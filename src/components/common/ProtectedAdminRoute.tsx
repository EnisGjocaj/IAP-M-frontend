import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  if (user.role !== 'ADMIN') {
   
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 