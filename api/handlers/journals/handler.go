package journals

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

func init() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		fmt.Println("Warning: DATABASE_URL not set")
		return
	}
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

	db.SetMaxOpenConns(2)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(5 * time.Minute)
}

type Journal struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	Date        time.Time  `json:"date"`
	Title       *string    `json:"title"`
	Content     *string    `json:"content"`
	Mood        *string    `json:"mood"`
	ImagePath   *string    `json:"imagePath"`
	IsPinned    bool       `json:"isPinned"`
	AiSentiment *string    `json:"aiSentiment"`
	MoodScore   *float64   `json:"moodScore"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func JournalsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

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

	// Server-Side Gating: Journal requires Architect tier
	var planType string
	err = db.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userID).Scan(&planType)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}
	if planType != "architect" && planType != "quantum" && planType != "legendary" && planType != "trial" {
		http.Error(w, `{"error": "Forbidden: Journal requires Architect tier"}`, http.StatusForbidden)
		return
	}

	if db == nil {
		http.Error(w, `{"error": "Database connection not initialized"}`, http.StatusInternalServerError)
		return
	}

	journalIdStr := r.URL.Query().Get("id")

	switch r.Method {
	case http.MethodGet:
		journals := []Journal{}
		rows, err := db.Query(`SELECT id, user_id, date, title, content, mood, image_path, is_pinned, ai_sentiment, mood_score, created_at, updated_at FROM journals WHERE user_id = $1 ORDER BY date DESC`, userID)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var j Journal
				rows.Scan(&j.ID, &j.UserID, &j.Date, &j.Title, &j.Content, &j.Mood, &j.ImagePath, &j.IsPinned, &j.AiSentiment, &j.MoodScore, &j.CreatedAt, &j.UpdatedAt)
				journals = append(journals, j)
			}
		} else {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to fetch: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(journals)

	case http.MethodPost:
		var req struct {
			Date        string   `json:"date"`
			Title       *string  `json:"title"`
			Content     *string  `json:"content"`
			Mood        *string  `json:"mood"`
			ImagePath   *string  `json:"imagePath"`
			IsPinned    bool     `json:"isPinned"`
			AiSentiment *string  `json:"aiSentiment"`
			MoodScore   *float64 `json:"moodScore"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}

		query := `INSERT INTO journals (user_id, date, title, content, mood, image_path, is_pinned, ai_sentiment, mood_score, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING id, created_at, updated_at`
		
		var id int
		var ca, ua time.Time
		err := db.QueryRow(query, userID, req.Date, req.Title, req.Content, req.Mood, req.ImagePath, req.IsPinned, req.AiSentiment, req.MoodScore).Scan(&id, &ca, &ua)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to create: %v"}`, err), http.StatusInternalServerError)
			return
		}
		
		dateParsed, _ := time.Parse(time.RFC3339, req.Date)
		json.NewEncoder(w).Encode(Journal{
			ID: id,
			UserID: userID,
			Date: dateParsed,
			Title: req.Title,
			Content: req.Content,
			Mood: req.Mood,
			ImagePath: req.ImagePath,
			IsPinned: req.IsPinned,
			AiSentiment: req.AiSentiment,
			MoodScore: req.MoodScore,
			CreatedAt: ca,
			UpdatedAt: ua,
		})

	case http.MethodPut:
		if journalIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}

		var req map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}

		setParts := []string{}
		args := []interface{}{userID, journalIdStr}
		i := 3

		for k, v := range req {
			if k == "id" || k == "userId" || k == "createdAt" || k == "updatedAt" {
				continue
			}
			dbCol := ""
			switch k {
			case "date": dbCol = "date"
			case "title": dbCol = "title"
			case "content": dbCol = "content"
			case "mood": dbCol = "mood"
			case "imagePath": dbCol = "image_path"
			case "isPinned": dbCol = "is_pinned"
			case "aiSentiment": dbCol = "ai_sentiment"
			case "moodScore": dbCol = "mood_score"
			default: continue
			}
			setParts = append(setParts, fmt.Sprintf("%s = $%d", dbCol, i))
			args = append(args, v)
			i++
		}

		if len(setParts) == 0 {
			json.NewEncoder(w).Encode(map[string]bool{"success": true})
			return
		}
		
		setParts = append(setParts, fmt.Sprintf("updated_at = NOW()"))

		query := fmt.Sprintf(`UPDATE journals SET %s WHERE user_id = $1 AND id = $2 RETURNING id`, strings.Join(setParts, ", "))
		
		var id int
		err := db.QueryRow(query, args...).Scan(&id)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to update: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"id": id})

	case http.MethodDelete:
		if journalIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}
		_, err := db.Exec(`DELETE FROM journals WHERE user_id = $1 AND id = $2`, userID, journalIdStr)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to delete: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"success": true})

	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
