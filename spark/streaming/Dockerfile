FROM bitnami/spark:3.4.0

WORKDIR /app

COPY main.py /app/

CMD ["spark-submit", "--master", "spark://spark-master:7077", "--packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.4.0", "/app/main.py"]
