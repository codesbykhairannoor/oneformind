package handler

import (
	"net/http"

	"tranvas-api/handlers/calendar"
	"tranvas-api/handlers/financecategories"
	"tranvas-api/handlers/financetransactions"
	"tranvas-api/handlers/goals"
	"tranvas-api/handlers/goalsmilestones"
	"tranvas-api/handlers/habits"
	"tranvas-api/handlers/jobs"
	"tranvas-api/handlers/journals"
	"tranvas-api/handlers/paymentduitkucallback"
	"tranvas-api/handlers/paymentduitkucheckout"
	"tranvas-api/handlers/paymentpaypalcapture"
	"tranvas-api/handlers/paymentpaypalcheckout"
	"tranvas-api/handlers/paymentupgrade"
	"tranvas-api/handlers/plannerdaily"
	"tranvas-api/handlers/plannertasks"
	"tranvas-api/handlers/studyarchives"
	"tranvas-api/handlers/studycourses"
	"tranvas-api/handlers/user"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	route := r.URL.Query().Get("route")

	switch route {
	case "calendar":
		calendar.CalendarHandler(w, r)
	case "finance-categories":
		financecategories.FinanceCategoriesHandler(w, r)
	case "finance-transactions":
		financetransactions.FinanceTransactionsHandler(w, r)
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
