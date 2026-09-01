package handler

import (
	"net/http"

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

func Handler(w http.ResponseWriter, r *http.Request) {
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
