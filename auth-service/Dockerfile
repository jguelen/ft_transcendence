# frontend/auth-service/Dockerfile

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Mettre le bon port pour la documentation
EXPOSE 3001

# Cette commande est parfaite, elle démarrera ton serveur
CMD ["node", "index.js"]
