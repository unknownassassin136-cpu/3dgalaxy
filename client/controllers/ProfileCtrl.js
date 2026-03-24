/**
 * ProfileCtrl — User profile, order history, and order detail.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('ProfileCtrl', ['$scope', '$location', '$routeParams', '$rootScope', 'AuthService', 'OrderService', 'ToastService',
    function($scope, $location, $routeParams, $rootScope, AuthService, OrderService, ToastService) {
      if (!AuthService.isLoggedIn()) { $location.path('/login'); return; }

      $scope.user = AuthService.getUser();
      $scope.orders = [];
      $scope.order = null;
      $scope.loading = true;
      $scope.activeTab = $location.path().indexOf('/orders') > -1 ? 'orders' : ($routeParams.id ? 'order-detail' : 'profile');
      $scope.profileForm = { name: $scope.user.name, phone: $scope.user.phone || '' };

      // Load orders
      if ($scope.activeTab === 'orders' || $scope.activeTab === 'profile') {
        OrderService.getMyOrders().then(function(res) {
          $scope.orders = res.data;
          $scope.loading = false;
        }).catch(function() { $scope.loading = false; });
      }

      // Load order detail
      if ($routeParams.id) {
        OrderService.getOrder($routeParams.id).then(function(res) {
          $scope.order = res.data;
          $scope.loading = false;
        }).catch(function() { $scope.loading = false; });
      }

      $scope.updateProfile = function() {
        AuthService.updateProfile($scope.profileForm).then(function(res) {
          AuthService.setAuth(res.data);
          $scope.user = res.data;
          $rootScope.$broadcast('authChanged');
          ToastService.success('Profile updated!');
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };

      $scope.logout = function() {
        AuthService.logout();
        $rootScope.$broadcast('authChanged');
        ToastService.info('You have been logged out');
        $location.path('/');
      };

      $scope.getStatusClass = function(status) {
        return 'status-' + status;
      };
    }
  ]);
})();
