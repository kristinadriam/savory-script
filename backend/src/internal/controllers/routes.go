package controllers

import (
	// "net/http"

	// "github.com/gin-gonic/gin"
)

func (s *Server) initializeRoutes() {
	// s.Router.GET("/api/home", func(c *gin.Context) {
	// 	response := Response{
	// 		Title:    "Are you hungry? Find something to suit your taste here!",
	// 		Subtitle: "Hundreds of recipes for every taste and color.",
	// 		AppName:  "Savory script",
	// 		Message:  "asosdosaodoad",
	// 		AccountButton: struct {
	// 			Text string `json:"text"`
	// 		}{
	// 			Text: "account",
	// 		},
	// 	}

	// 	c.JSON(http.StatusOK, response)
	// })

	internal_v1 := s.Router.Group("/internal/v1")

	{
		internal_v1.POST("/add-cuisine", s.AddCuisine)
		internal_v1.POST("/add-category", s.AddCategory)
		internal_v1.POST("/add-ingredient", s.AddIngredient)
		internal_v1.POST("/create-recipe", s.CreateRecipe)

		internal_v1.GET("/get-recipes", s.GetRecipes)
		internal_v1.GET("/get-cuisines", s.GetCuisines)
		internal_v1.GET("/get-categories", s.GetCategories)
		internal_v1.GET("/get-ingredients", s.GetIngredients)
	}

}
