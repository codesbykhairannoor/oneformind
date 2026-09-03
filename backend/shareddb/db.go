// Package shareddb provides a single, shared PostgreSQL connection pool
// for all Go backend handlers. This prevents each handler from opening
// its own pool, which would waste connections on a constrained VPS.
package shareddb

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var (
	instance *sql.DB
	once     sync.Once
)

// Get returns the shared DB instance, initializing it on first call.
func Get() *sql.DB {
	once.Do(func() {
		connStr := getBestConnStr()
		if connStr == "" {
			log.Println("FATAL: No database connection string found")
			return
		}

		connStr = cleanConnStr(connStr)

		db, err := sql.Open("pgx", connStr)
		if err != nil {
			log.Printf("FATAL: Failed to open shared DB: %v", err)
			return
		}

		// Optimal pool settings for 4GB/2vCPU VPS:
		// - Max 20 open connections total (shared across ALL handlers)
		// - Was: each of 20 handlers opened 2 = 40 connections
		// - Now: all 20 handlers share 20 connections max
		db.SetMaxOpenConns(20)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(10 * time.Minute)
		db.SetConnMaxIdleTime(2 * time.Minute)

		if err := db.Ping(); err != nil {
			log.Printf("WARNING: Shared DB ping failed (will retry on first query): %v", err)
		} else {
			log.Println("Shared DB pool initialized successfully")
		}

		instance = db
	})
	return instance
}

func getBestConnStr() string {
	// Prefer POSTGRES_PRISMA_URL (Supabase pooler with PgBouncer)
	if v := os.Getenv("POSTGRES_PRISMA_URL"); v != "" {
		return v
	}
	if v := os.Getenv("POSTGRES_URL_NON_POOLING"); v != "" {
		return v
	}
	if v := os.Getenv("POSTGRES_URL"); v != "" {
		return v
	}
	return os.Getenv("DATABASE_URL")
}

func cleanConnStr(connStr string) string {
	// pgbouncer=true is not compatible with pgx prepared statements
	// When using PgBouncer in transaction mode, use simple_protocol instead
	connStr = strings.Replace(connStr, "pgbouncer=true", "", -1)
	connStr = strings.Replace(connStr, "?&", "?", -1)
	connStr = strings.Replace(connStr, "&&", "&", -1)
	if strings.HasSuffix(connStr, "?") {
		connStr = strings.TrimSuffix(connStr, "?")
	}

	if !strings.Contains(connStr, "sslmode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&sslmode=require"
		} else {
			connStr += "?sslmode=require"
		}
	}

	if !strings.Contains(connStr, "default_query_exec_mode=") {
		if strings.Contains(connStr, "?") {
			connStr += "&default_query_exec_mode=simple_protocol"
		} else {
			connStr += "?default_query_exec_mode=simple_protocol"
		}
	}

	return connStr
}

// MustGet panics if the DB is not available. Use in critical paths.
func MustGet() *sql.DB {
	db := Get()
	if db == nil {
		panic("shared DB is not initialized")
	}
	return db
}

// HealthCheck pings the DB and returns an error if unhealthy.
func HealthCheck() error {
	db := Get()
	if db == nil {
		return fmt.Errorf("DB pool not initialized")
	}
	return db.Ping()
}
