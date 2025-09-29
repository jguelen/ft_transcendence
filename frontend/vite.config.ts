/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Plugin React pour Vite (transforme JSX en JavaScript)
    react(),
  ],

  // Configuration du serveur de développement
  server: {
    // Le port doit correspondre à celui que tu exposes dans docker-compose.override.yml
    port: 5173,
    // `host: true` est crucial pour que le serveur soit accessible depuis l'extérieur du conteneur
    host: true,
    // Essentiel pour que le Hot-Reload (HMR) fonctionne correctement dans certains environnements Docker
    watch: {
      usePolling: true
    },
    // Configuration du reverse proxy de Vite pour le développement
    proxy: {
      // Redirige toutes les requêtes commençant par /api/auth vers le service d'authentification
      '/api/auth': {
        target: 'http://auth-service:3001',
        changeOrigin: true,
        secure: false,
      },
      // Redirige vers le service utilisateur
      '/api/user': {
        target: 'http://user-service:3002',
        changeOrigin: true,
        secure: false,
      },
      // Redirige vers le service de jeu
      '/api/game': {
        target: 'http://game-service:3000',
        changeOrigin: true,
        secure: false,
      },
      // Redirige les requêtes WebSocket pour l'avatar
      '/avatar': {
        target: 'ws://avatar-service:3003',
        ws: true, // Active le proxy pour les WebSockets
      },
      // Redirige les requêtes WebSocket pour le statut en ligne
      '/online': {
        target: 'ws://online-service:3004',
        ws: true,
      },
      // Redirige les requêtes WebSocket pour le jeu
       '/ws': {
        target: 'ws://game-service:3000',
        ws: true,
      },
      // Redirige l'authentification GitHub
      '/login/github': {
        target: 'http://auth-service:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  
  // Options de build (utilisées pour la production)
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  
  // Alias de chemins pour simplifier les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  
  // Options pour optimiser le code
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})

