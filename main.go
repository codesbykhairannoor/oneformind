package main

import (
	"encoding/base64"
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

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// fallback to X-User-Id just in case some routes still use it temporarily,
			// or reject entirely. Let's strictly require JWT for security.
			http.Error(w, `{"error": "Missing Authorization header"}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"error": "Invalid Authorization header format"}`, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		secret := os.Getenv("SUPABASE_JWT_SECRET")
		if secret == "" {
			log.Println("WARNING: SUPABASE_JWT_SECRET is not set in environment")
			http.Error(w, `{"error": "Server configuration error"}`, http.StatusInternalServerError)
			return
		}

		// Try to decode as Base64 first, since modern Supabase projects use Base64 encoded secrets
		var jwtSecretBytes []byte
		decodedSecret, decodeErr := base64.StdEncoding.DecodeString(secret)
		if decodeErr == nil && len(decodedSecret) > 0 {
			jwtSecretBytes = decodedSecret
		} else {
			jwtSecretBytes = []byte(secret)
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecretBytes, nil
		})

		if err != nil {
			log.Printf("JWT Parse Error: %v\n", err)
			http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
			return
		}
		if !token.Valid {
			log.Printf("JWT Token Invalid")
			http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			var email string
			if e, ok := claims["email"].(string); ok {
				email = e
			}

			if email != "" && dbMain != nil {
				var internalID int
				err := dbMain.QueryRow(`SELECT id FROM "User" WHERE email = $1`, email).Scan(&internalID)
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
					
					errInsert := dbMain.QueryRow(`INSERT INTO "User" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, name, email).Scan(&internalID)
					if errInsert != nil {
						log.Printf("Error creating auto user: %v", errInsert)
					}
				}

				if internalID > 0 {
					q := r.URL.Query()
					q.Set("userId", fmt.Sprintf("%d", internalID))
					r.URL.RawQuery = q.Encode()
				}
			} else {
				// Fallback to SUB if DB lookup fails (will probably break Go handlers expecting INT)
				if sub, ok := claims["sub"].(string); ok {
					q := r.URL.Query()
					q.Set("userId", sub)
					r.URL.RawQuery = q.Encode()
				}
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
