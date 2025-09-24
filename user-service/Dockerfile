FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY schema.prisma ./

RUN npm install

# RUN npx prisma generate
# RUN npx prisma migrate deploy


COPY . .

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app ./prisma
COPY --from=builder /app . 

EXPOSE 3002

# CMD [ "node", "index.js" ]
COPY entrypoint.sh ./
CMD ["./entrypoint.sh"]
