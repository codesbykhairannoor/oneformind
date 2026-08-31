package user

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

var db *sql.DB

func init() {
	var err error
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
	
	// Strip pgbouncer=true if it exists because lib/pq doesn't support it
	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)
	if strings.HasSuffix(connStr, "?") {
		connStr = strings.TrimSuffix(connStr, "?")
	}

	// Ensure sslmode=require is present
	if !strings.Contains(connStr, "sslmode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&sslmode=require"
		} else {
			connStr += "?sslmode=require"
		}
	}

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Error connecting to DB: %v\n", err)
	}
	db.SetMaxOpenConns(2)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(30 * time.Minute)
}

type User struct {
	ID             int        `json:"id"`
	Name           *string    `json:"name"`
	Email          *string    `json:"email"`
	PlanType       *string    `json:"planType"`
	IsPremium      bool       `json:"isPremium"`
	PremiumUntil   *time.Time `json:"premiumUntil"`
	Settings       *string    `json:"settings"`
	ResumeText     *string    `json:"resumeText"`
	ResumeFilename *string    `json:"resumeFilename"`
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userID := r.Header.Get("X-User-Id")

	if userID == "" {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var u User
		err := db.QueryRow(`SELECT id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename FROM users WHERE id = $1`, userID).
			Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &u.PremiumUntil, &u.Settings, &u.ResumeText, &u.ResumeFilename)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
			} else {
				http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Cache-Control", "private, max-age=300, stale-while-revalidate=60")
		json.NewEncoder(w).Encode(u)

	case http.MethodPut:
		var req map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Update logic
		setParts := []string{}
		args := []interface{}{userID}
		i := 2

		for k, v := range req {
			dbCol := ""
			switch k {
			case "name": dbCol = "name"
			case "settings": dbCol = "settings"
			case "resumeText": dbCol = "resume_text"
			case "resumeFilename": dbCol = "resume_filename"
			default: continue
			}

			// If settings is provided, it might be a JSON object, so marshal it if it's not a string
			if k == "settings" {
				switch v.(type) {
				case map[string]interface{}, []interface{}:
					jsonBytes, _ := json.Marshal(v)
					v = string(jsonBytes)
				}
			}

			setParts = append(setParts, fmt.Sprintf("%s = $%d", dbCol, i))
			args = append(args, v)
			i++
		}

		if len(setParts) == 0 {
			// No update needed, return current user
			var u User
			db.QueryRow(`SELECT id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename FROM users WHERE id = $1`, userID).
				Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &u.PremiumUntil, &u.Settings, &u.ResumeText, &u.ResumeFilename)
			json.NewEncoder(w).Encode(u)
			return
		}

		setParts = append(setParts, fmt.Sprintf("updated_at = NOW()"))
		
		query := fmt.Sprintf(`UPDATE users SET %s WHERE id = $1 RETURNING id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename`, strings.Join(setParts, ", "))
		
		var u User
		err := db.QueryRow(query, args...).
			Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &u.PremiumUntil, &u.Settings, &u.ResumeText, &u.ResumeFilename)
		
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to update user: %v"}`, err), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(u)

	default:
		w.Header().Set("Allow", "GET, PUT")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}
