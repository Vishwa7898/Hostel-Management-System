const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

// Create Payment Intent (for Stripe Elements)
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your order' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // LKR has 100 cents - amount must be in smallest unit (e.g. Rs.300 = 30000)
    const currency = (process.env.STRIPE_CURRENCY || 'lkr').toLowerCase();
    const isZeroDecimal = ['jpy', 'krw', 'vnd'].includes(currency);
    const amount = isZeroDecimal ? Math.round(order.totalAmount) : Math.round(Number(order.totalAmount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency === 'usd' ? 'usd' : 'lkr',
      metadata: { orderId: order._id.toString() },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ message: err.message || 'Payment failed' });
  }
});

// Confirm payment (update order after Stripe success)
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ message: 'paymentIntentId and orderId required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    if (paymentIntent.metadata.orderId !== orderId) {
      return res.status(400).json({ message: 'Order mismatch' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your order' });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.json({ message: 'Payment confirmed', order });
  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({ message: err.message || 'Failed to confirm' });
  }
});

module.exports = router;
