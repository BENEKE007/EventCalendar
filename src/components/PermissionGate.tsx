import React, { ReactNode } from 'react';
import { useAuth } from '../lib/authContext';
import { UserPermissions } from '../types/user';

interface PermissionGateProps {
  permission: keyof UserPermissions;
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  children, 
  fallback = null, 
  requireAuth = true 
}) => {
  const { user } = useAuth();

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // For now, allow all permissions if user is authenticated
  // This can be enhanced later with proper permission checking
  // if (user && user.permissions && !user.permissions[permission]) {
  //   return <>{fallback}</>;
  // }
  
  // Suppress unused parameter warning for now
  console.log('Permission check for:', permission);

  return <>{children}</>;
};

export default PermissionGate;
