// src/app/(dashboard)/orders/[id]/page.js
import { getOrder, generateOrderDownloadLink } from '@/lib/stripe/orders';
import { getCustomer } from '@/lib/stripe/customers';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Download, Mail, User, Clock, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';

/**
 * Order detail page
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 */
export default async function OrderDetailPage({ params }) {
  const { id } = params;
  
  // Fetch order details
  const order = await getOrder(id);
  
  // Fetch customer details if available
  let customer = null;
  if (order.customer) {
    customer = await getCustomer(order.customer);
  }
  
  // Generate download links for digital products
  const { downloadLinks } = await generateOrderDownloadLink(id);
  
  // Format order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-success/10 text-success';
      case 'processing':
        return 'bg-warning/10 text-warning';
      case 'requires_payment_method':
        return 'bg-info/10 text-info';
      case 'canceled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/dashboard/orders" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(-8)}</h1>
        <div className="flex items-center">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
          <span className="text-sm text-muted-foreground ml-3">
            {formatDate(new Date(order.created * 1000))}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order details and line items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Line items */}
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-3 rounded-t-md">
                  <h3 className="font-medium">Line Items</h3>
                </div>
                <div className="divide-y">
                  {order.metadata?.productIds ? (
                    order.metadata.productIds.split(',').map((productId, index) => (
                      <div key={productId} className="px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Product #{index + 1}</p>
                          <p className="text-sm text-muted-foreground">{productId}</p>
                        </div>
                        {/* If we had actual line item data, we would show prices here */}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-muted-foreground">No line items found</p>
                    </div>
                  )}
                  
                  {/* Transaction fee */}
                  <div className="px-4 py-3 flex justify-between items-center bg-muted/50">
                    <p className="text-sm">Transaction Fee (5%)</p>
                    <p className="font-medium">
                      {formatCurrency(order.amount * 0.05 || 0)}
                    </p>
                  </div>
                  
                  {/* Total */}
                  <div className="px-4 py-3 flex justify-between items-center">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">
                      {formatCurrency(order.amount || 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Payment details */}
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-3 rounded-t-md">
                  <h3 className="font-medium">Payment Information</h3>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex">
                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">
                        {order.payment_method_types?.[0] ? 
                          order.payment_method_types[0].replace('_', ' ').toUpperCase() : 
                          'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Payment Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(order.created * 1000))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download links */}
              {downloadLinks && downloadLinks.length > 0 && (
                <div className="border rounded-md">
                  <div className="bg-muted px-4 py-3 rounded-t-md">
                    <h3 className="font-medium">Digital Downloads</h3>
                  </div>
                  <div className="divide-y">
                    {downloadLinks.map((link) => (
                      <div key={link.productId} className="px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{link.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            Expires: {formatDate(new Date(link.expiresAt))}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={link.downloadUrl}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Customer information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Customer information</CardDescription>
          </CardHeader>
          <CardContent>
            {customer ? (
              <div className="space-y-4">
                <div className="flex">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm">{customer.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="flex">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer ID</p>
                    <p className="text-sm text-muted-foreground">{customer.id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No customer information available</p>
            )}
          </CardContent>
          <CardFooter>
            {customer && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/customers/${customer.id}`}>
                  View Customer Profile
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}