import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../types/user';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, signOut, updateUserPreferences } = useAuth();
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedPreferenceChange = (parentKey: keyof UserPreferences, childKey: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as any),
        [childKey]: value
      }
    }));
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      await updateUserPreferences(preferences);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="android-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: themeConfig.colors.surface }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium" style={{ color: themeConfig.colors.onSurface }}>
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="text-2xl leading-none"
              style={{ color: themeConfig.colors.muted }}
            >
              ×
            </button>
          </div>

          {/* Message */}
          {message && (
            <div 
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="flex mb-6 border-b" style={{ borderColor: themeConfig.colors.outline }}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'profile' 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}
              style={{ 
                color: activeTab === 'profile' 
                  ? themeConfig.colors.primary 
                  : themeConfig.colors.muted 
              }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'preferences' 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}
              style={{ 
                color: activeTab === 'preferences' 
                  ? themeConfig.colors.primary 
                  : themeConfig.colors.muted 
              }}
            >
              Preferences
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: themeConfig.colors.outlineVariant }}>
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: themeConfig.colors.primary }}
                    >
                      {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      {user.displayName || 'User'}
                    </div>
                    <div className="text-sm" style={{ color: themeConfig.colors.muted }}>
                      {user.email}
                    </div>
                    <div className="text-xs" style={{ color: themeConfig.colors.muted }}>
                      Role: {user.role} • Joined: {user.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="flex gap-3">
                <button
                  onClick={signOut}
                  className="flex-1 android-button-outlined"
                  style={{ 
                    borderColor: themeConfig.colors.error,
                    color: themeConfig.colors.error
                  }}
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 android-button"
                  style={{ 
                    backgroundColor: themeConfig.colors.primary,
                    color: themeConfig.colors.onPrimary
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: themeConfig.colors.onSurface }}>
                  Appearance
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                      Theme
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.outline,
                        color: themeConfig.colors.onSurface
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calendar Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: themeConfig.colors.onSurface }}>
                  Calendar
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                      Default View
                    </label>
                    <select
                      value={preferences.defaultView}
                      onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.outline,
                        color: themeConfig.colors.onSurface
                      }}
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                      Default Region
                    </label>
                    <select
                      value={preferences.defaultRegion}
                      onChange={(e) => handlePreferenceChange('defaultRegion', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.outline,
                        color: themeConfig.colors.onSurface
                      }}
                    >
                      <option value="All">All Regions</option>
                      <option value="KZN">KZN</option>
                      <option value="Gauteng">Gauteng</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Show Weekends
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.calendar.showWeekends}
                      onChange={(e) => handleNestedPreferenceChange('calendar', 'showWeekends', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                      Start of Week
                    </label>
                    <select
                      value={preferences.calendar.startOfWeek}
                      onChange={(e) => handleNestedPreferenceChange('calendar', 'startOfWeek', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.outline,
                        color: themeConfig.colors.onSurface
                      }}
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                      Time Format
                    </label>
                    <select
                      value={preferences.calendar.timeFormat}
                      onChange={(e) => handleNestedPreferenceChange('calendar', 'timeFormat', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.outline,
                        color: themeConfig.colors.onSurface
                      }}
                    >
                      <option value="12h">12 Hour (AM/PM)</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: themeConfig.colors.onSurface }}>
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Email Notifications
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email}
                      onChange={(e) => handleNestedPreferenceChange('notifications', 'email', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Push Notifications
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push}
                      onChange={(e) => handleNestedPreferenceChange('notifications', 'push', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Event Reminders
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.eventReminders}
                      onChange={(e) => handleNestedPreferenceChange('notifications', 'eventReminders', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ color: themeConfig.colors.onSurface }}>
                  Privacy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Share Events
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.shareEvents}
                      onChange={(e) => handleNestedPreferenceChange('privacy', 'shareEvents', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: themeConfig.colors.onSurface }}>
                      Show in Public Calendar
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showInPublicCalendar}
                      onChange={(e) => handleNestedPreferenceChange('privacy', 'showInPublicCalendar', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: themeConfig.colors.outline }}>
                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="flex-1 android-button"
                  style={{ 
                    backgroundColor: themeConfig.colors.primary,
                    color: themeConfig.colors.onPrimary,
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 android-button-outlined"
                  style={{ 
                    borderColor: themeConfig.colors.outline,
                    color: themeConfig.colors.onSurface
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;