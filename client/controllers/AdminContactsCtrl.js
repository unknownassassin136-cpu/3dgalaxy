angular.module('galaxyStore').controller('AdminContactsCtrl', ['$scope', 'ContactService', 'ToastService', function($scope, ContactService, ToastService) {
  $scope.contacts = [];
  $scope.loading = true;
  $scope.viewModalOpen = false;
  $scope.selectedContact = null;

  $scope.loadContacts = function() {
    $scope.loading = true;
    ContactService.getAllContacts().then(function(res) {
      $scope.contacts = res.data;
    }).catch(function(err) {
      ToastService.error("Failed to load contacts.");
    }).finally(function() {
      $scope.loading = false;
    });
  };

  $scope.viewContact = function(contact) {
    $scope.selectedContact = contact;
    $scope.viewModalOpen = true;
    
    // Mark as read if it is unread
    if (!contact.isRead) {
      ContactService.markAsRead(contact._id).then(function() {
        contact.isRead = true;
      });
    }
  };

  $scope.closeViewModal = function() {
    $scope.viewModalOpen = false;
    $scope.selectedContact = null;
  };

  $scope.deleteContact = function(id) {
    if (confirm('Are you sure you want to delete this message?')) {
      ContactService.deleteContact(id).then(function() {
        ToastService.success("Message deleted");
        $scope.loadContacts();
      }).catch(function() {
        ToastService.error("Failed to delete message");
      });
    }
  };

  $scope.loadContacts();
}]);
