package studycourses

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
	db, err = sql.Open("postgres", connStr)
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

type StudyCourse struct {
	ID         int            `json:"id"`
	UserID     int            `json:"userId"`
	CourseName string         `json:"courseName"`
	Semester   int            `json:"semester"`
	SKS        int            `json:"sks"`
	Grade      *string        `json:"grade"`
	CreatedAt  *time.Time     `json:"createdAt"`
	UpdatedAt  *time.Time     `json:"updatedAt"`
	Archives   []StudyArchive `json:"archives"`
}

func StudyCoursesHandler(w http.ResponseWriter, r *http.Request) {
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

	courseIdStr := r.URL.Query().Get("id")

	switch r.Method {
	case http.MethodGet:
		// Fetch Courses
		courses := []StudyCourse{}
		cRows, err := db.Query(`SELECT id, user_id, course_name, semester, sks, grade, created_at, updated_at FROM study_courses WHERE user_id = $1 ORDER BY created_at DESC`, userID)
		if err == nil {
			defer cRows.Close()
			for cRows.Next() {
				var c StudyCourse
				cRows.Scan(&c.ID, &c.UserID, &c.CourseName, &c.Semester, &c.SKS, &c.Grade, &c.CreatedAt, &c.UpdatedAt)
				c.Archives = []StudyArchive{}
				courses = append(courses, c)
			}
		}

		if len(courses) > 0 {
			// Fetch Archives
			courseIds := make([]string, len(courses))
			for i, c := range courses {
				courseIds[i] = strconv.Itoa(c.ID)
			}
			aRows, err := db.Query(fmt.Sprintf(`SELECT id, course_id, meeting_tag, type, file_name, file_path, link_url, created_at, updated_at FROM study_archives WHERE course_id IN (%s)`, strings.Join(courseIds, ",")))
			if err == nil {
				defer aRows.Close()
				for aRows.Next() {
					var a StudyArchive
					aRows.Scan(&a.ID, &a.CourseID, &a.MeetingTag, &a.Type, &a.FileName, &a.FilePath, &a.LinkUrl, &a.CreatedAt, &a.UpdatedAt)
					for i, c := range courses {
						if c.ID == a.CourseID {
							courses[i].Archives = append(courses[i].Archives, a)
							break
						}
					}
				}
			}
		}

		json.NewEncoder(w).Encode(courses)

	case http.MethodPost:
		var req struct {
			CourseName string  `json:"courseName"`
			Semester   int     `json:"semester"`
			SKS        int     `json:"sks"`
			Grade      *string `json:"grade"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}

		query := `INSERT INTO study_courses (user_id, course_name, semester, sks, grade, updated_at) 
		VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, created_at, updated_at`
		
		var id int
		var ca, ua *time.Time
		err := db.QueryRow(query, userID, req.CourseName, req.Semester, req.SKS, req.Grade).Scan(&id, &ca, &ua)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to create: %v"}`, err), http.StatusInternalServerError)
			return
		}
		
		json.NewEncoder(w).Encode(StudyCourse{
			ID: id,
			UserID: userID,
			CourseName: req.CourseName,
			Semester: req.Semester,
			SKS: req.SKS,
			Grade: req.Grade,
			CreatedAt: ca,
			UpdatedAt: ua,
			Archives: []StudyArchive{},
		})

	case http.MethodPut:
		var req struct {
			ID         int     `json:"id"`
			CourseName string  `json:"courseName"`
			Semester   int     `json:"semester"`
			SKS        int     `json:"sks"`
			Grade      *string `json:"grade"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}
		if req.ID == 0 {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}

		query := `UPDATE study_courses SET course_name = $1, semester = $2, sks = $3, grade = $4, updated_at = NOW() WHERE user_id = $5 AND id = $6 RETURNING created_at, updated_at`
		
		var ca, ua *time.Time
		err := db.QueryRow(query, req.CourseName, req.Semester, req.SKS, req.Grade, userID, req.ID).Scan(&ca, &ua)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to update: %v"}`, err), http.StatusInternalServerError)
			return
		}
		
		// Return updated course with archives
		var course = StudyCourse{
			ID: req.ID,
			UserID: userID,
			CourseName: req.CourseName,
			Semester: req.Semester,
			SKS: req.SKS,
			Grade: req.Grade,
			CreatedAt: ca,
			UpdatedAt: ua,
			Archives: []StudyArchive{},
		}
		aRows, err := db.Query(`SELECT id, course_id, meeting_tag, type, file_name, file_path, link_url, created_at, updated_at FROM study_archives WHERE course_id = $1`, req.ID)
		if err == nil {
			defer aRows.Close()
			for aRows.Next() {
				var a StudyArchive
				aRows.Scan(&a.ID, &a.CourseID, &a.MeetingTag, &a.Type, &a.FileName, &a.FilePath, &a.LinkUrl, &a.CreatedAt, &a.UpdatedAt)
				course.Archives = append(course.Archives, a)
			}
		}

		json.NewEncoder(w).Encode(course)

	case http.MethodDelete:
		if courseIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}
		_, err := db.Exec(`DELETE FROM study_courses WHERE user_id = $1 AND id = $2`, userID, courseIdStr)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to delete: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"success": true})

	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
