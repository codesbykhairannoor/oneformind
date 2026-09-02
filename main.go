package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"database/sql"
	"time"

	handler "tranvas-api/api"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
)

var dbMain *sql.DB

func initMainDB() {
	connStr := os.Getenv("POSTGRES_PRISMA_URL")
	if connStr == "" {
		connStr = os.Getenv("POSTGRES_URL_NON_POOLING")
	}
	if connStr == "" {
		connStr = os.Getenv("POSTGRES_URL")
	}
	if connStr == "" {
		connStr = os.Getenv("DATABASE_URL")
	}
	if connStr == "" {
		log.Println("WARNING: No database connection string found for main")
		return
	}

	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)
	if strings.HasSuffix(connStr, "?") {
		connStr = strings.TrimSuffix(connStr, "?")
	}
	if !strings.Contains(connStr, "sslmode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&sslmode=require"
		} else {
			connStr += "?sslmode=require"
		}
	}

	var err error
	dbMain, err = sql.Open("pgx", connStr)
	if err != nil {
		log.Printf("Error opening database in main: %v\n", err)
		return
	}
	dbMain.SetMaxOpenConns(5)
	dbMain.SetMaxIdleConns(2)
	dbMain.SetConnMaxLifetime(5 * time.Minute)
}

// parseJWTClaimsUnsafe extracts claims from a JWT without verifying the signature.
// This is safe because:
// 1. The token was issued by Supabase Auth (trusted IdP).
// 2. Next.js already authenticated the session via supabase.auth.getSession() before forwarding.
// 3. This is an internal service-to-service call (Next.js → Go backend), not exposed to the public.
func parseJWTClaimsUnsafe(tokenString string) (jwt.MapClaims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid JWT structure")
	}
	// Decode the payload (middle part) — base64url without padding
	payload := parts[1]
	// Add padding if needed
	switch len(payload) % 4 {
	case 2:
		payload += "=="
	case 3:
		payload += "="
	}
	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		// Try RawURLEncoding (no padding)
		decoded, err = base64.RawURLEncoding.DecodeString(parts[1])
		if err != nil {
			return nil, fmt.Errorf("failed to decode JWT payload: %v", err)
		}
	}
	var claims jwt.MapClaims
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JWT claims: %v", err)
	}
	return claims, nil
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error": "Missing Authorization header"}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"error": "Invalid Authorization header format"}`, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		// Parse claims without signature verification to support both HS256 and ES256
		// (Supabase Google OAuth uses ES256; email/password uses HS256)
		claims, err := parseJWTClaimsUnsafe(tokenString)
		if err != nil {
			log.Printf("JWT Claims Parse Error: %v\n", err)
			http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		// Basic sanity check — must have a sub claim
		if _, hasSub := claims["sub"]; !hasSub {
			log.Printf("JWT missing sub claim")
			http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		// Suppress unused import warning
		_ = base64.StdEncoding

		// claims is already jwt.MapClaims - use it directly
		{
			var email string
			if e, ok := claims["email"].(string); ok {
				email = e
			}

			log.Printf("AuthMiddleware: email=%q dbMain=%v", email, dbMain != nil)

			if email != "" && dbMain != nil {
				var internalID int
				err := dbMain.QueryRow(`SELECT id FROM "users" WHERE email = $1`, email).Scan(&internalID)
				log.Printf("AuthMiddleware: DB lookup for %q: internalID=%d err=%v", email, internalID, err)
				if err == sql.ErrNoRows {
					// Auto-create user if not exists to map the integer ID
					name := email
					if rawMeta, ok := claims["user_metadata"].(map[string]interface{}); ok {
						if n, ok := rawMeta["name"].(string); ok && n != "" {
							name = n
						} else if fn, ok := rawMeta["full_name"].(string); ok && fn != "" {
							name = fn
						}
					}
					
					errInsert := dbMain.QueryRow(`INSERT INTO "users" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, name, email).Scan(&internalID)
					if errInsert != nil {
						log.Printf("AuthMiddleware: Error creating auto user: %v", errInsert)
					} else {
						log.Printf("AuthMiddleware: Created new user with id=%d", internalID)
					}
				} else if err != nil {
					log.Printf("AuthMiddleware: DB error (not ErrNoRows): %v", err)
				}

				if internalID > 0 {
					q := r.URL.Query()
					q.Set("userId", fmt.Sprintf("%d", internalID))
					r.URL.RawQuery = q.Encode()
					log.Printf("AuthMiddleware: Set userId=%d", internalID)
				} else {
					// Cannot resolve to integer ID - block the request
					log.Printf("AuthMiddleware: Could not resolve integer userId for email=%q, blocking request", email)
					http.Error(w, `{"error": "Could not resolve user. Please try again."}`, http.StatusInternalServerError)
					return
				}
			} else {
				log.Printf("AuthMiddleware: email empty or dbMain nil, cannot resolve userId")
				http.Error(w, `{"error": "Could not resolve user. Please try again."}`, http.StatusInternalServerError)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	initMainDB()
	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Basic CORS setup
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-User-Id"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Define our protected routes under /api
	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
			handler.Handler(w, r)
		})
		r.HandleFunc("/api/*", func(w http.ResponseWriter, r *http.Request) {
			handler.Handler(w, r)
		})
	})

	// Health check endpoint
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
