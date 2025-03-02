// lib/stripe.js
import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from 'stripe';

// Load Stripe on client side
let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Initialize Stripe on server side
let stripe;
export const getStripeServer = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Use the latest API version
    });
  }
  return stripe;
};