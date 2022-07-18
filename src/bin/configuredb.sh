#!/bin/bash
source .env

user=$PG_USER
password=$PG_PASSWORD
database=$PG_DATABASE

echo "Configuring database: $database"

if [ $ENV != "production" ]; then
    dropdb -U $user $database
    createdb -U $user $database
fi

psql -U $user $database < ./src/bin/sql/ddl.sql

if [ $ENV != "production" ]; then
    psql -U $user $database < ./src/bin/sql/filmbase.sql
fi

echo "$database configured"