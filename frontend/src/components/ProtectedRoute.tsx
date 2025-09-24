// src/ProtectedRoute.tsx

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // On importe notre hook personnalisé

// On définit le type des props que ce composant accepte.
// 'children' représente les composants qui seront imbriqués à l'intérieur.
type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // On se connecte au contexte d'authentification pour récupérer l'état.
  const { user, isLoading } = useAuth();

  // 1. Gérer l'état de chargement initial
  // Pendant que l'AuthContext vérifie si un cookie de session existe,
  // on affiche un message pour une meilleure expérience utilisateur.
  if (isLoading) {
    return <div className="flex justify-center items-center">Chargement de la session...</div>;
  }

  // 2. Vérifier si l'utilisateur est authentifié
  // Une fois le chargement terminé, si l'objet 'user' est null,
  // cela signifie que l'utilisateur n'est pas connecté.
  if (!user) {
    // On le redirige vers la page de connexion.
    return <Navigate to="/login" replace />;
  }

  // 3. Afficher la page protégée
  // Si un utilisateur existe, on affiche le composant enfant demandé.
  return <>{children}</>;
}

export default ProtectedRoute;

