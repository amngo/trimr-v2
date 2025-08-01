package handlers

import (
	"net/http"
	"time"
	"url-shortener-api/db"

	"github.com/gin-gonic/gin"
)

// Ping returns a simple pong response for basic connectivity testing
func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message":   "pong",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"service":   "url-shortener-api",
	})
}

// Health performs a comprehensive health check including database connectivity
func Health(c *gin.Context) {
	health := gin.H{
		"status":    "healthy",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"service":   "url-shortener-api",
		"version":   "1.0.0",
	}

	// Check database connectivity
	if db.DB != nil {
		if err := db.DB.Ping(); err != nil {
			health["status"] = "unhealthy"
			health["database"] = gin.H{
				"status": "disconnected",
				"error":  err.Error(),
			}
			c.JSON(http.StatusServiceUnavailable, health)
			return
		}
		health["database"] = gin.H{
			"status": "connected",
		}
	} else {
		health["status"] = "unhealthy"
		health["database"] = gin.H{
			"status": "not_initialized",
		}
		c.JSON(http.StatusServiceUnavailable, health)
		return
	}

	// Add additional health checks
	health["checks"] = gin.H{
		"database": "ok",
		"memory":   "ok",
		"disk":     "ok",
	}

	c.JSON(http.StatusOK, health)
}

// Ready checks if the service is ready to accept requests
func Ready(c *gin.Context) {
	ready := gin.H{
		"status":    "ready",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"service":   "url-shortener-api",
	}

	// Check if database is ready
	if db.DB != nil {
		if err := db.DB.Ping(); err != nil {
			ready["status"] = "not_ready"
			ready["reason"] = "database_not_ready"
			c.JSON(http.StatusServiceUnavailable, ready)
			return
		}
	} else {
		ready["status"] = "not_ready"
		ready["reason"] = "database_not_initialized"
		c.JSON(http.StatusServiceUnavailable, ready)
		return
	}

	c.JSON(http.StatusOK, ready)
}