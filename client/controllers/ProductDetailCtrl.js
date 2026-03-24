/**
 * ProductDetailCtrl — Single product view with gallery, add to cart, reviews.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('ProductDetailCtrl', ['$scope', '$routeParams', 'ProductService', 'CartService', 'AuthService', 'ToastService',
    function($scope, $routeParams, ProductService, CartService, AuthService, ToastService) {
      $scope.product = null;
      $scope.loading = true;
      $scope.selectedImage = '';
      $scope.quantity = 1;
      $scope.reviewForm = { rating: 5, comment: '' };
      $scope.relatedProducts = [];

      ProductService.getProduct($routeParams.id).then(function(res) {
        $scope.product = res.data;
        $scope.selectedImage = $scope.product.images[0] || '';
        $scope.loading = false;

        // Load related products from same category
        if ($scope.product.category) {
          var catId = $scope.product.category._id || $scope.product.category;
          ProductService.getProducts({ category: catId, limit: 4 }).then(function(r) {
            $scope.relatedProducts = r.data.products.filter(function(p) { return p._id !== $scope.product._id; }).slice(0, 4);
          });
        }
      }).catch(function() { $scope.loading = false; });

      $scope.selectImage = function(img) { $scope.selectedImage = img; };

      $scope.changeQuantity = function(delta) {
        var newQty = $scope.quantity + delta;
        if (newQty >= 1 && newQty <= ($scope.product ? $scope.product.stock : 99)) {
          $scope.quantity = newQty;
        }
      };

      $scope.addToCart = function() {
        if (!AuthService.isLoggedIn()) { ToastService.warning('Please login to add items to cart'); return; }
        CartService.addToCart($scope.product._id, $scope.quantity).then(function() {
          ToastService.success($scope.product.name + ' added to cart!');
          CartService.updateCartCount();
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };

      $scope.submitReview = function() {
        if (!AuthService.isLoggedIn()) { ToastService.warning('Please login to leave a review'); return; }
        if (!$scope.reviewForm.comment.trim()) { ToastService.warning('Please write a comment'); return; }
        ProductService.addReview($scope.product._id, $scope.reviewForm).then(function() {
          ToastService.success('Review submitted!');
          $scope.reviewForm = { rating: 5, comment: '' };
          ProductService.getProduct($routeParams.id).then(function(res) { $scope.product = res.data; });
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };

      $scope.getDiscount = function() {
        if (!$scope.product || !$scope.product.salePrice || $scope.product.salePrice >= $scope.product.price) return 0;
        return Math.round((1 - $scope.product.salePrice / $scope.product.price) * 100);
      };

      $scope.isLoggedIn = AuthService.isLoggedIn();
    }
  ]);
})();
