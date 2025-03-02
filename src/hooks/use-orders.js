'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrders, getCustomerOrders } from '@/lib/stripe/orders';

/**
 * Hook for order management
 * @param {Object} options - Initial options (customerId)
 * @returns {Object} Order methods and state
 */
export function useOrders(options = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(options.customerId || null);

  // Fetch orders based on customerId
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (customerId) {
        result = await getCustomerOrders(customerId);
      } else {
        result = await getOrders();
      }
      
      setOrders(result);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Fetch orders on mount and when customerId changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders by status
  const filterByStatus = useCallback((status) => {
    if (!status || status === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === status);
  }, [orders]);

  // Sort orders by date
  const sortByDate = useCallback((direction = 'desc') => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      
      return direction === 'desc' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }, [orders]);

  // Filter by date range
  const filterByDateRange = useCallback((startDate, endDate) => {
    if (!startDate && !endDate) {
      return orders;
    }
    
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    return orders.filter(order => {
      const orderDate = new Date(order.created);
      return orderDate >= start && orderDate <= end;
    });
  }, [orders]);

  // Change customer ID
  const changeCustomerId = useCallback((newCustomerId) => {
    setCustomerId(newCustomerId);
  }, []);

  // Refresh orders
  const refresh = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    customerId,
    changeCustomerId,
    filterByStatus,
    sortByDate,
    filterByDateRange,
    refresh
  };
}