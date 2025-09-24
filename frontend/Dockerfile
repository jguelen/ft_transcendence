FROM node:20-alpine AS build

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build /dist/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY nginx/ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY nginx/ssl/key.pem /etc/nginx/ssl/key.pem

EXPOSE 443 
