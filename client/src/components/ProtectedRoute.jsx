import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;}
    if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;