package plannertasks

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

var dbTasks *sql.DB

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

	if !strings.Contains(connStr, "default_query_exec_mode=") { 
		if strings.Contains(connStr, "?") { 
			connStr += "&default_query_exec_mode=simple_protocol" 
		} else { 
			connStr += "?default_query_exec_mode=simple_protocol" 
		} 
	}

	var err error
	dbTasks, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbTasks.SetMaxOpenConns(2)
	dbTasks.SetMaxIdleConns(1)
	dbTasks.SetConnMaxLifetime(5 * time.Minute)
}

type PlannerTask struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	Date        time.Time  `json:"date"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
	Title       string     `json:"title"`
	Notes       *string    `json:"notes"`
	Type        int        `json:"type"`
	IsCompleted bool       `json:"isCompleted"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func PlannerTasksHandler(w http.ResponseWriter, r *http.Request) {
	if dbTasks == nil {
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

	if dbTasks == nil {
		http.Error(w, `{"error": "DB not initialized"}`, 500)
		return
	}

	switch r.Method {
	case http.MethodGet:
		dateStr := r.URL.Query().Get("date")
		monthStr := r.URL.Query().Get("month")

		query := `SELECT id, user_id, date, start_time, end_time, title, notes, type, is_completed, created_at, updated_at FROM planner_tasks WHERE user_id = $1`
		args := []interface{}{userID}

		if dateStr != "" {
			query += ` AND date = $2`
			args = append(args, dateStr)
		} else if monthStr != "" {
			query += ` AND TO_CHAR(date, 'YYYY-MM') = $2`
			args = append(args, monthStr)
		}

		query += ` ORDER BY start_time ASC, id ASC`

		rows, err := dbTasks.Query(query, args...)
		if err != nil {
			http.Error(w, `{"error": "Query Error"}`, 500)
			return
		}
		defer rows.Close()

		tasks := []PlannerTask{}
		for rows.Next() {
			var t PlannerTask
			var sTime, eTime, createdAt, updatedAt sql.NullTime
			var notes sql.NullString
			
			err := rows.Scan(&t.ID, &t.UserID, &t.Date, &sTime, &eTime, &t.Title, &notes, &t.Type, &t.IsCompleted, &createdAt, &updatedAt)
			if err == nil {
				if sTime.Valid { t.StartTime = &sTime.Time }
				if eTime.Valid { t.EndTime = &eTime.Time }
				if notes.Valid { t.Notes = &notes.String }
				if createdAt.Valid { t.CreatedAt = createdAt.Time }
				if updatedAt.Valid { t.UpdatedAt = updatedAt.Time }
				tasks = append(tasks, t)
			}
		}

		json.NewEncoder(w).Encode(tasks)

	case http.MethodPost:
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		title := body["title"].(string)
		dateStr := body["date"].(string)
		
		var sTime, eTime interface{} = nil, nil
		if st, ok := body["startTime"].(string); ok && st != "" { sTime = st + ":00" }
		if et, ok := body["endTime"].(string); ok && et != "" { eTime = et + ":00" }
		
		var notes interface{} = nil
		if n, ok := body["notes"].(string); ok && n != "" { notes = n }
		
		var tType int = 1
		if t, ok := body["type"].(float64); ok { tType = int(t) }
		
		isCompleted := false
		if c, ok := body["isCompleted"].(bool); ok { isCompleted = c }

		var id int
		err := dbTasks.QueryRow(`
			INSERT INTO planner_tasks (user_id, date, start_time, end_time, title, notes, type, is_completed, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id`,
			userID, dateStr, sTime, eTime, title, notes, tType, isCompleted,
		).Scan(&id)

		if err != nil {
			fmt.Println(err)
			http.Error(w, `{"error": "Insert Error"}`, 500)
			return
		}
		w.Write([]byte(fmt.Sprintf(`{"id": %d, "success": true}`, id)))

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		if id == 0 {
			http.Error(w, `{"error": "Missing ID"}`, 400)
			return
		}

		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)

		// Start building dynamic update query
		query := "UPDATE planner_tasks SET updated_at = NOW()"
		args := []interface{}{}
		argId := 1

		if val, ok := body["title"].(string); ok {
			query += fmt.Sprintf(", title = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["notes"].(string); ok {
			query += fmt.Sprintf(", notes = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["type"].(float64); ok {
			query += fmt.Sprintf(", type = $%d", argId)
			args = append(args, int(val))
			argId++
		}
		if val, ok := body["isCompleted"].(bool); ok {
			query += fmt.Sprintf(", is_completed = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["date"].(string); ok {
			query += fmt.Sprintf(", date = $%d", argId)
			args = append(args, val)
			argId++
		}
		if val, ok := body["startTime"].(string); ok {
			query += fmt.Sprintf(", start_time = $%d", argId)
			if val == "" { args = append(args, nil) } else { args = append(args, val + ":00") }
			argId++
		}
		if val, ok := body["endTime"].(string); ok {
			query += fmt.Sprintf(", end_time = $%d", argId)
			if val == "" { args = append(args, nil) } else { args = append(args, val + ":00") }
			argId++
		}

		query += fmt.Sprintf(" WHERE id = $%d AND user_id = $%d", argId, argId+1)
		args = append(args, id, userID)

		_, err := dbTasks.Exec(query, args...)
		if err != nil {
			fmt.Println(err)
			http.Error(w, `{"error": "Update Error"}`, 500)
			return
		}
		w.Write([]byte(`{"success": true}`))

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		id, _ := strconv.Atoi(idStr)
		if id == 0 {
			http.Error(w, `{"error": "Missing ID"}`, 400)
			return
		}

		_, err := dbTasks.Exec("DELETE FROM planner_tasks WHERE id = $1 AND user_id = $2", id, userID)
		if err != nil {
			http.Error(w, `{"error": "Delete Error"}`, 500)
			return
		}
		w.Write([]byte(`{"success": true}`))
	}
}
