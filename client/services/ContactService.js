angular.module('galaxyStore').factory('ContactService', ['$http', 'API_BASE', function($http, API_BASE) {
  return {
    submitContact: function(contactData) {
      return $http.post(API_BASE + '/contact', contactData);
    },
    // Admin Routes
    getAllContacts: function() {
      return $http.get(API_BASE + '/admin/contacts');
    },
    markAsRead: function(id) {
      return $http.put(API_BASE + '/admin/contacts/' + id + '/read');
    },
    deleteContact: function(id) {
      return $http.delete(API_BASE + '/admin/contacts/' + id);
    }
  };
}]);
