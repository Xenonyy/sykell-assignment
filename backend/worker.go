package main

import (
	"database/sql"
	"log"
	"time"
)

func startBackgroundWorker(db *sql.DB) {
	for {
		var id int
		var url string
		err := db.QueryRow(`SELECT id, url FROM url_analysis WHERE status = 'queued' LIMIT 1`).Scan(&id, &url)
		if err == sql.ErrNoRows {
			time.Sleep(3 * time.Second)
			continue
		} else if err != nil {
			log.Println("Worker DB error:", err)
			time.Sleep(3 * time.Second)
			continue
		}

		log.Printf("Crawling: %s (id=%d)\n", url, id)
		result, brokenLinksJSON := crawlURL(url)

		_, err = db.Exec(`UPDATE url_analysis SET 
			html_version = ?, title = ?, headings = ?, internal_links = ?, external_links = ?, broken_links = ?, has_login_form = ?, status = 'done'
			WHERE id = ?`,
			result.HTMLVersion, result.Title, result.Headings, result.InternalLinks,
			result.ExternalLinks, brokenLinksJSON, result.HasLoginForm, id,
		)
		if err != nil {
			log.Println("Worker update error:", err)
		} else {
			log.Printf("Finished: %s (id=%d)\n", url, id)
		}
	}
}
