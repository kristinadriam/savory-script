FROM python:3.8-slim

WORKDIR /app

COPY . /app/

RUN pip install --no-cache-dir psycopg2-binary python-dotenv --break-system-packages

RUN chmod +x /app/insert_to_db.py

CMD ["python3", "/app/insert_to_db.py"]