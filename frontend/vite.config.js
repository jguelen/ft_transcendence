import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins:
  [
    // Plugin React pour Vite (transforme JSX en JavaScript)
    react(),
  ],

  root: 'src',
  // Configuration du serveur de développement
  server:
  {
    port: 3000, // Port sur lequel le serveur de développement s'exécute
    // Proxy pour rediriger les requêtes API vers votre back-end pendant le développement
    proxy:
    {
      '/api':
      {
        target: 'http://localhost:8000', // L'URL de votre API back-end
        changeOrigin: true,
        secure: false,
        // Optionnel: réécrire les chemins d'URL
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  
  // Options de build
  build: {
    outDir: 'dist', // Répertoire de sortie pour le build de production
    sourcemap: false, // Désactiver les sourcemaps en production pour des fichiers plus légers
  },
  
  // Alias de chemins pour simplifier les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Permet d'importer depuis '@/components/...' au lieu de '../../../components/...'
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
    include: ['react', 'react-dom'], // Packages à pré-bundler pour de meilleures performances
  },
})
