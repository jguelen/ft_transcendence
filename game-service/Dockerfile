FROM node:20-alpine

# WORKDIR .

# COPY package.json .
# RUN npm init
COPY . .
RUN npm install


EXPOSE 3000

ENTRYPOINT ["node", "game_file/server.js"]