package handler

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
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
	"tranvas-api/backend/studyarchives"
	"tranvas-api/backend/studycourses"
	"tranvas-api/backend/user"
)

var dbVercel *sql.DB

func initVercelDB() {
	if dbVercel != nil {
		return
	}
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
		log.Println("WARNING: No database connection string found")
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
	dbVercel, err = sql.Open("pgx", connStr)
	if err != nil {
		log.Printf("Error opening db in vercel: %v\n", err)
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// 1. Authenticate and Map User ID
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			secret := os.Getenv("SUPABASE_JWT_SECRET")
			if secret != "" {
				token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
					return []byte(secret), nil
				})
				
				if err == nil && token.Valid {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						var email string
						if e, ok := claims["email"].(string); ok {
							email = e
						}

						if email != "" {
							initVercelDB()
							if dbVercel != nil {
								var internalID int
								errDB := dbVercel.QueryRow(`SELECT id FROM "User" WHERE email = $1`, email).Scan(&internalID)
								if errDB == sql.ErrNoRows {
									name := email
									if rawMeta, ok := claims["user_metadata"].(map[string]interface{}); ok {
										if n, ok := rawMeta["name"].(string); ok && n != "" {
											name = n
										} else if fn, ok := rawMeta["full_name"].(string); ok && fn != "" {
											name = fn
										}
									}
									dbVercel.QueryRow(`INSERT INTO "User" (name, email, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id`, name, email).Scan(&internalID)
								}
								if internalID > 0 {
									q := r.URL.Query()
									q.Set("userId", fmt.Sprintf("%d", internalID))
									r.URL.RawQuery = q.Encode()
								}
							}
						} else if sub, ok := claims["sub"].(string); ok {
							q := r.URL.Query()
							q.Set("userId", sub)
							r.URL.RawQuery = q.Encode()
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
