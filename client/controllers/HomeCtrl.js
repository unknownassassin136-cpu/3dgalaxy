/**
 * HomeCtrl — Home page: featured products, categories, testimonials, FAQ.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('HomeCtrl', ['$scope', 'ProductService', 'CartService', 'AuthService', 'ToastService',
    function($scope, ProductService, CartService, AuthService, ToastService) {
      $scope.categories = [];
      $scope.featured = [];
      $scope.bestsellers = [];
      $scope.loading = true;

      // Load categories
      ProductService.getCategories().then(function(res) {
        $scope.categories = res.data;
      });

      // Load featured products
      ProductService.getProducts({ featured: true, limit: 6 }).then(function(res) {
        $scope.featured = res.data.products;
      });

      // Load bestsellers
      ProductService.getProducts({ sort: 'rating', limit: 5 }).then(function(res) {
        $scope.bestsellers = res.data.products;
        $scope.loading = false;
      });

      $scope.addToCart = function(product) {
        if (!AuthService.isLoggedIn()) {
          ToastService.warning('Please login to add items to cart');
          return;
        }
        CartService.addToCart(product._id, 1).then(function() {
          ToastService.success(product.name + ' added to cart!');
          CartService.updateCartCount();
        }).catch(function(err) {
          ToastService.error(err.data.message || 'Failed to add to cart');
        });
      };

      $scope.getDiscount = function(product) {
        if (!product.salePrice || product.salePrice >= product.price) return 0;
        return Math.round((1 - product.salePrice / product.price) * 100);
      };

      // Testimonials
      $scope.testimonials = [
        { name: 'Ramya S.', initial: 'R', text: 'The 3D miniature of my family is absolutely stunning! Every detail is so lifelike. Best gift I\'ve ever given my parents. Thank you 3D Galaxy!', rating: 5 },
        { name: 'Mahesh P.', initial: 'M', text: 'Ordered a couple miniature for our anniversary. My wife was in tears of joy. The quality exceeded our expectations. Highly recommended!', rating: 5 },
        { name: 'Priya K.', initial: 'P', text: 'The moon lamp with our photo looks magical on our bedside table. The warm glow creates such a romantic ambiance. Love it!', rating: 4 },
        { name: 'Arjun D.', initial: 'A', text: 'Got a personalized name plate for my desk. Professional quality, fast delivery, and great customer support. Will order again!', rating: 5 }
      ];

      // FAQ
      $scope.faqs = [
        { q: 'How do I place a customized order?', a: 'Simply select the product you want, upload your photos during checkout, and our team will create your personalized item. You\'ll receive a preview for approval before production begins.' },
        { q: 'What is the production and delivery time?', a: 'Production typically takes 5-7 business days. Shipping takes an additional 3-5 days depending on your location. Rush orders are available for an additional fee.' },
        { q: 'What is your return and refund policy?', a: 'Since our products are customized, we do not accept returns. However, if there\'s a manufacturing defect or quality issue, we offer a full replacement. Contact our support within 7 days of delivery.' },
        { q: 'What materials do you use?', a: 'We use premium PLA and high-quality resin for 3D printing. Our moon lamps use safe, eco-friendly PLA with LED lighting. All materials are non-toxic and durable.' }
      ];
      $scope.activeFaq = -1;
      $scope.toggleFaq = function(index) {
        $scope.activeFaq = $scope.activeFaq === index ? -1 : index;
      };
    }
  ]);
})();
