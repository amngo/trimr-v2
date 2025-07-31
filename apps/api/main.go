package main

import (
	"log"
	"url-shortener-api/db"
	"url-shortener-api/routes"
	"url-shortener-api/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	utils.LoadEnv()

	// Set Gin mode
	gin.SetMode(utils.AppConfig.GinMode)

	// Connect to Supabase PostgreSQL
	db.Connect()

	// Also connect with sqlx for easier querying
	db.ConnectSQLX()

	// Run database migrations
	db.RunMigrations()

	r := gin.Default()

	// Import routes package
	routes.SetupRoutes(r)

	log.Printf("Server running on port %s", utils.AppConfig.Port)
	r.Run(":" + utils.AppConfig.Port)
}
