/**
 * Coupon Model
 * Manages promotional discount codes.
 */
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 }, // max discount for percentage type
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Check if coupon is valid
couponSchema.methods.isValid = function(cartTotal) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (new Date() > this.expiresAt) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit > 0 && this.usageCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (cartTotal < this.minPurchase) return { valid: false, message: `Minimum purchase of ₹${this.minPurchase} required` };
  return { valid: true };
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(cartTotal) {
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (cartTotal * this.discountValue) / 100;
    if (this.maxDiscount > 0) discount = Math.min(discount, this.maxDiscount);
  } else {
    discount = this.discountValue;
  }
  return Math.min(discount, cartTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
