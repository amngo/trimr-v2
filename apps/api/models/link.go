package models

import (
	"time"

	"github.com/google/uuid"
)

type Link struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	Name        *string    `json:"name" db:"name"`
	Slug        string     `json:"slug" db:"slug"`
	Original    string     `json:"original" db:"original"`
	Clicks      int        `json:"clicks" db:"clicks"`
	CreatedAt   time.Time  `json:"createdAt" db:"created_at"`
	LastUpdated time.Time  `json:"lastUpdated" db:"last_updated"`
	ExpiresAt   *time.Time `json:"expiresAt,omitempty" db:"expires_at"`
	ActiveFrom  *time.Time `json:"activeFrom,omitempty" db:"active_from"`
	Password    *string    `json:"-" db:"password"`
	UserID      *uuid.UUID `json:"userId,omitempty" db:"user_id"`
}

type CreateLinkRequest struct {
	URL        string     `json:"url" binding:"required,url"`
	Name       *string    `json:"name"`
	ExpiresAt  *time.Time `json:"expiresAt,omitempty"`
	ActiveFrom *time.Time `json:"activeFrom,omitempty"`
	Password   *string    `json:"password,omitempty"`
}

type CreateLinkResponse struct {
	ShortURL string `json:"shortUrl"`
	Slug     string `json:"slug"`
}

type AccessLinkRequest struct {
	Password *string `json:"password,omitempty"`
}

type LinkStats struct {
	TotalClicks  int `json:"totalClicks" db:"total_clicks"`
	UniqueClicks int `json:"uniqueClicks" db:"unique_clicks"`
}

type ClickEvent struct {
	ID        uuid.UUID `json:"id" db:"id"`
	LinkID    uuid.UUID `json:"linkId" db:"link_id"`
	Timestamp time.Time `json:"timestamp" db:"timestamp"`
	IP        *string   `json:"ip,omitempty" db:"ip"`
	Country   *string   `json:"country,omitempty" db:"country"`
	Device    *string   `json:"device,omitempty" db:"device"`
	Lat       *float64  `json:"lat,omitempty" db:"lat"`
	Lng       *float64  `json:"lng,omitempty" db:"lng"`
}
