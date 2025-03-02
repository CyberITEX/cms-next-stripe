'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Repeat } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '@/context/app-context';

/**
 * Product card component
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 */
export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useContext(AppContext);
  
  // Check if product has prices
  const hasPrice = product.prices && product.prices.length > 0;
  
  // Check if product is a subscription
  const isSubscription = hasPrice && product.prices.some(price => price.recurring);
  
  // Get default price
  const defaultPrice = product.defaultPrice || (hasPrice ? product.prices[0] : null);
  
  // Handle view details - add to recently viewed
  const handleViewDetails = () => {
    addToRecentlyViewed(product);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    addItem(product);
  };
  
  // Placeholder image if none provided
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/api/placeholder/300/200';

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Product image */}
      <Link 
        href={`/products/${product.id}`}
        className="aspect-[4/3] w-full overflow-hidden"
        onClick={handleViewDetails}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className="h-full w-full object-cover object-center transition-transform hover:scale-105"
        />
      </Link>
      
      {/* Product content */}
      <CardContent className="flex-grow p-4">
        {/* Subscription badge */}
        {isSubscription && (
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Repeat className="mr-1 h-3 w-3" />
              Subscription
            </span>
          </div>
        )}
        
        {/* Product title */}
        <Link 
          href={`/products/${product.id}`}
          className="block font-medium hover:underline"
          onClick={handleViewDetails}
        >
          {product.name}
        </Link>
        
        {/* Product description */}
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.description || "No description available"}
        </p>
        
        {/* Product price */}
        <div className="mt-3 flex items-center">
          {defaultPrice ? (
            <div className="flex items-baseline">
              <span className="font-medium">
                {formatCurrency(defaultPrice.unit_amount)}
              </span>
              {isSubscription && (
                <span className="ml-1 text-xs text-muted-foreground">
                  /{defaultPrice.recurring?.interval || 'month'}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Price not available
            </span>
          )}
        </div>
      </CardContent>
      
      {/* Product actions */}
      <CardFooter className="border-t p-4">
        <div className="flex w-full justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link 
              href={`/products/${product.id}`}
              onClick={handleViewDetails}
            >
              View Details
            </Link>
          </Button>
          
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!defaultPrice || isSubscription}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isSubscription ? 'Subscribe' : 'Add to Cart'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}