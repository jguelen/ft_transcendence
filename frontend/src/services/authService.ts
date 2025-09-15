// src/services/authService.ts
import api from './api';
import { User, LoginCredentials } from '../types';

export interface SignupCredentials {
  useremail: string;
  username: string;
  password: string;
}

// Connexion de l'utilisateur
export const login = async (credentials: LoginCredentials): Promise<void> => {
  // L'URL est relative à la baseURL définie dans api.ts
  // '/auth/login' devient 'https://localhost:8443/api/auth/login'
  await api.post('/auth/login', credentials);
  // La réponse est vide (200 OK), le cookie est géré automatiquement par le navigateur
};

// Récupérer l'utilisateur actuellement connecté (grâce au cookie)
export const getLoggedInUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/getloggeduser');
  return response.data;
};

// Déconnexion de l'utilisateur
export const logout = async (): Promise<void> => {
  await api.delete('/auth/logout');
};

// NOUVELLE FONCTION : Inscription de l'utilisateur
export const signup = async (credentials: SignupCredentials): Promise<void> => {
  // On appelle la route '/signup' de notre auth-service via Nginx
  await api.post('/auth/signup', credentials);
};

// NOUVELLE FONCTION : Vérification de la disponibilité du nom d'utilisateur
export const checkUsernameAvailability = async (username: string): Promise<{ isAvailable: boolean }> => {
  // On appelle la nouvelle route de notre user-service via Nginx
  const response = await api.get(`/users/check-username/${username}`);
  return response.data; // La réponse devrait être { isAvailable: true | false }
};
