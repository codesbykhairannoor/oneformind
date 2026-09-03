package paymentupgrade

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var dbUpgrade *sql.DB

func initDB() {
	dbUpgrade = shareddb.Get()
}

func PaymentUpgradeHandler(w http.ResponseWriter, r *http.Request) {
	if dbUpgrade == nil {
		initDB()
	}
	if dbUpgrade == nil {
		http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}
	if userID == "" {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	plan, ok := req["plan"].(string)
	if !ok || plan == "" {
		http.Error(w, `{"error": "Plan is required"}`, http.StatusBadRequest)
		return
	}

	premiumUntil := time.Now().AddDate(1, 0, 0)
	
	_, err := dbUpgrade.Exec(`UPDATE users SET is_premium = true, plan_type = $1, premium_until = $2 WHERE id = $3`, plan, premiumUntil, userID)
	if err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
	})
}
