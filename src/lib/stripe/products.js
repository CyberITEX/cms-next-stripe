'use server';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import { createSlug } from '../utils';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get all products with prices
 * @param {Object} options - Query options
 * @returns {Array} - List of products with prices
 */
export async function getProducts(options = { active: true, limit: 100 }) {
  try {
    const products = await stripe.products.list(options);
    
    // Fetch prices for each product
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        
        return {
          ...product,
          prices: prices.data,
          defaultPrice: prices.data[0] || null
        };
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Get a product by ID with prices
 * @param {string} productId - Stripe product ID
 * @returns {Object} - Product data with prices
 */
export async function getProduct(productId) {
  if (!productId) throw new Error('Product ID is required');
  
  try {
    const product = await stripe.products.retrieve(productId);
    const prices = await stripe.prices.list({
      product: productId,
      active: true
    });
    
    return {
      ...product,
      prices: prices.data,
      defaultPrice: prices.data[0] || null
    };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Create a new product with price
 * @param {FormData} formData - Form data with product info
 * @returns {Object} - Created product with price
 */
export async function createProduct(formData) {
  try {
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const priceAmount = parseFloat(formData.get('price') || '0');
    const isRecurring = formData.get('isRecurring') === 'true';
    const interval = formData.get('interval') || 'month'; // month, year
    const category = formData.get('category') || 'uncategorized';
    
    if (!name) throw new Error('Product name is required');
    if (priceAmount <= 0) throw new Error('Valid price is required');
    
    // Create a slug from the name
    const slug = createSlug(name);
    
    // Create the product
    const product = await stripe.products.create({
      name,
      description,
      metadata: {
        category,
        slug
      }
    });
    
    // Create the price
    const priceData = {
      product: product.id,
      currency: 'usd',
      unit_amount: Math.round(priceAmount * 100), // Convert to cents
    };
    
    // Add recurring info if it's a subscription
    if (isRecurring) {
      priceData.recurring = {
        interval: interval,
        usage_type: 'licensed'
      };
    }
    
    const price = await stripe.prices.create(priceData);
    
    revalidatePath('/products');
    
    return {
      ...product,
      prices: [price],
      defaultPrice: price
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

/**
 * Update a product
 * @param {string} productId - Stripe product ID
 * @param {FormData} formData - Form data with updated info
 * @returns {Object} - Updated product
 */
export async function updateProduct(productId, formData) {
  if (!productId) throw new Error('Product ID is required');
  
  try {
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const priceId = formData.get('priceId');
    const priceAmount = parseFloat(formData.get('price') || '0');
    const isActive = formData.get('isActive') === 'true';
    const category = formData.get('category') || 'uncategorized';
    
    if (!name) throw new Error('Product name is required');
    
    // Update the product
    const product = await stripe.products.update(productId, {
      name,
      description,
      active: isActive,
      metadata: {
        category,
        updatedAt: new Date().toISOString()
      }
    });
    
    // Update price if provided
    if (priceId && priceAmount > 0) {
      // Deactivate old price
      await stripe.prices.update(priceId, { active: false });
      
      // Get original price to check if recurring
      const originalPrice = await stripe.prices.retrieve(priceId);
      
      // Create new price
      const priceData = {
        product: productId,
        currency: 'usd',
        unit_amount: Math.round(priceAmount * 100), // Convert to cents
      };
      
      // Add recurring info if original was recurring
      if (originalPrice.recurring) {
        priceData.recurring = {
          interval: originalPrice.recurring.interval,
          usage_type: 'licensed'
        };
      }
      
      await stripe.prices.create(priceData);
    }
    
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    
    // Fetch updated product with new prices
    return getProduct(productId);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

/**
 * Delete a product
 * @param {string} productId - Stripe product ID
 * @returns {Object} - Deletion confirmation
 */
export async function deleteProduct(productId) {
  if (!productId) throw new Error('Product ID is required');
  
  try {
    const deleted = await stripe.products.update(productId, {
      active: false
    });
    
    revalidatePath('/products');
    return deleted;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Array} - Products in category
 */
export async function getProductsByCategory(category) {
  if (!category) return [];
  
  try {
    const products = await stripe.products.search({
      query: `active:'true' AND metadata['category']:'${category}'`,
      limit: 100
    });
    
    // Fetch prices for each product
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        
        return {
          ...product,
          prices: prices.data,
          defaultPrice: prices.data[0] || null
        };
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    throw new Error('Failed to fetch products by category');
  }
}

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Array} - Search results
 */
export async function searchProducts(query) {
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
    const result = await stripe.products.search({
      query: `active:'true' AND (name~'${query}' OR description~'${query}')`,
      limit: 10
    });
    
    // Fetch prices for each product
    const productsWithPrices = await Promise.all(
      result.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        
        return {
          ...product,
          prices: prices.data,
          defaultPrice: prices.data[0] || null
        };
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}