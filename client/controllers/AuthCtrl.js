/**
 * AuthCtrl — Login and Register.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('AuthCtrl', ['$scope', '$location', '$rootScope', 'AuthService', 'ToastService', 'CartService',
    function($scope, $location, $rootScope, AuthService, ToastService, CartService) {
      $scope.isLogin = $location.path() === '/login';
      $scope.formData = { name: '', email: '', password: '', phone: '' };
      $scope.loading = false;

      if (AuthService.isLoggedIn()) { $location.path('/'); return; }

      $scope.submit = function() {
        $scope.loading = true;
        if ($scope.isLogin) {
          AuthService.login({ email: $scope.formData.email, password: $scope.formData.password })
            .then(function(res) {
              AuthService.setAuth(res.data);
              $rootScope.$broadcast('authChanged');
              ToastService.success('Welcome back, ' + res.data.name + '!');
              CartService.updateCartCount();
              $location.path('/');
            }).catch(function(err) {
              ToastService.error(err.data.message || 'Login failed');
              $scope.loading = false;
            });
        } else {
          if (!$scope.formData.name || !$scope.formData.email || !$scope.formData.password) {
            ToastService.warning('Please fill all required fields');
            $scope.loading = false;
            return;
          }
          AuthService.register($scope.formData)
            .then(function(res) {
              AuthService.setAuth(res.data);
              $rootScope.$broadcast('authChanged');
              ToastService.success('Welcome, ' + res.data.name + '!');
              $location.path('/');
            }).catch(function(err) {
              ToastService.error(err.data.message || 'Registration failed');
              $scope.loading = false;
            });
        }
      };
    }
  ]);
})();
