'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  User, 
  Calendar, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * Order card component
 * @param {Object} props - Component props
 * @param {Object} props.order - Order data
 */
export function OrderCard({ order }) {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
            <div className="flex items-center mt-1">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold">{formatCurrency(order.amount || 0)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Order details */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(new Date(order.created * 1000))}</span>
          </div>
          
          {/* Customer */}
          {order.customer && (
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {order.customer_details?.name || 'Customer ID: ' + order.customer.slice(-8)}
              </span>
            </div>
          )}
          
          {/* Payment method */}
          <div className="flex items-center text-sm">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {order.payment_method_types?.[0] 
                ? order.payment_method_types[0].replace('_', ' ').toUpperCase() 
                : 'Unknown payment method'}
            </span>
          </div>
        </div>
        
        {/* Items info */}
        {order.metadata?.productIds && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-1">Products:</p>
            <div className="space-y-1">
              {order.metadata.productIds.split(',').map((id, index) => (
                <div key={index} className="text-sm flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  <span>Product ID: {id.slice(-8)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/orders/${order.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
        
        {order.status === 'succeeded' && (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}