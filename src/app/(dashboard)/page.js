// src/app/(dashboard)/page.js
import { getProducts } from '@/lib/stripe/products';
import { getCustomers } from '@/lib/stripe/customers';
import { getOrders } from '@/lib/stripe/orders';
import { getSubscriptions } from '@/lib/stripe/subscriptions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Package, Receipt, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

/**
 * Dashboard overview page
 */
export default async function DashboardPage() {
  // Fetch data
  const products = await getProducts();
  const customers = await getCustomers();
  const orders = await getOrders();
  const subscriptions = await getSubscriptions();
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    return total + (order.amount || 0);
  }, 0);
  
  // Calculate subscription revenue
  const subscriptionRevenue = subscriptions.reduce((total, sub) => {
    return total + (sub.items?.data[0]?.price?.unit_amount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your digital store performance.
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Products stat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {products.filter(p => p.active).length} active
            </p>
          </CardContent>
        </Card>
        
        {/* Customers stat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime customers
            </p>
          </CardContent>
        </Card>
        
        {/* Orders stat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalRevenue)} total revenue
            </p>
          </CardContent>
        </Card>
        
        {/* Subscriptions stat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(subscriptionRevenue)} recurring revenue
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.slice(0, 5).length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-4">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Receipt className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(order.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent customers */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.slice(0, 5).length > 0 ? (
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center gap-4">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {customer.name || 'Unnamed Customer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(customer.created * 1000).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent customers</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}