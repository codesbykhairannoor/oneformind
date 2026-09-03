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

	_ "github.com/jackc/pgx/v5/stdlib"
)

var dbDaily *sql.DB

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

	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)
	if strings.HasSuffix(connStr, "?") {
		connStr = strings.TrimSuffix(connStr, "?")
	}

	if !strings.Contains(connStr, "sslmode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&sslmode=require"
		} else {
			connStr += "?sslmode=require"
		}
	}

	var err error
	if !strings.Contains(connStr, "default_query_exec_mode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&default_query_exec_mode=simple_protocol"
		} else {
			connStr += "?default_query_exec_mode=simple_protocol"
		}
	}
	dbDaily, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbDaily.SetMaxOpenConns(2)
	dbDaily.SetMaxIdleConns(1)
	dbDaily.SetConnMaxLifetime(5 * time.Minute)
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
	if dbDaily == nil {
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

		if notes.Valid {
			pd.Notes = &notes.String
		}

		response := map[string]interface{}{
			"id":           pd.ID,
			"userId":       pd.UserID,
			"date":         pd.Date,
			"notes":        pd.Notes,
			"waterGlasses": pd.WaterGlasses,
			"createdAt":    createdAt.Time,
			"updatedAt":    updatedAt.Time,
		}

		if meals.Valid && meals.String != "" {
			var m interface{}
			json.Unmarshal([]byte(meals.String), &m)
			response["meals"] = m
		} else {
			response["meals"] = nil
		}

		if inbox.Valid && inbox.String != "" {
			var i interface{}
			json.Unmarshal([]byte(inbox.String), &i)
			response["inbox"] = i
		} else {
			response["inbox"] = nil
		}

		json.NewEncoder(w).Encode(response)

	} else if r.Method == http.MethodPut {
		var body map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, 400)
			return
		}

		dateStr, ok := body["date"].(string)
		if !ok || dateStr == "" {
			http.Error(w, `{"error": "Missing date"}`, 400)
			return
		}

		// waterGlasses
		var waterGlasses int
		if wg, ok := body["waterGlasses"].(float64); ok {
			waterGlasses = int(wg)
		}

		// notes
		var notesVal interface{} = nil
		if n, ok := body["notes"].(string); ok {
			notesVal = n
		}

		// meals — MUST pass as string for jsonb column (pgx treats []byte as bytea)
		var mealsStr interface{} = nil
		if m, ok := body["meals"]; ok && m != nil {
			mBytes, _ := json.Marshal(m)
			mealsStr = string(mBytes)
		}

		// inbox — same fix: pass as string not []byte
		var inboxStr interface{} = nil
		if i, ok := body["inbox"]; ok && i != nil {
			iBytes, _ := json.Marshal(i)
			inboxStr = string(iBytes)
		}

		query := `
			INSERT INTO planner_daily (user_id, date, notes, meals, water_glasses, inbox, created_at, updated_at)
			VALUES ($1, $2, $3, $4::jsonb, $5, $6::jsonb, NOW(), NOW())
			ON CONFLICT (user_id, date) DO UPDATE SET 
			notes = EXCLUDED.notes, meals = EXCLUDED.meals, water_glasses = EXCLUDED.water_glasses, inbox = EXCLUDED.inbox, updated_at = NOW()
			RETURNING id
		`

		var id int
		err := dbDaily.QueryRow(query, userID, dateStr, notesVal, mealsStr, waterGlasses, inboxStr).Scan(&id)
		if err != nil {
			fmt.Println("Planner daily upsert error:", err)
			http.Error(w, `{"error": "Internal Error"}`, 500)
			return
		}

		w.Write([]byte(fmt.Sprintf(`{"id": %d, "success": true}`, id)))
	}
}
