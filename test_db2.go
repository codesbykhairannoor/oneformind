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
	db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	fmt.Println("Rows:", count)
	
	rows, _ := db.Query("SELECT email, is_premium, plan_type FROM users LIMIT 10")
	for rows != nil && rows.Next() {
		var email, planType string
		var isPremium bool
		rows.Scan(&email, &isPremium, &planType)
		fmt.Printf("- %s | premium: %v | plan: %s\n", email, isPremium, planType)
	}
}
