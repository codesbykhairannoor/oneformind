package goals

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var dbGoals *sql.DB

func initDB() {
	dbGoals = shareddb.Get()
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
	ParentGoalID  *int            `json:"parentGoalId,omitempty"`
	CreatedAt     *time.Time      `json:"createdAt"`
	UpdatedAt     *time.Time      `json:"updatedAt"`
	Milestones    []GoalMilestone `json:"milestones"`
}

func sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func sendError(w http.ResponseWriter, status int, msg string) {
	log.Printf("[goals_api] error status=%d: %s\n", status, msg)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func normalizePriority(p string) string {
	switch strings.ToLower(strings.TrimSpace(p)) {
	case "vital", "urgent":
		return "vital"
	case "optional", "low":
		return "optional"
	case "important", "medium", "normal", "high":
		fallthrough
	default:
		return "important"
	}
}

func normalizeStatus(s string) string {
	switch strings.ToLower(strings.TrimSpace(s)) {
	case "completed", "done":
		return "completed"
	case "paused":
		return "paused"
	case "cancelled", "canceled":
		return "cancelled"
	case "active", "in_progress":
		fallthrough
	default:
		return "active"
	}
}

func normalizeType(t string) string {
	tNorm := strings.ToLower(strings.TrimSpace(t))
	switch tNorm {
	case "daily", "weekly", "monthly", "quarterly", "yearly",
		"milestones", "numeric", "currency", "boolean", "custom",
		"vision", "specific_days", "custom_period", "habit_frequency":
		return tNorm
	default:
		return "milestones"
	}
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
		sendError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid user ID")
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
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func handleGetGoals(w http.ResponseWriter, r *http.Request, userId int) {
	if dbGoals == nil {
		initDB()
	}
	if dbGoals == nil {
		sendError(w, http.StatusInternalServerError, "Database connection not available")
		return
	}

	// Fetch Goals
	rows, err := dbGoals.Query(`
		SELECT id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, parent_goal_id, created_at, updated_at
		FROM goals
		WHERE user_id = $1
		ORDER BY id DESC
	`, userId)
	if err != nil {
		log.Printf("[goals_api] Failed to query goals: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Failed to query goals")
		return
	}
	defer rows.Close()

	goalsMap := make(map[int]*Goal)
	goals := []Goal{}
	goalIDs := []int{}

	for rows.Next() {
		var g Goal
		var startDate, endDate, createdAt, updatedAt sql.NullTime
		var parentGoalID sql.NullInt64
		err := rows.Scan(
			&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &startDate, &endDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &parentGoalID, &createdAt, &updatedAt,
		)
		if err != nil {
			log.Printf("[goals_api] Failed to scan goal: %v\n", err)
			sendError(w, http.StatusInternalServerError, "Failed to scan goal")
			return
		}
		if parentGoalID.Valid {
			v := int(parentGoalID.Int64)
			g.ParentGoalID = &v
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

		g.Priority = normalizePriority(g.Priority)
		g.Status = normalizeStatus(g.Status)
		g.Type = normalizeType(g.Type)
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

	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	sendJSON(w, http.StatusOK, goals)
}

func handleCreateGoal(w http.ResponseWriter, r *http.Request, userId int) {
	var body struct {
		Title              string   `json:"title"`
		Category           *string  `json:"category"`
		Type               *string  `json:"type"`
		TargetValue        *float64 `json:"targetValue"`
		TargetValueSnake   *float64 `json:"target_value"`
		CurrentValue       *float64 `json:"currentValue"`
		CurrentValueSnake  *float64 `json:"current_value"`
		StartDate          *string  `json:"startDate"`
		StartDateSnake     *string  `json:"start_date"`
		EndDate            *string  `json:"endDate"`
		EndDateSnake       *string  `json:"end_date"`
		SpecificDays       *string  `json:"specificDays"`
		SpecificDaysSnake  *string  `json:"specific_days"`
		Status             *string  `json:"status"`
		CoverImageUrl      *string  `json:"coverImageUrl"`
		CoverImageUrlSnake *string  `json:"cover_image_url"`
		Reward             *string  `json:"reward"`
		Priority           *string  `json:"priority"`
		Color              *string  `json:"color"`
		ParentGoalID       *int     `json:"parentGoalId"`
		ParentGoalIDSnake  *int     `json:"parent_goal_id"`
		Milestones         []struct {
			Title       string `json:"title"`
			Completed   *bool  `json:"completed"`
			IsCompleted *bool  `json:"is_completed"`
			Order       *int   `json:"order"`
		} `json:"milestones"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("[goals_api] Failed to decode body: %v\n", err)
		sendError(w, http.StatusBadRequest, fmt.Sprintf("Format data tidak valid: %v", err))
		return
	}

	title := strings.TrimSpace(body.Title)
	if title == "" {
		sendError(w, http.StatusBadRequest, "Judul target wajib diisi!")
		return
	}

	if body.TargetValue == nil && body.TargetValueSnake != nil {
		body.TargetValue = body.TargetValueSnake
	}
	if body.CurrentValue == nil && body.CurrentValueSnake != nil {
		body.CurrentValue = body.CurrentValueSnake
	}
	if body.StartDate == nil && body.StartDateSnake != nil {
		body.StartDate = body.StartDateSnake
	}
	if body.EndDate == nil && body.EndDateSnake != nil {
		body.EndDate = body.EndDateSnake
	}
	if body.SpecificDays == nil && body.SpecificDaysSnake != nil {
		body.SpecificDays = body.SpecificDaysSnake
	}
	if body.CoverImageUrl == nil && body.CoverImageUrlSnake != nil {
		body.CoverImageUrl = body.CoverImageUrlSnake
	}
	if body.ParentGoalID == nil && body.ParentGoalIDSnake != nil {
		body.ParentGoalID = body.ParentGoalIDSnake
	}

	rawType := "milestones"
	if body.Type != nil && *body.Type != "" {
		rawType = *body.Type
	}
	tType := normalizeType(rawType)

	tTarget := 100.0
	if body.TargetValue != nil {
		tTarget = *body.TargetValue
	}
	tCurrent := 0.0
	if body.CurrentValue != nil {
		tCurrent = *body.CurrentValue
	}

	rawStatus := "active"
	if body.Status != nil && *body.Status != "" {
		rawStatus = *body.Status
	}
	tStatus := normalizeStatus(rawStatus)

	rawPriority := "important"
	if body.Priority != nil && *body.Priority != "" {
		rawPriority = *body.Priority
	}
	tPriority := normalizePriority(rawPriority)

	var startDate, endDate *time.Time
	if body.StartDate != nil && *body.StartDate != "" {
		t, err := time.Parse(time.RFC3339, *body.StartDate)
		if err != nil {
			t, err = time.Parse("2006-01-02", *body.StartDate)
		}
		if err == nil {
			startDate = &t
		}
	}
	if body.EndDate != nil && *body.EndDate != "" {
		t, err := time.Parse(time.RFC3339, *body.EndDate)
		if err != nil {
			t, err = time.Parse("2006-01-02", *body.EndDate)
		}
		if err == nil {
			endDate = &t
		}
	}

	if dbGoals == nil {
		initDB()
	}
	if dbGoals == nil {
		sendError(w, http.StatusInternalServerError, "Koneksi database terputus. Silakan coba sesaat lagi.")
		return
	}

	var parentID *int
	if body.ParentGoalID != nil && *body.ParentGoalID > 0 {
		var existsID int
		err := dbGoals.QueryRow(`SELECT id FROM goals WHERE id = $1 AND user_id = $2`, *body.ParentGoalID, userId).Scan(&existsID)
		if err == nil && existsID > 0 {
			parentID = body.ParentGoalID
		}
	}

	// Insert
	var g Goal
	var retParentID sql.NullInt64
	var retStartDate, retEndDate, retCreatedAt, retUpdatedAt sql.NullTime
	err := dbGoals.QueryRow(`
		INSERT INTO goals (user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, parent_goal_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, parent_goal_id, created_at, updated_at
	`, userId, title, body.Category, tType, tTarget, tCurrent, startDate, endDate, body.SpecificDays, tStatus, body.CoverImageUrl, body.Reward, tPriority, body.Color, parentID).Scan(
		&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &retStartDate, &retEndDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &retParentID, &retCreatedAt, &retUpdatedAt,
	)
	if retParentID.Valid {
		v := int(retParentID.Int64)
		g.ParentGoalID = &v
	}
	if retStartDate.Valid {
		t := retStartDate.Time
		g.StartDate = &t
	}
	if retEndDate.Valid {
		t := retEndDate.Time
		g.EndDate = &t
	}
	if retCreatedAt.Valid {
		t := retCreatedAt.Time
		g.CreatedAt = &t
	}
	if retUpdatedAt.Valid {
		t := retUpdatedAt.Time
		g.UpdatedAt = &t
	}

	if err != nil {
		log.Printf("[goals_api] Failed to insert goal: %v\n", err)
		sendError(w, http.StatusInternalServerError, fmt.Sprintf("Gagal menyimpan target ke database: %v", err))
		return
	}
	g.Milestones = []GoalMilestone{}

	if len(body.Milestones) > 0 {
		for i, ms := range body.Milestones {
			msTitle := strings.TrimSpace(ms.Title)
			if msTitle == "" {
				continue
			}
			isComp := false
			if ms.Completed != nil {
				isComp = *ms.Completed
			} else if ms.IsCompleted != nil {
				isComp = *ms.IsCompleted
			}
			ord := i + 1
			if ms.Order != nil {
				ord = *ms.Order
			}
			var m GoalMilestone
			var retTargetDate, mCreatedAt, mUpdatedAt sql.NullTime
			err := dbGoals.QueryRow(`
				INSERT INTO goal_milestones (goal_id, title, completed, "order", created_at, updated_at)
				VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
				RETURNING id, goal_id, title, completed, "order", target_date, created_at, updated_at
			`, g.ID, msTitle, isComp, ord).Scan(
				&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &retTargetDate, &mCreatedAt, &mUpdatedAt,
			)
			if err == nil {
				if retTargetDate.Valid {
					t := retTargetDate.Time
					m.TargetDate = &t
				}
				if mCreatedAt.Valid {
					t := mCreatedAt.Time
					m.CreatedAt = &t
				}
				if mUpdatedAt.Valid {
					t := mUpdatedAt.Time
					m.UpdatedAt = &t
				}
				g.Milestones = append(g.Milestones, m)
			} else {
				log.Printf("[goals_api] Failed to insert milestone: %v\n", err)
			}
		}
	}

	sendJSON(w, http.StatusCreated, g)
}

func handleUpdateGoal(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		sendError(w, http.StatusBadRequest, "Missing ID")
		return
	}
	goalId, err := strconv.Atoi(idStr)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	var body struct {
		Title              *string  `json:"title"`
		Category           *string  `json:"category"`
		Type               *string  `json:"type"`
		TargetValue        *float64 `json:"targetValue"`
		TargetValueSnake   *float64 `json:"target_value"`
		CurrentValue       *float64 `json:"currentValue"`
		CurrentValueSnake  *float64 `json:"current_value"`
		StartDate          *string  `json:"startDate"`
		StartDateSnake     *string  `json:"start_date"`
		EndDate            *string  `json:"endDate"`
		EndDateSnake       *string  `json:"end_date"`
		SpecificDays       *string  `json:"specificDays"`
		SpecificDaysSnake  *string  `json:"specific_days"`
		Status             *string  `json:"status"`
		CoverImageUrl      *string  `json:"coverImageUrl"`
		CoverImageUrlSnake *string  `json:"cover_image_url"`
		Reward             *string  `json:"reward"`
		Priority           *string  `json:"priority"`
		Color              *string  `json:"color"`
		ParentGoalID       *int     `json:"parentGoalId"`
		ParentGoalIDSnake  *int     `json:"parent_goal_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("[goals_api] Failed to decode update body: %v\n", err)
		sendError(w, http.StatusBadRequest, fmt.Sprintf("Format data tidak valid: %v", err))
		return
	}

	if body.TargetValue == nil && body.TargetValueSnake != nil {
		body.TargetValue = body.TargetValueSnake
	}
	if body.CurrentValue == nil && body.CurrentValueSnake != nil {
		body.CurrentValue = body.CurrentValueSnake
	}
	if body.StartDate == nil && body.StartDateSnake != nil {
		body.StartDate = body.StartDateSnake
	}
	if body.EndDate == nil && body.EndDateSnake != nil {
		body.EndDate = body.EndDateSnake
	}
	if body.SpecificDays == nil && body.SpecificDaysSnake != nil {
		body.SpecificDays = body.SpecificDaysSnake
	}
	if body.CoverImageUrl == nil && body.CoverImageUrlSnake != nil {
		body.CoverImageUrl = body.CoverImageUrlSnake
	}
	if body.ParentGoalID == nil && body.ParentGoalIDSnake != nil {
		body.ParentGoalID = body.ParentGoalIDSnake
	}

	if dbGoals == nil {
		initDB()
	}
	if dbGoals == nil {
		sendError(w, http.StatusInternalServerError, "Koneksi database terputus. Silakan coba sesaat lagi.")
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbGoals.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil {
		sendError(w, http.StatusNotFound, "Target tidak ditemukan")
		return
	}
	if existingUserId != userId {
		sendError(w, http.StatusForbidden, "Akses ditolak")
		return
	}

	query := `UPDATE goals SET updated_at = CURRENT_TIMESTAMP`
	args := []interface{}{}
	argId := 1

	if body.Title != nil {
		trimmedTitle := strings.TrimSpace(*body.Title)
		if trimmedTitle != "" {
			query += `, title = $` + strconv.Itoa(argId)
			args = append(args, trimmedTitle)
			argId++
		}
	}
	if body.Category != nil {
		query += `, category = $` + strconv.Itoa(argId)
		args = append(args, *body.Category)
		argId++
	}
	if body.Type != nil {
		normT := normalizeType(*body.Type)
		query += `, type = $` + strconv.Itoa(argId)
		args = append(args, normT)
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
		normS := normalizeStatus(*body.Status)
		query += `, status = $` + strconv.Itoa(argId)
		args = append(args, normS)
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
		normP := normalizePriority(*body.Priority)
		query += `, priority = $` + strconv.Itoa(argId)
		args = append(args, normP)
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
			t, err := time.Parse(time.RFC3339, *body.StartDate)
			if err != nil {
				t, err = time.Parse("2006-01-02", *body.StartDate)
			}
			if err == nil {
				args = append(args, t)
			} else {
				args = append(args, nil)
			}
		} else {
			args = append(args, nil)
		}
		argId++
	}
	if body.EndDate != nil {
		query += `, end_date = $` + strconv.Itoa(argId)
		if *body.EndDate != "" {
			t, err := time.Parse(time.RFC3339, *body.EndDate)
			if err != nil {
				t, err = time.Parse("2006-01-02", *body.EndDate)
			}
			if err == nil {
				args = append(args, t)
			} else {
				args = append(args, nil)
			}
		} else {
			args = append(args, nil)
		}
		argId++
	}
	if body.SpecificDays != nil {
		query += `, specific_days = $` + strconv.Itoa(argId)
		args = append(args, *body.SpecificDays)
		argId++
	}
	if body.ParentGoalID != nil {
		query += `, parent_goal_id = $` + strconv.Itoa(argId)
		if *body.ParentGoalID > 0 {
			var existsID int
			err := dbGoals.QueryRow(`SELECT id FROM goals WHERE id = $1 AND user_id = $2`, *body.ParentGoalID, userId).Scan(&existsID)
			if err == nil && existsID > 0 {
				args = append(args, *body.ParentGoalID)
			} else {
				args = append(args, nil)
			}
		} else {
			args = append(args, nil)
		}
		argId++
	}

	query += ` WHERE id = $` + strconv.Itoa(argId) + ` RETURNING id, user_id, title, category, type, target_value, current_value, start_date, end_date, specific_days, status, cover_image_url, reward, priority, color, parent_goal_id, created_at, updated_at`
	args = append(args, goalId)

	var g Goal
	var retParentID sql.NullInt64
	var retStartDate, retEndDate, retCreatedAt, retUpdatedAt sql.NullTime
	err = dbGoals.QueryRow(query, args...).Scan(
		&g.ID, &g.UserID, &g.Title, &g.Category, &g.Type, &g.TargetValue, &g.CurrentValue, &retStartDate, &retEndDate, &g.SpecificDays, &g.Status, &g.CoverImageUrl, &g.Reward, &g.Priority, &g.Color, &retParentID, &retCreatedAt, &retUpdatedAt,
	)
	if retParentID.Valid {
		v := int(retParentID.Int64)
		g.ParentGoalID = &v
	}
	if retStartDate.Valid {
		t := retStartDate.Time
		g.StartDate = &t
	}
	if retEndDate.Valid {
		t := retEndDate.Time
		g.EndDate = &t
	}
	if retCreatedAt.Valid {
		t := retCreatedAt.Time
		g.CreatedAt = &t
	}
	if retUpdatedAt.Valid {
		t := retUpdatedAt.Time
		g.UpdatedAt = &t
	}

	if err != nil {
		log.Printf("[goals_api] Failed to update goal: %v\n", err)
		sendError(w, http.StatusInternalServerError, fmt.Sprintf("Gagal memperbarui target: %v", err))
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
			var mTargetDate, mCreated, mUpdated sql.NullTime
			if err := mRows.Scan(&m.ID, &m.GoalID, &m.Title, &m.Completed, &m.Order, &mTargetDate, &mCreated, &mUpdated); err == nil {
				if mTargetDate.Valid {
					t := mTargetDate.Time
					m.TargetDate = &t
				}
				if mCreated.Valid {
					t := mCreated.Time
					m.CreatedAt = &t
				}
				if mUpdated.Valid {
					t := mUpdated.Time
					m.UpdatedAt = &t
				}
				g.Milestones = append(g.Milestones, m)
			}
		}
	}

	sendJSON(w, http.StatusOK, g)
}

func handleDeleteGoal(w http.ResponseWriter, r *http.Request, userId int) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		sendError(w, http.StatusBadRequest, "Missing ID")
		return
	}
	goalId, err := strconv.Atoi(idStr)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	if dbGoals == nil {
		initDB()
	}
	if dbGoals == nil {
		sendError(w, http.StatusInternalServerError, "Koneksi database terputus")
		return
	}

	// Verify ownership
	var existingUserId int
	err = dbGoals.QueryRow(`SELECT user_id FROM goals WHERE id = $1`, goalId).Scan(&existingUserId)
	if err != nil {
		sendError(w, http.StatusNotFound, "Target tidak ditemukan")
		return
	}
	if existingUserId != userId {
		sendError(w, http.StatusForbidden, "Akses ditolak")
		return
	}

	_, err = dbGoals.Exec(`DELETE FROM goals WHERE id = $1`, goalId)
	if err != nil {
		log.Printf("[goals_api] Failed to delete goal: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Gagal menghapus target")
		return
	}

	sendJSON(w, http.StatusOK, map[string]bool{"success": true})
}
