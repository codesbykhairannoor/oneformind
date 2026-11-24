package paymentduitkucallback

import (
	"crypto/md5"
	"crypto/subtle"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var dbDuitku *sql.DB

func initDB() {
	dbDuitku = shareddb.Get()
}

func PaymentDuitkuCallbackHandler(w http.ResponseWriter, r *http.Request) {
	if dbDuitku == nil {
		initDB()
	}
	if dbDuitku == nil {
		http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// FAIL-CLOSED: Reject callbacks if Duitku credentials are not configured
	merchantCode := os.Getenv("DUITKU_MERCHANT_CODE")
	apiKey := os.Getenv("DUITKU_API_KEY")
	if merchantCode == "" || apiKey == "" {
		http.Error(w, `{"error": "Payment gateway credentials not configured"}`, http.StatusServiceUnavailable)
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

	signatureStr := merchantCode + amount + merchantOrderId + apiKey
	hash := md5.New()
	hash.Write([]byte(signatureStr))
	calcSignature := hex.EncodeToString(hash.Sum(nil))

	if subtle.ConstantTimeCompare([]byte(strings.ToLower(signature)), []byte(strings.ToLower(calcSignature))) != 1 {
		http.Error(w, `{"message": "Bad Signature"}`, http.StatusUnauthorized)
		return
	}

	amtF, errAmt := strconv.ParseFloat(amount, 64)
	if errAmt != nil || amtF <= 0 {
		http.Error(w, `{"message": "Invalid amount"}`, http.StatusBadRequest)
		return
	}

	var verifiedUserID string
	var verifiedPlan string

	if resultCode == "00" {
		parts := strings.Split(merchantOrderId, "-")
		if len(parts) >= 3 {
			planType := strings.ToUpper(parts[0])
			userId := strings.Join(parts[1:len(parts)-1], "-")

			var existingPlan sql.NullString
			err := dbDuitku.QueryRow(`SELECT plan_type FROM users WHERE id = $1`, userId).Scan(&existingPlan)
			if err == nil {
				finalPlan := "architect"
				premiumUntil := time.Now()

				switch planType {
				case "LIFETIME", "LEGENDARY":
					if amtF < 899000 {
						http.Error(w, `{"message": "Insufficient amount for Legendary plan"}`, http.StatusBadRequest)
						return
					}
					finalPlan = "legendary"
					premiumUntil = premiumUntil.AddDate(100, 0, 0)
				case "QUANTUM":
					if amtF >= 109000*12 {
						premiumUntil = premiumUntil.AddDate(1, 0, 0)
					} else if amtF >= 159000 {
						premiumUntil = premiumUntil.AddDate(0, 1, 0)
					} else {
						http.Error(w, `{"message": "Insufficient amount for Quantum plan"}`, http.StatusBadRequest)
						return
					}
					finalPlan = "quantum"
				default:
					if amtF >= 79000*12 {
						premiumUntil = premiumUntil.AddDate(1, 0, 0)
					} else if amtF >= 99000 {
						premiumUntil = premiumUntil.AddDate(0, 1, 0)
					} else {
						http.Error(w, `{"message": "Insufficient amount for Architect plan"}`, http.StatusBadRequest)
						return
					}
					finalPlan = "architect"
				}

				dbDuitku.Exec(`UPDATE users SET is_premium = true, plan_type = $1, premium_until = $2 WHERE id = $3`, finalPlan, premiumUntil, userId)
				verifiedUserID = userId
				verifiedPlan = finalPlan
			}
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":         "Callback processed",
		"verified":        resultCode == "00" && verifiedUserID != "",
		"user_id":         verifiedUserID,
		"plan":            verifiedPlan,
		"amount":          amtF,
		"merchantOrderId": merchantOrderId,
	})
}
