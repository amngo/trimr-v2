package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"time"
	"url-shortener-api/db"
	"url-shortener-api/models"
	"url-shortener-api/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type DashboardStats struct {
	UniqueVisitors   int                   `json:"uniqueVisitors"`
	MostPopularLink  *models.Link          `json:"mostPopularLink"`
	ClicksOverTime   []ClicksOverTimeData  `json:"clicksOverTime"`
	TopLinks         []TopLinkData         `json:"topLinks"`
	DeviceBreakdown  []DeviceData          `json:"deviceBreakdown"`
	PeakClickTime    *PeakTimeData         `json:"peakClickTime"`
	TopCountries     []CountryData         `json:"topCountries"`
	RecentActivity   []ActivityData        `json:"recentActivity"`
}

type ClicksOverTimeData struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type TopLinkData struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	Clicks   int    `json:"clicks"`
	ShortURL string `json:"shortUrl"`
}

type DeviceData struct {
	Device     string  `json:"device"`
	Clicks     int     `json:"clicks"`
	Percentage float64 `json:"percentage"`
}

type PeakTimeData struct {
	Hour   int    `json:"hour"`
	Clicks int    `json:"clicks"`
	Label  string `json:"label"`
}

type CountryData struct {
	Country string `json:"country"`
	Code    string `json:"code"`
	Clicks  int    `json:"clicks"`
}

type ActivityData struct {
	ID        string `json:"id"`
	LinkID    string `json:"linkId"`
	LinkName  string `json:"linkName"`
	Timestamp string `json:"timestamp"`
	Country   string `json:"country"`
	Device    string `json:"device"`
}

