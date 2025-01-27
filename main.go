package main

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// Holds scan results file, which has JSON format.
type JsonFile struct {
	Name string `json:"name"`
}

func main() {
	// Note: Uncomment the next line in production.
	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	router.SetTrustedProxies([]string{"localhost"})
	router.Static("/assets", "./assets")

	// Scan results are looked in this folder (see API below).
	// The files are also served statically from this path.
	router.Static("/results", "./results")
	router.LoadHTMLFiles("index.html")

	// Route for the main page.
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	// API to return the list of files.
	router.GET("/api/results", func(c *gin.Context) {
		// Get json files in results folder.
		jsonPattern := filepath.Join("./results", "*.json")
		jsonFiles, err := filepath.Glob(jsonPattern)
		if err != nil {
			return
		}

		// Holds the base name of json files.
		var results []JsonFile

		// Collect all base names.
		for _, fullPath := range jsonFiles {
			baseName := filepath.Base(fullPath)
			jf := JsonFile{Name: baseName}
			results = append(results, jf)
		}

		// Return as json.
		c.JSON(http.StatusOK, results)
	})

	// Listen and serve on 0.0.0.0:8080
	router.Run(":8080")
}
