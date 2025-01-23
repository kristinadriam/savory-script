export interface Category {
    id: number;
    name: string;
}
export interface Cuisine {
    id: number;
    name: string;
}

export interface Ingredient {
    id: number;
    name: string;
    quantity: string;
}

export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: Ingredient[];
    categories: Category[];
    cuisine: Cuisine;
}
