package db

import (
	"errors"
	"savory-script/internal/models"
	"savory-script/internal/utils"

	"github.com/lib/pq"
)

func (db *Db) CreateRecipe(author_id int, recipe DbRecipe) (int, error) {
	sqlStatement := `
	WITH insert_recipe AS (
		INSERT INTO recipes (
			author_id, name, description
		) VALUES (
			$1, $2, $3
		) RETURNING id
	), insert_ingredients AS (
		INSERT INTO recipes_ingredients (
			recipe_id, ingredient_id, quantity
		) SELECT (SELECT id FROM insert_recipe), UNNEST($4::INTEGER[]), UNNEST($5::TEXT[])
	), insert_categories AS (
		INSERT INTO recipes_categories (
			recipe_id, category_id
		) SELECT (SELECT id FROM insert_recipe), UNNEST($6::INTEGER[])
	), insert_cuisines AS (
		INSERT INTO recipes_cuisines (
			recipe_id, cuisine_id
		) VALUES (
			(SELECT id FROM insert_recipe), $7
		)
	)
	SELECT id FROM insert_recipe;`

	var ingredient_ids []int
	var ingredient_quantities []string
	for pos := 0; pos < len(recipe.Ingredients); pos++ {
		ingredient_ids = append(ingredient_ids, recipe.Ingredients[pos].Id)
		ingredient_quantities = append(ingredient_quantities, recipe.Ingredients[pos].Quantity)
	}

	var id int
	err := db.db.QueryRow(sqlStatement,
		author_id,
		recipe.Name,
		recipe.Description,
		pq.Array(ingredient_ids),
		pq.Array(ingredient_quantities),
		pq.Array(recipe.Categories),
		recipe.Cuisine,
	).Scan(&id)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for recipes: %v", err)
		return id, err
	}

	utils.LogInfof(logTag, "Successfully added recipe")

	return id, nil
}

func (db *Db) GetRecipes(author_id int) ([]models.Recipe, error) {
	recipes := []models.Recipe{}

	sqlStatementSelectRecipes := `
	WITH select_recipes AS (
		SELECT id, name, description
		FROM recipes
		WHERE author_id = $1
	), 
	select_ingredients AS (
		SELECT
			recipe_id AS id,
			array_agg(ingredient_id) AS ingredients,
			array_agg(quantity) AS quantities
		FROM recipes_ingredients
		WHERE recipe_id = ANY(SELECT id FROM select_recipes)
		GROUP BY recipe_id
	), 
	select_recipes_categories AS (
		SELECT
			recipe_id AS id,
			array_agg(category_id) AS categories
		FROM recipes_categories
		WHERE recipe_id = ANY(SELECT id FROM select_recipes)
		GROUP BY recipe_id
	)
	SELECT
		sr.id AS id,
		sr.name AS name,
		sr.description AS description,
		si.ingredients AS ingredients,
		si.quantities AS quantities,
		src.categories AS categories,
		rc.cuisine_id AS cuisine_id,
		(SELECT name FROM cuisines WHERE id = rc.cuisine_id) AS cuisine_name
	FROM select_recipes AS sr
	LEFT JOIN select_ingredients AS si ON sr.id = si.id
	LEFT JOIN select_recipes_categories AS src ON sr.id = src.id
	LEFT JOIN recipes_cuisines AS rc ON sr.id = rc.recipe_id;
	`

	sqlStatementSelectIngredients := `
	SELECT id, name
	FROM ingredients
	WHERE id = ANY($1::INTEGER[]);
	`

	sqlStatementSelectCategories := `
	SELECT id, name
	FROM categories
	WHERE id = ANY($1::INTEGER[]);
	`

	// get recipes list
	recipes_from_db, err := db.db.Query(sqlStatementSelectRecipes, author_id)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for selecting recipes: %v", err)
		return nil, err
	}

	var ingredient_ids []int
	var category_ids []int

	for recipes_from_db.Next() {
		var ingredient_ids_for_recipe pq.Int64Array
		var ingredient_quantities_for_recipe pq.StringArray
		var category_ids_for_recipe pq.Int64Array
		recipe := models.Recipe{}
		err := recipes_from_db.Scan(
			&recipe.Id,
			&recipe.Name,
			&recipe.Description,
			&ingredient_ids_for_recipe,
			&ingredient_quantities_for_recipe,
			&category_ids_for_recipe,
			&recipe.Cuisine.Id,
			&recipe.Cuisine.Name,
		)
		if err != nil {
			utils.LogErrorf(logTag, "Error executing query for selecting recipes: %v", err)
			return nil, err
		}

		if len([]int64(ingredient_ids_for_recipe)) != len([]string(ingredient_quantities_for_recipe)) {
			utils.LogErrorf(logTag, "Error executing query for selecting recipes: %v", err)
			return nil, errors.New("fatal: undefined response from pg: len(ingredient_ids) != len(ingredient_quantities)")
		}

		var ingredients []models.Ingredient
		for i := 0; i < len([]int64(ingredient_ids_for_recipe)); i++ {
			ingredient := models.Ingredient{
				Id:       int([]int64(ingredient_ids_for_recipe)[i]),
				Quantity: []string(ingredient_quantities_for_recipe)[i],
			}
			ingredient_ids = append(ingredient_ids, int([]int64(ingredient_ids_for_recipe)[i]))
			category_ids = append(category_ids, int([]int64(category_ids_for_recipe)[i]))
			ingredients = append(ingredients, ingredient)
		}

		recipe.Ingredients = ingredients

		var categories []models.Category
		for i := 0; i < len([]int64(category_ids_for_recipe)); i++ {
			category := models.Category{
				Id: int([]int64(category_ids_for_recipe)[i]),
			}
			categories = append(categories, category)
		}

		recipe.Categories = categories
		recipes = append(recipes, recipe)
	}

	// get ingredients data
	ingredients_from_db, err := db.db.Query(sqlStatementSelectIngredients, pq.Array(ingredient_ids))
	if err != nil {
		utils.LogErrorf(logTag, "4 Error executing query for selecting recipe ingredients: %v", err)
		return nil, err
	}

	ingredients_map := make(map[int]models.Ingredient)
	for ingredients_from_db.Next() {
		ingredient := models.Ingredient{}
		err := ingredients_from_db.Scan(
			&ingredient.Id,
			&ingredient.Name,
		)
		if err != nil {
			utils.LogErrorf(logTag, "5 Error executing query for selecting recipes: %v", err)
			return nil, err
		}

		ingredients_map[ingredient.Id] = ingredient
	}

	// get categories data
	categories_from_db, err := db.db.Query(sqlStatementSelectCategories, pq.Array(category_ids))
	if err != nil {
		utils.LogErrorf(logTag, "6 Error executing query for selecting recipe categories: %v", err)
		return nil, err
	}

	categories_map := make(map[int]models.Category)
	for categories_from_db.Next() {
		category := models.Category{}
		err := categories_from_db.Scan(
			&category.Id,
			&category.Name,
		)
		if err != nil {
			utils.LogErrorf(logTag, "7 Error executing query for selecting recipes: %v", err)
			return nil, err
		}
		categories_map[category.Id] = category
	}

	// update data in recipes
	for i := 0; i < len(recipes); i++ {
		for j := 0; j < len(recipes[i].Ingredients); j++ {
			recipes[i].Ingredients[j].Name = ingredients_map[recipes[i].Ingredients[j].Id].Name
		}
		for j := 0; j < len(recipes[i].Categories); j++ {
			recipes[i].Categories[j].Name = categories_map[recipes[i].Categories[j].Id].Name
		}
	}

	return recipes, nil
}

