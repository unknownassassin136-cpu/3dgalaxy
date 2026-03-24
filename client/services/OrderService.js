/**
 * OrderService — Order and payment API calls.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').factory('OrderService', ['$http', 'API_BASE',
    function($http, API_BASE) {
      return {
        createOrder: function(data) { return $http.post(API_BASE + '/orders/create', data); },
        getMyOrders: function() { return $http.get(API_BASE + '/orders/my-orders'); },
        getOrder: function(id) { return $http.get(API_BASE + '/orders/' + id); },
        createPaymentOrder: function(orderId) { return $http.post(API_BASE + '/payment/create-order', { orderId: orderId }); },
        verifyPayment: function(data) { return $http.post(API_BASE + '/payment/verify', data); },
        mockPayment: function(orderId) { return $http.post(API_BASE + '/payment/mock', { orderId: orderId }); },
        getPaymentKey: function() { return $http.get(API_BASE + '/payment/key'); }
      };
    }
  ]);
})();
