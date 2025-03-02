'use client';

import React from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, X, Package } from 'lucide-react';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { Button } from '@/components/ui/button';
import { processCheckout } from '@/lib/stripe/checkout';

/**
 * Cart drawer component
 */
export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    clearCart, 
    itemCount 
  } = useCart();

  // Handle checkout
  const handleCheckout = async () => {
    // This would typically be handled by a form submission
    // But for simplicity, we're directly calling the server action
    const formData = new FormData();
    formData.append('cartItems', JSON.stringify(items));
    
    // Process checkout with our Stripe server action
    await processCheckout(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div 
        id="cart-drawer"
        className="fixed right-0 top-0 z-40 h-screen w-full max-w-md overflow-y-auto border-l bg-background p-6 shadow-xl transition-transform sm:max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart
            <span className="ml-2 text-sm text-muted-foreground">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Cart content */}
        <div className="mt-6">
          {items.length > 0 ? (
            <>
              {/* Cart items */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.id}>
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Cart actions */}
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                >
                  Clear cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeCart}
                >
                  Continue shopping
                </Button>
              </div>
              
              {/* Cart summary */}
              <div className="mt-6">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Button
                className="mt-6"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}