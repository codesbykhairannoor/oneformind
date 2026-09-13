package relations

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"tranvas-api/backend/shareddb"
)

var dbRelations *sql.DB

func initDB() {
	dbRelations = shareddb.Get()
}

type EntityRelation struct {
	ID         int       `json:"id"`
	UserID     int       `json:"userId"`
	SourceType string    `json:"sourceType"`
	SourceID   int       `json:"sourceId"`
	TargetType string    `json:"targetType"`
	TargetID   int       `json:"targetId"`
	CreatedAt  time.Time `json:"createdAt"`
}

type SyncRelationPayload struct {
	SourceType string `json:"sourceType"`
	SourceID   int    `json:"sourceId"`
	TargetType string `json:"targetType"`
	TargetID   int    `json:"targetId"`
}

func RelationsHandler(w http.ResponseWriter, r *http.Request) {
	if dbRelations == nil {
		initDB()
	}
	w.Header().Set("Content-Type", "application/json")

	userIdStr := r.Header.Get("X-User-Id")
	if userIdStr == "" {
		userIdStr = r.URL.Query().Get("userId")
	}
	userID, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	if dbRelations == nil {
		http.Error(w, `{"error": "DB not initialized"}`, http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleGetRelations(w, r, userID)
	case http.MethodPost:
		handleCreateRelation(w, r, userID)
	case http.MethodPut:
		handleSyncRelation(w, r, userID)
	case http.MethodDelete:
		handleDeleteRelation(w, r, userID)
	default:
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleGetRelations(w http.ResponseWriter, r *http.Request, userID int) {
	q := r.URL.Query()
	sourceType := q.Get("sourceType")
	sourceIdStr := q.Get("sourceId")
	targetType := q.Get("targetType")
	targetIdStr := q.Get("targetId")

	var query string
	var args []interface{}
	args = append(args, userID)

	if sourceType != "" && sourceIdStr != "" {
		sourceID, err := strconv.Atoi(sourceIdStr)
		if err == nil {
			query = `SELECT id, user_id, source_type, source_id, target_type, target_id, created_at 
			         FROM entity_relations 
			         WHERE user_id = $1 AND source_type = $2 AND source_id = $3 
			         ORDER BY created_at DESC`
			args = append(args, sourceType, sourceID)
		}
	} else if targetType != "" && targetIdStr != "" {
		targetID, err := strconv.Atoi(targetIdStr)
		if err == nil {
			query = `SELECT id, user_id, source_type, source_id, target_type, target_id, created_at 
			         FROM entity_relations 
			         WHERE user_id = $1 AND target_type = $2 AND target_id = $3 
			         ORDER BY created_at DESC`
			args = append(args, targetType, targetID)
		}
	} else {
		query = `SELECT id, user_id, source_type, source_id, target_type, target_id, created_at 
		         FROM entity_relations 
		         WHERE user_id = $1 
		         ORDER BY created_at DESC`
	}

	rows, err := dbRelations.Query(query, args...)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch relations"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	relations := make([]EntityRelation, 0)
	for rows.Next() {
		var rel EntityRelation
		if err := rows.Scan(&rel.ID, &rel.UserID, &rel.SourceType, &rel.SourceID, &rel.TargetType, &rel.TargetID, &rel.CreatedAt); err == nil {
			relations = append(relations, rel)
		}
	}

	json.NewEncoder(w).Encode(relations)
}

func handleCreateRelation(w http.ResponseWriter, r *http.Request, userID int) {
	var payload SyncRelationPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if payload.SourceType == "" || payload.SourceID <= 0 || payload.TargetType == "" || payload.TargetID <= 0 {
		http.Error(w, `{"error": "Missing required relation parameters"}`, http.StatusBadRequest)
		return
	}

	var rel EntityRelation
	query := `
		INSERT INTO entity_relations (user_id, source_type, source_id, target_type, target_id, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		ON CONFLICT (user_id, source_type, source_id, target_type, target_id)
		DO UPDATE SET created_at = entity_relations.created_at
		RETURNING id, user_id, source_type, source_id, target_type, target_id, created_at
	`
	err := dbRelations.QueryRow(query, userID, payload.SourceType, payload.SourceID, payload.TargetType, payload.TargetID).
		Scan(&rel.ID, &rel.UserID, &rel.SourceType, &rel.SourceID, &rel.TargetType, &rel.TargetID, &rel.CreatedAt)

	if err != nil {
		http.Error(w, `{"error": "Failed to create relation"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rel)
}

func handleSyncRelation(w http.ResponseWriter, r *http.Request, userID int) {
	var payload SyncRelationPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if payload.SourceType == "" || payload.SourceID <= 0 || payload.TargetType == "" {
		http.Error(w, `{"error": "Missing required sync parameters"}`, http.StatusBadRequest)
		return
	}

	// Remove any existing relation between this source and target_type
	_, err := dbRelations.Exec(
		`DELETE FROM entity_relations WHERE user_id = $1 AND source_type = $2 AND source_id = $3 AND target_type = $4`,
		userID, payload.SourceType, payload.SourceID, payload.TargetType,
	)
	if err != nil {
		http.Error(w, `{"error": "Failed to clean old relation"}`, http.StatusInternalServerError)
		return
	}

	// If targetId > 0, insert the new relation
	if payload.TargetID > 0 {
		var rel EntityRelation
		query := `
			INSERT INTO entity_relations (user_id, source_type, source_id, target_type, target_id, created_at)
			VALUES ($1, $2, $3, $4, $5, NOW())
			RETURNING id, user_id, source_type, source_id, target_type, target_id, created_at
		`
		err = dbRelations.QueryRow(query, userID, payload.SourceType, payload.SourceID, payload.TargetType, payload.TargetID).
			Scan(&rel.ID, &rel.UserID, &rel.SourceType, &rel.SourceID, &rel.TargetType, &rel.TargetID, &rel.CreatedAt)

		if err != nil {
			http.Error(w, `{"error": "Failed to sync relation"}`, http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(rel)
		return
	}

	w.Write([]byte(`{"success": true, "unlinked": true}`))
}

func handleDeleteRelation(w http.ResponseWriter, r *http.Request, userID int) {
	q := r.URL.Query()
	idStr := q.Get("id")

	if idStr != "" {
		id, err := strconv.Atoi(idStr)
		if err == nil {
			_, err = dbRelations.Exec(`DELETE FROM entity_relations WHERE id = $1 AND user_id = $2`, id, userID)
			if err == nil {
				w.Write([]byte(`{"success": true}`))
				return
			}
		}
	}

	sourceType := q.Get("sourceType")
	sourceIdStr := q.Get("sourceId")
	targetType := q.Get("targetType")
	targetIdStr := q.Get("targetId")

	if sourceType != "" && sourceIdStr != "" && targetType != "" && targetIdStr != "" {
		sourceID, _ := strconv.Atoi(sourceIdStr)
		targetID, _ := strconv.Atoi(targetIdStr)
		_, err := dbRelations.Exec(
			`DELETE FROM entity_relations WHERE user_id = $1 AND source_type = $2 AND source_id = $3 AND target_type = $4 AND target_id = $5`,
			userID, sourceType, sourceID, targetType, targetID,
		)
		if err == nil {
			w.Write([]byte(`{"success": true}`))
			return
		}
	}

	http.Error(w, `{"error": "Failed to delete relation"}`, http.StatusBadRequest)
}
