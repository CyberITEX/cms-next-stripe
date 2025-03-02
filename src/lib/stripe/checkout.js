'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { addTransactionFeeToLineItems } from './transaction-fee';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Set your domain for success and cancel URLs
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Create a checkout session for one-time purchases
 * @param {Array} cartItems - Cart items to purchase
 * @param {string} customerId - Optional Stripe customer ID
 * @returns {Object} - Checkout session
 */
export async function createCheckoutSession(cartItems, customerId = null) {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    try {
        // Transform cart items to Stripe line items
        let lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description || '',
                    images: item.images || [],
                    metadata: {
                        productId: item.id
                    }
                },
                unit_amount: item.price, // Price in cents
            },
            quantity: item.quantity || 1,
        }));

        // Add 5% transaction fee
        lineItems = addTransactionFeeToLineItems(lineItems);



        // Create checkout session with transaction fee
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            customer: customerId, // Will be null if not logged in
            mode: 'payment',
            success_url: `${DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/checkout/cancel`,
            metadata: {
                productIds: cartItems.map(item => item.id).join(',')
            },
            billing_address_collection: 'required',
            allow_promotion_codes: true,
        });

        return { url: session.url, sessionId: session.id };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
    }
}

/**
* Create a checkout session for subscriptions
* @param {Object} product - Product to subscribe to
* @param {string} priceId - Stripe price ID
* @param {string} customerId - Optional Stripe customer ID
* @returns {Object} - Checkout session
*/
export async function createSubscriptionCheckout(product, priceId, customerId = null) {
    if (!product) throw new Error('Product is required');
    if (!priceId) throw new Error('Price ID is required');

    try {
        // Create session for subscription
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
                // Add transaction fee as a one-time fee
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Transaction Fee (5%)',
                            description: 'One-time processing fee'
                        },
                        unit_amount: Math.round(product.price * 0.05), // 5% of subscription price
                        recurring: null, // Make this a one-time fee
                    },
                    quantity: 1,
                }
            ],
            customer: customerId,
            mode: 'subscription',
            success_url: `${DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/checkout/cancel`,
            metadata: {
                productId: product.id
            },
            billing_address_collection: 'required',
            allow_promotion_codes: true,
        });

        return { url: session.url, sessionId: session.id };
    } catch (error) {
        console.error('Error creating subscription checkout:', error);
        throw new Error(`Failed to create subscription checkout: ${error.message}`);
    }
}

/**
* Get checkout session details
* @param {string} sessionId - Stripe checkout session ID
* @returns {Object} - Session details
*/
export async function getCheckoutSession(sessionId) {
    if (!sessionId) throw new Error('Session ID is required');

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'customer', 'payment_intent', 'subscription']
        });

        return session;
    } catch (error) {
        console.error(`Error fetching checkout session ${sessionId}:`, error);
        throw new Error('Failed to fetch checkout session');
    }
}

/**
* Process checkout and redirect to Stripe
* @param {FormData} formData - Form data with checkout details
*/
export async function processCheckout(formData) {
    const cartJson = formData.get('cartItems');
    const cartItems = JSON.parse(cartJson);
    const customerId = formData.get('customerId') || null;

    try {
        const { url } = await createCheckoutSession(cartItems, customerId);
        redirect(url);
    } catch (error) {
        console.error('Error processing checkout:', error);
        throw new Error(`Checkout failed: ${error.message}`);
    }
}

/**
* Process subscription checkout and redirect to Stripe
* @param {FormData} formData - Form data with subscription details
*/
export async function processSubscriptionCheckout(formData) {
    const productJson = formData.get('product');
    const product = JSON.parse(productJson);
    const priceId = formData.get('priceId');
    const customerId = formData.get('customerId') || null;

    try {
        const { url } = await createSubscriptionCheckout(product, priceId, customerId);
        redirect(url);
    } catch (error) {
        console.error('Error processing subscription checkout:', error);
        throw new Error(`Subscription checkout failed: ${error.message}`);
    }
}