package habits

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

// DB connection pool
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

// Models
type HabitLog struct {
	ID        int       `json:"id"`
	HabitID   int       `json:"habitId"`
	Date      time.Time `json:"date"`
	Status    string    `json:"status"`
	Notes     *string   `json:"notes"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Habit struct {
	ID            int         `json:"id"`
	UserID        int         `json:"userId"`
	Period        string      `json:"period"`
	Name          string      `json:"name"`
	Icon          *string     `json:"icon"`
	Color         string      `json:"color"`
	MonthlyTarget int         `json:"monthlyTarget"`
	IsArchived    bool        `json:"isArchived"`
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
	Status        string      `json:"status"`
	Position      int         `json:"position"`
	Logs          []HabitLog  `json:"logs"`
}

// Handler is the entrypoint for Vercel Serverless
func HabitsHandler(w http.ResponseWriter, r *http.Request) {
	if db == nil {
		initDB()
	}
	// Set CORS headers if needed
	w.Header().Set("Content-Type", "application/json")

	// Get User ID from proxy header
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

	habitIdStr := r.URL.Query().Get("habitId")
	action := r.URL.Query().Get("action")

	switch r.Method {
	case http.MethodGet:
		handleGetHabits(w, r, userID)
	case http.MethodPost:
		if habitIdStr != "" && action == "logs" {
			handleToggleHabitLog(w, r, userID, habitIdStr)
		} else {
			handleCreateHabit(w, r, userID)
		}
	case http.MethodPut:
		if habitIdStr != "" {
			handleUpdateHabit(w, r, userID, habitIdStr)
		} else {
			http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		}
	case http.MethodDelete:
		if habitIdStr != "" {
			handleDeleteHabit(w, r, userID, habitIdStr)
		} else {
			http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		}
	default:
		w.Header().Set("Allow", "GET, POST, PUT, DELETE")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetHabits(w http.ResponseWriter, r *http.Request, userID int) {
	period := r.URL.Query().Get("period")

	query := `SELECT id, user_id, period, name, icon, color, monthly_target, is_archived, created_at, updated_at, status, position 
			  FROM habits 
			  WHERE user_id = $1 AND is_archived = false`
	
	args := []interface{}{userID}
	
	if period != "" {
		query += ` AND period = $2`
		args = append(args, period)
	}
	
	query += ` ORDER BY position ASC`

	rows, err := db.Query(query, args...)
	if err != nil {
		fmt.Printf("Query error: %v\n", err)
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	habits := []Habit{}
	habitIDs := []int{}
	habitMap := make(map[int]*Habit)

	for rows.Next() {
		var h Habit
		// Because Next.js/Prisma maps these directly, we parse them
		var createdAt, updatedAt sql.NullTime
		err := rows.Scan(&h.ID, &h.UserID, &h.Period, &h.Name, &h.Icon, &h.Color, &h.MonthlyTarget, &h.IsArchived, &createdAt, &updatedAt, &h.Status, &h.Position)
		if err != nil {
			fmt.Printf("Scan error: %v\n", err)
			continue
		}
		if createdAt.Valid {
			h.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			h.UpdatedAt = updatedAt.Time
		}
		h.Logs = []HabitLog{} // Initialize empty slice instead of null
		
		habits = append(habits, h)
		habitIDs = append(habitIDs, h.ID)
	}

	// Reference mapping for fast append
	for i := range habits {
		habitMap[habits[i].ID] = &habits[i]
	}

	// Fetch logs for these habits
	if len(habitIDs) > 0 {
		// Create IN clause e.g., ($1, $2, $3)
		placeholders := make([]string, len(habitIDs))
		logArgs := make([]interface{}, len(habitIDs))
		for i, id := range habitIDs {
			placeholders[i] = fmt.Sprintf("$%d", i+1)
			logArgs[i] = id
		}

		logQuery := fmt.Sprintf(`SELECT id, habit_id, date, status, notes, created_at, updated_at 
								 FROM habit_logs 
								 WHERE habit_id IN (%s)`, strings.Join(placeholders, ","))
		
		logRows, err := db.Query(logQuery, logArgs...)
		if err == nil {
			defer logRows.Close()
			for logRows.Next() {
				var l HabitLog
				var createdAt, updatedAt sql.NullTime
				err := logRows.Scan(&l.ID, &l.HabitID, &l.Date, &l.Status, &l.Notes, &createdAt, &updatedAt)
				if err == nil {
					if createdAt.Valid {
						l.CreatedAt = createdAt.Time
					}
					if updatedAt.Valid {
						l.UpdatedAt = updatedAt.Time
					}
					// Map log back to habit
					if h, ok := habitMap[l.HabitID]; ok {
						h.Logs = append(h.Logs, l)
					}
				}
			}
		} else {
			fmt.Printf("Log query error: %v\n", err)
		}
	}

	if habits == nil {
		habits = []Habit{} // Ensure we return [] instead of null
	}

	w.Header().Set("Cache-Control", "private, max-age=30, stale-while-revalidate=10")
	json.NewEncoder(w).Encode(habits)
}

func handleCreateHabit(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	period, _ := body["period"].(string)
	name, _ := body["name"].(string)
	color, _ := body["color"].(string)

	if period == "" || name == "" || color == "" {
		http.Error(w, `{"error": "Missing required fields"}`, http.StatusBadRequest)
		return
	}

	monthlyTarget := 0
	if mt, ok := body["monthlyTarget"].(float64); ok {
		monthlyTarget = int(mt)
	}

	var icon *string
	if i, ok := body["icon"].(string); ok && i != "" {
		icon = &i
	}

	// Get max position
	var maxPos int
	err := db.QueryRow(`SELECT COALESCE(MAX(position), -1) FROM habits WHERE user_id = $1 AND period = $2`, userID, period).Scan(&maxPos)
	if err != nil {
		maxPos = -1
	}
	position := maxPos + 1

	query := `INSERT INTO habits (user_id, period, name, icon, color, monthly_target, position) 
			  VALUES ($1, $2, $3, $4, $5, $6, $7) 
			  RETURNING id, created_at, updated_at, status, is_archived`
	
	var h Habit
	h.UserID = userID
	h.Period = period
	h.Name = name
	h.Color = color
	h.Icon = icon
	h.MonthlyTarget = monthlyTarget
	h.Position = position

	err = db.QueryRow(query, userID, period, name, icon, color, monthlyTarget, position).
		Scan(&h.ID, &h.CreatedAt, &h.UpdatedAt, &h.Status, &h.IsArchived)

	if err != nil {
		fmt.Printf("Error creating habit: %v\n", err)
		http.Error(w, `{"error": "Failed to create habit"}`, http.StatusInternalServerError)
		return
	}

	h.Logs = []HabitLog{} // empty logs for new habit

	json.NewEncoder(w).Encode(h)
}
func handleUpdateHabit(w http.ResponseWriter, r *http.Request, userID int, habitIdStr string) {
	habitID, err := strconv.Atoi(habitIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid habit ID"}`, http.StatusBadRequest)
		return
	}

	// Verify ownership
	var existingUserID int
	err = db.QueryRow(`SELECT user_id FROM habits WHERE id = $1`, habitID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	setParts := []string{}
	args := []interface{}{habitID}
	i := 2

	for k, v := range req {
		dbCol := ""
		switch k {
		case "name": dbCol = "name"
		case "icon": dbCol = "icon"
		case "color": dbCol = "color"
		case "monthlyTarget": dbCol = "monthly_target"
		case "position": dbCol = "position"
		case "isArchived": dbCol = "is_archived"
		case "status": dbCol = "status"
		default: continue
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
	
	query := fmt.Sprintf(`UPDATE habits SET %s WHERE id = $1`, strings.Join(setParts, ", "))
	
	_, err = db.Exec(query, args...)
	if err != nil {
		fmt.Printf("Error updating habit: %v\n", err)
		http.Error(w, `{"error": "Failed to update habit"}`, http.StatusInternalServerError)
		return
	}
	
	w.Write([]byte(`{"success": true}`))
}

func handleDeleteHabit(w http.ResponseWriter, r *http.Request, userID int, habitIdStr string) {
	habitID, err := strconv.Atoi(habitIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid habit ID"}`, http.StatusBadRequest)
		return
	}

	// Verify ownership
	var existingUserID int
	err = db.QueryRow(`SELECT user_id FROM habits WHERE id = $1`, habitID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	_, err = db.Exec(`DELETE FROM habits WHERE id = $1`, habitID)
	if err != nil {
		fmt.Printf("Error deleting habit: %v\n", err)
		http.Error(w, `{"error": "Failed to delete habit"}`, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"success": true}`))
}

func handleToggleHabitLog(w http.ResponseWriter, r *http.Request, userID int, habitIdStr string) {
	habitID, err := strconv.Atoi(habitIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid habit ID"}`, http.StatusBadRequest)
		return
	}

	var existingUserID int
	err = db.QueryRow(`SELECT user_id FROM habits WHERE id = $1`, habitID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	dateStr, _ := req["date"].(string)
	status, _ := req["status"].(string)
	
	var notes *string
	if n, ok := req["notes"].(string); ok {
		notes = &n
	}

	if dateStr == "" || status == "" {
		http.Error(w, `{"error": "Missing date or status"}`, http.StatusBadRequest)
		return
	}

	if len(dateStr) > 10 {
		dateStr = dateStr[:10]
	}

	if status == "empty" {
		_, err = db.Exec(`DELETE FROM habit_logs WHERE habit_id = $1 AND DATE(date) = $2`, habitID, dateStr)
		if err != nil {
			http.Error(w, `{"error": "Failed to delete log"}`, http.StatusInternalServerError)
			return
		}
		w.Write([]byte(`{"success": true, "status": "empty"}`))
		return
	}

	query := `
		INSERT INTO habit_logs (habit_id, date, status, notes) 
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (habit_id, date) 
		DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes, updated_at = NOW()
		RETURNING id, date, status, notes, created_at, updated_at
	`
	var l HabitLog
	l.HabitID = habitID
	
	var logDate, createdAt, updatedAt time.Time
	var logNotes sql.NullString
	
	err = db.QueryRow(query, habitID, dateStr, status, notes).
		Scan(&l.ID, &logDate, &l.Status, &logNotes, &createdAt, &updatedAt)

	if err != nil {
		fmt.Printf("Error upserting habit log: %v\n", err)
		http.Error(w, `{"error": "Failed to update log"}`, http.StatusInternalServerError)
		return
	}

	l.Date = logDate
	l.CreatedAt = createdAt
	l.UpdatedAt = updatedAt
	if logNotes.Valid {
		l.Notes = &logNotes.String
	}

	json.NewEncoder(w).Encode(l)
}
