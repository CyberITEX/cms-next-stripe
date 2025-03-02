'use client';

import { createContext, useState, useEffect } from 'react';

// Create context with default values
export const CartContext = createContext({
  items: [],
  setItems: () => {},
  isOpen: false,
  setIsOpen: () => {},
  itemCount: 0,
  setItemCount: () => {},
});

/**
 * Cart context provider
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  
  // Close cart when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Only on mobile screens
      if (window.innerWidth < 768 && isOpen) {
        const cartElement = document.getElementById('cart-drawer');
        if (cartElement && !cartElement.contains(e.target)) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);
  
  // Close cart when pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        isOpen,
        setIsOpen,
        itemCount,
        setItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}