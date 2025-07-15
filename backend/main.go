package main

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

func main() {
	gin.SetMode(gin.ReleaseMode)
	db = ConnectDB()
	router := gin.Default()
	RegisterRoutes(router)
	router.Run(":8080")
}
