package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"savory-script/internal/fs"
	"savory-script/internal/utils"
)

type categoryName struct {
	Name string `json:"name" binding:"required"`
}

func (server *Server) GetCategories(c *gin.Context) {
	categories, err := server.DB.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to get categories")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"categories": categories})
}

func (server *Server) AddCategory(c *gin.Context) {
	var category_name categoryName

	if err := c.ShouldBindJSON(&category_name); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := server.DB.AddCategory(category_name.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to add category")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"category_id": id})

	category, err := server.DB.GetCategoryById(id)
	if err != nil {
		utils.LogWarnf(logTag, "Failed to get category info")
		return
	}

	categoryJson, err := json.Marshal(category)
	if err != nil {
		utils.LogErrorf(logTag, "Failed to convert category to JSON: %s", err)
		return
	}

	server.Fs.AddEntity(fs.AddCategory, string(categoryJson))
}
