package user

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"tranvas-api/backend/shareddb"
)

var db *sql.DB

func initDB() {
	db = shareddb.Get()
}

type User struct {
	ID             int             `json:"id"`
	Name           *string         `json:"name"`
	Email          *string         `json:"email"`
	PlanType       *string         `json:"planType"`
	IsPremium      bool            `json:"isPremium"`
	PremiumUntil   *time.Time      `json:"premiumUntil"`
	Settings       json.RawMessage `json:"settings"`
	ResumeText     *string         `json:"resumeText"`
	ResumeFilename *string         `json:"resumeFilename"`
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	if db == nil {
		initDB()
	}
	if db == nil {
		http.Error(w, `{"error": "Database connection not available"}`, http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}

	if userID == "" {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var u User
		var settingsStr sql.NullString
		var premiumUntil sql.NullTime
		err := db.QueryRow(`SELECT id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename FROM users WHERE id = $1`, userID).
			Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &premiumUntil, &settingsStr, &u.ResumeText, &u.ResumeFilename)

		if premiumUntil.Valid {
			t := premiumUntil.Time
			u.PremiumUntil = &t
		}

		if settingsStr.Valid && settingsStr.String != "" {
			u.Settings = json.RawMessage(settingsStr.String)
		} else {
			u.Settings = json.RawMessage(`{}`)
		}

		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
			} else {
				http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
		json.NewEncoder(w).Encode(u)

	case http.MethodPut:
		var req map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Fetch existing user details from DB to enforce server-side tier limits & grace period lock
		var currPlanType sql.NullString
		var currIsPremium bool
		var currPremiumUntil sql.NullTime
		var currCreatedAt time.Time
		var currSettingsStr sql.NullString

		err := db.QueryRow(`SELECT plan_type, is_premium, premium_until, created_at, settings FROM users WHERE id = $1`, userID).
			Scan(&currPlanType, &currIsPremium, &currPremiumUntil, &currCreatedAt, &currSettingsStr)

		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
			} else {
				http.Error(w, `{"error": "Internal Server Error"}`, http.StatusInternalServerError)
			}
			return
		}

		plan := ""
		if currPlanType.Valid {
			plan = strings.ToLower(currPlanType.String)
		}
		isPaidTrial := currPremiumUntil.Valid && currPremiumUntil.Time.After(time.Now())
		isUnlimited := currIsPremium || isPaidTrial || (plan != "" && plan != "explorer")

		// If user is on Explorer (Free) plan, validate and clamp settings server-side
		if !isUnlimited {
			if rawSettings, ok := req["settings"]; ok {
				var settingsMap map[string]interface{}
				switch v := rawSettings.(type) {
				case map[string]interface{}:
					settingsMap = v
				case string:
					json.Unmarshal([]byte(v), &settingsMap)
				}

				if settingsMap != nil {
					// Parse existing DB settings
					var existingSettings map[string]interface{}
					if currSettingsStr.Valid && currSettingsStr.String != "" {
						json.Unmarshal([]byte(currSettingsStr.String), &existingSettings)
					}
					if existingSettings == nil {
						existingSettings = make(map[string]interface{})
					}

					var existingModules map[string]bool
					if rawExistingModules, hasExisting := existingSettings["modules"].(map[string]interface{}); hasExisting {
						existingModules = make(map[string]bool)
						for mk, mv := range rawExistingModules {
							if b, ok := mv.(bool); ok {
								existingModules[mk] = b
							}
						}
					}

					// Determine original activation date
					activationTime := currCreatedAt
					if rawAct, ok := existingSettings["tabs_activated_at"].(string); ok && rawAct != "" {
						if parsedAct, pErr := time.Parse(time.RFC3339, rawAct); pErr == nil {
							activationTime = parsedAct
						}
					}

					elapsedDays := time.Since(activationTime).Hours() / 24.0
					isLocked := elapsedDays >= 30.0

					// Check incoming modules
					if rawIncomingModules, ok := settingsMap["modules"].(map[string]interface{}); ok {
						allKeys := []string{"habit", "planner", "finance", "study", "journal", "calendar", "job", "goal"}

						// 1. Enforce strict 3-tab max limit by clamping
						activeCount := 0
						clampedModules := make(map[string]bool)

						for _, key := range allKeys {
							if val, exists := rawIncomingModules[key]; exists {
								if b, ok := val.(bool); ok && b {
									if activeCount < 3 {
										clampedModules[key] = true
										activeCount++
									} else {
										clampedModules[key] = false
									}
								} else {
									clampedModules[key] = false
								}
							} else {
								clampedModules[key] = false
							}
						}

						// 2. Enforce 30-day lock
						if isLocked && len(existingModules) > 0 {
							// If locked, reject any attempt to activate a tab that was not previously active in DB
							for k, isAct := range clampedModules {
								if isAct && !existingModules[k] {
									w.WriteHeader(http.StatusForbidden)
									json.NewEncoder(w).Encode(map[string]string{
										"error": "Your 30-day grace period has expired. Active module selection is locked. Upgrade your plan to swap or unlock modules.",
									})
									return
								}
							}
						}

						settingsMap["modules"] = clampedModules
					}

					// 3. Prevent date anti-spoofing: force tabs_activated_at to original value
					settingsMap["tabs_activated_at"] = activationTime.Format(time.RFC3339)

					req["settings"] = settingsMap
				}
			}
		}

		// Update logic
		setParts := []string{}
		args := []interface{}{userID}
		i := 2

		for k, v := range req {
			dbCol := ""
			switch k {
			case "name":
				dbCol = "name"
			case "settings":
				dbCol = "settings"
			case "resumeText":
				dbCol = "resume_text"
			case "resumeFilename":
				dbCol = "resume_filename"
			default:
				continue
			}

			// If settings is provided, it might be a JSON object, so marshal it if it's not a string
			if k == "settings" {
				switch v.(type) {
				case map[string]interface{}, []interface{}:
					jsonBytes, _ := json.Marshal(v)
					v = string(jsonBytes)
				}
			}

			setParts = append(setParts, fmt.Sprintf("%s = $%d", dbCol, i))
			args = append(args, v)
			i++
		}

		if len(setParts) == 0 {
			// No update needed, return current user
			var u User
			var settingsStr sql.NullString
			var premiumUntil sql.NullTime
			db.QueryRow(`SELECT id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename FROM users WHERE id = $1`, userID).
				Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &premiumUntil, &settingsStr, &u.ResumeText, &u.ResumeFilename)

			if premiumUntil.Valid {
				t := premiumUntil.Time
				u.PremiumUntil = &t
			}

			if settingsStr.Valid && settingsStr.String != "" {
				u.Settings = json.RawMessage(settingsStr.String)
			} else {
				u.Settings = json.RawMessage(`{}`)
			}
			json.NewEncoder(w).Encode(u)
			return
		}

		setParts = append(setParts, fmt.Sprintf("updated_at = NOW()"))

		query := fmt.Sprintf(`UPDATE users SET %s WHERE id = $1 RETURNING id, name, email, plan_type, is_premium, premium_until, settings, resume_text, resume_filename`, strings.Join(setParts, ", "))

		var u User
		var settingsStr sql.NullString
		var premiumUntil sql.NullTime
		err = db.QueryRow(query, args...).
			Scan(&u.ID, &u.Name, &u.Email, &u.PlanType, &u.IsPremium, &premiumUntil, &settingsStr, &u.ResumeText, &u.ResumeFilename)

		if premiumUntil.Valid {
			t := premiumUntil.Time
			u.PremiumUntil = &t
		}

		if settingsStr.Valid && settingsStr.String != "" {
			u.Settings = json.RawMessage(settingsStr.String)
		} else {
			u.Settings = json.RawMessage(`{}`)
		}

		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error": "Failed to update user: %v"}`, err), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(u)

	default:
		w.Header().Set("Allow", "GET, PUT")
		http.Error(w, `{"error": "Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}
