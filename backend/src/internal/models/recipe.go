package models

import (
	"encoding/json"
	"savory-script/internal/utils"
)

type Category struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Cuisine struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Ingredient struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Quantity string `json:"quantity"`
}

type Recipe struct {
	Id          int          `json:"id"`
	Name        string       `json:"name"`
	Description string       `json:"description"`
	Ingredients []Ingredient `json:"ingredients"`
	Categories  []Category   `json:"categories"`
	Cuisine     Cuisine      `json:"cuisine"`
}

func (r Recipe) ConvertToJson() (string, error) {
	recipeJson, err := json.Marshal(r)
	if err != nil {
		utils.LogErrorf(logTag, "Failed to convert recipe to JSON: %s", err)
	}

	return string(recipeJson), nil
}
