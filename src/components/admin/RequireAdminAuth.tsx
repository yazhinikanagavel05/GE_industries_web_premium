import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth, AdminRole } from '../../context/AdminAuthContext';

interface RequireAdminAuthProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
}

export const RequireAdminAuth: React.FC<RequireAdminAuthProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, checkRole } = useAdminAuth();
  const location = useLocation();

  // 1. Unauthenticated visitors are redirected to private login portal
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated accounts without administrator role clearance
  if (!isAdmin || !checkRole(requiredRole)) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return <>{children}</>;
};
