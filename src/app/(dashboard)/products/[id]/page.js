// src/app/(dashboard)/products/[id]/page.js
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/stripe/products';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit, Archive, Tag, BarChart, Clock } from 'lucide-react';

/**
 * Product detail page
 * @param {Object} params - URL parameters
 * @param {string} params.id - Product ID
 */
export default async function ProductDetailPage({ params }) {
  try {
    // Fetch product data
    const product = await getProduct(params.id);
    
    // Format dates
    const createdDate = formatDate(new Date(product.created * 1000));
    const updatedDate = product.updated 
      ? formatDate(new Date(product.updated * 1000))
      : createdDate;
    
    // Get product image or placeholder
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/api/placeholder/600/400';

    // Check if product is a subscription
    const isSubscription = product.prices?.some(price => price.recurring);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              {product.active ? 'Active Product' : 'Inactive Product'} • Created on {createdDate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant={product.active ? "destructive" : "outline"}>
              <Archive className="mr-2 h-4 w-4" />
              {product.active ? 'Archive' : 'Restore'}
            </Button>
          </div>
        </div>
        
        {/* Product image and details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product image */}
          <Card className="lg:col-span-1">
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last updated: {updatedDate}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.active 
                    ? 'bg-success/20 text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Product details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Information about this product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{product.description || 'No description provided'}</p>
              </div>
              
              {/* Pricing */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Pricing</h3>
                <div className="space-y-2">
                  {product.prices && product.prices.length > 0 ? (
                    product.prices.map((price) => (
                      <div key={price.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatCurrency(price.unit_amount)}
                            {price.recurring && (
                              <span className="text-xs text-muted-foreground ml-1">
                                /{price.recurring.interval}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {price.active ? (
                            <span className="text-xs bg-success/20 text-success-foreground px-2 py-1 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No pricing information available</p>
                  )}
                </div>
              </div>
              
              {/* Metadata */}
              {product.metadata && Object.keys(product.metadata).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.metadata).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Product type */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  {isSubscription ? (
                    <>
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span>Subscription Product</span>
                    </>
                  ) : (
                    <>
                      <Tag className="h-5 w-5 text-green-500" />
                      <span>One-time Purchase</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {isSubscription 
                    ? 'This product is sold as a recurring subscription.' 
                    : 'This product is sold as a one-time purchase.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sales insights (placeholder for now) */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Insights</CardTitle>
            <CardDescription>
              Overview of product performance
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center flex-col text-center p-6">
            <BarChart className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Sales analytics for this product will appear here.</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/dashboard/analytics">
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}