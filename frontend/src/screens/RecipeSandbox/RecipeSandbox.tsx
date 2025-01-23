import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import DynamicButton from '../../components/models/DinamicButton';
import Button from '../../components/models/Button';

const parseCuisine = (data: string): number => {
    const id = parseInt(data, 10);
    if (id != null) {
        return id;
    }
    return 1;
}

const parseIngredients = (data: string): IngredientDb[] => {
    const items = data.split(/,\s*/);

    const ingredients: IngredientDb[] = [];

    for (let i = 0; i < items.length; i += 2) {
        const id = parseInt(items[i], 10);

        const quantity = items[i + 1].slice(1, -1);

        if (id != null) {
            ingredients.push({ id, quantity });
        }
    }

    return ingredients;
};


const parseCategories = (data: string): number[] => {
    const items = data.split(/,\s*/);
    return items.map(item => parseInt(item, 10));
};


interface AllRecipesProps {
    onClickAll: () => void;
    onClickCreate: () => void;
}

interface RecipeDb {
    name: string;
    description: string;
    ingredients: IngredientDb[];
    categories: number[];
    cuisine: number;
}

interface IngredientDb {
    id: number;
    quantity: string;
}

interface Ingredient {
    id: number;
    name: string;
    quantity: string;
}

interface Category {
    id: number;
    name: string;
}

interface Cuisine {
    id: number;
    name: string;
}

interface CuisineName {
    name: string;
}

interface CategoryName {
    name: string;
}

interface IngredientName {
    name: string;
}

function createRecipeEntity(
    name: string,
    description: string,
    ingredients: IngredientDb[],
    categories: number[],
    cuisine: number
): RecipeDb {
    return {
        name,
        description,
        ingredients,
        categories,
        cuisine
    };
}


function createCuisineName(name: string): CuisineName {
    return { name };
}

function createCategoryName(name: string): CategoryName {
    return { name };
}

function createIngredientName(name: string): IngredientName {
    return { name };
}

interface Category {
    id: number;
    name: string;
}

interface Ingredient {
    id: number;
    name: string;
}

