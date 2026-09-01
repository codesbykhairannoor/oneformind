package calendar

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
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	db.SetMaxOpenConns(2)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(5 * time.Minute)
}

type CalendarEvent struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Type        string     `json:"type"`
	Color       string     `json:"color"`
	StartDate   time.Time  `json:"startDate"`
	EndDate     *time.Time `json:"endDate"`
	IsAllDay    bool       `json:"isAllDay"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
	CreatedAt   *time.Time `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
}

type Journal struct {
	ID        int       `json:"id"`
	Date      time.Time `json:"date"`
	Content   *string   `json:"content"`
	Mood      *string   `json:"mood"`
}

type PlannerTask struct {
	ID          int        `json:"id"`
	Date        time.Time  `json:"date"`
	Title       string     `json:"title"`
	StartTime   *time.Time `json:"startTime"`
	EndTime     *time.Time `json:"endTime"`
	Type        int        `json:"type"`
	IsCompleted bool       `json:"completed"`
}

type FinanceTransaction struct {
	ID       int       `json:"id"`
	Date     time.Time `json:"date"`
	Type     string    `json:"type"`
	Amount   float64   `json:"amount"`
	Title    string    `json:"title"`
	Category string    `json:"category"`
}

type HabitLog struct {
	ID      int       `json:"id"`
	HabitID int       `json:"habitId"`
	Date    time.Time `json:"date"`
	Status  string    `json:"status"`
}

