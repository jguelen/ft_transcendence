#!/bin/sh

clear
export USER_SERVICE_URL="http://localhost:3002"
export PORT="3001"
. ../.env
export GITHUB_OAUTH_ID
export GITHUB_OAUTH_SECRET
export API_PASSPHRASE
export JWT_SECRET
node index.js
