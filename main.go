package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"net/http"
	"strconv" // ✅ Needed for converting string ID to integer
)

type Article struct {
	ID        uint    `json:"id" gorm:"primaryKey;column:id"`
	Link      string  `json:"link" gorm:"column:link"`
	ImageURL  string  `json:"image_url" gorm:"column:image_url"`
	Title     string  `json:"title" gorm:"column:title"`
	Author    string  `json:"author" gorm:"column:author"`
	IsSpecies *bool   `json:"is_species" gorm:"column:is_species"` // ✅ Handles NULL
}


var db *gorm.DB

func main() {
	r := gin.Default()

	var err error
	db, err = gorm.Open(sqlite.Open("data/articles.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the database")
	}

	// db.AutoMigrate(&Article{})

	r.GET("/api/articles", getArticles)
	r.POST("/api/articles/:id", updateArticle)

	r.Run(":8081") // Run server on port 8081
}

// ✅ FIXED: getArticles now correctly handles NULL, true, and false
func getArticles(c *gin.Context) {
	var articles []Article
	speciesParam := c.Query("species")

	if speciesParam == "true" {
		db.Where("is_species = ?", 1).Find(&articles)
	} else if speciesParam == "false" {
		db.Where("is_species = ?", 0).Find(&articles)
	} else if speciesParam == "null" {
		db.Where("is_species IS NULL").Find(&articles) // ✅ Handle NULL properly
	} else {
		db.Find(&articles) // ✅ If no query param, return all articles
	}

	c.JSON(http.StatusOK, articles)
}

// ✅ FIXED: updateArticle now correctly updates `is_species`
func updateArticle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr) // ✅ Convert string to int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	var article Article
	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	var input struct {
		IsSpecies *bool `json:"is_species"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	article.IsSpecies = input.IsSpecies
	db.Save(&article)

	c.JSON(http.StatusOK, article)
}
