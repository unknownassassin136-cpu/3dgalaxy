/**
 * AuthService — Handles authentication, token management, user state.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').factory('AuthService', ['$http', '$window', 'API_BASE',
    function($http, $window, API_BASE) {
      var service = {};
      service.getToken = function() { return $window.localStorage.getItem('galaxy_token'); };
      service.getUser = function() {
        var u = $window.localStorage.getItem('galaxy_user');
        return u ? JSON.parse(u) : null;
      };
      service.isLoggedIn = function() { return !!service.getToken(); };
      service.isAdmin = function() {
        var u = service.getUser();
        return u && u.role === 'admin';
      };
      service.setAuth = function(data) {
        $window.localStorage.setItem('galaxy_token', data.token);
        $window.localStorage.setItem('galaxy_user', JSON.stringify(data));
      };
      service.logout = function() {
        $window.localStorage.removeItem('galaxy_token');
        $window.localStorage.removeItem('galaxy_user');
      };
      service.register = function(data) { return $http.post(API_BASE + '/auth/register', data); };
      service.login = function(data) { return $http.post(API_BASE + '/auth/login', data); };
      service.getProfile = function() { return $http.get(API_BASE + '/auth/profile'); };
      service.updateProfile = function(data) { return $http.put(API_BASE + '/auth/profile', data); };
      return service;
    }
  ]);
})();
