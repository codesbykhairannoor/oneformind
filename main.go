package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	handler "tranvas-api/api"
	"tranvas-api/backend/shareddb"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/jackc/pgx/v5/stdlib"
)

var dbMain *sql.DB
var (
	userCacheMutex sync.RWMutex
	userCache      = make(map[string]int)
)

// --- GLOBAL CACHE SYSTEM ---
type cacheEntry struct {
	Body       []byte
	StatusCode int
	Headers    http.Header
	ExpiresAt  time.Time
}

var (
	apiCacheMutex sync.RWMutex
	apiCache      = make(map[string]map[string]cacheEntry)
)

type responseRecorder struct {
	http.ResponseWriter
	body       []byte
	statusCode int
}

func (rw *responseRecorder) Write(b []byte) (int, error) {
	rw.body = append(rw.body, b...)
	return rw.ResponseWriter.Write(b)
}

func (rw *responseRecorder) WriteHeader(statusCode int) {
	rw.statusCode = statusCode
	rw.ResponseWriter.WriteHeader(statusCode)
}

func CacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userId := r.Header.Get("X-User-Id")
		if userId == "" {
			next.ServeHTTP(w, r)
			return
		}

		if r.Method != http.MethodGet {
			apiCacheMutex.Lock()
			delete(apiCache, userId)
			apiCacheMutex.Unlock()
			next.ServeHTTP(w, r)
			return
		}

		cacheKey := r.URL.RequestURI()

		apiCacheMutex.RLock()
		userCacheMap, userExists := apiCache[userId]
		if userExists {
			entry, entryExists := userCacheMap[cacheKey]
			if entryExists && time.Now().Before(entry.ExpiresAt) {
				apiCacheMutex.RUnlock()
				for k, v := range entry.Headers {
					for _, val := range v {
						w.Header().Add(k, val)
					}
				}
				w.Header().Set("X-Cache", "HIT")
				w.WriteHeader(entry.StatusCode)
				w.Write(entry.Body)
				return
			}
		}
		apiCacheMutex.RUnlock()

		recorder := &responseRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		w.Header().Set("X-Cache", "MISS")
		next.ServeHTTP(recorder, r)

		if recorder.statusCode >= 200 && recorder.statusCode < 300 {
			headersCopy := make(http.Header)
			for k, v := range w.Header() {
				if k != "X-Cache" {
					headersCopy[k] = v
				}
			}

			entry := cacheEntry{
				Body:       append([]byte(nil), recorder.body...),
				StatusCode: recorder.statusCode,
				Headers:    headersCopy,
				ExpiresAt:  time.Now().Add(5 * time.Minute),
			}

			apiCacheMutex.Lock()
			if apiCache[userId] == nil {
				apiCache[userId] = make(map[string]cacheEntry)
			}
			apiCache[userId][cacheKey] = entry
			apiCacheMutex.Unlock()
		}
	})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Always strip client-supplied identity parameters before authentication
		r.Header.Del("X-User-Id")
		q := r.URL.Query()
		q.Del("userId")
		r.URL.RawQuery = q.Encode()

		route := r.URL.Query().Get("route")
		if route == "payment-duitku-callback" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" || strings.TrimSpace(parts[1]) == "" {
			http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
			return
		}

		email, displayName, err := shareddb.VerifySupabaseToken(parts[1])
		if err != nil || email == "" {
			http.Error(w, `{"error": "Unauthorized: Invalid or expired token"}`, http.StatusUnauthorized)
			return
		}

		if dbMain == nil {
			http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
			return
		}

		userCacheMutex.RLock()
		cachedID, exists := userCache[strings.ToLower(email)]
		userCacheMutex.RUnlock()

		var internalID int
		if exists {
			internalID = cachedID
		} else {
			err := dbMain.QueryRow(`SELECT id FROM "users" WHERE LOWER(email) = LOWER($1)`, email).Scan(&internalID)
			if err == sql.ErrNoRows {
				_ = dbMain.QueryRow(`INSERT INTO "users" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, displayName, email).Scan(&internalID)
			}
			if internalID > 0 {
				userCacheMutex.Lock()
				userCache[strings.ToLower(email)] = internalID
				userCacheMutex.Unlock()
			}
		}

		if internalID <= 0 {
			http.Error(w, `{"error": "Could not resolve user"}`, http.StatusUnauthorized)
			return
		}

		idStr := fmt.Sprintf("%d", internalID)
		r.Header.Set("X-User-Id", idStr)
		q = r.URL.Query()
		q.Set("userId", idStr)
		r.URL.RawQuery = q.Encode()

		next.ServeHTTP(w, r)
	})
}

func main() {
	log.Println("Pre-warming shared DB connection pool...")
	dbMain = shareddb.Get()
	if dbMain != nil {
		if err := dbMain.Ping(); err != nil {
			log.Printf("WARNING: DB ping failed at startup: %v", err)
		} else {
			log.Println("DB pool ready. Server starting...")
		}
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Strictly restrict CORS origins (never allow wildcard https://* with credentials)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://tranvas.com", "https://www.tranvas.com", "https://*.vercel.app", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.Use(CacheMiddleware)
		r.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
			handler.Handler(w, r)
		})
		r.HandleFunc("/api/*", func(w http.ResponseWriter, r *http.Request) {
			handler.Handler(w, r)
		})
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Starting server on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
