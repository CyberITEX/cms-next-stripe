'use server';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get all customers
 * @param {Object} options - Query options
 * @returns {Array} - List of customers
 */
export async function getCustomers(options = { limit: 100 }) {
  try {
    const customers = await stripe.customers.list(options);
    return customers.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }
}

/**
 * Get a customer by ID
 * @param {string} customerId - Stripe customer ID
 * @returns {Object} - Customer data
 */
export async function getCustomer(customerId) {
  if (!customerId) throw new Error('Customer ID is required');
  
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error);
    throw new Error('Failed to fetch customer');
  }
}

/**
 * Create a new customer
 * @param {FormData} formData - Form data with customer info
 * @returns {Object} - Created customer
 */
export async function createCustomer(formData) {
  try {
    const email = formData.get('email');
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const phone = formData.get('phone') || '';
    
    if (!email) throw new Error('Email is required');
    
    const customer = await stripe.customers.create({
      email,
      name,
      description,
      phone,
      metadata: {
        createdAt: new Date().toISOString()
      }
    });
    
    revalidatePath('/customers');
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

/**
 * Update a customer
 * @param {string} customerId - Stripe customer ID
 * @param {FormData} formData - Form data with updated info
 * @returns {Object} - Updated customer
 */
export async function updateCustomer(customerId, formData) {
  if (!customerId) throw new Error('Customer ID is required');
  
  try {
    const email = formData.get('email');
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const phone = formData.get('phone') || '';
    
    if (!email) throw new Error('Email is required');
    
    const customer = await stripe.customers.update(customerId, {
      email,
      name,
      description,
      phone,
      metadata: {
        updatedAt: new Date().toISOString()
      }
    });
    
    revalidatePath(`/customers/${customerId}`);
    revalidatePath('/customers');
    return customer;
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    throw new Error(`Failed to update customer: ${error.message}`);
  }
}

/**
 * Delete a customer
 * @param {string} customerId - Stripe customer ID
 * @returns {Object} - Deletion confirmation
 */
export async function deleteCustomer(customerId) {
  if (!customerId) throw new Error('Customer ID is required');
  
  try {
    const deleted = await stripe.customers.del(customerId);
    
    revalidatePath('/customers');
    return deleted;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    throw new Error(`Failed to delete customer: ${error.message}`);
  }
}

/**
 * Search customers
 * @param {string} query - Search query
 * @returns {Array} - Search results
 */
export async function searchCustomers(query) {
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
    const result = await stripe.customers.search({
      query: `name~"${query}" OR email~"${query}"`,
      limit: 10
    });
    
    return result.data;
  } catch (error) {
    console.error('Error searching customers:', error);
    throw new Error('Failed to search customers');
  }
}