package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"savory-script/internal/db"
	"savory-script/internal/fs"
	"savory-script/internal/utils"
)

func (server *Server) CreateRecipe(c *gin.Context) {
	var dbRecipe db.DbRecipe

	if err := c.ShouldBindJSON(&dbRecipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := server.DB.CreateRecipe(1, dbRecipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to create recipe")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"recipe_id": id})

	recipe, err := server.DB.GetRecipeById(id)
	if err != nil {
		utils.LogWarnf(logTag, "Failed to get recipe info")
		return
	}

	recipeJson, err := json.Marshal(recipe)
	if err != nil {
		utils.LogErrorf(logTag, "Failed to convert recipe to JSON: %s", err)
		return
	}

	server.Fs.AddEntity(fs.AddRecipe, string(recipeJson))
}

func (server *Server) GetRecipes(c *gin.Context) {
	recipes, err := server.DB.GetRecipes(1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to get recipes")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"recipes": recipes})
}
