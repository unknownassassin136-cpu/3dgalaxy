/**
 * Coupon Routes
 * POST   /api/coupons/validate - Validate coupon code
 * GET    /api/coupons          - List all coupons (admin)
 * POST   /api/coupons          - Create coupon (admin)
 * PUT    /api/coupons/:id      - Update coupon (admin)
 * DELETE /api/coupons/:id      - Delete coupon (admin)
 */
const express = require('express');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Validate coupon
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

    const validation = coupon.isValid(cartTotal);
    if (!validation.valid) return res.status(400).json({ message: validation.message });

    const discount = coupon.calculateDiscount(cartTotal);
    res.json({ valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List all coupons (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create coupon (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update coupon (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
