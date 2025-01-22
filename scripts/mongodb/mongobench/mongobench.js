const fs = require('fs');
const { MongoClient } = require('mongodb');

const resultFilePath = '/results/mongobench_results.txt';

function clearFile() {
    fs.writeFileSync(resultFilePath, '', 'utf8');
}

function writeToFile(content) {
    console.log(content);
    fs.appendFileSync(resultFilePath, content + '\n', 'utf8');
}

function runWithTimeout(promise, timeout, operationName) {
    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(`${operationName} operation timed out`)), timeout);
    });
    return Promise.race([promise, timeoutPromise])
        .finally(() => clearTimeout(timeoutHandle));
}

function getElapsedTime(startTime) {
    const diff = process.hrtime(startTime);
    return (diff[0] * 1e9 + diff[1]) / 1e6;
}

async function main() {
    clearFile();

    const url = 'mongodb://mongodb:27017';
    const client = new MongoClient(url);

    try {
        console.time('MongoDB Connection');
        await client.connect();
        console.timeEnd('MongoDB Connection');

        writeToFile("Connected to MongoDB");

        const db = client.db('testdb');
        const collection = db.collection('testcollection');

        const numInserts = 1000;
        const numQueries = 1000;
        const numUpdates = 500;
        const numDeletes = 300;

        const insertOperationTimeout = 1000;
        const queryOperationTimeout = 1000;
        const updateOperationTimeout = 1000;
        const deleteOperationTimeout = 1000;

        writeToFile("Starting benchmark...");

        const benchmarkStart = process.hrtime();

        const insertStart = process.hrtime();
        let insertPromises = [];
        for (let i = 0; i < numInserts; i++) {
            const promise = collection.insertOne({ name: `Name${i}`, value: i });
            insertPromises.push(runWithTimeout(promise, insertOperationTimeout, "Insert"));
        }
        await Promise.all(insertPromises);
        const insertTime = getElapsedTime(insertStart);
        writeToFile(`Insert operations completed in ${insertTime}ms`);

        const queryStart = process.hrtime();
        let queryPromises = [];
        for (let i = 0; i < numQueries; i++) {
            const randomIndex = Math.floor(Math.random() * numInserts);
            const promise = collection.findOne({ name: `Name${randomIndex}` });
            queryPromises.push(runWithTimeout(promise, queryOperationTimeout, "Query"));
        }
        await Promise.all(queryPromises);
        const queryTime = getElapsedTime(queryStart);
        writeToFile(`Query operations completed in ${queryTime}ms`);

        const updateStart = process.hrtime();
        let updatePromises = [];
        for (let i = 0; i < numUpdates; i++) {
            const randomIndex = Math.floor(Math.random() * numInserts);
            const promise = collection.updateOne(
                { name: `Name${randomIndex}` },
                { $set: { value: Math.random() } }
            );
            updatePromises.push(runWithTimeout(promise, updateOperationTimeout, "Update"));
        }
        await Promise.all(updatePromises);
        const updateTime = getElapsedTime(updateStart);
        writeToFile(`Update operations completed in ${updateTime}ms`);

        const deleteStart = process.hrtime();
        let deletePromises = [];
        for (let i = 0; i < numDeletes; i++) {
            const randomIndex = Math.floor(Math.random() * numInserts);
            const promise = collection.deleteOne({ name: `Name${randomIndex}` });
            deletePromises.push(runWithTimeout(promise, deleteOperationTimeout, "Delete"));
        }
        await Promise.all(deletePromises);
        const deleteTime = getElapsedTime(deleteStart);
        writeToFile(`Delete operations completed in ${deleteTime}ms`);

        const totalBenchmarkTime = getElapsedTime(benchmarkStart);
        writeToFile(`Benchmark completed successfully in ${totalBenchmarkTime.toFixed(2)} ms`);
    } catch (error) {
        writeToFile("An error occurred while benchmarking MongoDB: " + error);
        throw error;
    } finally {
        await client.close();
    }
}

main().catch(error => {
    writeToFile("An error occurred in the main function: " + error);
    process.exit(1);
});
