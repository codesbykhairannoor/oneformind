package paymentpaypalcheckout

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var dbPaypal *sql.DB

func initDB() {
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
		fmt.Println("FATAL: No database connection string found in any env var")
		return
	}

	// Strip pgbouncer=true because lib/pq doesn't support it
	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)
	if strings.HasSuffix(connStr, "?") {
		connStr = strings.TrimSuffix(connStr, "?")
	}

	// Ensure sslmode=require is present
	if !strings.Contains(connStr, "sslmode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&sslmode=require"
		} else {
			connStr += "?sslmode=require"
		}
	}

	var err error
    if !strings.Contains(connStr, "default_query_exec_mode=") { if strings.Contains(connStr, "?") { connStr += "&default_query_exec_mode=simple_protocol" } else { connStr += "?default_query_exec_mode=simple_protocol" } }
	dbPaypal, err = sql.Open("pgx", connStr)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	dbPaypal.SetMaxOpenConns(2)
	dbPaypal.SetMaxIdleConns(1)
	dbPaypal.SetConnMaxLifetime(5 * time.Minute)
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

	client := &http.Client{}
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

func PaymentPaypalCheckoutHandler(w http.ResponseWriter, r *http.Request) {
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

	plan := "architect"
	if p, ok := reqBody["plan"].(string); ok && p != "" {
		plan = p
	}
	billing := "yearly"
	if b, ok := reqBody["billing"].(string); ok && b != "" {
		billing = b
	}

	pricesUsd := map[string]map[string]string{
		"architect": {"yearly": "59.00", "monthly": "7.99"},
		"quantum":   {"yearly": "89.00", "monthly": "11.99"},
		"legendary": {"yearly": "599.00", "monthly": "599.00"},
		"lifetime":  {"yearly": "599.00", "monthly": "599.00"},
	}

	planKey := strings.ToLower(plan)
	paymentAmount := "59.00"
	if p, ok := pricesUsd[planKey]; ok {
		if amt, ok2 := p[billing]; ok2 {
			paymentAmount = amt
		}
	}

	productDetails := fmt.Sprintf("Tranvas %s (%s)", strings.Title(plan), strings.Title(billing))
	if planKey == "lifetime" || planKey == "legendary" {
		productDetails = "Tranvas Legendary Founder Edition"
	}

	token, baseUrl, err := getPayPalAccessToken()
	if err != nil {
		http.Error(w, `{"error": "Failed to get PayPal token"}`, http.StatusInternalServerError)
		return
	}

	referenceId := fmt.Sprintf("%s-%s-%d", strings.ToUpper(planKey), userID, time.Now().UnixNano()/1e6)

	orderPayload := map[string]interface{}{
		"intent": "CAPTURE",
		"purchase_units": []map[string]interface{}{
			{
				"reference_id": referenceId,
				"description":  productDetails,
				"amount": map[string]string{
					"currency_code": "USD",
					"value":         paymentAmount,
				},
			},
		},
		"application_context": map[string]string{
			"shipping_preference": "NO_SHIPPING",
		},
	}

	payloadBytes, _ := json.Marshal(orderPayload)
	req, _ := http.NewRequest("POST", baseUrl+"/v2/checkout/orders", bytes.NewBuffer(payloadBytes))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"error": "Failed to connect to PayPal"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var orderData map[string]interface{}
	json.Unmarshal(bodyBytes, &orderData)

	if resp.StatusCode == 200 || resp.StatusCode == 201 {
		if id, ok := orderData["id"].(string); ok {
			json.NewEncoder(w).Encode(map[string]string{"id": id})
			return
		}
	}

	http.Error(w, `{"error": "Failed to create PayPal order"}`, http.StatusBadRequest)
}


