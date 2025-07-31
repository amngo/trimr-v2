package utils

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	DBURL             string
	JWTSecret         string
	RateLimitRequests int
	RateLimitWindow   int
	UniqueClickExpiry int
	GinMode           string
	Port              string
	BaseURL           string
}

var AppConfig Config

// LoadEnv loads environment variables into the AppConfig struct
func LoadEnv() {
	// Load .env file only in local development
	_ = godotenv.Load()

	AppConfig = Config{
		DBURL:             getEnv("SUPABASE_DB_URL", ""),
		JWTSecret:         getEnv("JWT_SECRET", "defaultsecret"),
		RateLimitRequests: getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
		RateLimitWindow:   getEnvAsInt("RATE_LIMIT_WINDOW", 60),
		UniqueClickExpiry: getEnvAsInt("UNIQUE_CLICK_EXPIRY_HOURS", 24),
		GinMode:           getEnv("GIN_MODE", "release"),
		Port:              getEnv("PORT", "8080"),
		BaseURL:           getEnv("BASE_URL", ""),
	}

	if AppConfig.DBURL == "" {
		log.Fatal("SUPABASE_DB_URL is required")
	}
}

func getEnv(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(name string, defaultVal int) int {
	valStr := getEnv(name, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return defaultVal
}
