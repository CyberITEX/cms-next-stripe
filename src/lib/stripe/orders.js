'use server';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get all orders (payment intents)
 * @param {Object} options - Query options
 * @returns {Array} - List of orders
 */
export async function getOrders(options = { limit: 100 }) {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      ...options,
      expand: ['data.customer', 'data.payment_method']
    });
    
    return paymentIntents.data.filter(
      pi => pi.status === 'succeeded' || pi.status === 'processing'
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

/**
 * Get an order by ID
 * @param {string} orderId - Payment intent ID
 * @returns {Object} - Order data
 */
export async function getOrder(orderId) {
  if (!orderId) throw new Error('Order ID is required');
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(orderId, {
      expand: [
        'customer',
        'payment_method',
        'invoice.subscription',
        'latest_charge.balance_transaction'
      ]
    });
    
    return paymentIntent;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw new Error('Failed to fetch order');
  }
}

/**
 * Get orders for a customer
 * @param {string} customerId - Stripe customer ID
 * @returns {Array} - Customer's orders
 */
export async function getCustomerOrders(customerId) {
  if (!customerId) throw new Error('Customer ID is required');
  
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
      expand: ['data.payment_method']
    });
    
    return paymentIntents.data.filter(
      pi => pi.status === 'succeeded' || pi.status === 'processing'
    );
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw new Error('Failed to fetch customer orders');
  }
}

/**
 * Generate download link for digital order
 * @param {string} orderId - Payment intent ID
 * @returns {Object} - Download link info
 */
export async function generateOrderDownloadLink(orderId) {
  if (!orderId) throw new Error('Order ID is required');
  
  try {
    // Retrieve the order
    const order = await getOrder(orderId);
    
    if (order.status !== 'succeeded') {
      throw new Error('Cannot generate download link for unpaid order');
    }
    
    // In a real application, you would likely lookup a product mapping
    // and generate secure, time-limited download links here
    
    // This is a simplified example
    const downloadLinks = [];
    
    if (order.metadata && order.metadata.productIds) {
      const productIds = order.metadata.productIds.split(',');
      
      for (const productId of productIds) {
        const product = await stripe.products.retrieve(productId);
        
        downloadLinks.push({
          productId,
          productName: product.name,
          downloadUrl: `/api/download/${orderId}/${productId}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      }
    }
    
    return { downloadLinks };
  } catch (error) {
    console.error(`Error generating download link for order ${orderId}:`, error);
    throw new Error('Failed to generate download link');
  }
}