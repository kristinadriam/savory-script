from time import sleep
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


def insert_admin_to_users():
    """Inserting items into a table."""
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        cursor = connection.cursor()

        users_insert_query = "INSERT INTO users (name, email) VALUES (%s, %s)"
        cursor.execute(
            users_insert_query,
            (
                "admin",
                "admin@mail.ru",
            ),
        )

        connection.commit()

        logging.info("Categories successfully added to database.")

    except Exception as error:
        print(f"Error inserting into users: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()


if __name__ == "__main__":
    # todo: fix docker compose to start script after db init
    sleep(1)

    categories = read_file("data/categories.txt")
    cuisines = read_file("data/cuisines.txt")
    ingredients = read_file("data/ingredients.txt")

    insert_items_to_db(categories, "categories")
    insert_items_to_db(cuisines, "cuisines")
    insert_items_to_db(ingredients, "ingredients")

    insert_admin_to_users()

    logging.info("Script execution completed.")
