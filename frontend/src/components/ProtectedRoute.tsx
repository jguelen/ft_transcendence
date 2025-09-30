// src/ProtectedRoute.tsx

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext'; // On importe notre hook personnalisé
import { ROUTES } from '../App';

// On définit le type des props que ce composant accepte.
// 'children' représente les composants qui seront imbriqués à l'intérieur.
type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps)
{
  const { user, isLoading } = useAuth();
  if (isLoading)
    return <div className="flex justify-center items-center">Chargement de la session...</div>;
  if (!user)
  {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;

