package financetransactions

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

var dbFinTx *sql.DB

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

	// Strip pgbouncer=true because lib/pq doesn't support it
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

	var err error
	dbFinTx, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbFinTx.SetMaxOpenConns(2)
	dbFinTx.SetMaxIdleConns(1)
	dbFinTx.SetConnMaxLifetime(5 * time.Minute)
}

type FinanceTransaction struct {
	ID        int       `json:"id"`
	UserID    int       `json:"userId"`
	Title     string    `json:"title"`
	Amount    float64   `json:"amount"` // postgres decimal
	Type      string    `json:"type"`
	Category  string    `json:"category"`
	Date      time.Time `json:"date"`
	Notes     *string   `json:"notes"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func FinanceTransactionsHandler(w http.ResponseWriter, r *http.Request) {
	if dbFinTx == nil {
		initDB()
	}
	w.Header().Set("Content-Type", "application/json")
	
	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	userID, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	if dbFinTx == nil {
		http.Error(w, `{"error": "DB not initialized"}`, 500)
		return
	}

	switch r.Method {
	case http.MethodGet:
		monthStr := r.URL.Query().Get("month")
		
		query := `SELECT id, user_id, title, amount, type, category, date, notes, created_at, updated_at FROM finance_transactions WHERE user_id = $1`
		args := []interface{}{userID}

		if monthStr != "" {
			query += ` AND TO_CHAR(date, 'YYYY-MM') = $2`
			args = append(args, monthStr)
		}
		
		query += ` ORDER BY date DESC, id DESC`

		rows, err := dbFinTx.Query(query, args...)
		if err != nil {
			http.Error(w, `{"error": "Query Error"}`, 500)
			return
		}
		defer rows.Close()

		txs := []FinanceTransaction{}
		for rows.Next() {
			var t FinanceTransaction
			var createdAt, updatedAt sql.NullTime
			var amountBytes []byte
			var notes sql.NullString

			err := rows.Scan(&t.ID, &t.UserID, &t.Title, &amountBytes, &t.Type, &t.Category, &t.Date, &notes, &createdAt, &updatedAt)
			if err == nil {
				if len(amountBytes) > 0 {
					t.Amount, _ = strconv.ParseFloat(string(amountBytes), 64)
				}
				if notes.Valid { t.Notes = &notes.String }
				if createdAt.Valid { t.CreatedAt = createdAt.Time }
				if updatedAt.Valid { t.UpdatedAt = updatedAt.Time }
				txs = append(txs, t)
			} else {
				http.Error(w, fmt.Sprintf(`{"error": "Scan error: %v"}`, err), 500)
				return
			}
		}
		json.NewEncoder(w).Encode(txs)

	case http.MethodPost:
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		title := body["title"].(string)
		amount := body["amount"].(float64)
		tType := body["type"].(string)
		category := body["category"].(string)
		dateStr := body["date"].(string)
		
		var notes interface{} = nil
		if n, ok := body["notes"].(string); ok && n != "" { notes = n }

		var id int
		err := dbFinTx.QueryRow(`
			INSERT INTO finance_transactions (user_id, title, amount, type, category, date, notes, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id`,
			userID, title, amount, tType, category, dateStr, notes,
		).Scan(&id)

		if err != nil {
			http.Error(w, `{"error": "Insert Error"}`, 500)
			return
		}
		w.Write([]byte(fmt.Sprintf(`{"id": %d, "success": true}`, id)))
	
	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		query := "UPDATE finance_transactions SET updated_at = NOW()"
		args := []interface{}{}
		argId := 1

		if val, ok := body["title"].(string); ok {
			query += fmt.Sprintf(", title = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["amount"].(float64); ok {
			query += fmt.Sprintf(", amount = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["type"].(string); ok {
			query += fmt.Sprintf(", type = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["category"].(string); ok {
			query += fmt.Sprintf(", category = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["date"].(string); ok {
			query += fmt.Sprintf(", date = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["notes"].(string); ok {
			query += fmt.Sprintf(", notes = $%d", argId)
			args = append(args, val)
			argId++
		}

		query += fmt.Sprintf(" WHERE id = $%d AND user_id = $%d", argId, argId+1)
		args = append(args, id, userID)

		_, err = dbFinTx.Exec(query, args...)
		if err != nil {
			http.Error(w, `{"error": "Update Error"}`, 500)
			return
		}
		w.Write([]byte(`{"success": true}`))

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		
		_, err = dbFinTx.Exec("DELETE FROM finance_transactions WHERE id = $1 AND user_id = $2", id, userID)
		if err != nil {
			http.Error(w, `{"error": "Delete Error"}`, 500)
			return
		}
		w.Write([]byte(`{"success": true}`))
	}
}
