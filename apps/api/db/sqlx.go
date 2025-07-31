package db

import (
	"log"
	"url-shortener-api/utils"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

// ConnectSQLX initializes a sqlx database connection
func ConnectSQLX() {
	dbURL := utils.AppConfig.DBURL
	if dbURL == "" {
		log.Fatal("SUPABASE_DB_URL is not set")
	}

	var err error
	DB, err = sqlx.Connect("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Configure connection pool
	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(2)

	log.Println("✅ Connected to database with sqlx")
}
