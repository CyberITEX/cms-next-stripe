'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerCard } from './customer-card';
import { Search, UserPlus, Users } from 'lucide-react';

/**
 * Customer list component
 * @param {Object} props - Component props
 * @param {Array} props.customers - List of customers
 */
export function CustomerList({ customers = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter customers based on search query
  const filteredCustomers = searchQuery
    ? customers.filter(customer => 
        (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchQuery))
      )
    : customers;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input pl-10 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        {/* Add customer button */}
        <Button asChild>
          <Link href="/dashboard/customers/add">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>
      
      {/* Customer list */}
      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Customers Found</CardTitle>
            <CardDescription>
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first customer'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="text-center space-y-4">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/customers/add">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}