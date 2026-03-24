/**
 * Order Routes
 * POST /api/orders/create     - Create order
 * GET  /api/orders/my-orders  - Get user's orders
 * GET  /api/orders/:id        - Get order by ID
 * GET  /api/orders/all        - All orders (admin)
 * PUT  /api/orders/:id/status - Update order status (admin)
 */
const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/create', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, discount = 0 } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items and calculate totals
    const items = [];
    let itemsTotal = 0;
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} only has ${product.stock} in stock` });
      }
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      items.push({
        product: product._id, name: product.name,
        image: product.images[0] || '', price, quantity: item.quantity
      });
      itemsTotal += price * item.quantity;
    }

    const shippingCost = itemsTotal >= 999 ? 0 : 99; // Free shipping over ₹999
    const tax = Math.round(itemsTotal * 0.18 * 100) / 100; // 18% GST
    const totalPrice = itemsTotal + shippingCost + tax - discount;

    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentMethod,
      itemsTotal, shippingCost, tax, discount, couponCode, totalPrice
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin) - must be before /:id
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ orders, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Ensure user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
