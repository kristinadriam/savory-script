package db

import (
	"savory-script/internal/models"
	"savory-script/internal/utils"

	"github.com/lib/pq"
)

func (db *Db) AddIngredient(name string) (int, error) {
	sqlStatement := `
		INSERT INTO ingredients (name)
		VALUES ($1)
		RETURNING id
	`

	var id int
	err := db.db.QueryRow(sqlStatement, name).Scan(&id)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			if pqErr.Code == duplicateKeyErrorCode {
				utils.LogWarnf(logTag, "Duplicate key error: %v", err)
				return id, nil
			}
		}

		utils.LogErrorf(logTag, "Error executing query for ingredients: %v", err)
		return 0, err
	}

	utils.LogInfof(logTag, "Successfully added ingredient")
	return id, nil
}

func (db *Db) GetIngredients() ([]models.Ingredient, error) {
	sqlQuery := "SELECT * FROM ingredients"

	rows, err := db.db.Query(sqlQuery)

	ingredients := []models.Ingredient{}

	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for ingredients: %v", err)
		return ingredients, err
	}

	for rows.Next() {
		var id int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			utils.LogErrorf(logTag, "Error executing query for ingredients: %v", err)
			return []models.Ingredient{}, err
		}
		ingredients = append(ingredients, models.Ingredient{
			Id:   id,
			Name: name,
		})
	}

	return ingredients, nil
}

func (db *Db) GetIngredientById(id int) (models.Ingredient, error) {
	var ingredient models.Ingredient

	sqlStatement := `
	SELECT name
	FROM ingredients
	WHERE id = $1
	`

	var name string
	err := db.db.QueryRow(sqlStatement, id).Scan(&name)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for ingredient name: %v", err)
		return ingredient, err
	}

	ingredient.Id = id
	ingredient.Name = name
	utils.LogInfof(logTag, "Successfully retrieved ingredient name")
	return ingredient, nil
}
