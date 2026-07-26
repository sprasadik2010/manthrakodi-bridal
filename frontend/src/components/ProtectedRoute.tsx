// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react';
import AdminLogin from '../pages/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <AdminLogin onLoginSuccess={checkAuth} />;
};

export default ProtectedRoute;