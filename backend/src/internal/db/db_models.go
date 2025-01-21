package db

type DbIngredient struct {
	Id       int `json:"id"`
	Quantity string `json:"quantity"`
}

type DbRecipe struct {
	Name        string         `json:"name" binding:"required"`
	Description string         `json:"description" binding:"required"`
	Ingredients []DbIngredient `json:"ingredients" binding:"required"`
	Categories  []int          `json:"categories" binding:"required"`
	Cuisine     int            `json:"cuisine" binding:"required"`
}
