package utils

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// FetchFaviconURL attempts to fetch the favicon URL for a given website URL
func FetchFaviconURL(websiteURL string) string {
	// Parse the URL to extract the domain
	parsedURL, err := url.Parse(websiteURL)
	if err != nil {
		return ""
	}

	domain := parsedURL.Hostname()
	if domain == "" {
		return ""
	}

	// Try multiple favicon locations in order of preference
	faviconURLs := []string{
		fmt.Sprintf("https://%s/favicon.ico", domain),
		fmt.Sprintf("https://www.google.com/s2/favicons?domain=%s&sz=32", domain),
		fmt.Sprintf("https://icons.duckduckgo.com/ip3/%s.ico", domain),
	}

	// Test each favicon URL to see if it's accessible
	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	for _, faviconURL := range faviconURLs {
		if isValidFavicon(client, faviconURL) {
			return faviconURL
		}
	}

	// Fallback to Google's favicon service
	return fmt.Sprintf("https://www.google.com/s2/favicons?domain=%s&sz=32", domain)
}

// isValidFavicon checks if a favicon URL is accessible and returns a valid response
func isValidFavicon(client *http.Client, faviconURL string) bool {
	req, err := http.NewRequest("HEAD", faviconURL, nil)
	if err != nil {
		return false
	}

	// Set a proper User-Agent header
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; URL-Shortener-Bot/1.0)")

	resp, err := client.Do(req)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	// Check if the response is successful and the content type is an image
	if resp.StatusCode == http.StatusOK {
		contentType := resp.Header.Get("Content-Type")
		return strings.HasPrefix(contentType, "image/") || 
			   strings.Contains(contentType, "icon") ||
			   contentType == "application/octet-stream"
	}

	return false
}

// GetDomainFromURL extracts the domain from a URL string
func GetDomainFromURL(websiteURL string) string {
	parsedURL, err := url.Parse(websiteURL)
	if err != nil {
		return ""
	}
	return parsedURL.Hostname()
}