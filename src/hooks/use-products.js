'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/stripe/products';
import { debounce } from '@/lib/utils';

/**
 * Hook for product management
 * @param {Object} options - Initial options (category, search)
 * @returns {Object} Product methods and state
 */
export function useProducts(options = {}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(options.category || null);
  const [searchQuery, setSearchQuery] = useState(options.search || '');

  // Fetch products based on category
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (category) {
        result = await getProductsByCategory(category);
      } else {
        result = await getProducts();
      }
      
      setProducts(result);
      setFilteredProducts(result);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Fetch products on mount and when category changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search query changes
  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 3) {
        setFilteredProducts(products);
        return;
      }
      
      setLoading(true);
      
      try {
        const results = await searchProducts(query);
        setFilteredProducts(results);
      } catch (err) {
        console.error('Error searching products:', err);
        setError(err.message || 'Failed to search products');
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    }, 500),
    [products]
  );

  // Update search results when query changes
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Filter by product type (one-off or subscription)
  const filterByType = useCallback((type) => {
    if (!type || type === 'all') {
      setFilteredProducts(products);
      return;
    }
    
    const isSubscription = type === 'subscription';
    
    const filtered = products.filter(product => {
      const hasRecurringPrice = product.prices?.some(price => price.recurring);
      return isSubscription ? hasRecurringPrice : !hasRecurringPrice;
    });
    
    setFilteredProducts(filtered);
  }, [products]);

  // Sort products by price
  const sortByPrice = useCallback((direction = 'asc') => {
    const sorted = [...filteredProducts].sort((a, b) => {
      const priceA = a.defaultPrice?.unit_amount || 0;
      const priceB = b.defaultPrice?.unit_amount || 0;
      
      return direction === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    setFilteredProducts(sorted);
  }, [filteredProducts]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set();
    
    products.forEach(product => {
      if (product.metadata?.category) {
        categorySet.add(product.metadata.category);
      }
    });
    
    return Array.from(categorySet);
  }, [products]);

  // Change category
  const changeCategory = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  // Update search query
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Refresh products
  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    category,
    searchQuery,
    categories,
    changeCategory,
    updateSearchQuery,
    filterByType,
    sortByPrice,
    refresh
  };
}