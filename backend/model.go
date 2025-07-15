package main

import "database/sql"

type URLAnalysisDB struct {
	ID            int
	URL           string
	Status        string
	HTMLVersion   sql.NullString
	Title         sql.NullString
	Headings      sql.NullString
	InternalLinks sql.NullInt64
	ExternalLinks sql.NullInt64
	BrokenLinks   sql.NullString
	HasLoginForm  sql.NullBool
}

type URLAnalysis struct {
	ID            int    `json:"id"`
	URL           string `json:"url"`
	Status        string `json:"status"`
	HTMLVersion   string `json:"htmlVersion"`
	Title         string `json:"title"`
	Headings      string `json:"headings"`
	InternalLinks int    `json:"internalLinks"`
	ExternalLinks int    `json:"externalLinks"`
	BrokenLinks   string `json:"brokenLinks"`
	HasLoginForm  bool   `json:"hasLoginForm"`
}
