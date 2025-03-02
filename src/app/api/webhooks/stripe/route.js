import { NextResponse } from 'next/server';
import { verifyStripeWebhook, processWebhookEvent } from '@/lib/stripe/webhooks';
import { headers } from 'next/headers';

/**
 * Stripe webhook handler
 * @param {Request} request - Incoming request
 */
export async function POST(request) {
  try {
    // Get the signature from the headers
    const signature = headers().get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }
    
    // Get the raw body
    const payload = await request.text();
    
    // Verify the webhook request
    const event = verifyStripeWebhook(payload, signature);
    
    // Process the webhook event
    const result = await processWebhookEvent(event);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}