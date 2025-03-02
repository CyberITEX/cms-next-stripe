'use server';

import { calculateTransactionFee, calculateTotal } from '../utils';

/**
 * Calculate transaction fee (5%)
 * @param {number} amount - Amount in cents
 * @returns {Object} - Fee details
 */
export async function getTransactionFee(amount) {
  if (!amount || isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount provided');
  }
  
  const fee = calculateTransactionFee(amount);
  const total = calculateTotal(amount);
  
  return {
    subtotal: amount,
    fee,
    total,
    feePercentage: 5
  };
}

/**
 * Add transaction fee to line items
 * @param {Array} lineItems - Stripe line items
 * @returns {Array} - Line items with fee
 */
export function addTransactionFeeToLineItems(lineItems) {
  if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
    return lineItems;
  }

  // Calculate total amount
  const subtotal = lineItems.reduce((total, item) => {
    return total + (item.amount * item.quantity);
  }, 0);
  
  // Calculate fee
  const fee = calculateTransactionFee(subtotal);
  
  // Add fee as a new line item
  return [
    ...lineItems,
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Transaction Fee (5%)',
          description: 'Standard 5% processing fee'
        },
        unit_amount: fee,
      },
      quantity: 1,
    }
  ];
}