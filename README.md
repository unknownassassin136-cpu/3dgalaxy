# 3D Galaxy Store

A full-stack e-commerce platform built with AngularJS, Node.js, Express, and MongoDB, inspired by 3dgalaxy.co.

## Project Structure
- `client/`: AngularJS frontend (SPA)
  - `css/`: Dark-themed design system
  - `controllers/`: AngularJS logic for all 14 pages
  - `services/`: API communication ($http)
  - `views/`: HTML templates including full Admin panel
- `server/`: Node.js backend API
  - `models/`: Mongoose schemas (User, Product, Order, Cart, Category, Coupon)
  - `routes/`: RESTful endpoints
  - `middleware/`: JWT Auth and global error handling

## Setup & Running Locally

1. **Prerequisites**
   - Node.js (v16+)
   - MongoDB Atlas account (or local MongoDB)

2. **Configure Environment Variables**
   Open `server/.env` and configure your settings:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=any_random_secure_string
   
   # Optional: For real payments (defaults to mock payment if empty)
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   ```

3. **Install Dependencies & Seed Database**
   ```bash
   cd server
   npm install
   
   # Run the seed script to populate sample products and admin user
   npm run seed
   ```
   *Note: The seed script creates an admin user: `admin@3dgalaxy.com` / `admin123`*

4. **Start the Backend Server**
   ```bash
   cd server
   npm start
   # API runs on http://localhost:5000
   ```

5. **Start the Frontend Application**
   You can serve the `client/` folder using any static server.
   Using `npx serve`:
   ```bash
   cd client
   npx serve -l 3000
   # App runs on http://localhost:3000
   ```
   Alternatively, using Python: `python -m http.server 3000`

## Features Implemented
- **Storefront**: Dynamic catalog, search, filtering, product details with image galleries.
- **Cart & Checkout**: Cart management, coupon validation, and Razorpay payment integration with a mock payment fallback for testing.
- **User Accounts**: Registration, login (JWT), profile management, and order history.
- **Admin Dashboard**: Comprehensive management of products, categories, orders, discount coupons, users, and rich dashboard statistics.
- **Design System**: Fully responsive dark-theme UI with glassmorphism and modern CSS animations.
