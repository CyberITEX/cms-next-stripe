'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useContext } from 'react';
import { NotificationContext, NOTIFICATION_TYPES } from '@/context/notification-context';
import { createProduct, updateProduct } from '@/lib/stripe/products';

/**
 * Product form component
 * @param {Object} props - Component props
 * @param {Object} props.product - Existing product (for editing)
 */
export function ProductForm({ product }) {
    const router = useRouter();
    const { addNotification } = useContext(NotificationContext);

    // Form state
    const [loading, setLoading] = useState(false);
    const [isRecurring, setIsRecurring] = useState(
        product ? product.prices?.some(p => p.recurring) : false
    );

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);

            // Add recurring flag
            formData.append('isRecurring', isRecurring);

            // Create or update product
            if (product) {
                formData.append('priceId', product.defaultPrice?.id);
                await updateProduct(product.id, formData);
                addNotification({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: 'Product updated successfully'
                });
            } else {
                await createProduct(formData);
                addNotification({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: 'Product created successfully'
                });
            }

            // Redirect to products list
            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error submitting product:', error);
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: error.message || 'Failed to save product'
            });
        } finally {
            setLoading(false);
        }
    };

    // Generate interval options for subscriptions
    const intervalOptions = [
        { value: 'month', label: 'Monthly' },
        { value: 'year', label: 'Yearly' },
        { value: 'week', label: 'Weekly' },
        { value: 'day', label: 'Daily' }
    ];

    // Category options
    const categoryOptions = [
        { value: 'software', label: 'Software' },
        { value: 'services', label: 'Services' },
        { value: 'education', label: 'Education' },
        { value: 'tools', label: 'Tools' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {product ? 'Edit Product' : 'Create New Product'}
                </CardTitle>
                <CardDescription>
                    {product
                        ? 'Update your product details and pricing'
                        : 'Add a new product to your store'
                    }
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* Product name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            defaultValue={product?.name || ''}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Product description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            defaultValue={product?.description || ''}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Describe your product"
                        />
                    </div>

                    {/* Product category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={product?.metadata?.category || 'software'}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pricing section */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-base font-medium">Pricing</h3>

                        {/* Recurring toggle */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="recurring">Subscription Product</Label>
                                <p className="text-xs text-muted-foreground">
                                    Toggle to make this a recurring subscription
                                </p>
                            </div>
                            <Switch
                                id="recurring"
                                checked={isRecurring}
                                onCheckedChange={setIsRecurring}
                            />
                        </div>

                        {/* Price input */}
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price {product ? '(updates will create a new price)' : ''}
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    defaultValue={product?.defaultPrice ? (product.defaultPrice.unit_amount / 100).toFixed(2) : ''}
                                    className="w-full rounded-md border border-input bg-background pl-8 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Interval select (subscription only) */}
                        {isRecurring && (
                            <div className="space-y-2">
                                <Label htmlFor="interval">Billing Interval</Label>
                                <select
                                    id="interval"
                                    name="interval"
                                    defaultValue={product?.defaultPrice?.recurring?.interval || 'month'}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {intervalOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Active status (edit only) */}
                        {product && (
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="active">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Inactive products won't appear in your store
                                    </p>
                                </div>
                                <Switch
                                    id="active"
                                    name="isActive"
                                    defaultChecked={product.active}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/products')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                {product ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>{product ? 'Update Product' : 'Create Product'}</>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}