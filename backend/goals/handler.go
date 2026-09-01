package goals

import (
	"fmt"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var dbGoals *sql.DB

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
	dbGoals, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbGoals.SetMaxOpenConns(2)
	dbGoals.SetMaxIdleConns(1)
	dbGoals.SetConnMaxLifetime(5 * time.Minute)
}

type GoalMilestone struct {
	ID         int        `json:"id"`
	GoalID     int        `json:"goalId"`
	Title      string     `json:"title"`
	Completed  bool       `json:"completed"`
	Order      int        `json:"order"`
	TargetDate *time.Time `json:"targetDate,omitempty"`
	CreatedAt  *time.Time `json:"createdAt"`
	UpdatedAt  *time.Time `json:"updatedAt"`
}

type Goal struct {
	ID            int             `json:"id"`
	UserID        int             `json:"userId"`
	Title         string          `json:"title"`
	Category      *string         `json:"category"`
	Type          string          `json:"type"`
	TargetValue   float64         `json:"targetValue"`
	CurrentValue  float64         `json:"currentValue"`
	StartDate     *time.Time      `json:"startDate,omitempty"`
	EndDate       *time.Time      `json:"endDate,omitempty"`
	SpecificDays  *string         `json:"specificDays,omitempty"`
	Status        string          `json:"status"`
	CoverImageUrl *string         `json:"coverImageUrl"`
	Reward        *string         `json:"reward"`
	Priority      string          `json:"priority"`
	Color         *string         `json:"color"`
	CreatedAt     *time.Time      `json:"createdAt"`
	UpdatedAt     *time.Time      `json:"updatedAt"`
	Milestones    []GoalMilestone `json:"milestones"`
}

