export type UserRole = 'admin' | 'premium' | 'basic';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'day' | 'week' | 'month' | 'year';
  defaultRegion: 'All' | 'KZN' | 'Gauteng';
  notifications: {
    email: boolean;
    push: boolean;
    eventReminders: boolean;
  };
  calendar: {
    showWeekends: boolean;
    startOfWeek: 'sunday' | 'monday';
    timeFormat: '12h' | '24h';
  };
  privacy: {
    shareEvents: boolean;
    showInPublicCalendar: boolean;
  };
}

export interface UserPermissions {
  canCreateEvents: boolean;
  canEditOwnEvents: boolean;
  canDeleteOwnEvents: boolean;
  canViewAllEvents: boolean;
  canEditAllEvents: boolean;
  canDeleteAllEvents: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canImportData: boolean;
  canAccessAdvancedFeatures: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultView: 'month',
  defaultRegion: 'All',
  notifications: {
    email: true,
    push: false,
    eventReminders: true,
  },
  calendar: {
    showWeekends: true,
    startOfWeek: 'monday',
    timeFormat: '24h',
  },
  privacy: {
    shareEvents: false,
    showInPublicCalendar: false,
  },
};

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  basic: {
    canCreateEvents: true,
    canEditOwnEvents: true,
    canDeleteOwnEvents: true,
    canViewAllEvents: false,
    canEditAllEvents: false,
    canDeleteAllEvents: false,
    canManageUsers: false,
    canExportData: false,
    canImportData: false,
    canAccessAdvancedFeatures: false,
  },
  premium: {
    canCreateEvents: true,
    canEditOwnEvents: true,
    canDeleteOwnEvents: true,
    canViewAllEvents: true,
    canEditAllEvents: false,
    canDeleteAllEvents: false,
    canManageUsers: false,
    canExportData: true,
    canImportData: true,
    canAccessAdvancedFeatures: true,
  },
  admin: {
    canCreateEvents: true,
    canEditOwnEvents: true,
    canDeleteOwnEvents: true,
    canViewAllEvents: true,
    canEditAllEvents: true,
    canDeleteAllEvents: true,
    canManageUsers: true,
    canExportData: true,
    canImportData: true,
    canAccessAdvancedFeatures: true,
  },
};