func GetDashboardStats(c *gin.Context) {
	// Get user ID from context if authenticated
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	userID, ok := userIDInterface.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	database := db.DB
	stats := DashboardStats{}

	// Get unique visitors count
	var uniqueVisitors int
	err := database.QueryRow(`
		SELECT COUNT(DISTINCT ip) 
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1
	`, userID).Scan(&uniqueVisitors)
	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get unique visitors"})
		return
	}
	stats.UniqueVisitors = uniqueVisitors

	// Get most popular link
	var mostPopularLink models.Link
	err = database.QueryRow(`
		SELECT 
			l.id, l.name, l.slug, l.original, l.clicks, 
			l.created_at, l.last_updated, l.expires_at, 
			l.active_from, l.user_id, l.disabled,
			COUNT(DISTINCT ce.ip) as unique_clicks
		FROM links l
		LEFT JOIN click_events ce ON l.id = ce.link_id
		WHERE l.user_id = $1
		GROUP BY l.id
		ORDER BY l.clicks DESC
		LIMIT 1
	`, userID).Scan(
		&mostPopularLink.ID, &mostPopularLink.Name, &mostPopularLink.Slug,
		&mostPopularLink.Original, &mostPopularLink.Clicks, &mostPopularLink.CreatedAt,
		&mostPopularLink.LastUpdated, &mostPopularLink.ExpiresAt, &mostPopularLink.ActiveFrom,
		&mostPopularLink.UserID, &mostPopularLink.Disabled, &uniqueVisitors,
	)
	if err == nil {
		baseURL := utils.AppConfig.BaseURL
		mostPopularLink.ShortURL = baseURL + "/" + mostPopularLink.Slug
		
		// Calculate IsActive and IsExpired
		now := time.Now()
		mostPopularLink.IsActive = !mostPopularLink.Disabled
		if mostPopularLink.ActiveFrom != nil {
			mostPopularLink.IsActive = mostPopularLink.IsActive && now.After(*mostPopularLink.ActiveFrom)
		}
		
		mostPopularLink.IsExpired = false
		if mostPopularLink.ExpiresAt != nil {
			mostPopularLink.IsExpired = now.After(*mostPopularLink.ExpiresAt)
			mostPopularLink.IsActive = mostPopularLink.IsActive && !mostPopularLink.IsExpired
		}
		
		stats.MostPopularLink = &mostPopularLink
	}

	// Get clicks over time (last 7 days)
	clicksOverTime := make([]ClicksOverTimeData, 0)
	rows, err := database.Query(`
		SELECT 
			DATE(ce.timestamp) as date,
			COUNT(*) as clicks
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1 AND ce.timestamp >= NOW() - INTERVAL '7 days'
		GROUP BY DATE(ce.timestamp)
		ORDER BY date
	`, userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var data ClicksOverTimeData
			var date time.Time
			if err := rows.Scan(&date, &data.Clicks); err == nil {
				data.Date = date.Format("2006-01-02")
				clicksOverTime = append(clicksOverTime, data)
			}
		}
	}
	stats.ClicksOverTime = clicksOverTime

	// Get top 5 links
	topLinks := make([]TopLinkData, 0)
	rows, err = database.Query(`
		SELECT 
			l.id, COALESCE(l.name, l.slug) as name, l.slug, l.clicks
		FROM links l
		WHERE l.user_id = $1
		ORDER BY l.clicks DESC
		LIMIT 5
	`, userID)
	if err == nil {
		defer rows.Close()
		baseURL := utils.AppConfig.BaseURL
		for rows.Next() {
			var data TopLinkData
			if err := rows.Scan(&data.ID, &data.Name, &data.Slug, &data.Clicks); err == nil {
				data.ShortURL = baseURL + "/" + data.Slug
				topLinks = append(topLinks, data)
			}
		}
	}
	stats.TopLinks = topLinks

	// Get device breakdown
	deviceBreakdown := make([]DeviceData, 0)
	rows, err = database.Query(`
		SELECT 
			COALESCE(ce.device, 'Unknown') as device,
			COUNT(*) as clicks
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1
		GROUP BY device
		ORDER BY clicks DESC
	`, userID)
	if err == nil {
		defer rows.Close()
		var totalClicks int
		devices := make([]DeviceData, 0)
		
		// First pass to get total and data
		for rows.Next() {
			var data DeviceData
			if err := rows.Scan(&data.Device, &data.Clicks); err == nil {
				totalClicks += data.Clicks
				devices = append(devices, data)
			}
		}
		
		// Calculate percentages
		for _, device := range devices {
			device.Percentage = float64(device.Clicks) / float64(totalClicks) * 100
			deviceBreakdown = append(deviceBreakdown, device)
		}
	}
	stats.DeviceBreakdown = deviceBreakdown

	// Get peak click time
	var peakTime PeakTimeData
	err = database.QueryRow(`
		SELECT 
			EXTRACT(HOUR FROM ce.timestamp) as hour,
			COUNT(*) as clicks
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1
		GROUP BY hour
		ORDER BY clicks DESC
		LIMIT 1
	`, userID).Scan(&peakTime.Hour, &peakTime.Clicks)
	if err == nil {
		// Format hour to readable time
		peakTime.Label = formatHour(peakTime.Hour)
		stats.PeakClickTime = &peakTime
	}

	// Get top countries
	topCountries := make([]CountryData, 0)
	rows, err = database.Query(`
		SELECT 
			COALESCE(ce.country, 'Unknown') as country,
			COUNT(*) as clicks
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1 AND ce.country IS NOT NULL
		GROUP BY country
		ORDER BY clicks DESC
		LIMIT 5
	`, userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var data CountryData
			if err := rows.Scan(&data.Country, &data.Clicks); err == nil {
				data.Code = getCountryCode(data.Country)
				topCountries = append(topCountries, data)
			}
		}
	}
	stats.TopCountries = topCountries

	// Get recent activity
	recentActivity := make([]ActivityData, 0)
	rows, err = database.Query(`
		SELECT 
			ce.id,
			ce.link_id,
			COALESCE(l.name, l.slug) as link_name,
			ce.timestamp,
			COALESCE(ce.country, 'Unknown') as country,
			COALESCE(ce.device, 'Unknown') as device
		FROM click_events ce
		JOIN links l ON ce.link_id = l.id
		WHERE l.user_id = $1
		ORDER BY ce.timestamp DESC
		LIMIT 10
	`, userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var data ActivityData
			var timestamp time.Time
			if err := rows.Scan(&data.ID, &data.LinkID, &data.LinkName, 
				&timestamp, &data.Country, &data.Device); err == nil {
				data.Timestamp = timestamp.Format(time.RFC3339)
				recentActivity = append(recentActivity, data)
			}
		}
	}
	stats.RecentActivity = recentActivity

	c.JSON(http.StatusOK, stats)
}

func formatHour(hour int) string {
	period := "AM"
	displayHour := hour
	
	if hour == 0 {
		displayHour = 12
	} else if hour == 12 {
		period = "PM"
	} else if hour > 12 {
		displayHour = hour - 12
		period = "PM"
	}
	
	return fmt.Sprintf("%d:00 %s", displayHour, period)
}

func getCountryCode(country string) string {
	// Simple mapping for common countries
	countryMap := map[string]string{
		"United States": "US",
		"United Kingdom": "GB",
		"Canada": "CA",
		"Germany": "DE",
		"France": "FR",
		"Australia": "AU",
		"Japan": "JP",
		"India": "IN",
		"Brazil": "BR",
		"Mexico": "MX",
	}
	
	if code, exists := countryMap[country]; exists {
		return code
	}
	
	// Default to first two letters of country name
	if len(country) >= 2 {
		return strings.ToUpper(country[:2])
	}
	
	return "XX"
}