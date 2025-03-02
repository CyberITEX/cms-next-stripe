'use client';

import { ThemeProvider } from './theme-context';
import { CartProvider } from './cart-context';
import { NotificationProvider } from './notification-context';
import { AppProvider } from './app-context';

/**
 * Root provider that combines all context providers
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 */
export function RootProvider({ children }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <NotificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NotificationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}