import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth status
    return <div>Loading...</div>;
  }

  // If authenticated and user role is 'admin', show the page.
  // Otherwise, redirect to the homepage.
  return isAuthenticated && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;