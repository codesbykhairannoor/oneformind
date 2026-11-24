package paymentupgrade

import (
	"net/http"
)

// PaymentUpgradeHandler is permanently locked down against client self-upgrade manipulation.
// Paid subscription tiers must ONLY be granted via cryptographically verified payment gateway
// callbacks/captures (Duitku MD5 callback, PayPal server capture, or Lemon Squeezy HMAC webhook).
func PaymentUpgradeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, `{"error": "Forbidden: Direct subscription self-upgrade is disabled. Complete checkout via verified payment gateway."}`, http.StatusForbidden)
}
