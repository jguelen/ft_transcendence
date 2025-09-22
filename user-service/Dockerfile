# ---- Étape 1 : Le "Builder" ----
# On utilise une image Node complète pour avoir tous les outils de build
FROM node:18 AS builder

WORKDIR /app

# Copier les fichiers de dépendances et le schéma Prisma
COPY package*.json ./
COPY schema.prisma ./

# Installer TOUTES les dépendances, y compris les 'devDependencies' (comme 'prisma')
RUN npm install

# Générer le Prisma Client. C'est CRUCIAL.
# Cette commande lit 'schema.prisma' et crée le code de Prisma Client dans 'node_modules/.prisma/client'
RUN npx prisma generate

# Copier le reste du code de l'application
COPY . .


# ---- Étape 2 : L'image de Production ----
# On part d'une image plus légère pour la version finale
FROM node:18

WORKDIR /app

# Copier les dépendances et le Prisma Client généré depuis l'étape "builder"
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copier le reste du code de l'application depuis l'étape "builder"
COPY --from=builder /app .

# Exposer le port de l'application
EXPOSE 3000

# La commande pour démarrer l'application
CMD [ "node", "index.js" ]
