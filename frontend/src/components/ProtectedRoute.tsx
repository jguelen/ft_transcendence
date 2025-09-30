import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';
import { ROUTES } from '../App';

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

