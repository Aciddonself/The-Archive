import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || 'sk_test_default');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook needs raw body, so we need special handling
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for orders (in production, use a database)
const orders = new Map();

// Helper function to generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// API Routes

// 1. Create Payment Intent (Checkout Entry)
app.post('/api/checkout/create', async (req, res) => {
  try {
    const { customer, items, subtotal, shipping, total, currency } = req.body;

    console.log('=== CHECKOUT CREATE REQUEST ===');
    console.log('Customer:', customer);
    console.log('Items:', items);
    console.log('Subtotal:', subtotal);
    console.log('Shipping:', shipping);
    console.log('Total:', total);
    console.log('Currency:', currency || 'USD');
    console.log('================================');

    // Create order in our system
    const orderId = generateOrderId();
    const orderData = {
      id: orderId,
      customer,
      items,
      subtotal,
      shipping,
      total: total || (subtotal + shipping),
      currency: currency || 'usd',
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };

    // Store order
    orders.set(orderId, orderData);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((total || (subtotal + shipping)) * 100), // Stripe uses cents
      currency: currency || 'usd',
      metadata: {
        orderId: orderId,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`
      },
      description: 'Aromo-Mit Fashions Order',
      automatic_payment_methods: {
        enabled: true
      }
    });

    console.log('=== STRIPE PAYMENT INTENT CREATED ===');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret.substring(0, 20) + '...');
    console.log('Status:', paymentIntent.status);
    console.log('================================ // Update our order=====');

    // Update our order with Stripe Payment Intent ID
    orderData.stripePaymentIntentId = paymentIntent.id;
    orders.set(orderId, orderData);

    res.json({
      success: true,
      checkoutId: orderId,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: 'pending_payment',
      expiresAt: orderData.expiresAt
    });

  } catch (error) {
    console.error('Error creating checkout:', error);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create checkout',
      errorType: error.type,
      errorCode: error.code
    });
  }
});

// 2. Confirm Payment (webhook would handle this, but we also have an endpoint)
app.post('/api/checkout/confirm', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    console.log('=== CONFIRM PAYMENT REQUEST ===');
    console.log('Order ID:', orderId);
    console.log('Payment Intent ID:', paymentIntentId);
    console.log('================================');

    // Get order from storage
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      order.status = 'completed';
      order.paymentStatus = 'succeeded';
      order.paidAt = new Date().toISOString();
      orders.set(orderId, order);

      console.log('=== PAYMENT CONFIRMED ===');
      console.log('Order ID:', orderId);
      console.log('Status:', paymentIntent.status);
      console.log('=========================');

      res.json({
        success: true,
        orderId,
        status: 'completed',
        message: 'Payment completed successfully'
      });
    } else {
      res.json({
        success: false,
        status: paymentIntent.status,
        message: 'Payment not yet completed'
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to confirm payment'
    });
  }
});

// 3. Get Order Status
app.get('/api/checkout/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get order'
    });
  }
});

// 4. Stripe Webhook Handler
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('=== PAYMENT SUCCEEDED ===');
      console.log('PaymentIntent ID:', paymentIntent.id);
      console.log('Amount:', paymentIntent.amount / 100);
      console.log('=========================');
      
      // Update order in database
      const orderId = paymentIntent.metadata.orderId;
      if (orderId && orders.has(orderId)) {
        const order = orders.get(orderId);
        order.status = 'completed';
        order.paymentStatus = 'succeeded';
        order.paidAt = new Date().toISOString();
        orders.set(orderId, order);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('=== PAYMENT FAILED ===');
      console.log('PaymentIntent ID:', failedPayment.id);
      console.log('Error:', failedPayment.last_payment_error?.message);
      console.log('======================');
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// 5. Get Publishable Key (for frontend)
app.get('/api/stripe/config', (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    stripeMode: process.env.STRIPE_MODE || 'test'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 Aromo-Mit Fashions Backend Server                       ║
║                                                              ║
║   Server running on: http://localhost:${PORT}                 ║
║   Stripe Mode: ${process.env.STRIPE_MODE || 'test'}                                       ║
║                                                              ║
║   API Endpoints:                                             ║
║   - POST /api/checkout/create  - Create payment intent       ║
║   - POST /api/checkout/confirm - Confirm payment             ║
║   - GET  /api/checkout/:id    - Get order status            ║
║   - GET  /api/stripe/config   - Get Stripe publishable key   ║
║   - POST /api/stripe/webhook - Stripe webhook handler        ║
║   - GET  /api/health          - Health check                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
