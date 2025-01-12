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
host = os.getenv("BACKEND_DB_HOST")
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


def insert_items_to_db(items, table_name):
    """Inserting items into a table."""
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        cursor = connection.cursor()

        item_insert_query = f"INSERT INTO {table_name} (name) VALUES (%s)"
        for item in items:
            cursor.execute(item_insert_query, (item,))

        connection.commit()

        logging.info("Categories successfully added to database.")

    except Exception as error:
        print(f"Error inserting into {table_name}: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()


if __name__ == "__main__":
    create_tables()

    categories = read_file("data/categories.txt")
    cuisines = read_file("data/cuisines.txt")
    ingredients = read_file("data/ingredients.txt")

    insert_items_to_db(categories, "categories")
    insert_items_to_db(cuisines, "cuisines")
    insert_items_to_db(ingredients, "ingredients")

    logging.info("Script execution completed.")
