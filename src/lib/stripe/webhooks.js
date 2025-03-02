'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Verify Stripe webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature from headers
 * @returns {Object} - Verified event object
 */
export function verifyStripeWebhook(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Missing Stripe webhook secret');
  }
  
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw new Error(`Webhook verification failed: ${error.message}`);
  }
}

/**
 * Handle payment intent succeeded event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function handlePaymentIntentSucceeded(event) {
  const paymentIntent = event.data.object;
  
  try {
    // Revalidate the orders page and customer orders
    revalidatePath('/orders');
    
    if (paymentIntent.customer) {
      revalidatePath(`/customers/${paymentIntent.customer}`);
    }
    
    // For a real application, you would:
    // 1. Update your database
    // 2. Send confirmation emails
    // 3. Generate download links
    // 4. Update inventory if needed
    
    console.log(`Payment succeeded for intent: ${paymentIntent.id}`);
    
    return { success: true, paymentIntentId: paymentIntent.id };
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw new Error('Failed to process payment success');
  }
}

/**
 * Handle payment intent failed event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function handlePaymentIntentFailed(event) {
  const paymentIntent = event.data.object;
  
  try {
    // For a real application, you would:
    // 1. Update your database
    // 2. Send failure notification
    // 3. Take recovery actions
    
    console.log(`Payment failed for intent: ${paymentIntent.id}`);
    
    return { success: true, paymentIntentId: paymentIntent.id };
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
    throw new Error('Failed to process payment failure');
  }
}

/**
 * Handle subscription created event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function handleSubscriptionCreated(event) {
  const subscription = event.data.object;
  
  try {
    // Revalidate the subscriptions page and customer subscriptions
    revalidatePath('/subscriptions');
    
    if (subscription.customer) {
      revalidatePath(`/customers/${subscription.customer}`);
    }
    
    // For a real application, you would:
    // 1. Update your database
    // 2. Send welcome email
    // 3. Provision access
    
    console.log(`Subscription created: ${subscription.id}`);
    
    return { success: true, subscriptionId: subscription.id };
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw new Error('Failed to process subscription creation');
  }
}

/**
 * Handle subscription updated event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function handleSubscriptionUpdated(event) {
  const subscription = event.data.object;
  
  try {
    // Revalidate the subscription and subscriptions list
    revalidatePath(`/subscriptions/${subscription.id}`);
    revalidatePath('/subscriptions');
    
    // For a real application, you would:
    // 1. Update your database
    // 2. Send status update email
    // 3. Update access permissions
    
    console.log(`Subscription updated: ${subscription.id}`);
    
    return { success: true, subscriptionId: subscription.id };
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw new Error('Failed to process subscription update');
  }
}

/**
 * Handle subscription deleted event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function handleSubscriptionDeleted(event) {
  const subscription = event.data.object;
  
  try {
    // Revalidate the subscriptions page
    revalidatePath('/subscriptions');
    
    // For a real application, you would:
    // 1. Update your database
    // 2. Send cancellation confirmation
    // 3. Remove access
    
    console.log(`Subscription deleted: ${subscription.id}`);
    
    return { success: true, subscriptionId: subscription.id };
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw new Error('Failed to process subscription deletion');
  }
}

/**
 * Process incoming webhook event
 * @param {Object} event - Stripe event object
 * @returns {Object} - Processing result
 */
export async function processWebhookEvent(event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handlePaymentIntentSucceeded(event);
      
    case 'payment_intent.payment_failed':
      return handlePaymentIntentFailed(event);
      
    case 'customer.subscription.created':
      return handleSubscriptionCreated(event);
      
    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event);
      
    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event);
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
      return { success: true, handled: false };
  }
}