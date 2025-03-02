'use client';

import { useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

/**
 * Hook for theme management
 * @returns {Object} Theme methods and state
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  // Sync with system preference on initial load if not set
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined' && !theme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Listen for changes in system preference
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, setTheme]);

  /**
   * Toggle between dark and light mode
   */
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  /**
   * Set theme to dark mode
   */
  const setDarkTheme = () => {
    setTheme('dark');
  };

  /**
   * Set theme to light mode
   */
  const setLightTheme = () => {
    setTheme('light');
  };

  /**
   * Set theme to system preference
   */
  const setSystemTheme = () => {
    setTheme('system');
  };

  /**
   * Check if current theme is dark
   * @returns {boolean} Is dark theme
   */
  const isDarkTheme = resolvedTheme === 'dark';

  /**
   * Check if current theme is light
   * @returns {boolean} Is light theme
   */
  const isLightTheme = resolvedTheme === 'light';

  return {
    theme,
    resolvedTheme,
    systemTheme,
    isDarkTheme,
    isLightTheme,
    toggleTheme,
    setDarkTheme,
    setLightTheme,
    setSystemTheme,
    setTheme
  };
}