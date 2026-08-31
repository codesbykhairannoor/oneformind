package plannerdaily

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

var dbDaily *sql.DB

func init() {
	if dbDaily != nil {
		return
	}
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return
	}
	if !strings.Contains(dbURL, "sslmode=") {
		if strings.Contains(dbURL, "?") {
			dbURL += "&sslmode=require"
		} else {
			dbURL += "?sslmode=require"
		}
	}
	dbDaily, _ = sql.Open("postgres", dbURL)
	if dbDaily != nil {
		dbDaily.SetMaxOpenConns(2)
		dbDaily.SetMaxIdleConns(1)
		dbDaily.SetConnMaxLifetime(5 * time.Minute)
	}
}

type PlannerDaily struct {
	ID           int       `json:"id"`
	UserID       int       `json:"userId"`
	Date         time.Time `json:"date"`
	Notes        *string   `json:"notes"`
	Meals        *string   `json:"meals"` // Stored as JSON string
	WaterGlasses int       `json:"waterGlasses"`
	Inbox        *string   `json:"inbox"` // Stored as JSON string
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

func PlannerDailyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	userIdStr := r.Header.Get("X-User-Id")
	userID, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	if dbDaily == nil {
		http.Error(w, `{"error": "DB not initialized"}`, 500)
		return
	}

	if r.Method == http.MethodGet {
		dateStr := r.URL.Query().Get("date")
		if dateStr == "" {
			http.Error(w, `{"error": "Missing date"}`, 400)
			return
		}
		
		var pd PlannerDaily
		var createdAt, updatedAt sql.NullTime
		var notes, meals, inbox sql.NullString
		
		err := dbDaily.QueryRow(`SELECT id, user_id, date, notes, meals, water_glasses, inbox, created_at, updated_at 
			FROM planner_daily WHERE user_id = $1 AND date = $2`, userID, dateStr).Scan(
			&pd.ID, &pd.UserID, &pd.Date, &notes, &meals, &pd.WaterGlasses, &inbox, &createdAt, &updatedAt,
		)

		if err != nil {
			if err == sql.ErrNoRows {
				w.Write([]byte(`{}`))
				return
			}
			http.Error(w, `{"error": "Internal Error"}`, 500)
			return
		}

		if notes.Valid { pd.Notes = &notes.String }
		// Prisma returns JSON objects for meals/inbox, so we need to return json.RawMessage if we want to be exact,
		// but since they are null or json strings in postgres, we'll unmarshal them.
		
		response := map[string]interface{}{
			"id": pd.ID,
			"userId": pd.UserID,
			"date": pd.Date,
			"notes": pd.Notes,
			"waterGlasses": pd.WaterGlasses,
			"createdAt": createdAt.Time,
			"updatedAt": updatedAt.Time,
		}
		
		if meals.Valid {
			var m interface{}
			json.Unmarshal([]byte(meals.String), &m)
			response["meals"] = m
		} else {
			response["meals"] = nil
		}
		
		if inbox.Valid {
			var i interface{}
			json.Unmarshal([]byte(inbox.String), &i)
			response["inbox"] = i
		} else {
			response["inbox"] = nil
		}

		json.NewEncoder(w).Encode(response)

	} else if r.Method == http.MethodPut {
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)
		
		dateStr, ok := body["date"].(string)
		if !ok {
			http.Error(w, `{"error": "Missing date"}`, 400)
			return
		}

		// Prepare updates
		var waterGlasses int
		if wg, ok := body["waterGlasses"].(float64); ok {
			waterGlasses = int(wg)
		} else {
			dbDaily.QueryRow(`SELECT water_glasses FROM planner_daily WHERE user_id = $1 AND date = $2`, userID, dateStr).Scan(&waterGlasses)
		}

		var notes interface{} = nil
		if n, ok := body["notes"].(string); ok { notes = n } else {
			var existingNotes sql.NullString
			dbDaily.QueryRow(`SELECT notes FROM planner_daily WHERE user_id = $1 AND date = $2`, userID, dateStr).Scan(&existingNotes)
			if existingNotes.Valid { notes = existingNotes.String }
		}

		var mealsBytes, inboxBytes []byte
		if m, ok := body["meals"]; ok { mealsBytes, _ = json.Marshal(m) } else {
			var existingMeals sql.NullString
			dbDaily.QueryRow(`SELECT meals FROM planner_daily WHERE user_id = $1 AND date = $2`, userID, dateStr).Scan(&existingMeals)
			if existingMeals.Valid { mealsBytes = []byte(existingMeals.String) }
		}
		
		if i, ok := body["inbox"]; ok { inboxBytes, _ = json.Marshal(i) } else {
			var existingInbox sql.NullString
			dbDaily.QueryRow(`SELECT inbox FROM planner_daily WHERE user_id = $1 AND date = $2`, userID, dateStr).Scan(&existingInbox)
			if existingInbox.Valid { inboxBytes = []byte(existingInbox.String) }
		}

		query := `
			INSERT INTO planner_daily (user_id, date, notes, meals, water_glasses, inbox, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
			ON CONFLICT (user_id, date) DO UPDATE SET 
			notes = EXCLUDED.notes, meals = EXCLUDED.meals, water_glasses = EXCLUDED.water_glasses, inbox = EXCLUDED.inbox, updated_at = NOW()
			RETURNING id
		`
		
		var id int
		err := dbDaily.QueryRow(query, userID, dateStr, notes, mealsBytes, waterGlasses, inboxBytes).Scan(&id)
		if err != nil {
			fmt.Println("Upsert Error:", err)
			http.Error(w, `{"error": "Internal Error"}`, 500)
			return
		}
		
		w.Write([]byte(fmt.Sprintf(`{"id": %d, "success": true}`, id)))
	}
}
