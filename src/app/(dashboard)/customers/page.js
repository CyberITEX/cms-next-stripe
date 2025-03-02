// src/app/(dashboard)/customers/page.js
import { getCustomers } from '@/lib/stripe/customers';
import { CustomerList } from '@/components/customer/customer-list';

/**
 * Customers dashboard page
 * Displays all customers with search and filtering options
 */
export default async function CustomersPage() {
  // Fetch all customers
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view customer information
        </p>
      </div>

      {/* Customer list component */}
      <CustomerList customers={customers} />
    </div>
  );
}