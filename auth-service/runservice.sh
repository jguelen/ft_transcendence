#!/bin/sh

clear
export USER_SERVICE_URL="http://localhost:3002"
export JWT_SECRET="your_jwt_secret_key_change_this_in_production"
export PORT="3001"
node index.js
