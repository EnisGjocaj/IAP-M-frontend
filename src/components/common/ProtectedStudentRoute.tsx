import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const isJwtTokenValid = (token?: string) => {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4 !== 0) payload += '=';

    const decoded = JSON.parse(atob(payload));
    const exp = decoded?.exp;
    if (typeof exp !== 'number') return false;

    const nowSeconds = Date.now() / 1000;
    return nowSeconds < exp;
  } catch {
    return false;
  }
};

export const ProtectedStudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const tokenValid = isJwtTokenValid(user?.token);
  const isAuthenticated = Boolean(user) && tokenValid;

  useEffect(() => {
    if (user && !tokenValid) {
      logout();
    }
  }, [logout, tokenValid, user]);

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user.isStudent) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};