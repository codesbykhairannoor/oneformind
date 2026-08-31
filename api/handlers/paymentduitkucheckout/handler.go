package paymentduitkucheckout

import (
	"bytes"
	"crypto/md5"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

var dbDuitku *sql.DB

func init() {
	var err error
	connStr := os.Getenv("POSTGRES_PRISMA_URL")
	if connStr == "" {
		connStr = os.Getenv("DATABASE_URL")
	}
	dbDuitku, err = sql.Open("postgres", connStr+"&sslmode=require")
	if err != nil {
		fmt.Printf("Error connecting to DB (Duitku): %v\n", err)
	}
	dbDuitku.SetMaxOpenConns(2)
	dbDuitku.SetMaxIdleConns(1)
	dbDuitku.SetConnMaxLifetime(30 * time.Minute)
}

func PaymentDuitkuCheckoutHandler(w http.ResponseWriter, r *http.Request) {
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

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	plan := "architect"
	if p, ok := req["plan"].(string); ok && p != "" {
		plan = p
	}
	billing := "yearly"
	if b, ok := req["billing"].(string); ok && b != "" {
		billing = b
	}
	paymentMethod := ""
	if pm, ok := req["paymentMethod"].(string); ok {
		paymentMethod = pm
	}

	prices := map[string]map[string]int{
		"architect": {"yearly": 79000, "monthly": 99000},
		"quantum":   {"yearly": 109000, "monthly": 159000},
		"legendary": {"yearly": 899000, "monthly": 899000},
		"lifetime":  {"yearly": 899000, "monthly": 899000},
	}

	planKey := strings.ToLower(plan)
	paymentAmount := 79000
	if p, ok := prices[planKey]; ok {
		if amt, ok2 := p[billing]; ok2 {
			paymentAmount = amt
		}
	}

	productDetails := fmt.Sprintf("Tranvas %s (%s) Subscription", strings.Title(plan), strings.Title(billing))

	if billing == "yearly" && planKey != "lifetime" && planKey != "legendary" {
		paymentAmount *= 12
		productDetails = fmt.Sprintf("Tranvas %s Annual (12 Months) Subscription", strings.Title(plan))
	}

	if planKey == "lifetime" || planKey == "legendary" {
		productDetails = "Tranvas Legendary Founder Edition (Lifetime)"
	}

	merchantOrderId := fmt.Sprintf("%s-%s-%d", strings.ToUpper(planKey), userID, time.Now().UnixNano()/1e6)

	var email string
	err := dbDuitku.QueryRow(`SELECT email FROM users WHERE id = $1`, userID).Scan(&email)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	merchantCode := os.Getenv("DUITKU_MERCHANT_CODE")
	apiKey := os.Getenv("DUITKU_API_KEY")
	env := os.Getenv("DUITKU_ENV")
	if env == "" {
		env = "sandbox"
	}

	if merchantCode == "" || apiKey == "" {
		http.Error(w, `{"error": "Duitku API credentials not configured."}`, http.StatusInternalServerError)
		return
	}

	timestamp := strconv.FormatInt(time.Now().UnixNano()/1e6, 10)
	signatureStr := merchantCode + timestamp + apiKey
	hash := sha256.New()
	hash.Write([]byte(signatureStr))
	signature := hex.EncodeToString(hash.Sum(nil))

	origin := r.Header.Get("origin")
	if origin == "" {
		origin = os.Getenv("APP_URL")
		if origin == "" {
			origin = "https://tranvas.com"
		}
	}

	appUrl := os.Getenv("APP_URL")
	if appUrl == "" {
		appUrl = origin
	}

	callbackUrl := fmt.Sprintf("%s/api/payment/duitku/callback", appUrl)
	returnUrl := fmt.Sprintf("%s/id/payment/status", origin)

	params := map[string]interface{}{
		"paymentAmount":   paymentAmount,
		"merchantOrderId": merchantOrderId,
		"productDetails":  productDetails,
		"email":           email,
		"itemDetails": []map[string]interface{}{
			{
				"name":     productDetails,
				"price":    paymentAmount,
				"quantity": 1,
			},
		},
		"callbackUrl":  callbackUrl,
		"returnUrl":    returnUrl,
		"expiryPeriod": 60,
	}

	if paymentMethod != "" && paymentMethod != "00" {
		params["paymentMethod"] = paymentMethod
	}

	url := "https://api-sandbox.duitku.com/api/merchant/createInvoice"
	if env == "production" {
		url = "https://api-prod.duitku.com/api/merchant/createInvoice"
	}

	reqBody, _ := json.Marshal(params)
	duitkuReq, _ := http.NewRequest("POST", url, bytes.NewBuffer(reqBody))
	duitkuReq.Header.Set("Content-Type", "application/json")
	duitkuReq.Header.Set("x-duitku-signature", signature)
	duitkuReq.Header.Set("x-duitku-timestamp", timestamp)
	duitkuReq.Header.Set("x-duitku-merchantcode", merchantCode)

	client := &http.Client{}
	resp, err := client.Do(duitkuReq)
	if err != nil {
		http.Error(w, `{"error": "Failed to connect to Duitku"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var respData map[string]interface{}
	json.Unmarshal(bodyBytes, &respData)

	if resp.StatusCode == 200 {
		if paymentUrl, ok := respData["paymentUrl"].(string); ok && paymentUrl != "" {
			ref, _ := respData["reference"].(string)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"paymentUrl": paymentUrl,
				"reference":  ref,
			})
			return
		}
	}

	msg := "Failed to create invoice"
	if m, ok := respData["Message"].(string); ok {
		msg = m
	} else if rm, ok := respData["responseMessage"].(string); ok {
		msg = rm
	}
	http.Error(w, fmt.Sprintf(`{"error": "%s"}`, msg), http.StatusBadRequest)
}


