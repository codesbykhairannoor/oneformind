package handler

import (
	"net/http"
	"tranvas-api/handlers"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	route := r.URL.Query().Get("route")

	switch route {
	case "calendar":
		handlers.CalendarHandler(w, r)
	case "finance-categories":
		handlers.FinanceCategoriesHandler(w, r)
	case "finance-transactions":
		handlers.FinanceTransactionsHandler(w, r)
	case "goals-milestones":
		handlers.GoalsMilestonesHandler(w, r)
	case "goals":
		handlers.GoalsHandler(w, r)
	case "habits":
		handlers.HabitsHandler(w, r)
	case "jobs":
		handlers.JobsHandler(w, r)
	case "journals":
		handlers.JournalsHandler(w, r)
	case "payment-duitku-callback":
		handlers.PaymentDuitkuCallbackHandler(w, r)
	case "payment-duitku-checkout":
		handlers.PaymentDuitkuCheckoutHandler(w, r)
	case "payment-paypal-capture":
		handlers.PaymentPaypalCaptureHandler(w, r)
	case "payment-paypal-checkout":
		handlers.PaymentPaypalCheckoutHandler(w, r)
	case "payment-upgrade":
		handlers.PaymentUpgradeHandler(w, r)
	case "planner-daily":
		handlers.PlannerDailyHandler(w, r)
	case "planner-tasks":
		handlers.PlannerTasksHandler(w, r)
	case "study-archives":
		handlers.StudyArchivesHandler(w, r)
	case "study-courses":
		handlers.StudyCoursesHandler(w, r)
	case "user":
		handlers.UserHandler(w, r)
	default:
		http.Error(w, `{"error": "Route not found"}`, http.StatusNotFound)
	}
}
