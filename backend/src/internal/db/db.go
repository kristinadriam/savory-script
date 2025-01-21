package db

import (
	"database/sql"
	"fmt"
	"savory-script/internal/utils"

	_ "github.com/lib/pq"
)

type Db struct {
	db *sql.DB
}

const (
	logTag = "DB"
	duplicateKeyErrorCode = "23505"
)

func NewDb(dbHost string, dbPort int, dbUser string, dbPassword string, dbName string) *Db {
	dbUrl := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

	postgresDb, err := sql.Open("postgres", dbUrl)
	if err != nil {
		utils.LogFatalf(logTag, "Failed to connect to DB: %v", err)
	}

	err = postgresDb.Ping()
	if err != nil {
		utils.LogFatalf(logTag, "Failed to ping DB: %v", err)
	}
	utils.LogInfof(logTag, "Successfully connected to DB")

	db := &Db{db: postgresDb}

	return db
}
