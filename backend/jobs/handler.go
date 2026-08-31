package jobs

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

var dbJobs *sql.DB

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
	dbJobs, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbJobs.SetMaxOpenConns(2)
	dbJobs.SetMaxIdleConns(1)
	dbJobs.SetConnMaxLifetime(5 * time.Minute)
}

// Job represents the job model in Prisma
type Job struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	Title       string     `json:"title"`
	Company     string     `json:"company"`
	Status      string     `json:"status"`
	Salary      *float64   `json:"salary,omitempty"`
	Location    *string    `json:"location,omitempty"`
	JobUrl      *string    `json:"jobUrl,omitempty"`
	Notes       *string    `json:"notes,omitempty"`
	AppliedDate *time.Time `json:"appliedDate,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func JobsHandler(w http.ResponseWriter, r *http.Request) {
	if dbJobs == nil {
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

	// Server-Side Gating: Jobs requires Architect tier
	var planType string
	err := dbJobs.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userIdStr).Scan(&planType)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}
	if planType != "architect" && planType != "quantum" && planType != "legendary" && planType != "trial" {
		http.Error(w, `{"error": "Forbidden: Jobs requires Architect tier"}`, http.StatusForbidden)
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		handleGetJobs(w, r, userId)
	case "POST":
		handleCreateJob(w, r, userId)
	case "PUT":
		handleUpdateJob(w, r, userId)
	case "DELETE":
		handleDeleteJob(w, r, userId)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleGetJobs(w http.ResponseWriter, r *http.Request, userId int) {
	if dbJobs == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Fetch Jobs
	rows, err := dbJobs.Query(`
		SELECT "id", "userId", "title", "company", "status", "salary", "location", "jobUrl", "notes", "appliedDate", "createdAt", "updatedAt"
		FROM "Job"
		WHERE "userId" = $1
		ORDER BY "id" DESC
	`, userId)
	if err != nil {
		http.Error(w, "Failed to query jobs", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	jobs := []Job{}
	for rows.Next() {
		var j Job
		err := rows.Scan(
			&j.ID, &j.UserID, &j.Title, &j.Company, &j.Status, &j.Salary, &j.Location, &j.JobUrl, &j.Notes, &j.AppliedDate, &j.CreatedAt, &j.UpdatedAt,
		)
		if err != nil {
			http.Error(w, "Failed to scan job", http.StatusInternalServerError)
			return
		}
		jobs = append(jobs, j)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jobs)
}

func handleCreateJob(w http.ResponseWriter, r *http.Request, userId int) {
	var body struct {
		Title       string   `json:"title"`
		Company     string   `json:"company"`
		Status      string   `json:"status"`
		Salary      *float64 `json:"salary"`
		Location    *string  `json:"location"`
		JobUrl      *string  `json:"job_url"`
		Notes       *string  `json:"notes"`
		AppliedDate *string  `json:"applied_date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	var appliedDate *time.Time
	if body.AppliedDate != nil && *body.AppliedDate != "" {
		t, err := time.Parse(time.RFC3339, *body.AppliedDate)
		if err != nil {
			t, err = time.Parse("2006-01-02", *body.AppliedDate)
		}
		if err == nil {
			appliedDate = &t
		}
	}

	if dbJobs == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Insert
	var j Job
	err := dbJobs.QueryRow(`
		INSERT INTO "Job" ("userId", "title", "company", "status", "salary", "location", "jobUrl", "notes", "appliedDate", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
		RETURNING "id", "userId", "title", "company", "status", "salary", "location", "jobUrl", "notes", "appliedDate", "createdAt", "updatedAt"
	`, userId, body.Title, body.Company, body.Status, body.Salary, body.Location, body.JobUrl, body.Notes, appliedDate).Scan(
		&j.ID, &j.UserID, &j.Title, &j.Company, &j.Status, &j.Salary, &j.Location, &j.JobUrl, &j.Notes, &j.AppliedDate, &j.CreatedAt, &j.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to insert job", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(j)
}

func handleUpdateJob(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	jobId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var body struct {
		Title       *string  `json:"title"`
		Company     *string  `json:"company"`
		Status      *string  `json:"status"`
		Salary      *float64 `json:"salary"`
		Location    *string  `json:"location"`
		JobUrl      *string  `json:"job_url"`
		Notes       *string  `json:"notes"`
		AppliedDate *string  `json:"applied_date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	if dbJobs == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbJobs.QueryRow(`SELECT "userId" FROM "Job" WHERE "id" = $1`, jobId).Scan(&existingUserId)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	query := `UPDATE "Job" SET "updatedAt" = CURRENT_TIMESTAMP`
	args := []interface{}{}
	argId := 1

	if body.Title != nil {
		query += `, "title" = $` + strconv.Itoa(argId)
		args = append(args, *body.Title)
		argId++
	}
	if body.Company != nil {
		query += `, "company" = $` + strconv.Itoa(argId)
		args = append(args, *body.Company)
		argId++
	}
	if body.Status != nil {
		query += `, "status" = $` + strconv.Itoa(argId)
		args = append(args, *body.Status)
		argId++
	}
	if body.Salary != nil {
		query += `, "salary" = $` + strconv.Itoa(argId)
		args = append(args, *body.Salary)
		argId++
	}
	if body.Location != nil {
		query += `, "location" = $` + strconv.Itoa(argId)
		args = append(args, *body.Location)
		argId++
	}
	if body.JobUrl != nil {
		query += `, "jobUrl" = $` + strconv.Itoa(argId)
		args = append(args, *body.JobUrl)
		argId++
	}
	if body.Notes != nil {
		query += `, "notes" = $` + strconv.Itoa(argId)
		args = append(args, *body.Notes)
		argId++
	}
	if body.AppliedDate != nil {
		query += `, "appliedDate" = $` + strconv.Itoa(argId)
		if *body.AppliedDate != "" {
			t, _ := time.Parse(time.RFC3339, *body.AppliedDate)
			args = append(args, t)
		} else {
			args = append(args, nil)
		}
		argId++
	}

	query += ` WHERE "id" = $` + strconv.Itoa(argId) + ` RETURNING "id", "userId", "title", "company", "status", "salary", "location", "jobUrl", "notes", "appliedDate", "createdAt", "updatedAt"`
	args = append(args, jobId)

	var j Job
	err = dbJobs.QueryRow(query, args...).Scan(
		&j.ID, &j.UserID, &j.Title, &j.Company, &j.Status, &j.Salary, &j.Location, &j.JobUrl, &j.Notes, &j.AppliedDate, &j.CreatedAt, &j.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "Failed to update job", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(j)
}

func handleDeleteJob(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	jobId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if dbJobs == nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbJobs.QueryRow(`SELECT "userId" FROM "Job" WHERE "id" = $1`, jobId).Scan(&existingUserId)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if existingUserId != userId {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = dbJobs.Exec(`DELETE FROM "Job" WHERE id = $1`, jobId)
	if err != nil {
		http.Error(w, "Failed to delete job", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
