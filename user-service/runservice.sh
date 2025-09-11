#!/bin/sh

clear
export DATABASE_URL="file:./users_db.db"
export AUTH_SERVICE_URL="http://localhost:3001"
export JWT_SECRET="your_jwt_secret_key_change_this_in_production"
export PORT="3002"
node index.js
