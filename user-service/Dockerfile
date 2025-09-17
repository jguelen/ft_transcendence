# Étape 1: Installation des dépendances
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Étape 2: Construction de l'application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# On "construit" le client Prisma ici, car on a tout le code nécessaire
RUN npx prisma generate

# Étape 3: Image finale, optimisée pour la production
FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/schema.prisma ./schema.prisma
COPY --from=builder /app/index.js ./index.js

# On applique la migration, PUIS on lance le serveur.
CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]
