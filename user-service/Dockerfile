FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY schema.prisma ./

RUN npx prisma generate

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]
