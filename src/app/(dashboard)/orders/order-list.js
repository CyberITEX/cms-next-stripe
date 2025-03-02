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
import { OrderCard } from './order-card';
import { Search, Filter, Calendar, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

/**
 * Order list component
 * @param {Object} props - Component props
 * @param {Array} props.orders - List of orders
 * @param {string} props.customerId - Optional customer ID to filter orders
 */
export function OrderList({ orders = [], customerId = null }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Filter orders based on search query and filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (order.id && order.id.toLowerCase().includes(query)) || 
        (order.customer && order.customer.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return a.created - b.created;
      case 'date-desc':
        return b.created - a.created;
      case 'amount-asc':
        return (a.amount || 0) - (b.amount || 0);
      case 'amount-desc':
        return (b.amount || 0) - (a.amount || 0);
      default:
        return b.created - a.created;
    }
  });

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'succeeded', label: 'Succeeded' },
    { value: 'processing', label: 'Processing' },
    { value: 'requires_payment_method', label: 'Payment Required' },
    { value: 'canceled', label: 'Canceled' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Amount: High to Low' },
    { value: 'amount-asc', label: 'Amount: Low to High' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input pl-10 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          <div className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort options */}
          <div className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh button */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.refresh()}
            title="Refresh orders"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Orders list */}
      {sortedOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
            <CardDescription>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No orders have been placed yet'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="text-center">
              <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Clear your filters to see all orders'
                  : 'Orders will appear here once customers make purchases'
                }
              </p>
              {customerId && (
                <Button className="mt-4" variant="outline" asChild>
                  <Link href={`/dashboard/customers/${customerId}`}>
                    Back to Customer
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