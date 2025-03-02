// src/app/(dashboard)/products/add/page.js
import { ProductForm } from '@/components/forms/product-form';

/**
 * Add new product page
 */
export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new digital product or subscription
        </p>
      </div>
      
      <ProductForm />
    </div>
  );
}