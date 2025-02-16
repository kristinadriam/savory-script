# MongoDB Benchmarking Utility

## что тестируется

утилита выполняет тестирование через следующие операции:

1. **вставка (insert):** вставляет указанное количество документов в коллекцию MongoDB.
2. **чтение (query):** выполняет поиск по документам с использованием случайно выбранных критериев.
3. **обновление (update):** изменяет значение одного из полей для случайно выбранных документов.
4. **удаление (delete):** удаляет документы по критерию случайно выбранных значений.

## как настраивать скрипт

количество вставок, запросов, обновлений и удалений, выполняемых во время теста, можно настроить в переменных `numInserts`, `numQueries`, `numUpdates` и `numDeletes`.

```js
const numInserts = 1000;
const numQueries = 1000;
const numUpdates = 500;
const numDeletes = 300;
```

также можно задать таймаут в миллисекундах для каждой операции. это гарантирует, что скрипт завершает выполнение, если операция занимает слишком много времени.

```js
const insertOperationTimeout = 1000;
const queryOperationTimeout = 1000;
const updateOperationTimeout = 1000;
const deleteOperationTimeout = 1000;
```

## результаты тестирования

результаты выполнения будут записаны в файл по пути `/results/mongobench_results.txt`. в них будет представлено время выполнения каждой из тестируемых операций, по которому можно определить проиводительность MongoDB в проекте.
