FROM node:20-alpine

WORKDIR /app

# Installation des dépendances minimales
COPY temp_package.json ./package.json
COPY temp_tsconfig.json ./tsconfig.json
RUN npm install

# Création des répertoires
RUN mkdir -p src
RUN mkdir -p data

# Copie du serveur temporaire
COPY src/temp_server.ts ./src/temp_server.ts

# Compilation
RUN npm run build

# Exposition du port du service
EXPOSE 3003

# Commande pour démarrer le service
CMD ["node", "dist/temp_server.js"]
