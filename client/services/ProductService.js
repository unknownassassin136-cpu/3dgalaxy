/**
 * ProductService — Product and category API calls.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').factory('ProductService', ['$http', 'API_BASE',
    function($http, API_BASE) {
      return {
        getProducts: function(params) { return $http.get(API_BASE + '/products', { params: params }); },
        getProduct: function(id) { return $http.get(API_BASE + '/products/' + id); },
        getCategories: function() { return $http.get(API_BASE + '/categories'); },
        addReview: function(id, data) { return $http.post(API_BASE + '/products/' + id + '/reviews', data); }
      };
    }
  ]);
})();
