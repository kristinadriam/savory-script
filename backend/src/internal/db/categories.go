package db

import (
	"savory-script/internal/models"
	"savory-script/internal/utils"

	"github.com/lib/pq"
)

func (db *Db) AddCategory(name string) (int, error) {
	sqlStatement := `
		INSERT INTO categories (name)
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

	utils.LogInfof(logTag, "Successfully added category")
	return id, nil
}

func (db *Db) GetCategories() ([]models.Category, error) {
	sqlQuery := "SELECT * FROM categories"

	rows, err := db.db.Query(sqlQuery)

	var categories []models.Category

	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for categories: %v", err)
		return categories, err
	}

	for rows.Next() {
		var id int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			// todo: log
			return nil, err
		}
		categories = append(categories, models.Category{
			Id:   id,
			Name: name,
		})
	}

	return categories, nil
}

func (db *Db) GetCategoryById(id int) (models.Category, error) {
	var category models.Category

	sqlStatement := `
	SELECT name
	FROM categories
	WHERE id = $1
	`

	var name string
	err := db.db.QueryRow(sqlStatement, id).Scan(&name)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for category name: %v", err)
		return category, err
	}

	category.Id = id
	category.Name = name
	utils.LogInfof(logTag, "Successfully retrieved category name")
	return category, nil
}
