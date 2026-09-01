package studyarchives

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

type StudyArchive struct {
	ID         string     `json:"id"`
	CourseID   int        `json:"courseId"`
	MeetingTag string     `json:"meetingTag"`
	Type       string     `json:"type"`
	FileName   *string    `json:"fileName"`
	FilePath   *string    `json:"filePath"`
	LinkUrl    *string    `json:"linkUrl"`
	CreatedAt  *time.Time `json:"createdAt"`
	UpdatedAt  *time.Time `json:"updatedAt"`
}

func StudyArchivesHandler(w http.ResponseWriter, r *http.Request) {
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

	archiveIdStr := r.URL.Query().Get("id")

	switch r.Method {
	case http.MethodPost:
		var req struct {
			CourseID   int     `json:"courseId"`
			MeetingTag string  `json:"meetingTag"`
			Type       string  `json:"type"`
			LinkUrl    *string `json:"linkUrl"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}

		// Verify course ownership
		var owner int
		err = db.QueryRow(`SELECT user_id FROM study_courses WHERE id = $1`, req.CourseID).Scan(&owner)
		if err != nil || owner != userID {
			http.Error(w, `{"error": "Forbidden"}`, http.StatusForbidden)
			return
		}

		// Generate random CUID-like ID or UUID
		query := `INSERT INTO study_archives (course_id, meeting_tag, type, link_url, updated_at) 
		VALUES ($1, $2, $3, $4, NOW()) RETURNING id, created_at, updated_at`
		
		var id string
		var ca, ua *time.Time
		err = db.QueryRow(query, req.CourseID, req.MeetingTag, req.Type, req.LinkUrl).Scan(&id, &ca, &ua)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to create: %v"}`, err), http.StatusInternalServerError)
			return
		}
		
		json.NewEncoder(w).Encode(StudyArchive{
			ID: id,
			CourseID: req.CourseID,
			MeetingTag: req.MeetingTag,
			Type: req.Type,
			LinkUrl: req.LinkUrl,
			CreatedAt: ca,
			UpdatedAt: ua,
		})

	case http.MethodDelete:
		if archiveIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}
		
		// Verify ownership
		var owner int
		err = db.QueryRow(`SELECT c.user_id FROM study_archives a JOIN study_courses c ON a.course_id = c.id WHERE a.id = $1`, archiveIdStr).Scan(&owner)
		if err != nil || owner != userID {
			http.Error(w, `{"error": "Forbidden"}`, http.StatusForbidden)
			return
		}

		_, err = db.Exec(`DELETE FROM study_archives WHERE id = $1`, archiveIdStr)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to delete: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"success": true})

	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
