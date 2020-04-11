#!/bin/sh
if [[ ${NODE_ENV} = production ]]; then
    echo "Starting production environment"
    npm run dev
else
    /app/scripts/wait-for-postgres.sh postgres:5432 -t 25
    echo "> Running migration"
    npm run migrate
    echo "> Running seeder"
    npm run seed
    echo "> Starting the node environment"
    npm run dev
fi

