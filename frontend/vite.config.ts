/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],

  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/auth': {
        target: 'http://auth-service:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/user': {
        target: 'http://user-service:3002',
        changeOrigin: true,
        secure: false,
      },
      '/api/game': {
        target: 'http://game-service:3000',
        changeOrigin: true,
        secure: false,
      },
      '/avatar': {
        target: 'ws://avatar-service:3003',
        ws: true, 
      },
      '/online': {
        target: 'ws://online-service:3004',
        ws: true,
      },
       '/ws': {
        target: 'ws://game-service:3000',
        ws: true,
      },

      '/login/github': {
        target: 'http://auth-service:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  
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

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})

