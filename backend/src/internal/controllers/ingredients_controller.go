package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"savory-script/internal/fs"
	"savory-script/internal/utils"
)

type ingredientName struct {
	Name string `json:"name" binding:"required"`
}

func (server *Server) AddIngredient(c *gin.Context) {
	var ingredient_name ingredientName

	if err := c.ShouldBindJSON(&ingredient_name); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := server.DB.AddIngredient(ingredient_name.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to add ingredient")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"ingredient_id": id})

	ingredient, err := server.DB.GetIngredientById(id)
	if err != nil {
		utils.LogWarnf(logTag, "Failed to get ingredient info")
		return
	}

	recipeJson, err := json.Marshal(ingredient)
	if err != nil {
		utils.LogErrorf(logTag, "Failed to convert ingredient to JSON: %s", err)
		return
	}

	server.Fs.AddEntity(fs.AddIngredient, string(recipeJson))
}

func (server *Server) GetIngredients(c *gin.Context) {
	ingredients, err := server.DB.GetIngredients()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to get ingredients")
		return
	}

	c.JSON(http.StatusOK, gin.H{"ingredients": ingredients})
}
