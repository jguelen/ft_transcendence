FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers de configuration
COPY package.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src ./src

# Installation des dépendances et build
RUN npm install
RUN npm run install

# Image finale avec Nginx
FROM nginx:alpine

# Copie des fichiers buildés vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx pour SPA React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