func GoalsHandler(w http.ResponseWriter, r *http.Request) {
	if dbGoals == nil {
		initDB()
	}
	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	if userIdStr == "" {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	// Server-Side Gating: Goals requires Architect tier
	var planType string
	err := dbGoals.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userIdStr).Scan(&planType)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}
	if planType != "architect" && planType != "quantum" && planType != "legendary" && planType != "trial" {
		http.Error(w, `{"error": "Forbidden: Goals requires Architect tier"}`, http.StatusForbidden)
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		handleGetGoals(w, r, userId)
	case "POST":
		handleCreateGoal(w, r, userId)
	case "PUT":
		handleUpdateGoal(w, r, userId)
	case "DELETE":
		handleDeleteGoal(w, r, userId)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleGetGoals(w http.ResponseWriter, r *http.Request, userId int) {
	if dbGoals == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Fetch Goals
	rows, err := dbGoals.Query(`
		SELECT id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, created_at, updated_at
		FROM goals
		WHERE user_id = $1
		ORDER BY id DESC
	`, userId)
	if err != nil {
		http.Error(w, "Failed to query goals", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	goalsMap := make(map[int]*Goal)
	goals := []Goal{}
	goalIDs := []int{}

	for rows.Next() {
		var g Goal
		var startDate, endDate, createdAt, updatedAt sql.NullTime
		err := rows.Scan(
			&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &startDate, &endDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &createdAt, &updatedAt,
		)
		if err != nil {
			http.Error(w, "Failed to scan goal", http.StatusInternalServerError)
			return
		}
		if startDate.Valid {
			t := startDate.Time
			g.StartDate = &t
		}
		if endDate.Valid {
			t := endDate.Time
			g.EndDate = &t
		}
		if createdAt.Valid {
			t := createdAt.Time
			g.CreatedAt = &t
		}
		if updatedAt.Valid {
			t := updatedAt.Time
			g.UpdatedAt = &t
		}

		g.Milestones = []GoalMilestone{}
		goalsMap[g.ID] = &g
		goalIDs = append(goalIDs, g.ID)
	}

	// Fetch Milestones if there are goals
	if len(goalIDs) > 0 {
		mRows, err := dbGoals.Query(`
			SELECT id, goal_id, title, completed, "order", target_date, created_at, updated_at
			FROM goal_milestones
			WHERE goal_id = ANY($1)
			ORDER BY "order" ASC
		`, goalIDs)
		if err == nil {
			defer mRows.Close()
			for mRows.Next() {
				var m GoalMilestone
				var targetDate, createdAt, updatedAt sql.NullTime
				if err := mRows.Scan(&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &targetDate, &createdAt, &updatedAt); err == nil {
					if targetDate.Valid {
						t := targetDate.Time
						m.TargetDate = &t
					}
					if createdAt.Valid {
						t := createdAt.Time
						m.CreatedAt = &t
					}
					if updatedAt.Valid {
						t := updatedAt.Time
						m.UpdatedAt = &t
					}
					if g, ok := goalsMap[m.GoalID]; ok {
						g.Milestones = append(g.Milestones, m)
					}
				}
			}
		}
	}

	for _, id := range goalIDs {
		goals = append(goals, *goalsMap[id])
	}
	if goals == nil {
		goals = []Goal{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "private, max-age=120, stale-while-revalidate=30")
	json.NewEncoder(w).Encode(goals)
}

func handleCreateGoal(w http.ResponseWriter, r *http.Request, userId int) {
	var body struct {
		Title         string   `json:"title"`
		Category      *string  `json:"category"`
		Type          *string  `json:"type"`
		TargetValue   *float64 `json:"targetValue"`
		CurrentValue  *float64 `json:"currentValue"`
		StartDate     *string  `json:"startDate"`
		EndDate       *string  `json:"endDate"`
		SpecificDays  *string  `json:"specificDays"`
		Status        *string  `json:"status"`
		CoverImageUrl *string  `json:"coverImageUrl"`
		Reward        *string  `json:"reward"`
		Priority      *string  `json:"priority"`
		Color         *string  `json:"color"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	tType := "custom"
	if body.Type != nil {
		tType = *body.Type
	}
	tTarget := 100.0
	if body.TargetValue != nil {
		tTarget = *body.TargetValue
	}
	tCurrent := 0.0
	if body.CurrentValue != nil {
		tCurrent = *body.CurrentValue
	}
	tStatus := "active"
	if body.Status != nil {
		tStatus = *body.Status
	}
	tPriority := "medium"
	if body.Priority != nil {
		tPriority = *body.Priority
	}

	var startDate, endDate *time.Time
	if body.StartDate != nil && *body.StartDate != "" {
		t, _ := time.Parse(time.RFC3339, *body.StartDate)
		startDate = &t
	}
	if body.EndDate != nil && *body.EndDate != "" {
		t, _ := time.Parse(time.RFC3339, *body.EndDate)
		endDate = &t
	}

	if dbGoals == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Insert
	var g Goal
	err := dbGoals.QueryRow(`
		INSERT INTO goals (user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, created_at, updated_at
	`, userId, body.Title, body.Category, tType, tTarget, tCurrent, startDate, endDate, body.SpecificDays, tStatus, body.CoverImageUrl, body.Reward, tPriority, body.Color).Scan(
		&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &g.StartDate, &g.EndDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &g.CreatedAt, &g.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to insert goal", http.StatusInternalServerError)
		return
	}
	g.Milestones = []GoalMilestone{}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}

func handleUpdateGoal(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	goalId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var body struct {
		Title         *string  `json:"title"`
		Category      *string  `json:"category"`
		Type          *string  `json:"type"`
		TargetValue   *float64 `json:"targetValue"`
		CurrentValue  *float64 `json:"currentValue"`
		StartDate     *string  `json:"startDate"`
		EndDate       *string  `json:"endDate"`
		Status        *string  `json:"status"`
		CoverImageUrl *string  `json:"coverImageUrl"`
		Reward        *string  `json:"reward"`
		Priority      *string  `json:"priority"`
		Color         *string  `json:"color"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	if dbGoals == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbGoals.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	query := `UPDATE goals SET updated_at = CURRENT_TIMESTAMP`
	args := []interface{}{}
	argId := 1

	if body.Title != nil {
		query += `, title = $` + strconv.Itoa(argId)
		args = append(args, *body.Title)
		argId++
	}
	if body.Category != nil {
		query += `, category = $` + strconv.Itoa(argId)
		args = append(args, *body.Category)
		argId++
	}
	if body.Type != nil {
		query += `, type = $` + strconv.Itoa(argId)
		args = append(args, *body.Type)
		argId++
	}
	if body.TargetValue != nil {
		query += `, target_value = $` + strconv.Itoa(argId)
		args = append(args, *body.TargetValue)
		argId++
	}
	if body.CurrentValue != nil {
		query += `, current_value = $` + strconv.Itoa(argId)
		args = append(args, *body.CurrentValue)
		argId++
	}
	if body.Status != nil {
		query += `, status = $` + strconv.Itoa(argId)
		args = append(args, *body.Status)
		argId++
	}
	if body.CoverImageUrl != nil {
		query += `, cover_image_url = $` + strconv.Itoa(argId)
		args = append(args, *body.CoverImageUrl)
		argId++
	}
	if body.Reward != nil {
		query += `, reward = $` + strconv.Itoa(argId)
		args = append(args, *body.Reward)
		argId++
	}
	if body.Priority != nil {
		query += `, priority = $` + strconv.Itoa(argId)
		args = append(args, *body.Priority)
		argId++
	}
	if body.Color != nil {
		query += `, color = $` + strconv.Itoa(argId)
		args = append(args, *body.Color)
		argId++
	}
	if body.StartDate != nil {
		query += `, start_date = $` + strconv.Itoa(argId)
		if *body.StartDate != "" {
			t, _ := time.Parse(time.RFC3339, *body.StartDate)
			args = append(args, t)
		} else {
			args = append(args, nil)
		}
		argId++
	}
	if body.EndDate != nil {
		query += `, end_date = $` + strconv.Itoa(argId)
		if *body.EndDate != "" {
			t, _ := time.Parse(time.RFC3339, *body.EndDate)
			args = append(args, t)
		} else {
			args = append(args, nil)
		}
		argId++
	}

	query += ` WHERE id = $` + strconv.Itoa(argId) + ` RETURNING id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, created_at, updated_at`
	args = append(args, goalId)

	var g Goal
	err = dbGoals.QueryRow(query, args...).Scan(
		&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &g.StartDate, &g.EndDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &g.CreatedAt, &g.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to update goal", http.StatusInternalServerError)
		return
	}

	// Fetch milestones for the updated goal
	g.Milestones = []GoalMilestone{}
	mRows, err := dbGoals.Query(`
		SELECT id, goal_id, title, completed, "order", target_date, created_at, updated_at
		FROM goal_milestones
		WHERE goal_id = $1
		ORDER BY "order" ASC
	`, g.ID)
	if err == nil {
		defer mRows.Close()
		for mRows.Next() {
			var m GoalMilestone
			if err := mRows.Scan(&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &m.TargetDate, &m.CreatedAt, &m.UpdatedAt); err == nil {
				g.Milestones = append(g.Milestones, m)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}

func handleDeleteGoal(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	goalId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if dbGoals == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbGoals.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = dbGoals.Exec(`DELETE FROM goals WHERE id = $1`, goalId)
	if err != nil {
		http.Error(w, "Failed to delete goal", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
