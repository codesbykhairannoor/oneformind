package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	connStr := "postgresql://postgres.esahuobozjxkyjvpxslu:Khairanaja09@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&default_query_exec_mode=simple_protocol"
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
	
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		fmt.Println("users error:", err)
	} else {
		fmt.Println("Rows in users:", count)
	}
		// Try User table
		err = db.QueryRow("SELECT is_premium, plan_type FROM \"User\" WHERE email='khairannoor@gmail.com'").Scan(&isPremium, &planType)
		if err != nil {
			fmt.Println("User error:", err)
		} else {
			fmt.Printf("Found in 'User': isPremium=%v, planType=%s\n", isPremium, planType)
		}
	} else {
		fmt.Printf("Found in 'users': isPremium=%v, planType=%s\n", isPremium, planType)
	}
}
