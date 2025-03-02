import './globals.css';
import { Inter } from 'next/font/google';
import { RootProvider } from '@/context/root-provider';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Header } from '@/components/layout/header';
import { Notifications } from '@/components/ui/notifications';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] });

// Metadata for the app
export const metadata = {
  title: 'Digital Store - Your One-Stop Shop for Digital Products',
  description: 'Find premium digital products, subscriptions, and services.',
};

/**
 * Root layout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <CartDrawer />
          <Notifications />
        </RootProvider>
      </body>
    </html>
  );
}