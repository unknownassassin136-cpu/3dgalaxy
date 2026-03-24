/**
 * CartCtrl — Shopping cart management.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('CartCtrl', ['$scope', '$location', 'CartService', 'AuthService', 'ToastService',
    function($scope, $location, CartService, AuthService, ToastService) {
      $scope.cart = { items: [] };
      $scope.loading = true;
      $scope.couponCode = '';
      $scope.discount = 0;
      $scope.couponApplied = false;

      if (!AuthService.isLoggedIn()) { $location.path('/login'); return; }

      $scope.loadCart = function() {
        $scope.loading = true;
        CartService.getCart().then(function(res) {
          $scope.cart = res.data;
          $scope.loading = false;
        }).catch(function() { $scope.loading = false; });
      };
      $scope.loadCart();

      $scope.getItemPrice = function(item) {
        var p = item.product;
        return (p.salePrice && p.salePrice < p.price) ? p.salePrice : p.price;
      };

      $scope.getSubtotal = function() {
        var total = 0;
        if ($scope.cart && $scope.cart.items) {
          $scope.cart.items.forEach(function(item) { total += $scope.getItemPrice(item) * item.quantity; });
        }
        return total;
      };

      $scope.getShipping = function() { return $scope.getSubtotal() >= 999 ? 0 : 99; };
      $scope.getTax = function() { return Math.round($scope.getSubtotal() * 0.18 * 100) / 100; };
      $scope.getTotal = function() { return $scope.getSubtotal() + $scope.getShipping() + $scope.getTax() - $scope.discount; };

      $scope.updateQuantity = function(item, qty) {
        CartService.updateQuantity(item.product._id, qty).then(function(res) {
          $scope.cart = res.data;
          CartService.updateCartCount();
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };

      $scope.removeItem = function(item) {
        CartService.removeItem(item.product._id).then(function(res) {
          $scope.cart = res.data;
          CartService.updateCartCount();
          ToastService.success('Item removed');
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };

      $scope.applyCoupon = function() {
        if (!$scope.couponCode.trim()) return;
        CartService.validateCoupon($scope.couponCode, $scope.getSubtotal()).then(function(res) {
          $scope.discount = res.data.discount;
          $scope.couponApplied = true;
          ToastService.success('Coupon applied! You save ₹' + res.data.discount);
        }).catch(function(err) {
          $scope.discount = 0;
          $scope.couponApplied = false;
          ToastService.error(err.data.message || 'Invalid coupon');
        });
      };

      $scope.checkout = function() { $location.path('/checkout'); };
    }
  ]);
})();
