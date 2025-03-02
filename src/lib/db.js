/**
 * Client-side data management utilities
 * Note: This is NOT a database, but a simple way to persist data in the browser
 */

const CART_KEY = 'digital_store_cart';
const RECENT_PRODUCTS_KEY = 'digital_store_recent_products';

// Cart functions
export function getCart() {
  if (typeof window === 'undefined') return [];
  const cartData = localStorage.getItem(CART_KEY);
  return cartData ? JSON.parse(cartData) : [];
}

export function saveCart(cartItems) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

// Recently viewed products
export function getRecentProducts() {
  if (typeof window === 'undefined') return [];
  const products = localStorage.getItem(RECENT_PRODUCTS_KEY);
  return products ? JSON.parse(products) : [];
}

export function addRecentProduct(product) {
  if (typeof window === 'undefined') return;
  
  const recentProducts = getRecentProducts();
  // Remove if already exists
  const filtered = recentProducts.filter(p => p.id !== product.id);
  // Add to beginning of array
  const updated = [product, ...filtered].slice(0, 5); // Keep only 5 most recent
  
  localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
}

// Session functions
export function getStoredValue(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  const value = localStorage.getItem(key);
  return value !== null ? JSON.parse(value) : defaultValue;
}

export function setStoredValue(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredValue(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}