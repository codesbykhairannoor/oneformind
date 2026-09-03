package main

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"bufio"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	file, err := os.Open("../.env")
	if err == nil {
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, "DATABASE_URL=") {
				os.Setenv("DATABASE_URL", strings.TrimPrefix(line, "DATABASE_URL="))
			}
		}
		file.Close()
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		fmt.Println("No DATABASE_URL")
		return
	}
	// Adjust connection string
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

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		fmt.Println("Open err:", err)
		return
	}

	rows, err := db.Query("SELECT id, start_time FROM planner_tasks LIMIT 5")
	if err != nil {
		fmt.Println("Query err:", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var sTime sql.NullTime
		err := rows.Scan(&id, &sTime)
		if err != nil {
			fmt.Printf("Scan err for id %d: %v\n", id, err)
			
			// Try scanning as string
			var sStr sql.NullString
			rows2, _ := db.Query("SELECT start_time FROM planner_tasks WHERE id=$1", id)
			if rows2.Next() {
				err2 := rows2.Scan(&sStr)
				fmt.Printf("Scan as string err: %v, val: %v\n", err2, sStr)
			}
			rows2.Close()
		} else {
			fmt.Printf("Success! id %d, sTime: %v\n", id, sTime)
		}
	}
}
