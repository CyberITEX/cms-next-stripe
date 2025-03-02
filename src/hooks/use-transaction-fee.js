'use client';

import { useState, useEffect, useMemo } from 'react';
import { calculateTransactionFee, calculateTotal } from '@/lib/utils';

/**
 * Hook for managing transaction fees
 * @param {number} amount - Amount in cents
 * @returns {Object} Fee calculation and methods
 */
export function useTransactionFee(amount = 0) {
  const [subtotal, setSubtotal] = useState(amount);

  // Update subtotal when amount changes
  useEffect(() => {
    setSubtotal(amount);
  }, [amount]);

  // Calculate fee and total
  const feeAmount = useMemo(() => calculateTransactionFee(subtotal), [subtotal]);
  const totalAmount = useMemo(() => calculateTotal(subtotal), [subtotal]);

  /**
   * Calculate fee for a specific amount
   * @param {number} amt - Amount to calculate fee for
   * @returns {Object} Fee and total
   */
  const calculateFeeFor = (amt) => {
    const fee = calculateTransactionFee(amt);
    const total = calculateTotal(amt);
    
    return {
      amount: amt,
      fee,
      total,
      feePercentage: 5
    };
  };

  /**
   * Update the subtotal
   * @param {number} newAmount - New subtotal amount
   */
  const updateSubtotal = (newAmount) => {
    setSubtotal(newAmount);
  };

  /**
   * Format fee display text
   * @returns {string} Formatted fee text
   */
  const getFormattedFeeText = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    
    return `${formatter.format(feeAmount / 100)} (5%)`;
  };

  return {
    subtotal,
    feeAmount,
    totalAmount,
    feePercentage: 5,
    calculateFeeFor,
    updateSubtotal,
    getFormattedFeeText
  };
}