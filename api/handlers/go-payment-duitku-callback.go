package handlers

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



func PaymentDuitkuCallbackHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var amount, merchantOrderId, signature, resultCode string

	contentType := r.Header.Get("Content-Type")
	if strings.Contains(contentType, "application/x-www-form-urlencoded") {
		r.ParseForm()
		amount = r.FormValue("amount")
		merchantOrderId = r.FormValue("merchantOrderId")
		signature = r.FormValue("signature")
		resultCode = r.FormValue("resultCode")
	} else {
		var req map[string]interface{}
		json.NewDecoder(r.Body).Decode(&req)
		if a, ok := req["amount"]; ok {
			amount = fmt.Sprintf("%v", a)
		}
		if mo, ok := req["merchantOrderId"].(string); ok {
			merchantOrderId = mo
		}
		if s, ok := req["signature"].(string); ok {
			signature = s
		}
		if rc, ok := req["resultCode"].(string); ok {
			resultCode = rc
		}
	}

	if amount == "" || merchantOrderId == "" || signature == "" || resultCode == "" {
		http.Error(w, `{"message": "Invalid parameters"}`, http.StatusBadRequest)
		return
	}

	merchantCode := os.Getenv("DUITKU_MERCHANT_CODE")
	apiKey := os.Getenv("DUITKU_API_KEY")

	signatureStr := merchantCode + amount + merchantOrderId + apiKey
	hash := md5.New()
	hash.Write([]byte(signatureStr))
	calcSignature := hex.EncodeToString(hash.Sum(nil))

	if signature != calcSignature {
		http.Error(w, `{"message": "Bad Signature"}`, http.StatusBadRequest)
		return
	}

	if resultCode == "00" {
		parts := strings.Split(merchantOrderId, "-")
		if len(parts) >= 2 {
			planType := strings.ToUpper(parts[0])
			userId := parts[1]

			var existingPlan string
			err := dbDuitku.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userId).Scan(&existingPlan)
			
			if err == nil {
				finalPlan := strings.ToLower(planType)
				premiumUntil := time.Now()

				if planType == "LIFETIME" || planType == "LEGENDARY" {
					finalPlan = "legendary"
					premiumUntil = premiumUntil.AddDate(100, 0, 0)
				} else {
					amtF, _ := strconv.ParseFloat(amount, 64)
					if amtF > 200000 {
						premiumUntil = premiumUntil.AddDate(1, 0, 0)
					} else {
						premiumUntil = premiumUntil.AddDate(0, 1, 0)
					}
				}

				if planType == "QUANTUM" {
					finalPlan = "quantum"
				}

				dbDuitku.Exec(`UPDATE users SET is_premium = true, plan_type = $1, premium_until = $2 WHERE id = $3`, finalPlan, premiumUntil, userId)
			}
		}
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Callback processed"})
}
