/**
 * CartService — Shopping cart API calls + local cart count state.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').factory('CartService', ['$http', '$rootScope', 'API_BASE',
    function($http, $rootScope, API_BASE) {
      var service = {};
      service.getCart = function() { return $http.get(API_BASE + '/cart'); };
      service.addToCart = function(productId, quantity) {
        return $http.post(API_BASE + '/cart/add', { productId: productId, quantity: quantity || 1 });
      };
      service.updateQuantity = function(productId, quantity) {
        return $http.put(API_BASE + '/cart/update', { productId: productId, quantity: quantity });
      };
      service.removeItem = function(productId) {
        return $http.delete(API_BASE + '/cart/remove/' + productId);
      };
      service.clearCart = function() { return $http.delete(API_BASE + '/cart/clear'); };
      service.validateCoupon = function(code, cartTotal) {
        return $http.post(API_BASE + '/coupons/validate', { code: code, cartTotal: cartTotal });
      };

      // Broadcast cart count globally
      service.updateCartCount = function() {
        service.getCart().then(function(res) {
          var count = 0;
          if (res.data && res.data.items) {
            res.data.items.forEach(function(item) { count += item.quantity; });
          }
          $rootScope.$broadcast('cartCountUpdated', count);
        }).catch(function() {});
      };

      return service;
    }
  ]);
})();
