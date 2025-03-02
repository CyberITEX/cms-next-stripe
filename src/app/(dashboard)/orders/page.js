// src/app/(dashboard)/orders/page.js
import { getOrders } from '@/lib/stripe/orders';
import { OrderList } from '@/components/order/order-list';

/**
 * Orders dashboard page
 */
export default async function OrdersPage() {
  // Fetch orders
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all orders from your customers.
        </p>
      </div>
      
      {/* Orders list component */}
      <OrderList orders={orders} />
    </div>
  );
}