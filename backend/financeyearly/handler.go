package financeyearly

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var db *sql.DB

func initDB() {
	db = shareddb.Get()
}

func FinanceYearlyHandler(w http.ResponseWriter, r *http.Request) {
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
		handleGetYearly(w, r, userID)
	default:
		w.Header().Set("Allow", "GET")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}

type MonthlyStat struct {
	Income  float64 `json:"income"`
	Expense float64 `json:"expense"`
}

type YearlyResponse struct {
	Year         string                 `json:"year"`
	MonthlyStats map[string]MonthlyStat `json:"monthlyStats"`
	TotalSavings float64                `json:"totalSavings"`
}

func handleGetYearly(w http.ResponseWriter, r *http.Request, userID int) {
	year := r.URL.Query().Get("year")
	if year == "" {
		year = fmt.Sprintf("%d", time.Now().Year())
	}

	startDateStr := fmt.Sprintf("%s-01-01T00:00:00.000Z", year)
	endDateStr := fmt.Sprintf("%s-12-31T23:59:59.999Z", year)

	// Fetch Transactions
	query := `SELECT amount, type, date 
			  FROM finance_transactions 
			  WHERE user_id = $1 AND date >= $2 AND date <= $3`
	
	rows, err := db.Query(query, userID, startDateStr, endDateStr)
	if err != nil {
		http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	monthlyStats := make(map[string]MonthlyStat)
	for i := 1; i <= 12; i++ {
		monthKey := fmt.Sprintf("%s-%02d", year, i)
		monthlyStats[monthKey] = MonthlyStat{Income: 0, Expense: 0}
	}

	for rows.Next() {
		var amountBytes []byte
		var tType string
		var date time.Time

		if err := rows.Scan(&amountBytes, &tType, &date); err != nil {
			fmt.Println("Yearly scan err:", err)
			continue
		}
		
		var amount float64
		if len(amountBytes) > 0 {
			amount, _ = strconv.ParseFloat(string(amountBytes), 64)
		}
		
		monthKey := date.Format("2006-01") // YYYY-MM
		stat := monthlyStats[monthKey]
		
		if tType == "income" {
			stat.Income += amount
		} else if tType == "expense" {
			stat.Expense += amount
		}
		
		monthlyStats[monthKey] = stat
	}

	// Fetch Savings Total
	var totalSavings sql.NullFloat64
	err = db.QueryRow(`SELECT SUM(current_amount) FROM finance_savings WHERE user_id = $1`, userID).Scan(&totalSavings)
	savingsVal := 0.0
	if err == nil && totalSavings.Valid {
		savingsVal = totalSavings.Float64
	}

	resp := YearlyResponse{
		Year:         year,
		MonthlyStats: monthlyStats,
		TotalSavings: savingsVal,
	}

	json.NewEncoder(w).Encode(resp)
}
