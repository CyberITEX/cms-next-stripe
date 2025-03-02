'use client';

import { createContext } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

// Create context
export const ThemeContext = createContext(null);

/**
 * Theme context provider
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}