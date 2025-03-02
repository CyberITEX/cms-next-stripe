// src/app/(dashboard)/customers/[id]/edit/page.js
import { notFound } from 'next/navigation';
import { getCustomer } from '@/lib/stripe/customers';
import { CustomerForm } from '@/components/forms/customer-form';

/**
 * Edit customer page
 * @param {Object} params - URL parameters
 * @param {string} params.id - Customer ID
 */
export default async function EditCustomerPage({ params }) {
  try {
    // Fetch customer data
    const customer = await getCustomer(params.id);
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground mt-2">
            Update customer information
          </p>
        </div>
        
        <CustomerForm customer={customer} />
      </div>
    );
  } catch (error) {
    console.error('Error loading customer:', error);
    notFound();
  }
}