import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { authMiddleware } from '@/lib/auth';
import db from '@/lib/db';

async function createSubscription(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;
  const { paymentMethodId, subscriptionType } = await req.json();

  try {
    // Fetch user details
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    const userEmail = userResult.rows[0].email;

    // Create or retrieve Stripe customer
    const customerResult = await db.query('SELECT stripe_customer_id FROM creator_profiles WHERE user_id = $1', [userId]);
    let customerId;

    if (customerResult.rows.length > 0 && customerResult.rows[0].stripe_customer_id) {
      customerId = customerResult.rows[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
      await db.query('INSERT INTO creator_profiles (user_id, stripe_customer_id) VALUES ($1, $2)', [userId, customerId]);
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: process.env.STRIPE_PRICE_ID }], // You need to create this price in your Stripe dashboard
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: subscriptionType === 'trial' ? 30 : undefined,
    });

    // Update database
    await db.query(
      'UPDATE creator_profiles SET subscription_id = $1, subscription_status = $2 WHERE user_id = $3',
      [subscription.id, subscription.status, userId]
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export const POST = authMiddleware(createSubscription);