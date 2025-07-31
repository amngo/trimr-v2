package handlers

import (
	"database/sql"
	"fmt"
	"math/rand"
	"net/http"
	"time"
	"url-shortener-api/db"
	"url-shortener-api/middleware"
	"url-shortener-api/models"
	"url-shortener-api/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

const slugCharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func init() {
	rand.Seed(time.Now().UnixNano())
}

func generateSlug(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = slugCharset[rand.Intn(len(slugCharset))]
	}
	return string(b)
}

// CreateLink handles the creation of a new short link
func CreateLink(c *gin.Context) {
	var req models.CreateLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Generate a unique slug
	var slug string
	var link models.Link
	maxAttempts := 10

	for i := 0; i < maxAttempts; i++ {
		slug = generateSlug(6)

		// Check if slug already exists
		err := db.DB.Get(&link, "SELECT id FROM links WHERE slug = $1", slug)
		if err == sql.ErrNoRows {
			// Slug is unique, we can use it
			break
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		if i == maxAttempts-1 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate unique slug"})
			return
		}
	}

	// Get user ID from context (set by JWT middleware)
	userID := middleware.GetUserID(c)

	// Hash password if provided
	var hashedPassword *string
	if req.Password != nil && *req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
			return
		}
		hashStr := string(hash)
		hashedPassword = &hashStr
	}

	// Create the link
	link = models.Link{
		ID:          uuid.New(),
		Name:        req.Name,
		Slug:        slug,
		Original:    req.URL,
		Clicks:      0,
		CreatedAt:   time.Now(),
		LastUpdated: time.Now(),
		ExpiresAt:   req.ExpiresAt,
		ActiveFrom:  req.ActiveFrom,
		Password:    hashedPassword,
		UserID:      userID,
	}

	query := `
		INSERT INTO links (id, name, slug, original, clicks, created_at, last_updated, expires_at, active_from, password, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`

	_, err := db.DB.Exec(query, link.ID, link.Name, link.Slug, link.Original, link.Clicks, link.CreatedAt, link.LastUpdated, link.ExpiresAt, link.ActiveFrom, link.Password, link.UserID)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			c.JSON(http.StatusConflict, gin.H{"error": "Slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create link"})
		return
	}

	// Get the base URL from environment or use a default
	baseURL := utils.AppConfig.BaseURL
	if baseURL == "" {
		baseURL = fmt.Sprintf("http://localhost:%s", utils.AppConfig.Port)
	}

	response := models.CreateLinkResponse{
		ShortURL: fmt.Sprintf("%s/%s", baseURL, slug),
		Slug:     slug,
	}

	c.JSON(http.StatusCreated, response)
}

// RedirectLink handles the redirect from short link to original URL
func RedirectLink(c *gin.Context) {
	slug := c.Param("slug")

	var link models.Link
	err := db.DB.Get(&link, "SELECT * FROM links WHERE slug = $1", slug)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Link not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check if link is active (activeFrom)
	now := time.Now()
	if link.ActiveFrom != nil && now.Before(*link.ActiveFrom) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Link is not yet active"})
		return
	}

	// Check if link has expired
	if link.ExpiresAt != nil && now.After(*link.ExpiresAt) {
		c.JSON(http.StatusGone, gin.H{"error": "Link has expired"})
		return
	}

	// Check password protection
	if link.Password != nil {
		var req models.AccessLinkRequest
		if err := c.ShouldBindJSON(&req); err != nil || req.Password == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Password required", "passwordRequired": true})
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(*link.Password), []byte(*req.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password", "passwordRequired": true})
			return
		}
	}

	clientIP := c.ClientIP()

	// Check if this is a unique click (within the configured time window)
	var existingClick int
	timeWindow := time.Duration(utils.AppConfig.UniqueClickExpiry) * time.Hour
	cutoffTime := now.Add(-timeWindow)

	err = db.DB.Get(&existingClick,
		"SELECT COUNT(*) FROM click_events WHERE link_id = $1 AND ip = $2 AND timestamp > $3",
		link.ID, clientIP, cutoffTime)

	// isUniqueClick := (err != nil || existingClick == 0)

	// Increment click count (always increment total)
	_, err = db.DB.Exec("UPDATE links SET clicks = clicks + 1, last_updated = NOW() WHERE id = $1", link.ID)
	if err != nil {
		// Log error but don't stop the redirect
		fmt.Printf("Error updating click count: %v\n", err)
	}

	// Record click event
	userAgent := c.Request.UserAgent()
	clickEvent := models.ClickEvent{
		ID:        uuid.New(),
		LinkID:    link.ID,
		Timestamp: now,
		IP:        &clientIP,
		Device:    &userAgent,
	}

	_, err = db.DB.Exec(
		"INSERT INTO click_events (id, link_id, timestamp, ip, device) VALUES ($1, $2, $3, $4, $5)",
		clickEvent.ID, clickEvent.LinkID, clickEvent.Timestamp, clickEvent.IP, clickEvent.Device,
	)
	if err != nil {
		// Log error but don't stop the redirect
		fmt.Printf("Error recording click event: %v\n", err)
	}

	c.Redirect(http.StatusMovedPermanently, link.Original)
}

