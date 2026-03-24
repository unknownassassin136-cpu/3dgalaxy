/**
 * Seed Script
 * Populates the database with sample categories, products, an admin user, and coupons.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const seedData = async () => {
  await connectDB();
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Coupon.deleteMany({});

  // --- Admin User ---
  const admin = await User.create({
    name: 'Admin', email: 'admin@3dgalaxy.com', password: 'admin123',
    role: 'admin', phone: '+91 9876543210'
  });
  const demoUser = await User.create({
    name: 'Demo User', email: 'user@3dgalaxy.com', password: 'user123',
    role: 'user', phone: '+91 9876543211'
  });
  console.log('👤 Users created');

  // --- Categories ---
  const categories = await Category.insertMany([
    { name: '3D Miniatures', slug: '3d-miniatures', description: 'Custom 3D printed miniature figurines of yourself and loved ones', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
    { name: '3D Moon Lamps', slug: '3d-moon-lamps', description: 'Personalized 3D moon lamps with your photos', image: 'https://images.unsplash.com/photo-1532186773960-85649e5cb70b?w=400' },
    { name: 'Heart Lamps', slug: 'heart-lamps', description: 'Beautiful heart-shaped lamps with custom engravings', image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400' },
    { name: 'Name Plates', slug: 'name-plates', description: 'Dual name flip name plates and desk accessories', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' },
    { name: 'Couple Gifts', slug: 'couple-gifts', description: 'Romantic customized gifts for couples', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400' },
    { name: 'God Idols', slug: 'god-idols', description: '3D printed religious idols and spiritual figurines', image: 'https://images.unsplash.com/photo-1567591370504-cd227ce4a3e0?w=400' }
  ]);
  console.log('📂 Categories created');

  const [miniatures, moonLamps, heartLamps, namePlates, coupleGifts, godIdols] = categories;

  // --- Products ---
  const products = await Product.insertMany([
    {
      name: 'Personalized Single Full Body 3D Miniature',
      slug: 'personalized-single-full-body-3d-miniature',
      description: 'Get a stunning 3D miniature of yourself or your loved ones. Our state-of-the-art 3D printing technology creates lifelike miniatures with incredible detail. Perfect for birthdays, anniversaries, and special occasions. Each miniature is handcrafted with precision and care.',
      shortDescription: 'Lifelike 3D printed miniature figurine',
      price: 2499, salePrice: 1999,
      images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600'],
      category: miniatures._id, stock: 50, sku: 'MIN-SFB-001',
      tags: ['miniature', 'personalized', 'gift', 'birthday'], featured: true,
      averageRating: 4.5, numReviews: 24,
      specifications: [{ key: 'Height', value: '15-20 cm' }, { key: 'Material', value: 'PLA/Resin' }, { key: 'Production Time', value: '7-10 days' }]
    },
    {
      name: 'Couple Full Body 3D Miniature',
      slug: 'couple-full-body-3d-miniature',
      description: 'Celebrate your love with a beautiful couple 3D miniature. This exquisite piece captures both of you in stunning detail, making it the perfect anniversary or wedding gift.',
      shortDescription: 'Beautiful couple miniature figurine',
      price: 3999, salePrice: 3499,
      images: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600'],
      category: miniatures._id, stock: 30, sku: 'MIN-CFB-001',
      tags: ['couple', 'miniature', 'anniversary', 'wedding'], featured: true,
      averageRating: 4.8, numReviews: 18,
      specifications: [{ key: 'Height', value: '15-20 cm' }, { key: 'Material', value: 'PLA/Resin' }, { key: 'Figures', value: '2 persons' }]
    },
    {
      name: 'Single Half Bust 3D Miniature',
      slug: 'single-half-bust-3d-miniature',
      description: 'An elegant half-bust miniature that captures your likeness from the waist up. Perfect for desk decoration or as a memorable gift.',
      shortDescription: 'Elegant half-bust 3D figurine',
      price: 1999, salePrice: 1499,
      images: ['https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600'],
      category: miniatures._id, stock: 40, sku: 'MIN-SHB-001',
      tags: ['miniature', 'bust', 'desk', 'gift'], featured: false,
      averageRating: 4.3, numReviews: 12
    },
    {
      name: 'Family Full Body 3D Miniature (3 Members)',
      slug: 'family-full-body-3d-miniature',
      description: 'Bring your whole family together in miniature form! This beautiful piece captures up to 3 family members with stunning detail.',
      shortDescription: 'Family 3D miniature for 3 members',
      price: 5499, salePrice: 4999,
      images: ['https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600'],
      category: miniatures._id, stock: 20, sku: 'MIN-FAM-001',
      tags: ['family', 'miniature', 'group', 'gift'], featured: true,
      averageRating: 4.7, numReviews: 8
    },
    {
      name: 'Personalized Single Color 3D Moon Lamp',
      slug: 'personalized-single-color-3d-moon-lamp',
      description: 'A magical personalized moon lamp with your photo printed on it. Illuminates your room with a warm, romantic glow. Features touch control for brightness adjustment.',
      shortDescription: 'Photo moon lamp with warm glow',
      price: 1299, salePrice: 999,
      images: ['https://images.unsplash.com/photo-1532186773960-85649e5cb70b?w=600', 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600'],
      category: moonLamps._id, stock: 60, sku: 'MOON-SC-001',
      tags: ['moon', 'lamp', 'romantic', 'anniversary'], featured: true,
      averageRating: 4.6, numReviews: 32,
      specifications: [{ key: 'Diameter', value: '12 cm' }, { key: 'Light', value: 'LED warm white' }, { key: 'Power', value: 'USB rechargeable' }]
    },
    {
      name: 'Multi-Color 3D Moon Lamp',
      slug: 'multi-color-3d-moon-lamp',
      description: '16-color changing personalized moon lamp with remote control. Features photo printing and optional text engraving.',
      shortDescription: '16-color photo moon lamp with remote',
      price: 1799, salePrice: 1499,
      images: ['https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600'],
      category: moonLamps._id, stock: 45, sku: 'MOON-MC-001',
      tags: ['moon', 'lamp', 'color', 'remote'], featured: false,
      averageRating: 4.4, numReviews: 15
    },
    {
      name: 'Crystal Heart Photo Lamp',
      slug: 'crystal-heart-photo-lamp',
      description: 'A stunning crystal heart lamp that projects your photo in 3D. Perfect romantic gift with LED base and color-changing lights.',
      shortDescription: 'Crystal heart with 3D photo projection',
      price: 1499, salePrice: 1199,
      images: ['https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600'],
      category: heartLamps._id, stock: 35, sku: 'HEART-CL-001',
      tags: ['heart', 'crystal', 'romantic', 'photo'], featured: true,
      averageRating: 4.5, numReviews: 20
    },
    {
      name: 'Rotating Heart Photo Frame Lamp',
      slug: 'rotating-heart-photo-frame-lamp',
      description: 'A mesmerizing rotating heart lamp with space for 3 photos. Spins slowly creating a beautiful display of memories.',
      shortDescription: 'Rotating heart lamp with 3 photos',
      price: 999, salePrice: 799,
      images: ['https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600'],
      category: heartLamps._id, stock: 50, sku: 'HEART-RF-001',
      tags: ['heart', 'rotating', 'frame', 'lamp'], featured: false,
      averageRating: 4.2, numReviews: 10
    },
    {
      name: 'Customised Dual Name Table Top',
      slug: 'customised-dual-name-table-top',
      description: 'A beautifully crafted flip name plate that displays two names. Perfect for couples, best friends, or parent-child gifts. Made with premium acrylic.',
      shortDescription: 'Dual flip name desk accessory',
      price: 899, salePrice: 699,
      images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'],
      category: namePlates._id, stock: 70, sku: 'NAME-DT-001',
      tags: ['name', 'table', 'couple', 'desk'], featured: true,
      averageRating: 4.6, numReviews: 28
    },
    {
      name: 'LED Name Plate with Clock',
      slug: 'led-name-plate-with-clock',
      description: 'Modern LED name plate with built-in digital clock and temperature display. Customisable with your name in various fonts.',
      shortDescription: 'LED name plate with clock display',
      price: 1299, salePrice: 999,
      images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'],
      category: namePlates._id, stock: 30, sku: 'NAME-LC-001',
      tags: ['name', 'LED', 'clock', 'modern'], featured: false,
      averageRating: 4.3, numReviews: 7
    },
    {
      name: 'Couple Photo Keychain Set',
      slug: 'couple-photo-keychain-set',
      description: 'A pair of matching keychains with your couple photos. Made with crystal-clear resin and stainless steel rings.',
      shortDescription: 'Matching photo keychains for couples',
      price: 599, salePrice: 449,
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=600'],
      category: coupleGifts._id, stock: 100, sku: 'COUP-KC-001',
      tags: ['couple', 'keychain', 'matching', 'photo'], featured: false,
      averageRating: 4.1, numReviews: 14
    },
    {
      name: 'Couple 3D Photo Crystal',
      slug: 'couple-3d-photo-crystal',
      description: 'Your couple photo laser-engraved inside a premium crystal block. Comes with a beautiful LED light base for stunning display.',
      shortDescription: '3D laser-engraved crystal with LED base',
      price: 2499, salePrice: 1999,
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=600'],
      category: coupleGifts._id, stock: 25, sku: 'COUP-3C-001',
      tags: ['couple', 'crystal', '3D', 'photo', 'premium'], featured: true,
      averageRating: 4.9, numReviews: 22
    },
    {
      name: 'Ganesha 3D Printed Idol',
      slug: 'ganesha-3d-printed-idol',
      description: 'A beautifully detailed 3D printed Ganesha idol. Eco-friendly material with premium finish. Perfect for home or office.',
      shortDescription: 'Eco-friendly 3D Ganesha figurine',
      price: 1299, salePrice: 999,
      images: ['https://images.unsplash.com/photo-1567591370504-cd227ce4a3e0?w=600'],
      category: godIdols._id, stock: 40, sku: 'GOD-GAN-001',
      tags: ['ganesha', 'idol', 'religious', 'spiritual'], featured: true,
      averageRating: 4.7, numReviews: 16
    },
    {
      name: 'Buddha 3D Printed Idol',
      slug: 'buddha-3d-printed-idol',
      description: 'A serene 3D printed Buddha idol. Brings peace and tranquility to any space. Available in multiple sizes.',
      shortDescription: 'Peaceful 3D Buddha figurine',
      price: 1499, salePrice: 1199,
      images: ['https://images.unsplash.com/photo-1567591370504-cd227ce4a3e0?w=600'],
      category: godIdols._id, stock: 35, sku: 'GOD-BUD-001',
      tags: ['buddha', 'idol', 'peace', 'spiritual'], featured: false,
      averageRating: 4.5, numReviews: 9
    },
    {
      name: 'Pet 3D Miniature',
      slug: 'pet-3d-miniature',
      description: 'Immortalize your furry friend with a lifelike 3D miniature. We capture every detail of your beloved pet.',
      shortDescription: 'Custom 3D miniature of your pet',
      price: 1999, salePrice: 1699,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
      category: miniatures._id, stock: 25, sku: 'MIN-PET-001',
      tags: ['pet', 'miniature', 'dog', 'cat', 'animal'], featured: false,
      averageRating: 4.8, numReviews: 6
    },
    {
      name: 'Galaxy Night Lamp',
      slug: 'galaxy-night-lamp',
      description: 'A mesmerizing galaxy projection night lamp. Projects stars and nebulae across your ceiling. Features timer and multiple color modes.',
      shortDescription: 'Galaxy star projector night lamp',
      price: 1799, salePrice: 1399,
      images: ['https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600'],
      category: moonLamps._id, stock: 30, sku: 'MOON-GL-001',
      tags: ['galaxy', 'projector', 'night', 'stars'], featured: true,
      averageRating: 4.6, numReviews: 19
    },
    {
      name: 'Anniversary Special Combo',
      slug: 'anniversary-special-combo',
      description: 'The perfect anniversary gift combo! Includes a couple full body miniature + personalized moon lamp. Save ₹1000 with this combo deal.',
      shortDescription: 'Couple miniature + moon lamp combo',
      price: 5999, salePrice: 4499,
      images: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600'],
      category: coupleGifts._id, stock: 15, sku: 'COUP-COMBO-001',
      tags: ['combo', 'anniversary', 'couple', 'gift'], featured: true,
      averageRating: 4.9, numReviews: 11
    },
    {
      name: 'Car Dashboard 3D Miniature',
      slug: 'car-dashboard-3d-miniature',
      description: 'A mini 3D figurine designed for your car dashboard. Compact size with magnetic base for secure placement.',
      shortDescription: 'Car-friendly mini 3D figurine',
      price: 1199, salePrice: 899,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
      category: miniatures._id, stock: 55, sku: 'MIN-CAR-001',
      tags: ['car', 'miniature', 'dashboard', 'compact'], featured: false,
      averageRating: 4.2, numReviews: 13
    }
  ]);
  console.log(`📦 ${products.length} Products created`);

  // --- Coupons ---
  await Coupon.insertMany([
    { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 500, maxDiscount: 200, expiresAt: new Date('2027-12-31'), usageLimit: 1000 },
    { code: 'FLAT200', discountType: 'fixed', discountValue: 200, minPurchase: 1500, expiresAt: new Date('2027-12-31'), usageLimit: 500 },
    { code: 'GALAXY20', discountType: 'percentage', discountValue: 20, minPurchase: 2000, maxDiscount: 500, expiresAt: new Date('2027-06-30'), usageLimit: 200 }
  ]);
  console.log('🎫 Coupons created');

  console.log('\n✅ Seed complete!');
  console.log('📧 Admin: admin@3dgalaxy.com / admin123');
  console.log('📧 User:  user@3dgalaxy.com / user123');
  process.exit(0);
};

seedData().catch(err => { console.error('Seed error:', err); process.exit(1); });
