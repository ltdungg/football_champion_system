import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Function for defining an effective theme
  const getEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return currentTheme;
  };

  // Applying a theme to DOM
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // Removing all theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Adding a new theme class
    root.classList.add(newTheme);
    body.classList.add(newTheme);

    setEffectiveTheme(newTheme);
  };

  // Theme system change handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newEffectiveTheme = getEffectiveTheme('system');
        applyTheme(newEffectiveTheme);
      }
    };

    // Adding a listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleaning
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Main effect for applying theme
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save in localStorage
    localStorage.setItem('theme', theme);

    // Define and apply an effective theme
    const newEffectiveTheme = getEffectiveTheme(theme);
    applyTheme(newEffectiveTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
          return 'light';
        default:
          return 'dark';
      }
    });
  };

  const value = {
    theme,
    effectiveTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};