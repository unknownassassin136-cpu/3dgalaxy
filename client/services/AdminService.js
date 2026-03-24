/**
 * AdminService — Admin panel API calls (dashboard, products CRUD, orders, users, coupons, categories).
 */
(function() {
  'use strict';
  angular.module('galaxyStore').factory('AdminService', ['$http', 'API_BASE',
    function($http, API_BASE) {
      return {
        // Dashboard
        getDashboard: function() { return $http.get(API_BASE + '/admin/dashboard'); },
        // Products
        createProduct: function(data) { return $http.post(API_BASE + '/products', data); },
        updateProduct: function(id, data) { return $http.put(API_BASE + '/products/' + id, data); },
        deleteProduct: function(id) { return $http.delete(API_BASE + '/products/' + id); },
        // Orders
        getAllOrders: function(params) { return $http.get(API_BASE + '/orders/all', { params: params }); },
        updateOrderStatus: function(id, data) { return $http.put(API_BASE + '/orders/' + id + '/status', data); },
        // Users
        getUsers: function(params) { return $http.get(API_BASE + '/admin/users', { params: params }); },
        updateUser: function(id, data) { return $http.put(API_BASE + '/admin/users/' + id, data); },
        // Coupons
        getCoupons: function() { return $http.get(API_BASE + '/coupons'); },
        createCoupon: function(data) { return $http.post(API_BASE + '/coupons', data); },
        updateCoupon: function(id, data) { return $http.put(API_BASE + '/coupons/' + id, data); },
        deleteCoupon: function(id) { return $http.delete(API_BASE + '/coupons/' + id); },
        // Categories
        createCategory: function(data) { return $http.post(API_BASE + '/categories', data); },
        updateCategory: function(id, data) { return $http.put(API_BASE + '/categories/' + id, data); },
        deleteCategory: function(id) { return $http.delete(API_BASE + '/categories/' + id); }
      };
    }
  ]);
})();
