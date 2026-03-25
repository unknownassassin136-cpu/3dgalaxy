angular.module('galaxyStore').controller('ChatWidgetCtrl', ['$scope', 'ChatService', 'AuthService', '$window', '$timeout', function($scope, ChatService, AuthService, $window, $timeout) {
  $scope.isOpen = false;
  $scope.messages = [];
  $scope.newMessage = "";
  $scope.userName = "Guest";
  $scope.userId = "";

  $scope.isCustomer = function() {
    return AuthService.isLoggedIn() && !AuthService.isAdmin();
  };

  // Set up session
  $scope.initChat = function() {
    var user = AuthService.getUser();
    if (user) {
      $scope.userId = user._id;
      $scope.userName = user.name;
    } else {
      return; // Stop if not logged in
    }

    var sessionId = "chat_" + $scope.userId;

    ChatService.joinRoom(sessionId, 'customer');

    // Load message history
    ChatService.getSessionMessages(sessionId).then(function(res) {
      $scope.messages = res.data;
      $scope.scrollToBottom();
    }).catch(function(err) {
      console.error("Failed to load history", err);
    });

    // Listen for incoming messages
    var socket = ChatService.getSocket();
    socket.off('receive_message'); // prevent duplicates
    socket.on('receive_message', function(msg) {
      $scope.$apply(function() {
        $scope.messages.push(msg);
        $scope.scrollToBottom();
      });
    });
  };

  $scope.toggleChat = function() {
    $scope.isOpen = !$scope.isOpen;
    if ($scope.isOpen && $scope.messages.length === 0) {
      $scope.initChat();
    }
  };

  $scope.sendMessage = function() {
    if (!$scope.newMessage.trim()) return;
    
    var content = $scope.newMessage.trim();
    $scope.newMessage = "";

    var sessionId = "chat_" + $scope.userId;
    ChatService.sendMessage(content, $scope.userName, 'customer', $scope.userId);
  };

  $scope.scrollToBottom = function() {
    $timeout(function() {
      var body = document.getElementById('chat-widget-body');
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    }, 100);
  };

}]);
