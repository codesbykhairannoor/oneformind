package shareddb

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type verifiedUser struct {
	Email     string
	Name      string
	ExpiresAt time.Time
}

var (
	tokenVerifyCache sync.Map // sha256(token) -> verifiedUser
	authHTTPClient   = &http.Client{Timeout: 6 * time.Second}
)

// VerifySupabaseToken cryptographically validates a Supabase JWT (HS256 or ES256)
// by calling Supabase Auth's authoritative /auth/v1/user endpoint, with a 60s in-memory cache.
// Forged, unsigned, expired, or revoked tokens are strictly rejected.
func VerifySupabaseToken(tokenString string) (email string, name string, err error) {
	tokenString = strings.TrimSpace(tokenString)
	if tokenString == "" || strings.Count(tokenString, ".") != 2 {
		return "", "", fmt.Errorf("invalid bearer token format")
	}

	sum := sha256.Sum256([]byte(tokenString))
	cacheKey := hex.EncodeToString(sum[:])

	if cached, ok := tokenVerifyCache.Load(cacheKey); ok {
		vu := cached.(verifiedUser)
		if time.Now().Before(vu.ExpiresAt) {
			return vu.Email, vu.Name, nil
		}
		tokenVerifyCache.Delete(cacheKey)
	}

	supabaseURL := strings.TrimRight(os.Getenv("NEXT_PUBLIC_SUPABASE_URL"), "/")
	if supabaseURL == "" {
		supabaseURL = strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")
	}
	if supabaseURL == "" {
		supabaseURL = "https://esahuobozjxkyjvpxslu.supabase.co"
	}

	supabaseAnonKey := os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
	if supabaseAnonKey == "" {
		supabaseAnonKey = os.Getenv("SUPABASE_ANON_KEY")
	}
	if supabaseAnonKey == "" {
		supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWh1b2Jvemp4a3lqdnB4c2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDk3NzMsImV4cCI6MjA4NDQ4NTc3M30.V6ZBvGe00D7HsduaxstN8bquN8-Snnl61LbwPVSi3ks"
	}

	req, err := http.NewRequest(http.MethodGet, supabaseURL+"/auth/v1/user", nil)
	if err != nil {
		return "", "", err
	}
	req.Header.Set("Authorization", "Bearer "+tokenString)
	req.Header.Set("apikey", supabaseAnonKey)

	resp, err := authHTTPClient.Do(req)
	if err != nil {
		return "", "", fmt.Errorf("auth verification request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("token rejected by identity provider (status %d)", resp.StatusCode)
	}

	var payload struct {
		ID           string                 `json:"id"`
		Email        string                 `json:"email"`
		UserMetadata map[string]interface{} `json:"user_metadata"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return "", "", fmt.Errorf("invalid identity provider response")
	}
	if payload.ID == "" || payload.Email == "" {
		return "", "", fmt.Errorf("verified token missing user identity")
	}

	resolvedName := payload.Email
	if payload.UserMetadata != nil {
		if fn, ok := payload.UserMetadata["full_name"].(string); ok && fn != "" {
			resolvedName = fn
		} else if n, ok := payload.UserMetadata["name"].(string); ok && n != "" {
			resolvedName = n
		}
	}

	tokenVerifyCache.Store(cacheKey, verifiedUser{
		Email:     payload.Email,
		Name:      resolvedName,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	return payload.Email, resolvedName, nil
}
