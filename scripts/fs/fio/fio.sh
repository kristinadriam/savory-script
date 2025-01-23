#!/bin/bash

set -e

if [ -f .env ]; then
    source .env
else
    echo ".env file not found! Script stopped."
    exit 1
fi

exec 3>&1   

exec > /results/fio_results.txt 2>&1

echo "fio script started" >&3

mkdir -p $LOG_DIR

BLOCK_SIZES=("64k" "128k" "256k" "512k")

escape_sed() {
    echo "$1" | sed 's/[\/&]/\\&/g'
}

for BLOCK_SIZE in "${BLOCK_SIZES[@]}"; do
    TEMP_FIO_FILE=$(mktemp)

    ESCAPED_LOG_DIR=$(escape_sed "$LOG_DIR")
    ESCAPED_BLOCK_SIZE=$(escape_sed "$BLOCK_SIZE")

    sed "s/\${BLOCK_SIZE}/$ESCAPED_BLOCK_SIZE/g; s/\${LOG_DIR}/$ESCAPED_LOG_DIR/g" "$CONFIG_FILE" > "$TEMP_FIO_FILE"

    echo "Running test with block size: $BLOCK_SIZE"

    fio "$TEMP_FIO_FILE"

    trap 'rm -f "$TEMP_FIO_FILE"' EXIT

    echo "Test completed for block size: $BLOCK_SIZE"
done

echo "fio script finished" >&3
