#!/bin/sh
set -e

DB_HOST="${DATABASE_HOST}"
DB_PORT="${DATABASE_PORT}"

echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
for i in $(seq 1 60); do
	if nc -z "$DB_HOST" "$DB_PORT"; then
		echo "Database is ready."
		break
	fi
	sleep 2
done

if ! nc -z "$DB_HOST" "$DB_PORT"; then
	echo "Database is still unavailable after waiting."
	exit 1
fi

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

exec "$@"
