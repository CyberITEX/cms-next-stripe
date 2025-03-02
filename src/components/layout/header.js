'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu, 
  User, 
  ChevronDown,
  Package,
  CreditCard,
  Users
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/context/app-context';

/**
 * Main header component
 */
export function Header() {
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Toggle sidebar for dashboard layout
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if we're in the dashboard section
  const isDashboard = pathname.includes('/(dashboard)');

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-background/70 backdrop-blur-lg shadow-sm' 
          : 'bg-background'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Logo & toggle */}
        <div className="flex items-center gap-2">
          {isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl">DigitalStore</span>
          </Link>
        </div>

        {/* Center - Main navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <div className="relative group">
            <button className="flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              Products
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full w-48 origin-top-right rounded-md border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <Link 
                  href="/products?category=software"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Software
                </Link>
                <Link 
                  href="/products?category=services"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Services
                </Link>
                <Link 
                  href="/products?category=subscriptions"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  Subscriptions
                </Link>
              </div>
            </div>
          </div>
          <Link 
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Pricing
          </Link>
          {isDashboard ? (
            <>
              <Link 
                href="/dashboard/customers"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.includes('/customers') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Customers
              </Link>
              <Link 
                href="/dashboard/orders"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.includes('/orders') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Orders
              </Link>
            </>
          ) : (
            <Link 
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/contact' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Contact
            </Link>
          )}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {!isDashboard && (
            <Button 
              onClick={openCart}
              variant="ghost" 
              size="icon"
              aria-label="Shopping cart"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          )}
          
          {isDashboard ? (
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">
                <CreditCard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                Account
              </Link>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 px-4 sm:px-6 space-y-1">
            <Link 
              href="/"
              className="block py-2 text-sm font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link 
              href="/products"
              className="block py-2 text-sm font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            <Link 
              href="/pricing"
              className="block py-2 text-sm font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/contact"
              className="block py-2 text-sm font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </Link>
            {isDashboard && (
              <>
                <Link 
                  href="/dashboard/customers"
                  className="block py-2 text-sm font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Customers
                </Link>
                <Link 
                  href="/dashboard/orders"
                  className="block py-2 text-sm font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Orders
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}