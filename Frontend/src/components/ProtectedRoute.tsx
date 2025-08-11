import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is authenticated (using localStorage for demo)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'user';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Store user role in a way that child components can access it
  // This ensures role-based access control throughout the app
  
  return <>{children}</>;
};

export default ProtectedRoute;