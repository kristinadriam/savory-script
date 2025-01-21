package db

import (
	"savory-script/internal/models"
	"savory-script/internal/utils"
	"sort"

	"github.com/lib/pq"
)

func (db *Db) AddCuisine(name string) (int, error) {
	sqlStatement := `
		INSERT INTO cuisines (name)
		VALUES ($1)
		RETURNING id`

	var id int
	err := db.db.QueryRow(sqlStatement, name).Scan(&id)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == duplicateKeyErrorCode {
				utils.LogWarnf(logTag, "Duplicate key error: %v", err)
				return id, nil
			}
		}

		utils.LogErrorf(logTag, "Error executing query for cuisines: %v", err)
		return 0, err
	}

	utils.LogInfof(logTag, "Successfully added cuisine")
	return id, nil
}

func (db *Db) GetCuisines() ([]models.Cuisine, error) {
	sqlQuery := "SELECT * FROM cuisines"

	rows, err := db.db.Query(sqlQuery)

	var cuisines []models.Cuisine

	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for cuisines: %v", err)
		return cuisines, err
	}

	for rows.Next() {
		var id int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			utils.LogInfof(logTag, "Something wrong while reading: %v, returns empty list", err)
			return []models.Cuisine{}, err
		}
		cuisines = append(cuisines, models.Cuisine{
			Id:   id,
			Name: name,
		})
	}

	sort.Slice(cuisines, func(i, j int) bool {
		return cuisines[i].Name < cuisines[j].Name
	})

	return cuisines, nil
}

func (db *Db) GetCuisineById(id int) (models.Cuisine, error) {
	var cuisine models.Cuisine

	sqlStatement := `
	SELECT name
	FROM categories
	WHERE id = $1
	`

	var name string
	err := db.db.QueryRow(sqlStatement, id).Scan(&name)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for cuisine name: %v", err)
		return cuisine, err
	}

	cuisine.Id = id
	cuisine.Name = name
	utils.LogInfof(logTag, "Successfully retrieved cuisine name")
	return cuisine, nil
}