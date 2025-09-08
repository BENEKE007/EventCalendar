import React from 'react';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';

interface UserStatusProps {
  onShowAuthModal: () => void;
  onShowSignUpModal: () => void;
  onShowUserProfile: () => void;
}

const UserStatus: React.FC<UserStatusProps> = ({ onShowAuthModal, onShowSignUpModal, onShowUserProfile }) => {
  const { user, signOut } = useAuth();
  const { themeConfig } = useTheme();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onShowAuthModal}
          className="android-button-outlined"
          style={{ 
            borderColor: themeConfig.colors.outline,
            color: themeConfig.colors.onSurface,
            padding: '8px 16px',
            cursor: 'pointer',
            border: '1px solid',
            borderRadius: '4px',
            backgroundColor: 'transparent'
          }}
        >
          Sign In
        </button>
        <button
          onClick={onShowSignUpModal}
          className="android-button"
          style={{ 
            backgroundColor: themeConfig.colors.primary,
            color: themeConfig.colors.onPrimary,
            padding: '8px 16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: themeConfig.colors.primary }}
          >
            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm" style={{ color: themeConfig.colors.onSurface }}>
          {user.displayName || user.email}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onShowUserProfile}
          className="android-button-outlined"
          style={{ 
            borderColor: themeConfig.colors.outline,
            color: themeConfig.colors.onSurface,
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          Profile
        </button>
        <button
          onClick={signOut}
          className="android-button-outlined"
          style={{ 
            borderColor: themeConfig.colors.error,
            color: themeConfig.colors.error,
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserStatus;
