package financecategories

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

var dbFinCat *sql.DB

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
	if !strings.Contains(connStr, "default_query_exec_mode=") { 
		if strings.Contains(connStr, "?") { 
			connStr += "&default_query_exec_mode=simple_protocol" 
		} else { 
			connStr += "?default_query_exec_mode=simple_protocol" 
		} 
	}
	dbFinCat, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbFinCat.SetMaxOpenConns(2)
	dbFinCat.SetMaxIdleConns(1)
	dbFinCat.SetConnMaxLifetime(5 * time.Minute)
}

type FinanceCategory struct {
	ID        int       `json:"id"`
	UserID    int       `json:"userId"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Type      string    `json:"type"`
	Icon      string    `json:"icon"`
	Color     *string   `json:"color"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func FinanceCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	if dbFinCat == nil {
		initDB()
	}
	if dbFinCat == nil {
		http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	
	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	userID, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, 401)
		return
	}

	switch r.Method {
	case http.MethodGet:
		rows, _ := dbFinCat.Query(`SELECT id, user_id, name, slug, type, icon, color, created_at, updated_at FROM finance_categories WHERE user_id = $1 ORDER BY name ASC`, userID)
		defer rows.Close()

		cats := []FinanceCategory{}
		for rows.Next() {
			var c FinanceCategory
			var color sql.NullString
			var createdAt, updatedAt sql.NullTime
			
			err := rows.Scan(&c.ID, &c.UserID, &c.Name, &c.Slug, &c.Type, &c.Icon, &color, &createdAt, &updatedAt)
			if err == nil {
				if color.Valid { c.Color = &color.String }
				if createdAt.Valid { c.CreatedAt = createdAt.Time }
				if updatedAt.Valid { c.UpdatedAt = updatedAt.Time }
				cats = append(cats, c)
			}
		}
		json.NewEncoder(w).Encode(cats)

	case http.MethodPost:
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		name := body["name"].(string)
		
		slug := ""
		if s, ok := body["slug"].(string); ok { slug = s } else { slug = strings.ToLower(strings.ReplaceAll(name, " ", "-")) }
		
		tType := body["type"].(string)
		
		icon := "folder"
		if i, ok := body["icon"].(string); ok && i != "" { icon = i }
		
		var color interface{} = nil
		if c, ok := body["color"].(string); ok && c != "" { color = c }

		var id int
		err := dbFinCat.QueryRow(`
			INSERT INTO finance_categories (user_id, name, slug, type, icon, color, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
			userID, name, slug, tType, icon, color,
		).Scan(&id)
		
		if err != nil {
			fmt.Println("Error inserting category:", err)
			http.Error(w, `{"error": "Insert Error"}`, 500)
			return
		}
		w.Write([]byte(fmt.Sprintf(`{"id": %d, "success": true}`, id)))
	
	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		query := "UPDATE finance_categories SET updated_at = NOW()"
		args := []interface{}{}
		argId := 1

		if val, ok := body["name"].(string); ok {
			query += fmt.Sprintf(", name = $%d", argId); args = append(args, val); argId++
		}
		if val, ok := body["type"].(string); ok {
			query += fmt.Sprintf(", type = $%d", argId); args = append(args, val); argId++
		}
		if val, ok := body["icon"].(string); ok {
			query += fmt.Sprintf(", icon = $%d", argId); args = append(args, val); argId++
		}
		if val, ok := body["color"].(string); ok {
			query += fmt.Sprintf(", color = $%d", argId); args = append(args, val); argId++
		}

		query += fmt.Sprintf(" WHERE id = $%d AND user_id = $%d", argId, argId+1)
		args = append(args, id, userID)

		dbFinCat.Exec(query, args...)
		w.Write([]byte(`{"success": true}`))

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		
		dbFinCat.Exec("DELETE FROM finance_categories WHERE id = $1 AND user_id = $2", id, userID)
		w.Write([]byte(`{"success": true}`))
	}
}
