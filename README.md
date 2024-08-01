## Installation

```bash
$ npm install
```

## Restore the database

```bash
# Create the database
$ psql -U postgres -h localhost -p 5433 -c "CREATE DATABASE racquet_store_db;"

# Restore database information
$ psql -U postgres -d racquet_store_db -h localhost -p 5433 -f racquet_store_db_plain.sql
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```