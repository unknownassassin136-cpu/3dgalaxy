/**
 * ProductsCtrl — Product catalog with filtering, search, sort, pagination.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('ProductsCtrl', ['$scope', '$location', 'ProductService', 'CartService', 'AuthService', 'ToastService',
    function($scope, $location, ProductService, CartService, AuthService, ToastService) {
      $scope.products = [];
      $scope.categories = [];
      $scope.loading = true;
      $scope.totalPages = 1;
      $scope.currentPage = 1;
      $scope.total = 0;

      // Filters
      $scope.filters = {
        search: $location.search().search || '',
        category: $location.search().category || '',
        sort: $location.search().sort || 'newest',
        featured: $location.search().featured || '',
        minPrice: '',
        maxPrice: ''
      };

      // Load categories
      ProductService.getCategories().then(function(res) { $scope.categories = res.data; });

      // Load products
      $scope.loadProducts = function(page) {
        $scope.loading = true;
        var params = { page: page || 1, limit: 12 };
        if ($scope.filters.search) params.search = $scope.filters.search;
        if ($scope.filters.category) params.category = $scope.filters.category;
        if ($scope.filters.sort) params.sort = $scope.filters.sort;
        if ($scope.filters.featured) params.featured = $scope.filters.featured;
        if ($scope.filters.minPrice) params.minPrice = $scope.filters.minPrice;
        if ($scope.filters.maxPrice) params.maxPrice = $scope.filters.maxPrice;

        ProductService.getProducts(params).then(function(res) {
          $scope.products = res.data.products;
          $scope.currentPage = res.data.page;
          $scope.totalPages = res.data.pages;
          $scope.total = res.data.total;
          $scope.loading = false;
        }).catch(function() { $scope.loading = false; });
      };

      $scope.loadProducts(1);

      $scope.applyFilters = function() { $scope.loadProducts(1); };
      $scope.clearFilters = function() {
        $scope.filters = { search: '', category: '', sort: 'newest', featured: '', minPrice: '', maxPrice: '' };
        $scope.loadProducts(1);
      };
      $scope.goToPage = function(page) {
        if (page >= 1 && page <= $scope.totalPages) $scope.loadProducts(page);
      };

      $scope.getPages = function() {
        var pages = [];
        for (var i = 1; i <= $scope.totalPages; i++) pages.push(i);
        return pages;
      };

      $scope.getDiscount = function(product) {
        if (!product.salePrice || product.salePrice >= product.price) return 0;
        return Math.round((1 - product.salePrice / product.price) * 100);
      };

      $scope.addToCart = function(product) {
        if (!AuthService.isLoggedIn()) { ToastService.warning('Please login to add items to cart'); return; }
        CartService.addToCart(product._id, 1).then(function() {
          ToastService.success(product.name + ' added to cart!');
          CartService.updateCartCount();
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };
    }
  ]);
})();
