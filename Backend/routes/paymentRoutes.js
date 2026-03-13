// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: (process.env.STRIPE_CURRENCY || 'usd').toLowerCase(),
      metadata: {
        orderId: order._id.toString(),
        regNumber: order.regNumber,
        studentName: order.studentName
      }
    });

    const payment = new Payment({
      order: order._id,
      amount: order.totalAmount,
      method: 'card',
      status: 'pending',
      transactionId: paymentIntent.id
    });
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Confirm Payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOneAndUpdate(
        { transactionId: paymentIntentId },
        { 
          status: 'completed',
          transactionId: paymentIntentId
        },
        { new: true }
      );

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid'
      });

      res.json({ success: true, message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// Webhook endpoint
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      try {
        const orderId = paymentIntent.metadata.orderId;
        await Payment.findOneAndUpdate(
          { transactionId: paymentIntent.id },
          { status: 'completed' }
        );
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid'
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});


module.exports = router;