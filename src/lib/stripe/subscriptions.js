'use server';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get all subscriptions
 * @param {Object} options - Query options
 * @returns {Array} - List of subscriptions
 */
export async function getSubscriptions(options = { limit: 100, status: 'all' }) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      ...options,
      expand: ['data.customer', 'data.default_payment_method']
    });
    
    return subscriptions.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw new Error('Failed to fetch subscriptions');
  }
}

/**
 * Get a subscription by ID
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} - Subscription data
 */
export async function getSubscription(subscriptionId) {
  if (!subscriptionId) throw new Error('Subscription ID is required');
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: [
        'customer',
        'default_payment_method',
        'latest_invoice',
        'items.data.price.product'
      ]
    });
    
    return subscription;
  } catch (error) {
    console.error(`Error fetching subscription ${subscriptionId}:`, error);
    throw new Error('Failed to fetch subscription');
  }
}

/**
 * Get subscriptions for a customer
 * @param {string} customerId - Stripe customer ID
 * @returns {Array} - Customer's subscriptions
 */
export async function getCustomerSubscriptions(customerId) {
  if (!customerId) throw new Error('Customer ID is required');
  
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      expand: ['data.default_payment_method', 'data.items.data.price.product']
    });
    
    return subscriptions.data;
  } catch (error) {
    console.error(`Error fetching subscriptions for customer ${customerId}:`, error);
    throw new Error('Failed to fetch customer subscriptions');
  }
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} - Updated subscription
 */
export async function cancelSubscription(subscriptionId) {
  if (!subscriptionId) throw new Error('Subscription ID is required');
  
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    revalidatePath(`/subscriptions/${subscriptionId}`);
    revalidatePath('/subscriptions');
    
    return subscription;
  } catch (error) {
    console.error(`Error canceling subscription ${subscriptionId}:`, error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

/**
 * Update a subscription (change plan)
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {string} newPriceId - New price ID
 * @returns {Object} - Updated subscription
 */
export async function updateSubscription(subscriptionId, newPriceId) {
  if (!subscriptionId) throw new Error('Subscription ID is required');
  if (!newPriceId) throw new Error('New price ID is required');
  
  try {
    // Get subscription to find the item ID
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0].id;
    
    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: itemId,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });
    
    revalidatePath(`/subscriptions/${subscriptionId}`);
    revalidatePath('/subscriptions');
    
    return updatedSubscription;
  } catch (error) {
    console.error(`Error updating subscription ${subscriptionId}:`, error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

/**
 * Reactivate a canceled subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} - Updated subscription
 */
export async function reactivateSubscription(subscriptionId) {
  if (!subscriptionId) throw new Error('Subscription ID is required');
  
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });
    
    revalidatePath(`/subscriptions/${subscriptionId}`);
    revalidatePath('/subscriptions');
    
    return subscription;
  } catch (error) {
    console.error(`Error reactivating subscription ${subscriptionId}:`, error);
    throw new Error(`Failed to reactivate subscription: ${error.message}`);
  }
}

/**
 * Create a customer portal session for managing subscriptions
 * @param {string} customerId - Stripe customer ID 
 * @param {string} returnUrl - URL to return to after portal session
 * @returns {Object} - Portal session
 */
export async function createCustomerPortalSession(customerId, returnUrl) {
  if (!customerId) throw new Error('Customer ID is required');
  if (!returnUrl) throw new Error('Return URL is required');
  
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    
    return portalSession;
  } catch (error) {
    console.error(`Error creating portal session for ${customerId}:`, error);
    throw new Error('Failed to create customer portal session');
  }
}