'use client';

import { createContext, useState, useEffect } from 'react';
import { getStoredValue, setStoredValue } from '@/lib/db';

// Create context with default values
export const AppContext = createContext({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  currency: 'USD',
  setCurrency: () => {},
  recentlyViewedProducts: [],
  addToRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
});

/**
 * App context provider
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 */
export function AppProvider({ children }) {
  // Sidebar state (collapsed/expanded)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Currency preference
  const [currency, setCurrency] = useState('USD');
  
  // Recently viewed products
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  
  // Initialize from local storage on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Get sidebar state
    const savedSidebarState = getStoredValue('sidebarOpen', true);
    setSidebarOpen(savedSidebarState);
    
    // Get currency preference
    const savedCurrency = getStoredValue('currency', 'USD');
    setCurrency(savedCurrency);
    
    // Get recently viewed products
    const savedRecentlyViewed = getStoredValue('recentlyViewedProducts', []);
    setRecentlyViewedProducts(savedRecentlyViewed);
  }, []);
  
  // Save sidebar state to local storage
  useEffect(() => {
    setStoredValue('sidebarOpen', sidebarOpen);
  }, [sidebarOpen]);
  
  // Save currency preference to local storage
  useEffect(() => {
    setStoredValue('currency', currency);
  }, [currency]);
  
  // Save recently viewed products to local storage
  useEffect(() => {
    setStoredValue('recentlyViewedProducts', recentlyViewedProducts);
  }, [recentlyViewedProducts]);
  
  /**
   * Add a product to recently viewed
   * @param {Object} product - Product to add
   */
  const addToRecentlyViewed = (product) => {
    if (!product) return;
    
    setRecentlyViewedProducts((prev) => {
      // Remove existing if already present
      const filtered = prev.filter((p) => p.id !== product.id);
      
      // Add to the beginning
      return [product, ...filtered].slice(0, 5); // Keep only 5 most recent
    });
  };
  
  /**
   * Clear recently viewed products
   */
  const clearRecentlyViewed = () => {
    setRecentlyViewedProducts([]);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        currency,
        setCurrency,
        recentlyViewedProducts,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}