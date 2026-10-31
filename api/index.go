package handler

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
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

// parseJWTClaimsUnsafe extracts claims without signature verification
// Supporting both HS256 (email) and ES256 (Google OAuth) Supabase tokens
func parseJWTClaimsUnsafe(tokenString string) (jwt.MapClaims, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid JWT structure")
	}
	payload := parts[1]
	switch len(payload) % 4 {
	case 2:
		payload += "=="
	case 3:
		payload += "="
	}
	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		decoded, err = base64.RawURLEncoding.DecodeString(parts[1])
		if err != nil {
			return nil, fmt.Errorf("failed to decode JWT payload: %v", err)
		}
	}
	var claims jwt.MapClaims
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JWT claims: %v", err)
	}
	return claims, nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Authenticate and Map User ID (if not already set by AuthMiddleware)
	if r.URL.Query().Get("userId") == "" {
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				claims, err := parseJWTClaimsUnsafe(parts[1])
				if err == nil {
					var email string
					if e, ok := claims["email"].(string); ok {
						email = e
					}

					if email != "" {
						db := shareddb.Get()
						if db != nil {
							var internalID int
							errDB := db.QueryRow(`SELECT id FROM "users" WHERE LOWER(email) = LOWER($1)`, email).Scan(&internalID)
							if errDB == sql.ErrNoRows {
								name := email
								if rawMeta, ok := claims["user_metadata"].(map[string]interface{}); ok {
									if n, ok := rawMeta["name"].(string); ok && n != "" {
										name = n
									} else if fn, ok := rawMeta["full_name"].(string); ok && fn != "" {
										name = fn
									}
								}
								db.QueryRow(`INSERT INTO "users" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, name, email).Scan(&internalID)
							}
							if internalID > 0 {
								q := r.URL.Query()
								q.Set("userId", fmt.Sprintf("%d", internalID))
								r.URL.RawQuery = q.Encode()
							}
						}
					}
				}
			}
		}
	}

	route := r.URL.Query().Get("route")

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