func CalendarHandler(w http.ResponseWriter, r *http.Request) {
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

	// Server-Side Gating: Calendar requires Architect tier
	var planType string
	err = db.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userID).Scan(&planType)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}
	if planType != "architect" && planType != "quantum" && planType != "legendary" && planType != "trial" {
		http.Error(w, `{"error": "Forbidden: Calendar requires Architect tier"}`, http.StatusForbidden)
		return
	}

	if db == nil {
		http.Error(w, `{"error": "Database connection not initialized"}`, http.StatusInternalServerError)
		return
	}

	eventIdStr := r.URL.Query().Get("id")

	switch r.Method {
	case http.MethodGet:
		period := r.URL.Query().Get("period")
		now := time.Now()
		startDate := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
		endDate := startDate.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)

		if period != "" {
			parts := strings.Split(period, "-")
			if len(parts) == 2 {
				y, _ := strconv.Atoi(parts[0])
				m, _ := strconv.Atoi(parts[1])
				startDate = time.Date(y, time.Month(m), 1, 0, 0, 0, 0, time.UTC)
				endDate = startDate.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			}
		}

		// Calendar Events
		events := []CalendarEvent{}
		rows, err := db.Query(`SELECT id, user_id, title, description, type, color, start_date, end_date, is_all_day, start_time, end_time, created_at, updated_at FROM calendar_events WHERE user_id = $1 AND start_date >= $2 AND start_date <= $3`, userID, startDate, endDate)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var e CalendarEvent
				var ed, st, et, ca, ua sql.NullTime
				err := rows.Scan(&e.ID, &e.UserID, &e.Title, &e.Description, &e.Type, &e.Color, &e.StartDate, &ed, &e.IsAllDay, &st, &et, &ca, &ua)
				if err == nil {
					if ed.Valid { t := ed.Time; e.EndDate = &t }
					if st.Valid { t := st.Time; e.StartTime = &t }
					if et.Valid { t := et.Time; e.EndTime = &t }
					if ca.Valid { t := ca.Time; e.CreatedAt = &t }
					if ua.Valid { t := ua.Time; e.UpdatedAt = &t }
					events = append(events, e)
				}
			}
		}

		// Journals
		journals := []Journal{}
		jRows, err := db.Query(`SELECT id, date, content, mood FROM journals WHERE user_id = $1 AND date >= $2 AND date <= $3`, userID, startDate, endDate)
		if err == nil {
			defer jRows.Close()
			for jRows.Next() {
				var j Journal
				err := jRows.Scan(&j.ID, &j.Date, &j.Content, &j.Mood)
				if err == nil {
					journals = append(journals, j)
				}
			}
		}

		// PlannerTasks
		tasks := []PlannerTask{}
		tRows, err := db.Query(`SELECT id, date, title, start_time, end_time, type, is_completed FROM planner_tasks WHERE user_id = $1 AND date >= $2 AND date <= $3`, userID, startDate, endDate)
		if err == nil {
			defer tRows.Close()
			for tRows.Next() {
				var t PlannerTask
				var st, et sql.NullTime
				err := tRows.Scan(&t.ID, &t.Date, &t.Title, &st, &et, &t.Type, &t.IsCompleted)
				if err == nil {
					if st.Valid { tTime := st.Time; t.StartTime = &tTime }
					if et.Valid { tTime := et.Time; t.EndTime = &tTime }
					tasks = append(tasks, t)
				}
			}
		}

		// Finance
		finances := []FinanceTransaction{}
		fRows, err := db.Query(`SELECT id, date, type, amount, title, category FROM finance_transactions WHERE user_id = $1 AND date >= $2 AND date <= $3`, userID, startDate, endDate)
		if err == nil {
			defer fRows.Close()
			for fRows.Next() {
				var f FinanceTransaction
				err := fRows.Scan(&f.ID, &f.Date, &f.Type, &f.Amount, &f.Title, &f.Category)
				if err == nil {
					finances = append(finances, f)
				}
			}
		}

		// HabitLogs
		habitLogs := []HabitLog{}
		hRows, err := db.Query(`SELECT hl.id, hl.habit_id, hl.date, hl.status FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = $1 AND hl.date >= $2 AND hl.date <= $3 AND hl.status = 'completed'`, userID, startDate, endDate)
		if err == nil {
			defer hRows.Close()
			for hRows.Next() {
				var hl HabitLog
				err := hRows.Scan(&hl.ID, &hl.HabitID, &hl.Date, &hl.Status)
				if err == nil {
					habitLogs = append(habitLogs, hl)
				}
			}
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"events":              events,
			"journals":            journals,
			"plannerTasks":        tasks,
			"financeTransactions": finances,
			"habitLogs":           habitLogs,
		})

	case http.MethodPost:
		var req struct {
			Title       string  `json:"title"`
			Description *string `json:"description"`
			Type        string  `json:"type"`
			Color       string  `json:"color"`
			StartDate   string  `json:"startDate"`
			EndDate     *string `json:"endDate"`
			IsAllDay    bool    `json:"isAllDay"`
			StartTime   *string `json:"startTime"`
			EndTime     *string `json:"endTime"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}
		if req.Type == "" {
			req.Type = "event"
		}
		if req.Color == "" {
			req.Color = "#3b82f6"
		}

		var startDate time.Time
		if req.StartDate != "" {
			startDate, _ = time.Parse(time.RFC3339, req.StartDate)
		} else {
			startDate = time.Now()
		}

		var endDate, startTime, endTime sql.NullTime
		if req.EndDate != nil && *req.EndDate != "" {
			t, _ := time.Parse(time.RFC3339, *req.EndDate)
			endDate = sql.NullTime{Time: t, Valid: true}
		}
		if req.StartTime != nil && *req.StartTime != "" {
			t, _ := time.Parse(time.RFC3339, *req.StartTime)
			startTime = sql.NullTime{Time: t, Valid: true}
		}
		if req.EndTime != nil && *req.EndTime != "" {
			t, _ := time.Parse(time.RFC3339, *req.EndTime)
			endTime = sql.NullTime{Time: t, Valid: true}
		}

		query := `INSERT INTO calendar_events (user_id, title, description, type, color, start_date, end_date, is_all_day, start_time, end_time, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id, created_at, updated_at`
		
		var id int
		var ca, ua time.Time
		err := db.QueryRow(query, userID, req.Title, req.Description, req.Type, req.Color, startDate, endDate, req.IsAllDay, startTime, endTime).Scan(&id, &ca, &ua)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to create: %v"}`, err), http.StatusInternalServerError)
			return
		}
		
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id": id,
			"userId": userID,
			"title": req.Title,
			"description": req.Description,
			"type": req.Type,
			"color": req.Color,
			"startDate": startDate,
			"endDate": req.EndDate,
			"isAllDay": req.IsAllDay,
			"startTime": req.StartTime,
			"endTime": req.EndTime,
			"createdAt": ca,
			"updatedAt": ua,
		})

	case http.MethodPut:
		if eventIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}

		var req map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
			return
		}

		setParts := []string{}
		args := []interface{}{userID, eventIdStr}
		i := 3

		for k, v := range req {
			if k == "id" || k == "userId" || k == "createdAt" || k == "updatedAt" {
				continue
			}
			dbCol := ""
			switch k {
			case "title": dbCol = "title"
			case "description": dbCol = "description"
			case "type": dbCol = "type"
			case "color": dbCol = "color"
			case "startDate": dbCol = "start_date"
			case "endDate": dbCol = "end_date"
			case "isAllDay": dbCol = "is_all_day"
			case "startTime": dbCol = "start_time"
			case "endTime": dbCol = "end_time"
			default: continue
			}

			// Handle potential null dates sent as empty strings or nulls from UI
			if (k == "endDate" || k == "startTime" || k == "endTime") && (v == "" || v == nil) {
				setParts = append(setParts, fmt.Sprintf("%s = NULL", dbCol))
				continue
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

		query := fmt.Sprintf(`UPDATE calendar_events SET %s WHERE user_id = $1 AND id = $2 RETURNING id`, strings.Join(setParts, ", "))
		
		var id int
		err := db.QueryRow(query, args...).Scan(&id)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to update: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"id": id})

	case http.MethodDelete:
		if eventIdStr == "" {
			http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
			return
		}
		_, err := db.Exec(`DELETE FROM calendar_events WHERE user_id = $1 AND id = $2`, userID, eventIdStr)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to delete: %v"}`, err), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"success": true})

	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
