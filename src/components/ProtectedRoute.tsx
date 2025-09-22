import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallbackPath = '/admin/dashboard'
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific permission or role is required, allow access
  if (!requiredPermission && !requiredRole) {
    return <>{children}</>;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Super admin has access to everything
  if (user.role === 'super_admin') {
    return <>{children}</>;
  }

  // Check permission-based access for admin role
  if (requiredPermission && user.role === 'admin') {
    if (!user.permissions || !user.permissions[requiredPermission]) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // If user doesn't have admin or super_admin role and permission is required
  if (requiredPermission && user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;