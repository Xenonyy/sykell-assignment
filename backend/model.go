package main

import "database/sql"

type URLAnalysis struct {
	ID            int            `json:"id"`
	URL           string         `json:"url"`
	Status        string         `json:"status"`
	HTMLVersion   sql.NullString `json:"htmlVersion"`
	Title         sql.NullString `json:"title"`
	Headings      sql.NullString `json:"headings"`
	InternalLinks sql.NullInt64  `json:"internalLinks"`
	ExternalLinks sql.NullInt64  `json:"externalLinks"`
	BrokenLinks   sql.NullString `json:"brokenLinks"`
	HasLoginForm  sql.NullBool   `json:"hasLoginForm"`
}
