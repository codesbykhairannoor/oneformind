package paymentpaypalcapture

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var dbPaypal *sql.DB
var validOrderIDRe = regexp.MustCompile(`^[A-Za-z0-9_-]{8,40}$`)

func initDB() {
	dbPaypal = shareddb.Get()
}

func getPayPalAccessToken() (string, string, error) {
	mode := os.Getenv("PAYPAL_MODE")
	if mode == "" {
		mode = "sandbox"
	}
	clientId := os.Getenv(fmt.Sprintf("PAYPAL_%s_CLIENT_ID", strings.ToUpper(mode)))
	clientSecret := os.Getenv(fmt.Sprintf("PAYPAL_%s_CLIENT_SECRET", strings.ToUpper(mode)))

	if clientId == "" || clientSecret == "" {
		return "", "", fmt.Errorf("PayPal credentials missing")
	}

	baseUrl := "https://api-m.sandbox.paypal.com"
	if mode == "live" {
		baseUrl = "https://api-m.paypal.com"
	}

	authString := base64.StdEncoding.EncodeToString([]byte(clientId + ":" + clientSecret))

	req, _ := http.NewRequest("POST", baseUrl+"/v1/oauth2/token", strings.NewReader("grant_type=client_credentials"))
	req.Header.Set("Authorization", "Basic "+authString)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 12 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", "", fmt.Errorf("Failed to get token")
	}

	var data map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&data)

	if token, ok := data["access_token"].(string); ok {
		return token, baseUrl, nil
	}

	return "", "", fmt.Errorf("Invalid token response")
}

func PaymentPaypalCaptureHandler(w http.ResponseWriter, r *http.Request) {
	if dbPaypal == nil {
		initDB()
	}
	if dbPaypal == nil {
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

	var reqBody map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	tokenOrder, ok := reqBody["token"].(string)
	if !ok || !validOrderIDRe.MatchString(tokenOrder) {
		http.Error(w, `{"error": "Invalid or missing PayPal order token"}`, http.StatusBadRequest)
		return
	}

	token, baseUrl, err := getPayPalAccessToken()
	if err != nil {
		http.Error(w, `{"error": "Failed to get PayPal token"}`, http.StatusInternalServerError)
		return
	}

	req, _ := http.NewRequest("POST", baseUrl+"/v2/checkout/orders/"+tokenOrder+"/capture", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"error": "Failed to connect to PayPal"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var captureData map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &captureData); err != nil {
		http.Error(w, `{"error": "Invalid PayPal capture response"}`, http.StatusBadGateway)
		return
	}

	status, _ := captureData["status"].(string)
	if (resp.StatusCode != 200 && resp.StatusCode != 201) || status != "COMPLETED" {
		http.Error(w, `{"error": "Payment not completed"}`, http.StatusBadRequest)
		return
	}

	// SECURITY CRITICAL: Derive plan, owner userID, and paid amount strictly from PayPal's
	// server-signed purchase_units (NEVER trust client reqBody["plan"] or reqBody["amount"]).
	purchaseUnits, ok := captureData["purchase_units"].([]interface{})
	if !ok || len(purchaseUnits) == 0 {
		http.Error(w, `{"error": "Missing verified purchase units from PayPal"}`, http.StatusBadRequest)
		return
	}
	unit, ok := purchaseUnits[0].(map[string]interface{})
	if !ok {
		http.Error(w, `{"error": "Malformed purchase unit"}`, http.StatusBadRequest)
		return
	}

	refID, _ := unit["reference_id"].(string)
	// Format set server-side during checkout: PLAN-USERID-TIMESTAMP
	refParts := strings.Split(refID, "-")
	if len(refParts) < 3 {
		http.Error(w, `{"error": "Unrecognized order reference"}`, http.StatusBadRequest)
		return
	}
	verifiedPlanKey := strings.ToUpper(refParts[0])
	verifiedOrderUserID := strings.Join(refParts[1:len(refParts)-1], "-")
	if verifiedOrderUserID != userID {
		http.Error(w, `{"error": "Forbidden: Order does not belong to authenticated user"}`, http.StatusForbidden)
		return
	}

	// Extract verified captured USD amount
	var paidAmount float64
	var paidCurrency string
	if payments, ok := unit["payments"].(map[string]interface{}); ok {
		if captures, ok := payments["captures"].([]interface{}); ok && len(captures) > 0 {
			if capObj, ok := captures[0].(map[string]interface{}); ok {
				if amtObj, ok := capObj["amount"].(map[string]interface{}); ok {
					valStr, _ := amtObj["value"].(string)
					paidCurrency, _ = amtObj["currency_code"].(string)
					paidAmount, _ = strconv.ParseFloat(valStr, 64)
				}
			}
		}
	}

	if paidCurrency != "USD" || paidAmount <= 0 {
		http.Error(w, `{"error": "Unverified captured amount or currency"}`, http.StatusBadRequest)
		return
	}

	finalPlan := "architect"
	premiumUntil := time.Now()

	switch verifiedPlanKey {
	case "LIFETIME", "LEGENDARY":
		if paidAmount < 599.00 {
			http.Error(w, `{"error": "Paid amount insufficient for Legendary plan"}`, http.StatusBadRequest)
			return
		}
		finalPlan = "legendary"
		premiumUntil = premiumUntil.AddDate(100, 0, 0)
	case "QUANTUM":
		if paidAmount >= 89.00 {
			premiumUntil = premiumUntil.AddDate(1, 0, 0)
		} else if paidAmount >= 11.99 {
			premiumUntil = premiumUntil.AddDate(0, 1, 0)
		} else {
			http.Error(w, `{"error": "Paid amount insufficient for Quantum plan"}`, http.StatusBadRequest)
			return
		}
		finalPlan = "quantum"
	default:
		if paidAmount >= 59.00 {
			premiumUntil = premiumUntil.AddDate(1, 0, 0)
		} else if paidAmount >= 7.99 {
			premiumUntil = premiumUntil.AddDate(0, 1, 0)
		} else {
			http.Error(w, `{"error": "Paid amount insufficient for Architect plan"}`, http.StatusBadRequest)
			return
		}
		finalPlan = "architect"
	}

	if _, err := dbPaypal.Exec(`UPDATE users SET is_premium = true, plan_type = $1, premium_until = $2 WHERE id = $3`, finalPlan, premiumUntil, userID); err != nil {
		http.Error(w, `{"error": "Failed to update subscription"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"verified": true,
		"orderID":  tokenOrder,
		"plan":     finalPlan,
		"amount":   paidAmount,
		"currency": paidCurrency,
	})
}
