angular.module('galaxyStore').controller('AdminChatCtrl', ['$scope', 'ChatService', 'AuthService', '$window', '$timeout', function($scope, ChatService, AuthService, $window, $timeout) {
  $scope.sessions = [];
  $scope.activeSession = null;
  $scope.messages = [];
  $scope.data = { replyMessage: "" };

  var socket = ChatService.getSocket();

  $scope.loadSessions = function() {
    ChatService.getAdminSessions().then(function(res) {
      $scope.sessions = res.data;
    }).catch(function(err) {
      console.error("Failed to load customer sessions", err);
    });
  };

  $scope.selectSession = function(session) {
    $scope.activeSession = session;
    // Join room as admin
    ChatService.joinRoom(session._id, 'admin');
    
    // Clear unread count locally
    session.unreadCount = 0;

    ChatService.getSessionMessages(session._id).then(function(res) {
      $scope.messages = res.data;
      $scope.scrollToBottom();
    }).catch(function(err) {
      console.error("Failed to load session messages", err);
    });
  };

  $scope.sendReply = function() {
    if (!$scope.data.replyMessage.trim() || !$scope.activeSession) return;
    
    var content = $scope.data.replyMessage.trim();
    $scope.data.replyMessage = "";

    ChatService.sendMessage(content, "Admin Support", 'admin', 'admin_' + (AuthService.getUser() ? AuthService.getUser()._id : 'admin123'));
  };

  $scope.scrollToBottom = function() {
    $timeout(function() {
      var body = document.getElementById('admin-chat-body');
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    }, 100);
  };

  // Real-time Event listeners
  socket.off('new_chat_notification');
  socket.on('new_chat_notification', function(msg) {
    // If we are looking at this specific session, push the message
    if ($scope.activeSession && $scope.activeSession._id === msg.sessionId) {
      $scope.$apply(function() {
        $scope.messages.push(msg);
        $scope.scrollToBottom();
      });
      // Admin sees it immediately, so tell server it's read
      // Since HTTP GET marks as read, we can just fetch or assume it.
    } else {
      // Otherwise refresh sessions list to show unread count
      $scope.$apply(function() {
        $scope.loadSessions();
      });
    }
  });

  socket.off('receive_message');
  socket.on('receive_message', function(msg) {
    if (msg.senderRole === 'admin' && $scope.activeSession && $scope.activeSession._id === msg.sessionId) {
      $scope.$apply(function() {
        $scope.messages.push(msg);
        $scope.scrollToBottom();
      });
    }
  });

  // Init
  $scope.loadSessions();
  // Ensure we are in the admin_room to receive notifications
  socket.emit('join_room', { sessionId: 'admin_dashboard', role: 'admin' });

}]);
