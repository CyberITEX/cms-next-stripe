'use client';

import { useContext, useEffect, useCallback } from 'react';
import { CartContext } from '@/context/cart-context';
import { getCart, saveCart } from '@/lib/db';
import { calculateTransactionFee, calculateTotal } from '@/lib/utils';

/**
 * Hook for cart management
 * @returns {Object} Cart methods and state
 */
export function useCart() {
  const {
    items,
    setItems,
    isOpen,
    setIsOpen,
    itemCount,
    setItemCount
  } = useContext(CartContext);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = getCart();
    if (savedCart.length > 0) {
      setItems(savedCart);
      setItemCount(
        savedCart.reduce((count, item) => count + (item.quantity || 1), 0)
      );
    }
  }, [setItems, setItemCount]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
    setItemCount(items.reduce((count, item) => count + (item.quantity || 1), 0));
  }, [items, setItemCount]);

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity of existing item
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { 
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.defaultPrice?.unit_amount || 0,
          priceId: product.defaultPrice?.id,
          image: product.images?.[0],
          quantity
        }];
      }
    });
    
    // Open cart drawer if not already open
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [setItems, isOpen, setIsOpen]);

  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   */
  const removeItem = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, [setItems]);

  /**
   * Update item quantity
   * @param {string} productId - Product ID to update
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  }, [setItems, removeItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  /**
   * Open cart drawer
   */
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  /**
   * Close cart drawer
   */
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );
  
  const transactionFee = calculateTransactionFee(subtotal);
  const total = calculateTotal(subtotal);

  return {
    items,
    itemCount,
    isOpen,
    subtotal,
    transactionFee,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart
  };
}