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

	_ "github.com/lib/pq"
)

// DB connection pool
var db *sql.DB

func init() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		// Log but don't panic, maybe it's local dev or not set yet
		fmt.Println("Warning: DATABASE_URL not set")
		return
	}
	
	// Add sslmode=require if not present (usually needed for Supabase)
	if !strings.Contains(dbURL, "sslmode=") {
		if strings.Contains(dbURL, "?") {
			dbURL += "&sslmode=require"
		} else {
			dbURL += "?sslmode=require"
		}
	}

	var err error
	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	// Optimize connection pool for Vercel Serverless
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
	// Set CORS headers if needed
	w.Header().Set("Content-Type", "application/json")

	// Get User ID from proxy header
	userIdStr := r.Header.Get("X-User-Id")
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
		handleGetHabits(w, r, userID)
	case http.MethodPost:
		handleCreateHabit(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, POST")
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

	var habits []Habit
	var habitIDs []int
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
	var body struct {
		Name          string  `json:"name"`
		Icon          *string `json:"icon"`
		Color         string  `json:"color"`
		Period        string  `json:"period"`
		MonthlyTarget int     `json:"monthlyTarget"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Bad Request"}`, http.StatusBadRequest)
		return
	}

	if body.Color == "" {
		body.Color = "#6366f1"
	}
	if body.MonthlyTarget == 0 {
		body.MonthlyTarget = 30
	}

	// Get max position
	var maxPos sql.NullInt32
	err := db.QueryRow(`SELECT position FROM habits WHERE user_id = $1 AND period = $2 AND is_archived = false ORDER BY position DESC LIMIT 1`, userID, body.Period).Scan(&maxPos)
	
	position := 1
	if err == nil && maxPos.Valid {
		position = int(maxPos.Int32) + 1
	}

	// Insert
	var h Habit
	query := `INSERT INTO habits (user_id, name, icon, color, period, monthly_target, status, position, is_archived, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, false, NOW(), NOW()) 
			  RETURNING id, user_id, period, name, icon, color, monthly_target, is_archived, created_at, updated_at, status, position`

	var createdAt, updatedAt sql.NullTime
	err = db.QueryRow(query, userID, body.Name, body.Icon, body.Color, body.Period, body.MonthlyTarget, position).Scan(
		&h.ID, &h.UserID, &h.Period, &h.Name, &h.Icon, &h.Color, &h.MonthlyTarget, &h.IsArchived, &createdAt, &updatedAt, &h.Status, &h.Position,
	)

	if err != nil {
		fmt.Printf("Insert error: %v\n", err)
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		h.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		h.UpdatedAt = updatedAt.Time
	}
	h.Logs = []HabitLog{}

	json.NewEncoder(w).Encode(h)
}
