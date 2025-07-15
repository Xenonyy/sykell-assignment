package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.POST("/urls", addURL)
	router.GET("/urls", listURLs)
	router.GET("/urls/:id", getURL)
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
		var u URLAnalysis
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
		urls = append(urls, u)
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
