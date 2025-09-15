// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // L'URL de votre Nginx, qui est la porte d'entrée de toute votre application
  baseURL: 'https://localhost:8443/api',

  // TRÈS IMPORTANT : Permet à axios d'envoyer les cookies (comme votre JWT)
  // avec chaque requête. Sans ça, l'authentification échouera.
  withCredentials: true,
});

export default api;
