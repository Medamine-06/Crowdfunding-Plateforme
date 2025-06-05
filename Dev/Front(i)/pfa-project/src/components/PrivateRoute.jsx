import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ requiredRole, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('PrivateRoute Debug:', {
      path: window.location.pathname,
      isAuthenticated,
      userRole: user?.role,
      requiredRole,
      loading,
      storedAuth: localStorage.getItem('authData')
    });
  }, [isAuthenticated, user, loading, requiredRole]);

  // Show nothing while loading
  if (loading) {
    console.log('PrivateRoute: Still loading...');
    return null;
  }

  // Check stored auth data
  const storedAuth = localStorage.getItem('authData');
  if (!storedAuth) {
    console.log('PrivateRoute: No stored auth data found');
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const { user: storedUser } = JSON.parse(storedAuth);
    
    if (!isAuthenticated || !user) {
      console.log('PrivateRoute: Not authenticated or no user data');
      return <Navigate to="/auth/login" replace />;
    }

    if (requiredRole && storedUser.role !== requiredRole) {
      console.log('PrivateRoute: Role mismatch', {
        storedUserRole: storedUser.role,
        requiredRole
      });
      return <Navigate to="/" replace />;
    }

    console.log('PrivateRoute: Access granted');
    return children ? children : <Outlet />;
  } catch (error) {
    console.error('PrivateRoute: Error parsing auth data:', error);
    return <Navigate to="/auth/login" replace />;
  }
};

export default PrivateRoute;