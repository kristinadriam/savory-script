package controllers

import (
	"fmt"
	"os"
	"savory-script/internal/db"
	"savory-script/internal/fs"
	"savory-script/internal/middlewares"
	"strconv"

	"github.com/gin-gonic/gin"
)

const (
	logTag = "server"
)

type Server struct {
	Router *gin.Engine
	DB     *db.Db
	Fs     *fs.Fs
}

// type Response struct {
// 	Title         string `json:"title"`
// 	Subtitle      string `json:"subtitle"`
// 	AppName       string `json:"app_name"`
// 	Message       string `json:"message"`
// 	AccountButton struct {
// 		Text string `json:"text"`
// 	} `json:"account_button"`
// }

func getDbEnvs() (
	string, /* dbHost */
	int, /* dbPort */
	string, /* dbUser */
	string, /* dbPassword */
	string, /* dbName */
) {
	dbHost := os.Getenv("BACKEND_DB_HOST")
	dbPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		fmt.Println("error:", err)
	}
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	return dbHost, dbPort, dbUser, dbPassword, dbName
}

func (server *Server) initializeDB() {
	dbHost, dbPort, dbUser, dbPassword, dbName := getDbEnvs()

	server.DB = db.NewDb(
		dbHost,
		dbPort,
		dbUser,
		dbPassword,
		dbName,
	)
}

func (server *Server) Initialize() {
	// init router
	server.Router = gin.Default()
	server.Router.Use(middlewares.CORSMiddleware())
	server.initializeRoutes()

	// init db
	server.initializeDB()

	// init fs
	server.Fs = fs.NewFs("/fs/data")
	server.Fs.StartFs()
}

func (server *Server) Run() {
	server.Router.Run("0.0.0.0:8060")
}
