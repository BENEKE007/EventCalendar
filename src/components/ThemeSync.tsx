import { useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';

const ThemeSync: React.FC = () => {
  const { user, updateUserPreferences } = useAuth();
  const { setTheme } = useTheme();

  // Sync theme with user preferences
  useEffect(() => {
    if (user?.preferences?.theme) {
      const userTheme = user.preferences.theme;
      if (userTheme === 'system') {
        // Use system preference
        setTheme('android');
      } else {
        setTheme('android');
      }
    }
  }, [user?.preferences?.theme, setTheme]);

  // Update user preferences when theme changes
  const handleThemeChange = async (theme: string) => {
    if (user) {
      try {
        await updateUserPreferences({ 
          theme: theme as 'light' | 'dark' | 'system' 
        });
      } catch (error) {
        console.error('Failed to update theme preference:', error);
      }
    }
  };

  // Expose theme change handler to parent components
  useEffect(() => {
    // This could be used by components that need to update theme preferences
    (window as any).updateThemePreference = handleThemeChange;
  }, [user]);

  return null; // This component doesn't render anything
};

export default ThemeSync;
