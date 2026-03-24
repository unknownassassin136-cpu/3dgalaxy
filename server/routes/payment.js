/**
 * Payment Routes
 * POST /api/payment/create-order - Create Razorpay order
 * POST /api/payment/verify       - Verify Razorpay payment signature
 * POST /api/payment/mock         - Mock payment for development
 */
const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Initialize Razorpay (only if keys are available)
let razorpayInstance = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized');
  } else {
    console.log('⚠️  Razorpay keys not configured. Using mock payment mode.');
  }
} catch (err) {
  console.log('⚠️  Razorpay module not available. Using mock payment mode.');
}

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!razorpayInstance) {
      return res.status(400).json({ message: 'Razorpay not configured. Use mock payment.', useMock: true });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.totalPrice * 100), // paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString() }
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Razorpay payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';
    order.paymentResult = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'completed'
    };
    await order.save();

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mock payment (for development without Razorpay keys)
router.post('/mock', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';
    order.paymentMethod = 'mock';
    order.paymentResult = {
      razorpayOrderId: 'mock_' + Date.now(),
      razorpayPaymentId: 'mock_pay_' + Date.now(),
      status: 'completed'
    };
    await order.save();

    res.json({ message: 'Mock payment successful', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Razorpay key for frontend
router.get('/key', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || '' });
});

module.exports = router;
