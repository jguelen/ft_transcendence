#!/bin/sh

clear
export DATABASE_URL="file:./users_db.db"
export AUTH_SERVICE_URL="http://localhost:3001"
export PORT="3002"
. ../.env
export API_PASSPHRASE
export JWT_SECRET
node index.js
