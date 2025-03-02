'use client';

import { useState, useCallback } from 'react';

/**
 * Hook for managing disclosure state (open/closed)
 * @param {boolean} initialState - Initial state (default: false)
 * @returns {Object} Disclosure methods and state
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
}