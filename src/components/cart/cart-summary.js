'use client';

import React from 'react';
import { useCart } from '@/hooks/use-cart';
import { useTransactionFee } from '@/hooks/use-transaction-fee';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

/**
 * Cart summary component
 * @param {Object} props - Component props
 * @param {Function} props.onCheckout - Checkout handler function
 */
export function CartSummary({ onCheckout }) {
  const { items, subtotal, transactionFee, total } = useCart();
  
  // Check if cart is empty
  const isEmpty = items.length === 0;

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        
        {/* Summary rows */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-sm font-medium">{formatCurrency(subtotal)}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">Transaction Fee (5%)</p>
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xs">?</span>
              </span>
            </div>
            <p className="text-sm font-medium">{formatCurrency(transactionFee)}</p>
          </div>
          
          <div className="border-t pt-4 flex items-center justify-between font-medium">
            <p className="text-base">Total</p>
            <p className="text-base">{formatCurrency(total)}</p>
          </div>
        </div>
        
        {/* Checkout button */}
        <Button
          onClick={onCheckout}
          disabled={isEmpty}
          className="mt-6 w-full"
          size="lg"
        >
          <Check className="mr-2 h-4 w-4" />
          Checkout
        </Button>
        
        {/* Secure transaction note */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure transaction. Your information is private.
        </p>
      </div>
    </div>
  );
}