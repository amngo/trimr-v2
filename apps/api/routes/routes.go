package routes

import (
	"url-shortener-api/handlers"
	"url-shortener-api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Apply CORS middleware
	r.Use(middleware.CORS())

	// Test endpoints (no auth required)
	r.GET("/ping", handlers.Ping)
	r.GET("/health", handlers.Health)
	r.GET("/ready", handlers.Ready)

	// API routes
	api := r.Group("/api")
	{
		// Authentication endpoints
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)
		api.POST("/auth/logout", handlers.Logout)
		api.GET("/auth/profile", middleware.JWTAuth(), handlers.GetProfile)

		// Link endpoints - using optional JWT auth for backward compatibility
		api.POST("/links", middleware.OptionalJWTAuth(), handlers.CreateLink)
		api.GET("/links", middleware.OptionalJWTAuth(), handlers.GetLinks)
		api.PATCH("/links/:id", middleware.OptionalJWTAuth(), handlers.UpdateLink)
		api.DELETE("/links/:id", middleware.OptionalJWTAuth(), handlers.DeleteLink)
		api.POST("/links/:slug/access", handlers.CheckLinkAccess)

		// Dashboard endpoints
		api.GET("/dashboard/stats", middleware.JWTAuth(), handlers.GetDashboardStats)
	}

	// Redirect route (at root level)
	r.GET("/:slug", handlers.RedirectLink)
}
