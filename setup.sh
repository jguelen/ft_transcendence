#!/bin/sh

# Création de la structure de projet
mkdir -p api-gateway/src
mkdir -p frontend/src
mkdir -p auth-service/src/plugins
mkdir -p game-service/src/plugins
mkdir -p profile-service/src/plugins
mkdir -p chat-service/src/plugins

# Création des dossiers data pour SQLite
mkdir -p auth-service/data
mkdir -p game-service/data
mkdir -p profile-service/data
mkdir -p chat-service/data

# Création de fichiers .gitkeep pour les dossiers vides
touch auth-service/data/.gitkeep
touch game-service/data/.gitkeep
touch profile-service/data/.gitkeep
touch chat-service/data/.gitkeep

echo "Structure de projet créée avec succès!"
echo "N'oubliez pas de placer les fichiers db-connector.ts dans le dossier plugins de chaque service."
