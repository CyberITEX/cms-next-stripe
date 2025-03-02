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
import { Label } from '@/components/ui/label';
import { useContext } from 'react';
import { NotificationContext, NOTIFICATION_TYPES } from '@/context/notification-context';
import { createCustomer, updateCustomer } from '@/lib/stripe/customers';
import { isValidEmail } from '@/lib/utils';

/**
 * Customer form component
 * @param {Object} props - Component props
 * @param {Object} props.customer - Existing customer (for editing)
 */
export function CustomerForm({ customer }) {
  const router = useRouter();
  const { addNotification } = useContext(NotificationContext);
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Validate form
  const validateForm = (formData) => {
    const newErrors = {};
    
    const email = formData.get('email');
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    const name = formData.get('name');
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    if (!validateForm(formData)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create or update customer
      if (customer) {
        await updateCustomer(customer.id, formData);
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Customer updated successfully'
        });
      } else {
        await createCustomer(formData);
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Customer created successfully'
        });
      }
      
      // Redirect to customers list
      router.push('/dashboard/customers');
      router.refresh();
    } catch (error) {
      console.error('Error submitting customer:', error);
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: error.message || 'Failed to save customer'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {customer ? 'Edit Customer' : 'Add New Customer'}
        </CardTitle>
        <CardDescription>
          {customer 
            ? 'Update customer details' 
            : 'Create a new customer in your Stripe account'
          }
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={customer?.email || ''}
              className={`w-full rounded-md border ${errors.email ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              placeholder="customer@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={customer?.name || ''}
              className={`w-full rounded-md border ${errors.name ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              placeholder="Full name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={customer?.phone || ''}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={customer?.description || ''}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Additional notes about the customer"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/customers')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                {customer ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{customer ? 'Update Customer' : 'Add Customer'}</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}