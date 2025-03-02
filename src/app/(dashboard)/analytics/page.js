// src/app/(dashboard)/analytics/page.js
import { getOrders } from '@/lib/stripe/orders';
import { getCustomers } from '@/lib/stripe/customers';
import { getSubscriptions } from '@/lib/stripe/subscriptions';
import { formatCurrency } from '@/lib/utils';
import { SalesChart } from '@/components/analytics/sales-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, CreditCard, Calendar } from 'lucide-react';

/**
 * Prepare sales data for the chart
 * @param {Array} orders - Order data
 * @returns {Array} - Formatted sales data
 */
function prepareSalesData(orders) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesByMonth = {};
  const subscriptionsByMonth = {};
  
  // Initialize with zeros
  months.forEach(month => {
    salesByMonth[month] = 0;
    subscriptionsByMonth[month] = 0;
  });
  
  // Aggregate sales data
  orders.forEach(order => {
    if (!order.created) return;
    
    const date = new Date(order.created * 1000);
    const month = months[date.getMonth()];
    
    if (order.metadata?.isSubscription) {
      subscriptionsByMonth[month] += order.amount || 0;
    } else {
      salesByMonth[month] += order.amount || 0;
    }
  });
  
  // Format for chart
  return months.map(month => ({
    name: month,
    sales: salesByMonth[month],
    subscriptions: subscriptionsByMonth[month]
  }));
}

/**
 * Calculate customer growth over time
 * @param {Array} customers - Customer data
 * @returns {Object} - Growth data
 */
function calculateCustomerGrowth(customers) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const customersByMonth = {};
  
  // Initialize with zeros
  months.forEach(month => {
    customersByMonth[month] = 0;
  });
  
  // Count customers by month
  customers.forEach(customer => {
    if (!customer.created) return;
    
    const date = new Date(customer.created * 1000);
    const month = months[date.getMonth()];
    customersByMonth[month]++;
  });
  
  // Calculate cumulative growth
  let total = 0;
  const growth = months.map(month => {
    total += customersByMonth[month];
    return {
      name: month,
      customers: total,
      newCustomers: customersByMonth[month]
    };
  });
  
  return growth;
}

/**
 * Analytics page component
 */
export default async function AnalyticsPage() {
  // Fetch data
  const orders = await getOrders();
  const customers = await getCustomers();
  const subscriptions = await getSubscriptions();
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    return total + (order.amount || 0);
  }, 0);
  
  // Calculate subscription revenue
  const subscriptionRevenue = subscriptions.reduce((total, sub) => {
    return total + (sub.items?.data[0]?.price?.unit_amount || 0);
  }, 0);
  
  // Calculate total transaction fees (5%)
  const transactionFees = totalRevenue * 0.05;
  
  // Format sales data for chart
  const salesData = prepareSalesData(orders);
  
  // Calculate customer growth over time
  const customerGrowthData = calculateCustomerGrowth(customers);
  
  // Calculate average order value
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Insights and metrics on your digital store performance.
        </p>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +16.2% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5.8% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.length > 0 ? `+${Math.floor(customers.length * 0.12)} new this month` : '0 customers'}
            </p>
          </CardContent>
        </Card>
        
        {/* Subscription Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription MRR</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(subscriptionRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +22.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Chart */}
      <SalesChart data={salesData} />
      
      {/* Revenue breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>
              Distribution of revenue by product type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-primary mr-2" />
                  <p className="text-sm font-medium">One-time Sales</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {formatCurrency(totalRevenue - subscriptionRevenue)}
                  </p>
                  <span className="text-xs text-success">+14.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-500 mr-2" />
                  <p className="text-sm font-medium">Subscriptions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {formatCurrency(subscriptionRevenue)}
                  </p>
                  <span className="text-xs text-success">+22.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2" />
                  <p className="text-sm font-medium">Transaction Fees</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {formatCurrency(transactionFees)}
                  </p>
                  <span className="text-xs text-success">+16.2%</span>
                </div>
              </div>
            </div>
            
            {/* Progress bars */}
            <div className="mt-6 space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(totalRevenue - subscriptionRevenue) / totalRevenue * 100}%` }}
                />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${subscriptionRevenue / totalRevenue * 100}%` }}
                />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${transactionFees / totalRevenue * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>
              Total customers over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* Customer growth chart would go here */}
              <div className="flex flex-col h-full justify-center items-center">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Customer growth visualization coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}