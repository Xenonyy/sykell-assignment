package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.POST("/urls", addURL)
	router.GET("/urls", listURLs)
	router.GET("/urls/:id", getURL)
	router.POST("/urls/start", startURLs)
}

func addURL(c *gin.Context) {
	var input struct {
		URL string `json:"url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	res, err := db.Exec(
		`INSERT INTO url_analysis (url, status) VALUES (?, ?)`,
		input.URL, "queued",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	id, _ := res.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"id": id, "url": input.URL, "status": "queued"})
}

func listURLs(c *gin.Context) {
	rows, err := db.Query(`SELECT id, url, status, title, html_version, headings, internal_links, external_links, broken_links, has_login_form FROM url_analysis`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	defer rows.Close()

	var urls []URLAnalysis
	for rows.Next() {
		var u URLAnalysisDB
		err := rows.Scan(
			&u.ID,
			&u.URL,
			&u.Status,
			&u.Title,
			&u.HTMLVersion,
			&u.Headings,
			&u.InternalLinks,
			&u.ExternalLinks,
			&u.BrokenLinks,
			&u.HasLoginForm,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
			return
		}
		urls = append(urls, URLAnalysis{
			ID:            u.ID,
			URL:           u.URL,
			Status:        u.Status,
			HTMLVersion:   u.HTMLVersion.String,
			Title:         u.Title.String,
			Headings:      u.Headings.String,
			InternalLinks: int(u.InternalLinks.Int64),
			ExternalLinks: int(u.ExternalLinks.Int64),
			BrokenLinks:   u.BrokenLinks.String,
			HasLoginForm:  u.HasLoginForm.Bool,
		})
	}
	c.JSON(http.StatusOK, urls)
}

func getURL(c *gin.Context) {
	id := c.Param("id")

	var u URLAnalysis
	err := db.QueryRow(
		`SELECT id, url, status, title, html_version, headings, internal_links, external_links, broken_links, has_login_form 
		 FROM url_analysis WHERE id = ?`, id,
	).Scan(
		&u.ID,
		&u.URL,
		&u.Status,
		&u.Title,
		&u.HTMLVersion,
		&u.Headings,
		&u.InternalLinks,
		&u.ExternalLinks,
		&u.BrokenLinks,
		&u.HasLoginForm,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	c.JSON(http.StatusOK, u)
}

func startURLs(c *gin.Context) {
	var input struct {
		IDs []int `json:"ids"`
	}
	if err := c.ShouldBindJSON(&input); err != nil || len(input.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	query := "UPDATE url_analysis SET status = 'running' WHERE id IN (?" + strings.Repeat(",?", len(input.IDs)-1) + ")"
	args := make([]interface{}, len(input.IDs))
	for i, id := range input.IDs {
		args[i] = id
	}
	_, err := db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}