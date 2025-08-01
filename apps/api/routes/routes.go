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
		// Authentication endpoints
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)
		api.GET("/auth/profile", middleware.JWTAuth(), handlers.GetProfile)

		// Link endpoints - using optional JWT auth for backward compatibility
		api.POST("/links", middleware.OptionalJWTAuth(), handlers.CreateLink)
		api.GET("/links", middleware.OptionalJWTAuth(), handlers.GetLinks)
		api.PATCH("/links/:id", middleware.OptionalJWTAuth(), handlers.UpdateLink)
		api.DELETE("/links/:id", middleware.OptionalJWTAuth(), handlers.DeleteLink)
		api.POST("/links/:slug/access", handlers.CheckLinkAccess)
	}

	// Redirect route (at root level)
	r.GET("/:slug", handlers.RedirectLink)
}
