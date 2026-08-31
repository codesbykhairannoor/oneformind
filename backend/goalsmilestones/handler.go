package goalsmilestones

import (
	"fmt"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

var dbMilestones *sql.DB

func init() {
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
	dbMilestones, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbMilestones.SetMaxOpenConns(2)
	dbMilestones.SetMaxIdleConns(1)
	dbMilestones.SetConnMaxLifetime(5 * time.Minute)
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

func GoalsMilestonesHandler(w http.ResponseWriter, r *http.Request) {
	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	if userIdStr == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "POST":
		handleCreateMilestone(w, r, userId)
	case "PUT":
		handleUpdateMilestone(w, r, userId)
	case "DELETE":
		handleDeleteMilestone(w, r, userId)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleCreateMilestone(w http.ResponseWriter, r *http.Request, userId int) {
	goalIdStr := r.URL.Query().Get("goalId")
	if goalIdStr == "" {
		http.Error(w, "Missing Goal ID", http.StatusBadRequest)
		return
	}
	goalId, err := strconv.Atoi(goalIdStr)
	if err != nil {
		http.Error(w, "Invalid Goal ID", http.StatusBadRequest)
		return
	}

	var body struct {
		Title     string `json:"title"`
		Completed *bool  `json:"completed"`
		Order     *int   `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	completed := false
	if body.Completed != nil {
		completed = *body.Completed
	}
	order := 0
	if body.Order != nil {
		order = *body.Order
	}

	if dbMilestones == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbMilestones.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil || existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var m GoalMilestone
	err = dbMilestones.QueryRow(`
		INSERT INTO goal_milestones (goal_id, title, completed, "order", created_at, updated_at)
		VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, goal_id, title, completed, "order", target_date, created_at, updated_at
	`, goalId, body.Title, completed, order).Scan(
		&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &m.TargetDate, &m.CreatedAt, &m.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to insert milestone", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

func handleUpdateMilestone(w http.ResponseWriter, r *http.Request, userId int) {
	goalIdStr := r.URL.Query().Get("goalId")
	milestoneIdStr := r.URL.Query().Get("milestoneId")
	if goalIdStr == "" || milestoneIdStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	goalId, err2 := strconv.Atoi(goalIdStr)
	milestoneId, err := strconv.Atoi(milestoneIdStr)
	if err != nil || err2 != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var body struct {
		Title     *string `json:"title"`
		Completed *bool   `json:"completed"`
		Order     *int    `json:"order"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	if dbMilestones == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbMilestones.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil || existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	query := `UPDATE goal_milestones SET updated_at = CURRENT_TIMESTAMP`
	args := []interface{}{}
	argId := 1

	if body.Title != nil {
		query += `, title = $` + strconv.Itoa(argId)
		args = append(args, *body.Title)
		argId++
	}
	if body.Completed != nil {
		query += `, completed = $` + strconv.Itoa(argId)
		args = append(args, *body.Completed)
		argId++
	}
	if body.Order != nil {
		query += `, "order" = $` + strconv.Itoa(argId)
		args = append(args, *body.Order)
		argId++
	}

	query += ` WHERE id = $` + strconv.Itoa(argId) + ` AND goal_id = $` + strconv.Itoa(argId+1) + ` RETURNING id, goal_id, title, completed, "order", target_date, created_at, updated_at`
	args = append(args, milestoneId, goalId)

	var m GoalMilestone
	err = dbMilestones.QueryRow(query, args...).Scan(
		&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &m.TargetDate, &m.CreatedAt, &m.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to update milestone", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

func handleDeleteMilestone(w http.ResponseWriter, r *http.Request, userId int) {
	goalIdStr := r.URL.Query().Get("goalId")
	milestoneIdStr := r.URL.Query().Get("milestoneId")
	if goalIdStr == "" || milestoneIdStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	goalId, err2 := strconv.Atoi(goalIdStr)
	milestoneId, err := strconv.Atoi(milestoneIdStr)
	if err != nil || err2 != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if dbMilestones == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbMilestones.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil || existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = dbMilestones.Exec(`DELETE FROM goal_milestones WHERE id = $1 AND goal_id = $2`, milestoneId, goalId)
	if err != nil {
		http.Error(w, "Failed to delete milestone", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
