// src/app/(dashboard)/customers/[id]/page.js
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomer } from '@/lib/stripe/customers';
import { getCustomerOrders } from '@/lib/stripe/orders';
import { getCustomerSubscriptions } from '@/lib/stripe/subscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, Edit, Receipt, CreditCard } from 'lucide-react';

/**
 * Customer detail page
 * @param {Object} params - URL parameters
 * @param {string} params.id - Customer ID
 */
export default async function CustomerDetailPage({ params }) {
  try {
    // Fetch customer details and related data
    const customer = await getCustomer(params.id);
    const orders = await getCustomerOrders(params.id);
    const subscriptions = await getCustomerSubscriptions(params.id);

    // Format date
    const createdDate = customer.created 
      ? formatDate(new Date(customer.created * 1000))
      : 'Unknown';

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name || 'Unnamed Customer'}</h1>
            <p className="text-muted-foreground mt-2">
              Customer since {createdDate}
            </p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/customers/${customer.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Link>
          </Button>
        </div>

        {/* Customer details card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Customer personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              
              {/* Phone (if available) */}
              {customer.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              
              {/* Description (if available) */}
              {customer.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mt-2">
                    {customer.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Overview of customer's purchases and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">{orders.length}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold mt-1">{subscriptions.length}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/customers/${customer.id}/orders`}>
                  <Receipt className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/customers/${customer.id}/subscriptions`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Subscriptions
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent activity section */}
        {(orders.length > 0 || subscriptions.length > 0) && (
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4 p-2 bg-primary/10 rounded-full">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(order.created * 1000))}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading customer:', error);
    notFound();
  }
}