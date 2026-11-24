package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/calendar"
	"tranvas-api/backend/financeassets"
	"tranvas-api/backend/financebudgets"
	"tranvas-api/backend/financecategories"
	"tranvas-api/backend/financesavings"
	"tranvas-api/backend/financetransactions"
	"tranvas-api/backend/financeyearly"
	"tranvas-api/backend/goals"
	"tranvas-api/backend/goalsmilestones"
	"tranvas-api/backend/habits"
	"tranvas-api/backend/jobs"
	"tranvas-api/backend/journals"
	"tranvas-api/backend/paymentduitkucallback"
	"tranvas-api/backend/paymentduitkucheckout"
	"tranvas-api/backend/paymentpaypalcapture"
	"tranvas-api/backend/paymentpaypalcheckout"
	"tranvas-api/backend/paymentupgrade"
	"tranvas-api/backend/plannerdaily"
	"tranvas-api/backend/plannertasks"
	"tranvas-api/backend/relations"
	"tranvas-api/backend/shareddb"
	"tranvas-api/backend/studyarchives"
	"tranvas-api/backend/studycourses"
	"tranvas-api/backend/user"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	route := r.URL.Query().Get("route")

	// SECURITY CRITICAL: Always strip any client-supplied X-User-Id header or userId query param
	// to completely prevent horizontal privilege escalation / IDOR via URL parameter injection.
	r.Header.Del("X-User-Id")
	q := r.URL.Query()
	q.Del("userId")
	r.URL.RawQuery = q.Encode()

	// Only verified signed payment webhooks may bypass Bearer authentication.
	if route != "payment-duitku-callback" {
		authHeader := r.Header.Get("Authorization")
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" || strings.TrimSpace(parts[1]) == "" {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
			return
		}

		email, displayName, err := shareddb.VerifySupabaseToken(parts[1])
		if err != nil || email == "" {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"error": "Unauthorized: Invalid or expired token"}`, http.StatusUnauthorized)
			return
		}

		db := shareddb.Get()
		if db == nil {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
			return
		}

		var internalID int
		errDB := db.QueryRow(`SELECT id FROM "users" WHERE LOWER(email) = LOWER($1)`, email).Scan(&internalID)
		if errDB == sql.ErrNoRows {
			_ = db.QueryRow(`INSERT INTO "users" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, displayName, email).Scan(&internalID)
		}
		if internalID <= 0 {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"error": "Unauthorized: Could not resolve user"}`, http.StatusUnauthorized)
			return
		}

		idStr := fmt.Sprintf("%d", internalID)
		r.Header.Set("X-User-Id", idStr)
		q = r.URL.Query()
		q.Set("userId", idStr)
		r.URL.RawQuery = q.Encode()
	}

	switch route {
	case "calendar":
		calendar.CalendarHandler(w, r)
	case "finance-assets":
		financeassets.FinanceAssetsHandler(w, r)
	case "finance-budgets":
		financebudgets.FinanceBudgetsHandler(w, r)
	case "finance-categories":
		financecategories.FinanceCategoriesHandler(w, r)
	case "finance-savings":
		financesavings.FinanceSavingsHandler(w, r)
	case "finance-transactions":
		financetransactions.FinanceTransactionsHandler(w, r)
	case "finance-yearly":
		financeyearly.FinanceYearlyHandler(w, r)
	case "goals-milestones":
		goalsmilestones.GoalsMilestonesHandler(w, r)
	case "goals":
		goals.GoalsHandler(w, r)
	case "habits":
		habits.HabitsHandler(w, r)
	case "jobs":
		jobs.JobsHandler(w, r)
	case "journals":
		journals.JournalsHandler(w, r)
	case "payment-duitku-callback":
		paymentduitkucallback.PaymentDuitkuCallbackHandler(w, r)
	case "payment-duitku-checkout":
		paymentduitkucheckout.PaymentDuitkuCheckoutHandler(w, r)
	case "payment-paypal-capture":
		paymentpaypalcapture.PaymentPaypalCaptureHandler(w, r)
	case "payment-paypal-checkout":
		paymentpaypalcheckout.PaymentPaypalCheckoutHandler(w, r)
	case "payment-upgrade":
		paymentupgrade.PaymentUpgradeHandler(w, r)
	case "planner-daily":
		plannerdaily.PlannerDailyHandler(w, r)
	case "planner-tasks":
		plannertasks.PlannerTasksHandler(w, r)
	case "relations":
		relations.RelationsHandler(w, r)
	case "study-archives":
		studyarchives.StudyArchivesHandler(w, r)
	case "study-courses":
		studycourses.StudyCoursesHandler(w, r)
	case "user":
		user.UserHandler(w, r)
	default:
		http.Error(w, `{"error": "Route not found"}`, http.StatusNotFound)
	}
}
