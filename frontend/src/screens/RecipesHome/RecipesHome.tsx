import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DynamicButton from '../../components/models/DinamicButton';
import RecipeList from './RecipesList';
import { Recipe } from './types';

interface RecipesHomeProps {
    onClickHome: () => void;
    onClickSandbox: () => void;
}

const RecipesHome: React.FC<RecipesHomeProps> = ({ onClickHome: onClickAll, onClickSandbox: onClickCreate }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:8060/internal/v1/get-recipes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setRecipes(data.recipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <View style={styles.main}>
            <View style={styles.buttonContainer}>
                <DynamicButton
                    name="home"
                    onClick={onClickAll}
                    isPressedOnStart={true}
                />
                <DynamicButton
                    name="sandbox"
                    onClick={onClickCreate}
                    isPressedOnStart={false}
                />
            </View>
            <RecipeList recipes={recipes} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        gap: 10,
        zIndex: 1,
        display: 'flex',
        padding: 10,
        flexDirection: 'row',
    },
    main: {
        width: '100%',
        flex: 1,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
});

export default RecipesHome;
