// src/app/(dashboard)/products/page.js
import Link from 'next/link';
import { getProducts } from '@/lib/stripe/products';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

/**
 * Products dashboard page
 * Displays all products with filtering options
 */
export default async function ProductsPage() {
  // Fetch all products
  const products = await getProducts({ active: true });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital products and subscriptions
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-md border border-input pl-10 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <select
            className="h-9 rounded-md border border-input px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue="all"
          >
            <option value="all">All Products</option>
            <option value="one-time">One-time Products</option>
            <option value="subscription">Subscriptions</option>
          </select>
        </div>
      </div>
      
      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              Get started by adding your first product
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button asChild>
              <Link href="/dashboard/products/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Product card component for dashboard
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 */
function ProductCard({ product }) {
  // Check if product has prices
  const hasPrice = product.prices && product.prices.length > 0;
  
  // Check if product is a subscription
  const isSubscription = hasPrice && product.prices.some(price => price.recurring);
  
  // Get default price
  const defaultPrice = product.defaultPrice || (hasPrice ? product.prices[0] : null);
  
  // Format price display
  const priceDisplay = defaultPrice 
    ? formatCurrency(defaultPrice.unit_amount) 
    : 'No price set';
  
  // Subscription interval if applicable
  const interval = isSubscription && defaultPrice?.recurring
    ? `/${defaultPrice.recurring.interval}`
    : '';
    
  // Get product image or placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/api/placeholder/300/200';
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="h-40 bg-muted bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
            <CardDescription>
              {isSubscription ? 'Subscription' : 'One-time purchase'}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-semibold">{priceDisplay}{interval}</p>
            <p className="text-xs text-muted-foreground">
              {product.active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </CardHeader>
      <div className="p-4 pt-0 flex justify-between border-t mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/products/${product.id}`}>
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/products/${product.id}/edit`}>
            Edit
          </Link>
        </Button>
      </div>
    </Card>
  );
}