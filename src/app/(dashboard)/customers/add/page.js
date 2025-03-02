// src/app/(dashboard)/customers/add/page.js
import { CustomerForm } from '@/components/forms/customer-form';

/**
 * Add new customer page
 */
export default function AddCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        <p className="text-muted-foreground mt-2">
          Create a new customer in your Stripe account
        </p>
      </div>
      
      <CustomerForm />
    </div>
  );
}