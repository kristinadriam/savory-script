from pyspark.sql import SparkSession
import os

os.environ['PYSPARK_SUBMIT_ARGS'] = '--packages org.apache.spark:spark-streaming-kafka-0-10_2.12:3.4.0,org.apache.spark:spark-sql-kafka-0-10_2.12:3.4.0 pyspark-shell'

def main():
    spark = SparkSession.builder \
                        .appName("NewFiles") \
                        .master("spark://localhost:7077") \
                        .getOrCreate()

    input_directory = "/fs/data"

    file_stream_df = spark.readStream.format("text").load(input_directory)

    query = (
        file_stream_df.writeStream
        .format("kafka")
        .option("kafka.bootstrap.servers", "kafka:9092")
        .option("topic", "new_entities")
        .option("checkpointLocation", "/app/checkpoints")
        .start()
    )

    query.awaitTermination()

if __name__ == "__main__":
    main()