const RecipeSandbox: React.FC<AllRecipesProps> = ({ onClickAll, onClickCreate }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [enteredIngredients, setEnteredIngredients] = useState<string>('');
    const [enteredCategories, setEnteredCategories] = useState<string>('');
    const [enteredCuisine, setEnteredCuisine] = useState<string>('');
    const [cuisines, setCuisines] = useState<Cuisine[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const handleNameChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setName(event.nativeEvent.text);
    };

    const handleDescriptionChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setDescription(event.nativeEvent.text);
    };

    const handleEnteredIngredientsChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEnteredIngredients(event.nativeEvent.text);
    };

    const handleEnteredCategoriesChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEnteredCategories(event.nativeEvent.text);
    };

    const handleEnteredCuisineChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEnteredCuisine(event.nativeEvent.text);
    };

    const [category, setCategory] = useState('');

    const handleCategoryChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setCategory(event.nativeEvent.text);
    };

    const [cuisine, setCuisine] = useState('');

    const handleCuisineChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setCuisine(event.nativeEvent.text);
    };

    const [ingredient, setIngredient] = useState('');

    const handleIngredientChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setIngredient(event.nativeEvent.text);
    };

    console.log('Received response:');
    useEffect(() => {
        const fetchCuisines = async () => {
            try {
                const response = await fetch('http://localhost:8060/internal/v1/get-cuisines', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setCuisines(data.cuisines);
            } catch (error) {
                console.error('Error fetching cuisines:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8060/internal/v1/get-categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://localhost:8060/internal/v1/get-ingredients', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setIngredients(data.ingredients);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchCuisines();
        fetchCategories();
        fetchIngredients();
    }, []);

    const createRecipe = async (recipe: RecipeDb): Promise<void> => {
        await fetch('http://localhost:8060/internal/v1/create-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
    }


    const addCuisine = async (cuisineName: CuisineName): Promise<void> => {
        const response = await fetch('http://localhost:8060/internal/v1/add-cuisine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cuisineName),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    const addCategory = async (categoryName: CategoryName): Promise<void> => {
        const response = await fetch('http://localhost:8060/internal/v1/add-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryName),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    const addIngredient = async (ingredientName: IngredientName): Promise<void> => {
        const response = await fetch('http://localhost:8060/internal/v1/add-ingredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredientName),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    return (
        <View style={styles.main}>
            <View style={styles.buttonContainer}>
                <DynamicButton
                    name="home"
                    onClick={onClickAll}
                    isPressedOnStart={false}
                />
                <DynamicButton
                    name="sandbox"
                    onClick={onClickCreate}
                    isPressedOnStart={true}
                />
            </View>
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <View style={styles.columnContainer}>
                        <Text style={styles.ttitle}>{"Recipe creation"}</Text>
                        <Text style={styles.title}>{"Name"}</Text>
                        <TextInput
                            value={name}
                            style={styles.textInput}
                            placeholder="For example, «Mega vkusnie syrniki»"
                            placeholderTextColor={"#b8b5af"}
                            onChange={handleNameChange}
                        />

                        <Text style={styles.title}>{"Description"}</Text>
                        <TextInput
                            value={description}
                            style={styles.textInputBig}
                            multiline={true}
                            placeholder="For example, «1. Buy in Yandex Lavka or Yandex Eats. 2. You're great.»"
                            placeholderTextColor={"#b8b5af"}
                            onChange={handleDescriptionChange}
                        />
                        <Text style={styles.title}>{"Ingredients"}</Text>
                        <TextInput
                            value={enteredIngredients}
                            style={styles.textInput}
                            placeholder="For example, «number from list, measurent (1, 200 kg, 4, 382 gr)»"
                            placeholderTextColor={"#b8b5af"}
                            onChange={handleEnteredIngredientsChange}
                        />

                        <Text style={styles.title}>{"Cuisine"}</Text>
                        <TextInput
                            value={enteredCuisine}
                            style={styles.textInput}
                            placeholder="For example, «number from list (12)»"
                            placeholderTextColor={"#b8b5af"}
                            onChange={handleEnteredCuisineChange}
                        />
                        <Text style={styles.title}>{"Categories"}</Text>
                        <TextInput
                            value={enteredCategories}
                            style={styles.textInput}
                            placeholder="For example, «numbers from list (3, 5, 16)»"
                            placeholderTextColor={"#b8b5af"}
                            onChange={handleEnteredCategoriesChange}
                        />
                        <TouchableOpacity
                            style={styles.pressedButton}
                            onPress={() => {
                                var recipeName = name
                                setName('')
                                var recipeDescription = description
                                setDescription('')
                                var recipeIngredients = enteredIngredients
                                setEnteredIngredients('')
                                var recipeCategories = enteredCategories
                                setEnteredCategories('')
                                var recipeCuisine = enteredCuisine
                                setEnteredCuisine('')
                                var result = createRecipe(createRecipeEntity(
                                    recipeName,
                                    recipeDescription,
                                    parseIngredients(recipeIngredients),
                                    parseCategories(recipeCategories),
                                    parseCuisine(recipeCuisine)
                                )
                                )
                                return result
                            }}
                        >
                            <Text
                                style={styles.pressedButtonText}>
                                {"create"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.border}>
                        <Text style={styles.containerTitle}>{"Categories"}</Text>
                        <View style={styles.scrollableList}>
                            {categories.map(category => (
                                <Text
                                    key={category.id}
                                    style={styles.text}>
                                    {`${category.id}. ${category.name}`}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.bigContainer}>
                            <TextInput
                                value={category}
                                style={styles.sectionInput}
                                placeholder="For example, «Lunches»"
                                placeholderTextColor={"#b8b5af"}
                                onChange={handleCategoryChange}
                            />
                            <Button
                                onClick={() => {
                                    var result = addCategory(createCategoryName(category))
                                    setCategory('')
                                    return result
                                }}
                                name="add"
                                height={30}
                            />
                        </View>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.border}>
                        <Text style={styles.containerTitle}>{"Cuisines"}</Text>
                        <View style={styles.scrollableList}>
                            {cuisines.map(cuisine => (
                                <Text
                                    key={cuisine.id}
                                    style={styles.text}>
                                    {`${cuisine.id}. ${cuisine.name}`}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.bigContainer}>
                            <TextInput
                                value={cuisine}
                                style={styles.sectionInput}
                                placeholder="For example, «Asian»"
                                placeholderTextColor={"#b8b5af"}
                                onChange={handleCuisineChange}
                            />
                            <Button
                                onClick={() => {
                                    var result = addCuisine(createCuisineName(cuisine))
                                    setCuisine('')
                                    return result
                                }}
                                name="add"
                                height={30}
                            />
                        </View>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.border}>
                        <Text style={styles.containerTitle}>{"Ingredients"}</Text>
                        <View style={styles.scrollableList}>
                            {ingredients.map(ingredient => (
                                <Text
                                    key={ingredient.id}
                                    style={styles.text}>
                                    {`${ingredient.id}. ${ingredient.name}`}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.bigContainer}>
                            <TextInput
                                value={ingredient}
                                style={styles.sectionInput}
                                placeholder="For example, «Lunches»"
                                placeholderTextColor={"#b8b5af"}
                                onChange={handleIngredientChange}
                            />
                            <Button
                                onClick={() => {
                                    var result = addIngredient(createIngredientName(ingredient))
                                    setIngredient('')
                                    return result
                                }}
                                name="add"
                                height={30}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    pressedButton: {
        marginRight: 'auto',
        backgroundColor: '#BABDE2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#BABDE2',
    },
    pressedButtonText: {
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFCF5',
    },
    divider: {
        height: 0,
        marginTop: 15,
    },
    scrollableList: {
        width: 300,
        height: 200,
        marginBottom: 10,
        overflow: 'scroll',
        padding: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    border: {
        padding: 15,
        borderColor: '#808bbc',
        borderWidth: 1,
        borderRadius: 15,
    },
    bigContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    leftColumn: {
        flex: 0.7
    },
    leftButton: {
        marginLeft: 'auto'
    },
    rightColumn: {
        flex: 0.3
    },
    buttonContainer: {
        gap: 10,
        marginTop: 10,
        margin: 10,
        zIndex: 1,
        display: 'flex',
        padding: 10,
        flexDirection: 'row',
    },
    ttitle: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374375',
        marginBottom: 20
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374375',
        marginBottom: 10
    },
    containerTitle: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#374375'
    },
    text: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#374375',
        marginLeft: 10,
        marginBottom: 5
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        textAlign: 'center',
        color: '#708090',
    },
    main: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    texts: {
        textAlign: 'center',
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        flex: 1,
    },
    sectionInput: {
        fontFamily: 'Montserrat',
        padding: 10,
        height: 30,
        marginRight: 15,
        width: '80%',
        borderWidth: 1,
        borderColor: '#e4e1db',
        borderRadius: 15,
        backgroundColor: '#f2efe9',
    },
    textInput: {
        fontFamily: 'Montserrat',
        marginBottom: 20,
        padding: 10,
        width: '80%',
        borderWidth: 1,
        borderColor: '#e4e1db',
        borderRadius: 15,
        backgroundColor: '#f2efe9',
    },
    textInputBig: {
        fontFamily: 'Montserrat',
        marginBottom: 20,
        padding: 10,
        width: '80%',
        borderWidth: 1,
        borderColor: '#e4e1db',
        borderRadius: 15,
        backgroundColor: '#f2efe9',
        minHeight: 100,
    },
    inputFields: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    findButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        color: '#895159',
    },
});

export default RecipeSandbox;