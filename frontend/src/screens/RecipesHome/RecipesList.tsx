import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recipe } from './types';

interface RecipeListProps {
    recipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
    return (
        <View style={styles.recipesContainer}>
            {
                recipes.map((recipe) => (
                    <View key={recipe.id} style={styles.recipe}>
                        <Text style={styles.recipeTitle}>{recipe.name}</Text>
                        <View style={styles.container}>
                            <Text style={styles.title}>Ingredients: </Text>
                            <Text style={styles.text}>{recipe.ingredients.map(ingredient => ingredient.name).join(', ')}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.title}>Categories: </Text>
                            <Text style={styles.text}>{recipe.categories.map(category => category.name).join(', ')}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.title}>Cuisine: </Text>
                            <Text style={styles.text}>{recipe.cuisine.name}</Text>
                        </View>
                        <Text style={styles.title}>Description:</Text>
                        <View style={styles.scrollableList}>
                            <Text style={styles.text}>{recipe.description}</Text>
                        </View>
                    </View>
                ))
            }
        </View >
    );
};

const styles = StyleSheet.create({
    recipesContainer: {
        width: '100%',
        gap: 10,
        marginTop: 10,
        margin: 10,
        zIndex: 1,
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'column',
    },
    recipe: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#e4e1db',
        borderRadius: 15,
        backgroundColor: '#f2efe9',
    },
    recipeTitle: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#374375'
    },
    container: {
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    title: {
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        fontSize: 16,
        marginBottom: 10,
        color: '#374375'
    },
    text: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#374375'
    },
    scrollableList: {
        marginLeft: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#bebcb7',
        backgroundColor: '#e9e7e3',
        width: '80%',
        height: 200,
        marginBottom: 10,
        overflow: 'scroll',
        padding: 10,
    },
});

export default RecipeList;