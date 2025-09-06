export type Theme = 'android' | 'default' | 'minimal';

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    primaryVariant: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onError: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    // Calendar specific colors
    today: string;
    selected: string;
    selectedText: string;
    muted: string;
    eventIndicator: string;
    eventIndicatorSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const themes: Record<Theme, ThemeConfig> = {
  android: {
    name: 'Android Material',
    colors: {
      primary: '#1976d2', // Material Blue 700
      primaryVariant: '#1565c0', // Material Blue 800
      secondary: '#dc004e', // Material Pink 600
      background: '#fafafa', // Material Grey 50
      surface: '#ffffff',
      error: '#d32f2f', // Material Red 700
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#212121', // Material Grey 900
      onSurface: '#212121',
      onError: '#ffffff',
      outline: '#e0e0e0', // Material Grey 300
      outlineVariant: '#f5f5f5', // Material Grey 100
      shadow: 'rgba(0, 0, 0, 0.1)',
      // Calendar specific
      today: '#1976d2',
      selected: '#e3f2fd', // Material Blue 50
      selectedText: '#1976d2',
      muted: '#9e9e9e', // Material Grey 500
      eventIndicator: '#1976d2',
      eventIndicatorSecondary: '#dc004e',
    },
    typography: {
      fontFamily: '"Roboto", "Noto Sans", sans-serif',
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    borderRadius: {
      sm: '0.25rem', // 4px
      md: '0.5rem', // 8px
      lg: '0.75rem', // 12px
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
      lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    },
  },
  default: {
    name: 'Default',
    colors: {
      primary: '#3b82f6',
      primaryVariant: '#2563eb',
      secondary: '#10b981',
      background: '#ffffff',
      surface: '#ffffff',
      error: '#ef4444',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#111827',
      onSurface: '#111827',
      onError: '#ffffff',
      outline: '#e5e7eb',
      outlineVariant: '#f9fafb',
      shadow: 'rgba(0, 0, 0, 0.1)',
      today: '#3b82f6',
      selected: '#dbeafe',
      selectedText: '#1d4ed8',
      muted: '#6b7280',
      eventIndicator: '#3b82f6',
      eventIndicatorSecondary: '#10b981',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      primaryVariant: '#333333',
      secondary: '#666666',
      background: '#ffffff',
      surface: '#ffffff',
      error: '#ff0000',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#ffffff',
      outline: '#e0e0e0',
      outlineVariant: '#f5f5f5',
      shadow: 'rgba(0, 0, 0, 0.05)',
      today: '#000000',
      selected: '#f0f0f0',
      selectedText: '#000000',
      muted: '#999999',
      eventIndicator: '#000000',
      eventIndicatorSecondary: '#666666',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 4px rgba(0, 0, 0, 0.05)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
  },
};

export const getTheme = (theme: Theme): ThemeConfig => themes[theme];
