package paymentupgrade

import (
	"strings"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var dbUpgrade *sql.DB

func init() {
	var err error
		connStr := os.Getenv("POSTGRES_URL_NON_POOLING")
	if connStr == "" {
		connStr = os.Getenv("POSTGRES_URL")
	}
	if connStr == "" {
		connStr = os.Getenv("DATABASE_URL")
	}
	
	// Strip pgbouncer=true if it exists because lib/pq doesn't support it
	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)

	dbUpgrade, err = sql.Open("postgres", connStr+"&sslmode=require")
	if err != nil {
		fmt.Printf("Error connecting to DB (Upgrade): %v\n", err)
	}
	dbUpgrade.SetMaxOpenConns(2)
	dbUpgrade.SetMaxIdleConns(1)
	dbUpgrade.SetConnMaxLifetime(30 * time.Minute)
}

func PaymentUpgradeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-Id")
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
