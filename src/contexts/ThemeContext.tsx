'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system'); // Default to system to prevent hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Initialize theme on client side only
  useEffect(() => {
    setMounted(true);
    
    // Load theme from localStorage on client side
    const savedTheme = localStorage.getItem('bible-study-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // Default to system preference if no saved theme
      setTheme('system');
    }
  }, []);  useEffect(() => {
    if (!mounted) return; // Prevent server-side execution
    
    // Save theme to localStorage
    localStorage.setItem('bible-study-theme', theme);

    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // system theme
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(shouldBeDark);
      
      // Update HTML and body classes
      const root = document.documentElement;
      const body = document.body;
      
      if (shouldBeDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
      
      // Force re-render by updating a data attribute
      root.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
        // Also update CSS custom properties for immediate theme switching
      root.style.colorScheme = shouldBeDark ? 'dark' : 'light';
    };

    updateTheme();

    // Listen for system theme changes only if theme is set to system
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // Save to localStorage only after mounting
    if (mounted) {
      localStorage.setItem('bible-study-theme', newTheme);
    }
  };return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDarkMode }}>
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
