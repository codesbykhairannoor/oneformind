package handler

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

var dbFinTx *sql.DB

func init() {
	if dbFinTx != nil {
		return
	}
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return
	}
	if !strings.Contains(dbURL, "sslmode=") {
		if strings.Contains(dbURL, "?") {
			dbURL += "&sslmode=require"
		} else {
			dbURL += "?sslmode=require"
		}
	}
	dbFinTx, _ = sql.Open("postgres", dbURL)
	if dbFinTx != nil {
		dbFinTx.SetMaxOpenConns(2)
		dbFinTx.SetMaxIdleConns(1)
		dbFinTx.SetConnMaxLifetime(5 * time.Minute)
	}
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
	w.Header().Set("Content-Type", "application/json")
	
	userIdStr := r.Header.Get("X-User-Id")
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
			var notes sql.NullString
			
			err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Amount, &t.Type, &t.Category, &t.Date, &notes, &createdAt, &updatedAt)
			if err == nil {
				if notes.Valid { t.Notes = &notes.String }
				if createdAt.Valid { t.CreatedAt = createdAt.Time }
				if updatedAt.Valid { t.UpdatedAt = updatedAt.Time }
				txs = append(txs, t)
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
