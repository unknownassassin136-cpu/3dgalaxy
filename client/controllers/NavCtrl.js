/**
 * NavCtrl — Navigation active state
 * NavActionsCtrl — Cart count, auth state for navbar
 */
(function() {
  'use strict';

  angular.module('galaxyStore')
    .controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.isActive = function(path) {
        if (path === '/') return $location.path() === '/';
        return $location.path().indexOf(path) === 0;
      };
    }])
    .controller('NavActionsCtrl', ['$scope', '$rootScope', 'AuthService', 'CartService',
      function($scope, $rootScope, AuthService, CartService) {
        $scope.cartCount = 0;
        $scope.isLoggedIn = AuthService.isLoggedIn();
        $scope.isAdmin = AuthService.isAdmin();

        // Listen for auth changes
        $rootScope.$on('authChanged', function() {
          $scope.isLoggedIn = AuthService.isLoggedIn();
          $scope.isAdmin = AuthService.isAdmin();
          if ($scope.isLoggedIn) CartService.updateCartCount();
        });

        // Listen for cart count updates
        $rootScope.$on('cartCountUpdated', function(e, count) {
          $scope.cartCount = count;
        });

        // Load initial cart count
        if (AuthService.isLoggedIn()) CartService.updateCartCount();
      }
    ]);
})();
