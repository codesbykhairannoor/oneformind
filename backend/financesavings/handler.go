package financesavings

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

type FinanceSaving struct {
	ID            int       `json:"id"`
	UserID        int       `json:"userId"`
	Title         string    `json:"title"`
	TargetAmount  float64   `json:"targetAmount"`
	CurrentAmount float64   `json:"currentAmount"`
	Icon          *string   `json:"icon"`
	Color         *string   `json:"color"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func FinanceSavingsHandler(w http.ResponseWriter, r *http.Request) {
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

	switch r.Method {
	case http.MethodGet:
		handleGetSavings(w, r, userID)
	case http.MethodPost:
		handleCreateSaving(w, r, userID)
	case http.MethodPut:
		handleUpdateSaving(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, POST, PUT")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetSavings(w http.ResponseWriter, r *http.Request, userID int) {
	query := `SELECT id, user_id, title, target_amount, current_amount, icon, color, created_at, updated_at 
			  FROM finance_savings 
			  WHERE user_id = $1 ORDER BY id ASC`

	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	savings := []FinanceSaving{}
	for rows.Next() {
		var s FinanceSaving
		var createdAt, updatedAt sql.NullTime
		if err := rows.Scan(&s.ID, &s.UserID, &s.Title, &s.TargetAmount, &s.CurrentAmount, &s.Icon, &s.Color, &createdAt, &updatedAt); err != nil {
			continue
		}
		if createdAt.Valid {
			s.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			s.UpdatedAt = updatedAt.Time
		}
		savings = append(savings, s)
	}

	json.NewEncoder(w).Encode(savings)
}

func handleCreateSaving(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	title, _ := body["title"].(string)
	
	targetAmount := 0.0
	if ta, ok := body["targetAmount"].(float64); ok {
		targetAmount = ta
	} else if taStr, ok := body["targetAmount"].(string); ok {
		targetAmount, _ = strconv.ParseFloat(taStr, 64)
	}

	currentAmount := 0.0
	if ca, ok := body["currentAmount"].(float64); ok {
		currentAmount = ca
	} else if caStr, ok := body["currentAmount"].(string); ok {
		currentAmount, _ = strconv.ParseFloat(caStr, 64)
	}

	var icon *string
	if i, ok := body["icon"].(string); ok && i != "" {
		icon = &i
	}
	var color *string
	if c, ok := body["color"].(string); ok && c != "" {
		color = &c
	}

	query := `INSERT INTO finance_savings (user_id, title, target_amount, current_amount, icon, color, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
			  RETURNING id, user_id, title, target_amount, current_amount, icon, color, created_at, updated_at`

	var s FinanceSaving
	var createdAt, updatedAt sql.NullTime
	err := db.QueryRow(query, userID, title, targetAmount, currentAmount, icon, color).
		Scan(&s.ID, &s.UserID, &s.Title, &s.TargetAmount, &s.CurrentAmount, &s.Icon, &s.Color, &createdAt, &updatedAt)

	if err != nil {
		http.Error(w, `{"error": "Failed to create saving"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		s.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		s.UpdatedAt = updatedAt.Time
	}

	json.NewEncoder(w).Encode(s)
}

func handleUpdateSaving(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	idFloat, ok := body["id"].(float64)
	if !ok {
		http.Error(w, `{"error": "ID is required"}`, http.StatusBadRequest)
		return
	}
	savingID := int(idFloat)

	// Verify ownership
	var existingUserID int
	err := db.QueryRow(`SELECT user_id FROM finance_savings WHERE id = $1`, savingID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	setParts := []string{}
	args := []interface{}{savingID}
	i := 2

	for k, v := range body {
		dbCol := ""
		switch k {
		case "title": dbCol = "title"
		case "targetAmount": dbCol = "target_amount"
		case "currentAmount": dbCol = "current_amount"
		case "icon": dbCol = "icon"
		case "color": dbCol = "color"
		default: continue
		}
		
		// Handle decimal mapping properly
		if (k == "targetAmount" || k == "currentAmount") {
			if strVal, ok := v.(string); ok {
				v, _ = strconv.ParseFloat(strVal, 64)
			}
		}

		setParts = append(setParts, fmt.Sprintf("%s = $%d", dbCol, i))
		args = append(args, v)
		i++
	}

	if len(setParts) == 0 {
		w.Write([]byte(`{"success": true}`))
		return
	}

	setParts = append(setParts, "updated_at = NOW()")
	
	query := fmt.Sprintf(`UPDATE finance_savings SET %s WHERE id = $1 RETURNING id, user_id, title, target_amount, current_amount, icon, color, created_at, updated_at`, strings.Join(setParts, ", "))
	
	var s FinanceSaving
	var createdAt, updatedAt sql.NullTime
	err = db.QueryRow(query, args...).
		Scan(&s.ID, &s.UserID, &s.Title, &s.TargetAmount, &s.CurrentAmount, &s.Icon, &s.Color, &createdAt, &updatedAt)
	
	if err != nil {
		fmt.Printf("Error updating saving: %v\n", err)
		http.Error(w, `{"error": "Failed to update saving"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		s.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		s.UpdatedAt = updatedAt.Time
	}
	
	json.NewEncoder(w).Encode(s)
}
