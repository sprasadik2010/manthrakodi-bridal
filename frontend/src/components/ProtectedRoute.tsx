// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

<<<<<<< HEAD
  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
=======
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon"></div>
      </div>
    );
  }

<<<<<<< HEAD
  return isAuthenticated ? <>{children}</> : <AdminLogin onLoginSuccess={checkAuth} />;
=======
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
};

export default ProtectedRoute;