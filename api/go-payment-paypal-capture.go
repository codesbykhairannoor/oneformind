package handler

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

	_ "github.com/lib/pq"
)

var dbPaypal *sql.DB

func init() {
	var err error
	connStr := os.Getenv("POSTGRES_PRISMA_URL")
	if connStr == "" {
		connStr = os.Getenv("DATABASE_URL")
	}
	dbPaypal, err = sql.Open("postgres", connStr+"&sslmode=require")
	if err != nil {
		fmt.Printf("Error connecting to DB (Paypal): %v\n", err)
	}
	dbPaypal.SetMaxOpenConns(2)
	dbPaypal.SetMaxIdleConns(1)
	dbPaypal.SetConnMaxLifetime(30 * time.Minute)
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



func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-Id")
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
	if !ok || tokenOrder == "" {
		http.Error(w, `{"error": "Missing token"}`, http.StatusBadRequest)
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

	token, baseUrl, err := getPayPalAccessToken()
	if err != nil {
		http.Error(w, `{"error": "Failed to get PayPal token"}`, http.StatusInternalServerError)
		return
	}

	req, _ := http.NewRequest("POST", baseUrl+"/v2/checkout/orders/"+tokenOrder+"/capture", nil)
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
	var captureData map[string]interface{}
	json.Unmarshal(bodyBytes, &captureData)

	status, _ := captureData["status"].(string)

	if resp.StatusCode == 200 || resp.StatusCode == 201 {
		if status == "COMPLETED" {
			planKey := strings.ToUpper(plan)
			finalPlan := strings.ToLower(planKey)
			premiumUntil := time.Now()

			if planKey == "LIFETIME" || planKey == "LEGENDARY" {
				finalPlan = "legendary"
				premiumUntil = premiumUntil.AddDate(100, 0, 0)
			} else {
				if billing == "yearly" {
					premiumUntil = premiumUntil.AddDate(1, 0, 0)
				} else {
					premiumUntil = premiumUntil.AddDate(0, 1, 0)
				}
			}

			if planKey == "QUANTUM" {
				finalPlan = "quantum"
			}

			dbPaypal.Exec(`UPDATE users SET is_premium = true, plan_type = $1, premium_until = $2 WHERE id = $3`, finalPlan, premiumUntil, userID)
			
			json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			return
		}
	}

	http.Error(w, `{"error": "Payment not completed"}`, http.StatusBadRequest)
}
