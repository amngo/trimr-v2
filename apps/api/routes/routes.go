package routes

import (
	"url-shortener-api/handlers"
	"url-shortener-api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Apply CORS middleware
	r.Use(middleware.CORS())
	// API routes
	api := r.Group("/api")
	{
		// Link endpoints
		api.POST("/links", handlers.CreateLink)
		api.GET("/links", handlers.GetLinks)
	}

	// Redirect route (at root level)
	r.GET("/:slug", handlers.RedirectLink)
}
