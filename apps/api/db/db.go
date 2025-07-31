package db

import (
	"context"
	"log"
	"time"
	"url-shortener-api/utils"

	"github.com/jackc/pgx/v5/pgxpool"

	"fmt"

	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

var Pool *pgxpool.Pool

func RunMigrations() {
	m, err := migrate.New(
		"file://db/migrations",
		os.Getenv("SUPABASE_DB_URL"),
	)
	if err != nil {
		log.Fatalf("Migration setup failed: %v", err)
	}

	if err := m.Up(); err != nil && err.Error() != "no change" {
		log.Fatalf("Migration failed: %v", err)
	}

	fmt.Println("✅ Database migrations applied successfully")
}

// Connect initializes a database connection pool using SUPABASE_DB_URL
func Connect() {
	// Read DB URL from config
	dbURL := utils.AppConfig.DBURL
	if dbURL == "" {
		log.Fatal("SUPABASE_DB_URL is not set")
	}

	// Configure connection pool
	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Failed to parse database URL: %v", err)
	}

	// Optional tuning for performance
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = 5 * time.Minute
	config.MaxConnLifetime = 30 * time.Minute

	// Connect to database
	Pool, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Failed to create connection pool: %v", err)
	}

	// Test connection
	err = Pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Database connection test failed: %v", err)
	}

	log.Println("✅ Connected to Supabase PostgreSQL")
}

// Close releases all database connections
func Close() {
	if Pool != nil {
		Pool.Close()
	}
}
