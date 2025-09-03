import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirection racine */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Routes publiques */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Routes privées (nécessitant authentification) */}
      <Route path="/dashboard/*" element={<PrivateRoutes />} />
      
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
