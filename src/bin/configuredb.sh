#!/bin/bash
source .env

user=$PG_USER
password=$PG_PASSWORD
database=$PG_DATABASE

echo "Configuring database: $database"

dropdb -U $user $database
createdb -U $user $database

psql -U $user $database < ./src/bin/sql/filmbase.sql

echo "$database configured"