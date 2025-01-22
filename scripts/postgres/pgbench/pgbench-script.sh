#!/bin/bash

exec 3>&1   

exec > /results/pgbench_results.txt 2>&1

echo "pgbench script started" >&3

sleep 5

if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ] || [ -z "$PGBENCH_DB_HOST" ] || [ -z "$DB_PORT" ]; then
  echo "One or more required environment variables are missing: DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT."
  exit 1
fi

export PGPASSWORD=$DB_PASSWORD

INITIAL_SCALE=${INITIAL_SCALE:-1}
SCALE_STEP=${SCALE_STEP:-1}
MAX_SCALE=${MAX_SCALE:-10}

INITIAL_TRANSACTIONS=${INITIAL_TRANSACTIONS:-10}
TRANSACTION_STEP=${TRANSACTION_STEP:-10}
MAX_TRANSACTIONS=${MAX_TRANSACTIONS:-100}

INITIAL_CLIENTS=${INITIAL_CLIENTS:-1}
CLIENT_STEP=${CLIENT_STEP:-1}
MAX_CLIENTS=${MAX_CLIENTS:-10}

MAX_LATENCY=${MAX_LATENCY:-100}

TEST_COUNT=1
FAILED_TEST_COUNT=0
TEMP_FILE=$(mktemp)

for (( scale=$INITIAL_SCALE; scale<=$MAX_SCALE; scale+=$SCALE_STEP ))
do
  for (( transactions=$INITIAL_TRANSACTIONS; transactions<=$MAX_TRANSACTIONS; transactions+=$TRANSACTION_STEP ))
  do
    for (( clients=$INITIAL_CLIENTS; clients<=$MAX_CLIENTS; clients+=$CLIENT_STEP ))
    do
        if [ "$clients" -lt 1 ]; then
          echo "Number of clients must be at least 1."
          exit 1
        fi
        
        echo "=================================================="
        echo "TEST $TEST_COUNT: SCALE=$scale, TRANSACTIONS=$transactions, CLIENTS=$clients"
        echo "=================================================="

        if ! pgbench -i -s $scale -h $PGBENCH_DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > /dev/null 2>&1; then
          echo "Error initializing database with pgbench."
          exit 1
        fi

        if pgbench -c $clients -j $clients -t $transactions -h $PGBENCH_DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $TEMP_FILE 2>&1; then
            TPS=$(awk '/tps =/{print $3}' $TEMP_FILE)
            LATENCY=$(awk '/latency average =/{print $4}' $TEMP_FILE)

            if [ -n "$TPS" ]; then
                echo "TPS=$TPS, AVG LATENCY=$LATENCY ms"

                if (( $(echo "$LATENCY > $MAX_LATENCY" | bc -l) )); then
                    echo "ERROR: Latency $LATENCY ms exceeds maximum allowed latency of $MAX_LATENCY ms."
                    rm -f $TEMP_FILE
                    ((FAILED_TEST_COUNT++))
                fi
            else
                echo "ERROR: TPS not found"
                ((FAILED_TEST_COUNT++))
            fi
        else
            echo "ERROR: pgbench failed with the following output:"
            cat $TEMP_FILE
            rm -f $TEMP_FILE
            ((FAILED_TEST_COUNT++))
        fi
        echo ""

        > $TEMP_FILE

        ((TEST_COUNT++))
    done
  done
done

rm -f $TEMP_FILE

echo "Total failed tests: $FAILED_TEST_COUNT / $TEST_COUNT"

echo "pgbench script finished" >&3

exit $FAILED_TEST_COUNT