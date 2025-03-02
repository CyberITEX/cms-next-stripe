'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Mail, 
  Phone, 
  CreditCard, 
  Receipt, 
  Trash, 
  Edit 
} from 'lucide-react';
import { useContext } from 'react';
import { NotificationContext, NOTIFICATION_TYPES } from '@/context/notification-context';
import { deleteCustomer } from '@/lib/stripe/customers';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

/**
 * Customer card component
 * @param {Object} props - Component props
 * @param {Object} props.customer - Customer data
 */
export function CustomerCard({ customer }) {
  const router = useRouter();
  const { addNotification } = useContext(NotificationContext);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Format created date
  const createdDate = customer.created 
    ? formatDate(new Date(customer.created * 1000))
    : 'Unknown';
  
  // Handle customer deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await deleteCustomer(customer.id);
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Customer deleted successfully'
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting customer:', error);
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: error.message || 'Failed to delete customer'
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{customer.name || 'Unnamed Customer'}</CardTitle>
            <CardDescription>Customer since {createdDate}</CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="h-8 w-8"
            >
              <Link href={`/dashboard/customers/${customer.id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this customer? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact info */}
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        {customer.description && (
          <div className="pt-2 text-sm text-muted-foreground">
            {customer.description}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/customers/${customer.id}/subscriptions`}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscriptions
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/customers/${customer.id}/orders`}>
            <Receipt className="mr-2 h-4 w-4" />
            Orders
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}