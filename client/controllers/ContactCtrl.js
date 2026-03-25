angular.module('galaxyStore').controller('ContactCtrl', ['$scope', 'ContactService', 'ToastService', function($scope, ContactService, ToastService) {
  $scope.formData = {};
  $scope.isSubmitting = false;

  $scope.submitContact = function() {
    if (!$scope.formData.name || !$scope.formData.email || !$scope.formData.subject || !$scope.formData.message) {
      ToastService.error("Please fill in all fields.");
      return;
    }
    $scope.isSubmitting = true;
    ContactService.submitContact($scope.formData).then(function(res) {
      ToastService.success(res.data.message || "Message sent successfully!");
      $scope.formData = {};
    }).catch(function(err) {
      ToastService.error(err.data.message || "Failed to send message");
    }).finally(function() {
      $scope.isSubmitting = false;
    });
  };
}]);
