// src/app/(dashboard)/subscriptions/page.js
import { getSubscriptions } from '@/lib/stripe/subscriptions';
import { SubscriptionList } from '@/components/subscription/subscription-list';

/**
 * Subscriptions dashboard page
 */
export default async function SubscriptionsPage() {
  // Fetch subscriptions
  const subscriptions = await getSubscriptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage recurring subscriptions from your customers.
        </p>
      </div>
      
      {/* Subscriptions list component */}
      <SubscriptionList subscriptions={subscriptions} />
    </div>
  );
}