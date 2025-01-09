import psycopg2
from dotenv import load_dotenv
import os
import logging


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

load_dotenv()

dbname = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = "db"
port = os.getenv("DB_PORT")


def create_tables():
    """Creating the necessary tables in the database."""
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        cursor = connection.cursor()

        create_tables_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS ingredients (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS cuisines (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS recipes (
            id SERIAL PRIMARY KEY,
            author_id INTEGER REFERENCES users(id),
            name TEXT NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS recipes_ingredients (
            recipe_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            unit VARCHAR(20) DEFAULT 'piece',
            PRIMARY KEY (recipe_id, ingredient_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes(id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
        );
        CREATE TABLE IF NOT EXISTS recipes_categories (
            recipe_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (recipe_id, category_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );
        CREATE TABLE IF NOT EXISTS recipes_cuisines (
            recipe_id INTEGER NOT NULL,
            cuisine_id INTEGER NOT NULL,
            PRIMARY KEY (recipe_id, cuisine_id),
            FOREIGN KEY (recipe_id) REFERENCES recipes(id),
            FOREIGN KEY (cuisine_id) REFERENCES cuisines(id)
        );
        """
        cursor.execute(create_tables_query)
        connection.commit()

        logging.info("Tables created successfully or already exist.")

    except Exception as error:
        print(f"Error creating tables: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()


def read_file(file_path):
    """Read a file and return a list of lines."""
    with open(file_path, "r") as file:
        lines = [line.strip() for line in file if line.strip()]
    return lines


def insert_ingredients_to_db(ingredients):
    """Inserting ingredients into a table."""
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        cursor = connection.cursor()

        ingredient_insert_query = "INSERT INTO ingredients (name) VALUES (%s)"
        for ingredient in ingredients:
            cursor.execute(ingredient_insert_query, (ingredient,))

        connection.commit()

        logging.info("Ingredients successfully added to database.")

    except Exception as error:
        print(f"Error inserting ingredients: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()


def insert_cuisines_to_db(cuisines):
    """Inserting cuisines into a table."""
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        cursor = connection.cursor()

        cuisine_insert_query = "INSERT INTO cuisines (name) VALUES (%s)"
        for cuisine in cuisines:
            cursor.execute(cuisine_insert_query, (cuisine,))

        connection.commit()

        logging.info("Cuisines successfully added to database.")

    except Exception as error:
        print(f"Error inserting cuisines: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()


if __name__ == "__main__":
    create_tables()

    ingredients = read_file("data/ingredients.txt")
    cuisines = read_file("data/cuisines.txt")

    insert_ingredients_to_db(ingredients)
    insert_cuisines_to_db(cuisines)

    logging.info("Script execution completed.")
