// src/app/(dashboard)/products/[id]/edit/page.js
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/stripe/products';
import { ProductForm } from '@/components/forms/product-form';

/**
 * Edit product page
 * @param {Object} params - URL parameters
 * @param {string} params.id - Product ID
 */
export default async function EditProductPage({ params }) {
  try {
    // Fetch product data
    const product = await getProduct(params.id);
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-2">
            Update product details and pricing
          </p>
        </div>
        
        <ProductForm product={product} />
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}