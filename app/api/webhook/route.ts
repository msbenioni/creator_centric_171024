import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(subscription);
      break;
    case 'invoice.paid':
      const invoice = event.data.object as Stripe.Invoice;
      await handleSuccessfulPayment(invoice);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      await handleFailedPayment(failedInvoice);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const customerId = subscription.customer as string;

  try {
    await db.query(
      'UPDATE creator_profiles SET subscription_status = $1, subscription_end_date = $2 WHERE stripe_customer_id = $3',
      [status, new Date(subscription.current_period_end * 1000), customerId]
    );
    console.log(`Updated subscription status for customer ${customerId} to ${status}`);
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  try {
    await db.query(
      'UPDATE creator_profiles SET last_payment_date = $1 WHERE stripe_customer_id = $2',
      [new Date(), customerId]
    );
    console.log(`Recorded successful payment for customer ${customerId}`);
  } catch (error) {
    console.error('Error recording successful payment:', error);
  }
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  try {
    await db.query(
      'UPDATE creator_profiles SET payment_failed_date = $1 WHERE stripe_customer_id = $2',
      [new Date(), customerId]
    );
    console.log(`Recorded failed payment for customer ${customerId}`);
    // TODO: Implement logic to notify the user about the failed payment
  } catch (error) {
    console.error('Error recording failed payment:', error);
  }
}