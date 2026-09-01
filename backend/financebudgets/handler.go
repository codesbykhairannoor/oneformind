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

	_ "github.com/jackc/pgx/v5/stdlib"
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
    if !strings.Contains(connStr, "default_query_exec_mode=") { if strings.Contains(connStr, "?") { connStr += "&default_query_exec_mode=simple_protocol" } else { connStr += "?default_query_exec_mode=simple_protocol" } }
	db, err = sql.Open("pgx", connStr)
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
	case http.MethodPut:
		handleUpdateBudget(w, r, userID)
	case http.MethodDelete:
		handleDeleteBudget(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, POST, PUT, DELETE")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetBudgets(w http.ResponseWriter, r *http.Request, userID int) {
	monthStr := r.URL.Query().Get("month")
	
	query := `SELECT id, user_id, category, limit_amount, month, created_at, updated_at 
			  FROM finance_budgets 
			  WHERE user_id = $1`
			  
	args := []interface{}{userID}
	
	if monthStr != "" {
		query += ` AND month = $2`
		args = append(args, monthStr)
	}
	
	query += ` ORDER BY id DESC`

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
		var amountBytes []byte
		if err := rows.Scan(&b.ID, &b.UserID, &b.Category, &amountBytes, &b.Month, &createdAt, &updatedAt); err != nil {
			fmt.Println("Budget scan err:", err)
			continue
		}
		if len(amountBytes) > 0 {
			b.LimitAmount, _ = strconv.ParseFloat(string(amountBytes), 64)
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
	
	limitAmount := 0.0
	if v, ok := body["limitAmount"].(float64); ok {
		limitAmount = v
	} else if vStr, ok := body["limitAmount"].(string); ok {
		limitAmount, _ = strconv.ParseFloat(vStr, 64)
	}

	month, _ := body["month"].(string)

	query := `INSERT INTO finance_budgets (user_id, category, limit_amount, month, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, NOW(), NOW()) 
			  RETURNING id, created_at, updated_at`

	var b FinanceBudget
	b.UserID = userID
	b.Category = category
	b.LimitAmount = limitAmount
	b.Month = month

	var createdAt, updatedAt sql.NullTime
	err := db.QueryRow(query, userID, category, limitAmount, month).
		Scan(&b.ID, &createdAt, &updatedAt)

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

func handleUpdateBudget(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	idFloat, ok := body["id"].(float64)
	if !ok {
		http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
		return
	}
	budgetID := int(idFloat)

	// Verify ownership
	var existingUserID int
	err := db.QueryRow(`SELECT user_id FROM finance_budgets WHERE id = $1`, budgetID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	setParts := []string{}
	args := []interface{}{budgetID, userID}
	i := 3

	for k, v := range body {
		dbCol := ""
		switch k {
		case "category": dbCol = "category"
		case "limitAmount": dbCol = "limit_amount"
		case "month": dbCol = "month"
		default: continue
		}
		
		if k == "limitAmount" {
			if strVal, ok := v.(string); ok {
				v, _ = strconv.ParseFloat(strVal, 64)
			}
		}

		setParts = append(setParts, fmt.Sprintf("%s = $%d", dbCol, i))
		args = append(args, v)
		i++
	}

	if len(setParts) == 0 {
		w.Write([]byte(`{"success": true}`))
		return
	}

	setParts = append(setParts, "updated_at = NOW()")
	
	query := fmt.Sprintf(`UPDATE finance_budgets SET %s WHERE id = $1 AND user_id = $2 RETURNING updated_at`, strings.Join(setParts, ", "))
	
	var updatedAt sql.NullTime
	err = db.QueryRow(query, args...).Scan(&updatedAt)
	
	if err != nil {
		fmt.Printf("Error updating budget: %v\n", err)
		http.Error(w, `{"error": "Failed to update budget"}`, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"success": true}`))
}

func handleDeleteBudget(w http.ResponseWriter, r *http.Request, userID int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, `{"error": "Missing ID"}`, http.StatusBadRequest)
		return
	}
	
	budgetID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid ID"}`, http.StatusBadRequest)
		return
	}

	result, err := db.Exec(`DELETE FROM finance_budgets WHERE id = $1 AND user_id = $2`, budgetID, userID)
	if err != nil {
		http.Error(w, `{"error": "Failed to delete budget"}`, http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, `{"error": "Not found or unauthorized"}`, http.StatusNotFound)
		return
	}

	w.Write([]byte(`{"success": true}`))
}
