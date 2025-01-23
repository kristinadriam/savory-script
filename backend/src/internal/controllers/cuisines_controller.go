package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"savory-script/internal/fs"
	"savory-script/internal/utils"
)

type cuisineName struct {
	Name string `json:"name" binding:"required"`
}

func (server *Server) GetCuisines(c *gin.Context) {
	cuisines, err := server.DB.GetCuisines()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to get cuisines")
		return
	}

	c.JSON(http.StatusOK, gin.H{"cuisines": cuisines})
}

func (server *Server) AddCuisine(c *gin.Context) {
	var cuisine_name cuisineName

	if err := c.ShouldBindJSON(&cuisine_name); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := server.DB.AddCuisine(cuisine_name.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.LogWarnf(logTag, "Failed to add cuisine")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"cuisine_id": id})

	cuisine, err := server.DB.GetCuisineById(id)
	if err != nil {
		utils.LogWarnf(logTag, "Failed to get cuisine info")
		return
	}

	cuisineJson, err := json.Marshal(cuisine)
	if err != nil {
		utils.LogErrorf(logTag, "Failed to convert cuisine to JSON: %s", err)
		return
	}

	server.Fs.AddEntity(fs.AddCuisine, string(cuisineJson))
}
