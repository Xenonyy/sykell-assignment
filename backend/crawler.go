package main

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func crawlURL(targetURL string) (URLAnalysis, string) {
	parsed, err := url.ParseRequestURI(targetURL)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		brokenLinks := []BrokenLink{{URL: targetURL, Status: 0}}
		brokenLinksJSON, _ := json.Marshal(brokenLinks)
		return URLAnalysis{
			URL:         targetURL,
			Status:      "error",
			BrokenLinks: brokenLinks,
		}, string(brokenLinksJSON)
	}

	resp, err := http.Get(targetURL)
	if err != nil {
		brokenLinks := []BrokenLink{{URL: targetURL, Status: 0}}
		brokenLinksJSON, _ := json.Marshal(brokenLinks)
		return URLAnalysis{
			URL:         targetURL,
			Status:      "error",
			BrokenLinks: brokenLinks,
		}, string(brokenLinksJSON)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		brokenLinks := []BrokenLink{{URL: targetURL, Status: resp.StatusCode}}
		brokenLinksJSON, _ := json.Marshal(brokenLinks)
		return URLAnalysis{
			URL:         targetURL,
			Status:      "error",
			BrokenLinks: brokenLinks,
		}, string(brokenLinksJSON)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return URLAnalysis{
			URL:    targetURL,
			Status: "error",
		}, ""
	}

	htmlVersion := detectHTMLVersion(resp)
	title := doc.Find("title").Text()

	headings := map[string]int{}
	for i := 1; i <= 6; i++ {
		tag := "h" + string('0'+i)
		headings[tag] = doc.Find(tag).Length()
	}
	headingSummary := headingsToString(headings)

	baseURL, _ := url.Parse(targetURL)
	internalLinks := 0
	externalLinks := 0
	brokenLinks := []BrokenLink{}

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		link, _ := s.Attr("href")
		linkURL, err := url.Parse(link)
		if err != nil || linkURL.Scheme == "mailto" || linkURL.Scheme == "javascript" {
			return
		}

		if linkURL.Host == "" || linkURL.Host == baseURL.Host {
			internalLinks++
		} else {
			externalLinks++
		}

		absolute := baseURL.ResolveReference(linkURL)
		status := checkLink(absolute.String())
		if status >= 400 {
			brokenLinks = append(brokenLinks, BrokenLink{URL: absolute.String(), Status: status})
		}
	})

	hasLogin := false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			hasLogin = true
		}
	})

	brokenLinksJSON, _ := json.Marshal(brokenLinks)

	return URLAnalysis{
		URL:           targetURL,
		HTMLVersion:   htmlVersion,
		Title:         title,
		Headings:      headingSummary,
		InternalLinks: internalLinks,
		ExternalLinks: externalLinks,
		BrokenLinks:   brokenLinks,
		HasLoginForm:  hasLogin,
		Status:        "done",
	}, string(brokenLinksJSON)
}

func headingsToString(h map[string]int) string {
	var parts []string
	for k, v := range h {
		parts = append(parts, k+":"+string(rune('0'+v)))
	}
	return strings.Join(parts, ",")
}

func detectHTMLVersion(resp *http.Response) string {
	if strings.Contains(strings.ToLower(resp.Proto), "html") {
		return "HTML5"
	}
	return resp.Proto
}

func checkLink(link string) int {
	resp, err := http.Head(link)
	if err != nil {
		return 500
	}
	defer resp.Body.Close()
	return resp.StatusCode
}
