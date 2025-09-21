FROM node:20-alpine

COPY . .
RUN npm install

EXPOSE 3003

ENTRYPOINT ["node", "files/server.js"]