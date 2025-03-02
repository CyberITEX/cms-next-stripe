'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';

/**
 * Cart item component
 * @param {Object} props - Component props
 * @param {Object} props.item - Cart item data
 */
export function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  // Placeholder image if none provided
  const imageUrl = item.image || '/api/placeholder/100/100';

  return (
    <div className="flex py-6 border-b">
      {/* Product image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={imageUrl}
          alt={item.name}
          width={100}
          height={100}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">{item.name}</h3>
            <p className="ml-4 text-sm font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {item.description}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex flex-1 items-end justify-between">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="p-1 hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-muted"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => removeItem(item.id)}
            className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}