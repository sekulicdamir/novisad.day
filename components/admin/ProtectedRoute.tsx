
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const adminContext = useContext(AdminContext);
  const location = useLocation();

  if (!adminContext?.isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
