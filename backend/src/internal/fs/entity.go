package fs

type OperationType int

const (
	AddCategory OperationType = iota
	AddCuisine
	AddIngredient
	AddRecipe
)

func (t OperationType) String() string {
	switch t {
	case AddCategory:
		return "add-category"
	case AddCuisine:
		return "add-cuisine"
	case AddIngredient:
		return "add-ingredient"
	case AddRecipe:
		return "add-recipe"
	default:
		return "Invalid type"
	}
}

type Entity struct {
	OperationType string `json:"type"`
	JsonBody      string `json:"recipe"`
}

type Entities struct {
	Entities []Entity `json:"entities"`
}

func NewEntity(jsonBody string, operationType OperationType) Entity {
	return Entity{
		OperationType: operationType.String(),
		JsonBody:      jsonBody,
	}
}
