# Dockerfile for Spark
FROM bitnami/spark:3.4.0

# Install Kafka dependencies for Spark
USER root
RUN apt-get update && apt-get install -y wget \
    && wget https://repo1.maven.org/maven2/org/apache/spark/spark-sql-kafka-0-10_2.12/3.4.0/spark-sql-kafka-0-10_2.12-3.4.0.jar \
    && wget https://repo1.maven.org/maven2/org/apache/spark/spark-token-provider-kafka-0-10_2.12/3.4.0/spark-token-provider-kafka-0-10_2.12-3.4.0.jar \
    && mv spark-sql-kafka-0-10_2.12-3.4.0.jar /opt/bitnami/spark/jars/ \
    && mv spark-token-provider-kafka-0-10_2.12-3.4.0.jar /opt/bitnami/spark/jars/

# Set Spark as the main user
USER 1001