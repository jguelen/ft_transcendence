#!/bin/sh

clear
. ../.env
export JWT_SECRET
node index.js
