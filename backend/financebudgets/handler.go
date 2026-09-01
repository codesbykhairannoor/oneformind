package financebudgets

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

var db *sql.DB

func initDB() {
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
		fmt.Println("FATAL: No database connection string found in any env var")
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
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	db.SetMaxOpenConns(2)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(5 * time.Minute)
}

type FinanceBudget struct {
	ID          int       `json:"id"`
	UserID      int       `json:"userId"`
	Category    string    `json:"category"`
	LimitAmount float64   `json:"limitAmount"`
	Month       string    `json:"month"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func FinanceBudgetsHandler(w http.ResponseWriter, r *http.Request) {
	if db == nil {
		initDB()
	}
	w.Header().Set("Content-Type", "application/json")

	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	if userIdStr == "" {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	userID, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid User ID"}`, http.StatusBadRequest)
		return
	}

	if db == nil {
		http.Error(w, `{"error": "Database connection not initialized"}`, http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleGetBudgets(w, r, userID)
	case http.MethodPost:
		handleCreateBudget(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, POST")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetBudgets(w http.ResponseWriter, r *http.Request, userID int) {
	month := r.URL.Query().Get("month")

	query := `SELECT id, user_id, category, limit_amount, month, created_at, updated_at 
			  FROM finance_budgets 
			  WHERE user_id = $1`
	args := []interface{}{userID}

	if month != "" {
		query += ` AND month = $2`
		args = append(args, month)
	}

	query += ` ORDER BY id ASC`

	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	budgets := []FinanceBudget{}
	for rows.Next() {
		var b FinanceBudget
		var createdAt, updatedAt sql.NullTime
		if err := rows.Scan(&b.ID, &b.UserID, &b.Category, &b.LimitAmount, &b.Month, &createdAt, &updatedAt); err != nil {
			continue
		}
		if createdAt.Valid {
			b.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			b.UpdatedAt = updatedAt.Time
		}
		budgets = append(budgets, b)
	}

	json.NewEncoder(w).Encode(budgets)
}

func handleCreateBudget(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	category, _ := body["category"].(string)
	month, _ := body["month"].(string)
	
	limitAmount := 0.0
	if la, ok := body["limitAmount"].(float64); ok {
		limitAmount = la
	} else if laStr, ok := body["limitAmount"].(string); ok {
		limitAmount, _ = strconv.ParseFloat(laStr, 64)
	}

	query := `INSERT INTO finance_budgets (user_id, category, limit_amount, month, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, NOW(), NOW()) 
			  RETURNING id, user_id, category, limit_amount, month, created_at, updated_at`

	var b FinanceBudget
	var createdAt, updatedAt sql.NullTime
	err := db.QueryRow(query, userID, category, limitAmount, month).
		Scan(&b.ID, &b.UserID, &b.Category, &b.LimitAmount, &b.Month, &createdAt, &updatedAt)

	if err != nil {
		http.Error(w, `{"error": "Failed to create budget"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		b.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		b.UpdatedAt = updatedAt.Time
	}

	json.NewEncoder(w).Encode(b)
}
