FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de configuration
COPY temp_package.json ./package.json
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src ./src

# Installation des dépendances et build
RUN npm install
RUN npm run build

# Image finale avec Nginx
FROM nginx:alpine

# Copie des fichiers buildés vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx pour SPA React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