// GetLinks retrieves user-specific links (for dashboard)
func GetLinks(c *gin.Context) {
	var links []models.Link

	// Get user ID from context (set by JWT middleware)
	userID := middleware.GetUserID(c)

	var query string
	var err error

	if userID != nil {
		// If authenticated, show only user's links
		query = `
			SELECT id, name, slug, original, clicks, created_at, last_updated, expires_at, active_from, user_id
			FROM links
			WHERE user_id = $1
			ORDER BY created_at DESC
		`
		err = db.DB.Select(&links, query, *userID)
	} else {
		// If not authenticated, show only anonymous links (for backward compatibility)
		query = `
			SELECT id, name, slug, original, clicks, created_at, last_updated, expires_at, active_from, user_id
			FROM links
			WHERE user_id IS NULL
			ORDER BY created_at DESC
		`
		err = db.DB.Select(&links, query)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve links"})
		return
	}

	// Generate short URLs and calculate unique clicks
	baseURL := utils.AppConfig.BaseURL
	if baseURL == "" {
		baseURL = fmt.Sprintf("http://localhost:%s", utils.AppConfig.Port)
	}

	type LinkResponse struct {
		models.Link
		ShortURL     string `json:"shortUrl"`
		UniqueClicks int    `json:"uniqueClicks"`
		IsActive     bool   `json:"isActive"`
		IsExpired    bool   `json:"isExpired"`
	}

	response := make([]LinkResponse, len(links))
	now := time.Now()
	timeWindow := time.Duration(utils.AppConfig.UniqueClickExpiry) * time.Hour
	cutoffTime := now.Add(-timeWindow)

	for i, link := range links {
		// Calculate unique clicks
		var uniqueClicks int
		err := db.DB.Get(&uniqueClicks,
			`SELECT COUNT(DISTINCT ip) FROM click_events
			 WHERE link_id = $1 AND timestamp > $2`,
			link.ID, cutoffTime)
		if err != nil {
			uniqueClicks = 0
		}

		// Check if link is active and not expired
		isActive := link.ActiveFrom == nil || now.After(*link.ActiveFrom)
		isExpired := link.ExpiresAt != nil && now.After(*link.ExpiresAt)

		response[i] = LinkResponse{
			Link:         link,
			ShortURL:     fmt.Sprintf("%s/%s", baseURL, link.Slug),
			UniqueClicks: uniqueClicks,
			IsActive:     isActive,
			IsExpired:    isExpired,
		}
	}

	c.JSON(http.StatusOK, response)
}

// CheckLinkAccess checks if a link requires a password and validates it
func CheckLinkAccess(c *gin.Context) {
	slug := c.Param("slug")

	var link models.Link
	err := db.DB.Get(&link, "SELECT * FROM links WHERE slug = $1", slug)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Link not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check if link is active (activeFrom)
	now := time.Now()
	if link.ActiveFrom != nil && now.Before(*link.ActiveFrom) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Link is not yet active"})
		return
	}

	// Check if link has expired
	if link.ExpiresAt != nil && now.After(*link.ExpiresAt) {
		c.JSON(http.StatusGone, gin.H{"error": "Link has expired"})
		return
	}

	// Return link info and password requirement status
	response := gin.H{
		"slug":             link.Slug,
		"passwordRequired": link.Password != nil,
	}

	// If password is provided, validate it
	if link.Password != nil {
		var req models.AccessLinkRequest
		if err := c.ShouldBindJSON(&req); err == nil && req.Password != nil {
			err = bcrypt.CompareHashAndPassword([]byte(*link.Password), []byte(*req.Password))
			if err == nil {
				response["passwordValid"] = true
				response["originalUrl"] = link.Original
			} else {
				response["passwordValid"] = false
			}
		}
	} else {
		response["originalUrl"] = link.Original
	}

	c.JSON(http.StatusOK, response)
}