func (db *Db) GetRecipeById(id int) (models.Recipe, error) {
	recipe := models.Recipe{}

	sqlStatementSelectRecipes := `
	SELECT
	 r.id AS id,
	 r.name AS name,
	 r.description AS description
	FROM recipes
	WHERE id = $1;
	`

	sqlStatementSelectIngredients := `
	WITH select_ids AS (
	 SELECT
	  ingredient_id,
	  quantity
	 FROM recipes_ingredients
	 WHERE recipe_id = $1
	)
	SELECT ingredients.id AS id, ingredients.name AS name, select_ids.quantity AS quantity
	FROM ingredients
	INNER JOIN select_ids ON select_ids.ingredient_id = ingredients.id;
	`

	sqlStatementSelectCategories := `
	WITH select_ids AS (
	 SELECT
	  category_id
	 FROM recipes_categories
	 WHERE recipe_id = $1
	)
	SELECT categories.id AS id, categories.name AS name
	FROM categories
	INNER JOIN select_ids ON select_ids.category_id = categories.id;
	`

	// get recipe
	err := db.db.QueryRow(sqlStatementSelectRecipes, id).Scan(&recipe.Id, &recipe.Name, &recipe.Description)
	if err != nil {
		utils.LogErrorf(logTag, "Error executing query for selecting recipe: %v", err)
		return recipe, err
	}

	// get ingredients
	ingredients_from_db, err := db.db.Query(sqlStatementSelectIngredients, id)
	if err != nil {
		utils.LogErrorf(logTag, "4 Error executing query for selecting recipe ingredients: %v", err)
		return recipe, err
	}

	for ingredients_from_db.Next() {
		ingredient := models.Ingredient{}
		err := ingredients_from_db.Scan(
			&ingredient.Id,
			&ingredient.Name,
		)
		if err != nil {
			utils.LogErrorf(logTag, "5 Error executing query for selecting recipes: %v", err)
			return recipe, err
		}

		recipe.Ingredients = append(recipe.Ingredients, ingredient)
	}

	// get categories data
	categories_from_db, err := db.db.Query(sqlStatementSelectCategories, id)
	if err != nil {
		utils.LogErrorf(logTag, "6 Error executing query for selecting recipe categories: %v", err)
		return recipe, err
	}

	for categories_from_db.Next() {
		category := models.Category{}
		err := categories_from_db.Scan(
			&category.Id,
			&category.Name,
		)
		if err != nil {
			utils.LogErrorf(logTag, "7 Error executing query for selecting recipes: %v", err)
			return recipe, err
		}
		recipe.Categories = append(recipe.Categories, category)
	}

	return recipe, nil
}
