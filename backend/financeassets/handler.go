package financeassets

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

type FinanceAsset struct {
	ID        int       `json:"id"`
	UserID    int       `json:"userId"`
	Name      string    `json:"name"`
	Value     float64   `json:"value"`
	Icon      *string   `json:"icon"`
	Color     *string   `json:"color"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func FinanceAssetsHandler(w http.ResponseWriter, r *http.Request) {
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
		handleGetAssets(w, r, userID)
	case http.MethodPost:
		handleCreateAsset(w, r, userID)
	case http.MethodPut:
		handleUpdateAsset(w, r, userID)
	case http.MethodDelete:
		handleDeleteAsset(w, r, userID)
	default:
		w.Header().Set("Allow", "GET, POST, PUT, DELETE")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetAssets(w http.ResponseWriter, r *http.Request, userID int) {
	query := `SELECT id, user_id, name, value, icon, color, created_at, updated_at 
			  FROM finance_assets 
			  WHERE user_id = $1 ORDER BY created_at DESC`

	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	assets := []FinanceAsset{}
	for rows.Next() {
		var a FinanceAsset
		var createdAt, updatedAt sql.NullTime
		var amountBytes []byte
		if err := rows.Scan(&a.ID, &a.UserID, &a.Name, &amountBytes, &a.Icon, &a.Color, &createdAt, &updatedAt); err != nil {
			fmt.Println("Asset scan err:", err)
			continue
		}
		if len(amountBytes) > 0 {
			a.Value, _ = strconv.ParseFloat(string(amountBytes), 64)
		}
		if createdAt.Valid {
			a.CreatedAt = createdAt.Time
		}
		if updatedAt.Valid {
			a.UpdatedAt = updatedAt.Time
		}
		assets = append(assets, a)
	}

	json.NewEncoder(w).Encode(assets)
}

func handleCreateAsset(w http.ResponseWriter, r *http.Request, userID int) {
	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	name, _ := body["name"].(string)
	
	value := 0.0
	if v, ok := body["value"].(float64); ok {
		value = v
	} else if vStr, ok := body["value"].(string); ok {
		value, _ = strconv.ParseFloat(vStr, 64)
	}

	var icon *string
	if i, ok := body["icon"].(string); ok && i != "" {
		icon = &i
	}
	var color *string
	if c, ok := body["color"].(string); ok && c != "" {
		color = &c
	}

	query := `INSERT INTO finance_assets (user_id, name, value, icon, color, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
			  RETURNING id, user_id, name, value, icon, color, created_at, updated_at`

	var a FinanceAsset
	var createdAt, updatedAt sql.NullTime
	err := db.QueryRow(query, userID, name, value, icon, color).
		Scan(&a.ID, &a.UserID, &a.Name, &a.Value, &a.Icon, &a.Color, &createdAt, &updatedAt)

	if err != nil {
		http.Error(w, `{"error": "Failed to create asset"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		a.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		a.UpdatedAt = updatedAt.Time
	}

	json.NewEncoder(w).Encode(a)
}

func handleUpdateAsset(w http.ResponseWriter, r *http.Request, userID int) {
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
	assetID := int(idFloat)

	// Verify ownership
	var existingUserID int
	err := db.QueryRow(`SELECT user_id FROM finance_assets WHERE id = $1`, assetID).Scan(&existingUserID)
	if err == sql.ErrNoRows {
		http.Error(w, `{"error": "Not found"}`, http.StatusNotFound)
		return
	}
	if existingUserID != userID {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusForbidden)
		return
	}

	setParts := []string{}
	args := []interface{}{assetID}
	i := 2

	for k, v := range body {
		dbCol := ""
		switch k {
		case "name": dbCol = "name"
		case "value": dbCol = "value"
		case "icon": dbCol = "icon"
		case "color": dbCol = "color"
		default: continue
		}
		
		if k == "value" {
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
	
	query := fmt.Sprintf(`UPDATE finance_assets SET %s WHERE id = $1 RETURNING id, user_id, name, value, icon, color, created_at, updated_at`, strings.Join(setParts, ", "))
	
	var a FinanceAsset
	var createdAt, updatedAt sql.NullTime
	err = db.QueryRow(query, args...).
		Scan(&a.ID, &a.UserID, &a.Name, &a.Value, &a.Icon, &a.Color, &createdAt, &updatedAt)
	
	if err != nil {
		fmt.Printf("Error updating asset: %v\n", err)
		http.Error(w, `{"error": "Failed to update asset"}`, http.StatusInternalServerError)
		return
	}

	if createdAt.Valid {
		a.CreatedAt = createdAt.Time
	}
	if updatedAt.Valid {
		a.UpdatedAt = updatedAt.Time
	}
	
	json.NewEncoder(w).Encode(a)
}

func handleDeleteAsset(w http.ResponseWriter, r *http.Request, userID int) {
	assetIdStr := r.URL.Query().Get("id")
	if assetIdStr == "" {
		http.Error(w, `{"error": "Missing ID"}`, http.StatusBadRequest)
		return
	}
	
	assetID, err := strconv.Atoi(assetIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid ID"}`, http.StatusBadRequest)
		return
	}

	result, err := db.Exec(`DELETE FROM finance_assets WHERE id = $1 AND user_id = $2`, assetID, userID)
	if err != nil {
		http.Error(w, `{"error": "Failed to delete asset"}`, http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, `{"error": "Not found or unauthorized"}`, http.StatusNotFound)
		return
	}

	w.Write([]byte(`{"success": true}`))
}
