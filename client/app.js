/**
 * 3D Galaxy Store — AngularJS Application
 * Main module, route configuration, and HTTP interceptor for JWT.
 */
(function() {
  'use strict';

  var API_BASE = 'http://localhost:5000/api';

  var app = angular.module('galaxyStore', ['ngRoute']);

  // Expose API_BASE as a constant
  app.constant('API_BASE', API_BASE);

  // =========================================
  // Route Configuration
  // =========================================
  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', { templateUrl: 'views/home.html', controller: 'HomeCtrl' })
      .when('/products', { templateUrl: 'views/products.html', controller: 'ProductsCtrl' })
      .when('/product/:id', { templateUrl: 'views/product-detail.html', controller: 'ProductDetailCtrl' })
      .when('/cart', { templateUrl: 'views/cart.html', controller: 'CartCtrl' })
      .when('/checkout', { templateUrl: 'views/checkout.html', controller: 'CheckoutCtrl' })
      .when('/login', { templateUrl: 'views/login.html', controller: 'AuthCtrl' })
      .when('/register', { templateUrl: 'views/register.html', controller: 'AuthCtrl' })
      .when('/profile', { templateUrl: 'views/profile.html', controller: 'ProfileCtrl' })
      .when('/profile/orders', { templateUrl: 'views/profile.html', controller: 'ProfileCtrl' })
      .when('/order/:id', { templateUrl: 'views/order-detail.html', controller: 'ProfileCtrl' })
      // Admin routes
      .when('/admin', { templateUrl: 'views/admin/dashboard.html', controller: 'AdminDashboardCtrl' })
      .when('/admin/products', { templateUrl: 'views/admin/products.html', controller: 'AdminProductsCtrl' })
      .when('/admin/orders', { templateUrl: 'views/admin/orders.html', controller: 'AdminOrdersCtrl' })
      .when('/admin/users', { templateUrl: 'views/admin/users.html', controller: 'AdminUsersCtrl' })
      .when('/admin/coupons', { templateUrl: 'views/admin/coupons.html', controller: 'AdminCouponsCtrl' })
      .when('/admin/categories', { templateUrl: 'views/admin/categories.html', controller: 'AdminCategoriesCtrl' })
      .otherwise({ redirectTo: '/' });
  }]);

  // =========================================
  // HTTP Interceptor — Attach JWT token
  // =========================================
  app.factory('authInterceptor', ['$window', '$q', function($window, $q) {
    return {
      request: function(config) {
        var token = $window.localStorage.getItem('galaxy_token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          $window.localStorage.removeItem('galaxy_token');
          $window.localStorage.removeItem('galaxy_user');
        }
        return $q.reject(response);
      }
    };
  }]);

  app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);

  // =========================================
  // Toast Service — Global notifications
  // =========================================
  app.factory('ToastService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    $rootScope.toasts = [];
    return {
      show: function(message, type) {
        type = type || 'info';
        var toast = { message: message, type: type };
        $rootScope.toasts.push(toast);
        $timeout(function() {
          var idx = $rootScope.toasts.indexOf(toast);
          if (idx > -1) $rootScope.toasts.splice(idx, 1);
        }, 3500);
      },
      success: function(msg) { this.show(msg, 'success'); },
      error: function(msg) { this.show(msg, 'danger'); },
      info: function(msg) { this.show(msg, 'info'); },
      warning: function(msg) { this.show(msg, 'warning'); }
    };
  }]);

  app.controller('ToastCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.toasts = $rootScope.toasts;
  }]);

  // =========================================
  // Currency Filter
  // =========================================
  app.filter('inr', function() {
    return function(amount) {
      if (amount === undefined || amount === null) return '₹0';
      return '₹' + Number(amount).toLocaleString('en-IN');
    };
  });

  // Star rating helper
  app.filter('stars', function() {
    return function(rating) {
      var full = Math.floor(rating);
      var half = rating % 1 >= 0.5 ? 1 : 0;
      var empty = 5 - full - half;
      var s = '';
      for (var i = 0; i < full; i++) s += '★';
      if (half) s += '☆';
      for (var j = 0; j < empty; j++) s += '☆';
      return s;
    };
  });

  // Scroll to top on route change
  app.run(['$rootScope', '$window', function($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function() {
      $window.scrollTo(0, 0);
    });
  }]);

})();
