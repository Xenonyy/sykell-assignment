package main

import (
	"database/sql"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var db *sql.DB

func main() {
	godotenv.Load()
	gin.SetMode(gin.ReleaseMode)
	db = ConnectDB()
	go startBackgroundWorker(db)
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("ALLOWED_ORIGINS")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	RegisterRoutes(router)
	router.Run(":8080")
}
