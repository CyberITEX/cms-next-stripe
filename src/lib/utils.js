/**
 * Utility functions for the application
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Add this function to utils.js
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// Format currency with locale support
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount / 100); // Stripe amounts are in cents
  }
  
  // Format date to readable format
  export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
  
  // Truncate text with ellipsis
  export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }
  
  // Generate a random ID (useful for temporary client-side IDs)
  export function generateId(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
  }
  
  // Validate email format
  export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Calculate transaction fee (5%)
  export function calculateTransactionFee(amount) {
    return Math.round(amount * 0.05);
  }
  
  // Calculate total with transaction fee
  export function calculateTotal(subtotal) {
    const fee = calculateTransactionFee(subtotal);
    return subtotal + fee;
  }
  
  // Safely parse JSON
  export function safeJSONParse(json, fallback = {}) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return fallback;
    }
  }
  
  // Debounce function for search inputs, etc.
  export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Create URL-friendly slug from string
  export function createSlug(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .trim();
  }