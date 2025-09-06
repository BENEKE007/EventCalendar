import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, getTheme, ThemeConfig } from './themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (_theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('calendarTheme');
    return (saved as Theme) || 'android';
  });

  const themeConfig = getTheme(currentTheme);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('calendarTheme', theme);
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(themeConfig.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    Object.entries(themeConfig.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });
    
    Object.entries(themeConfig.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    Object.entries(themeConfig.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });
    
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    root.style.setProperty('--font-family', themeConfig.typography.fontFamily);
  }, [themeConfig]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
