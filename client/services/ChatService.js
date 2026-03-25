angular.module('galaxyStore').factory('ChatService', ['$http', '$window', 'API_BASE', function($http, $window, API_BASE) {
  var socket = null;
  var currentSessionId = null;

  return {
    initSocket: function() {
      if (!socket) {
        var socketUrl = API_BASE.replace('/api', '');
        socket = io(socketUrl, {
          auth: { token: $window.localStorage.getItem('galaxy_token') }
        });
      }
      return socket;
    },
    
    getSocket: function() {
      return socket || this.initSocket();
    },

    joinRoom: function(sessionId, role) {
      currentSessionId = sessionId;
      var s = this.getSocket();
      s.emit('join_room', { sessionId: sessionId, role: role });
    },

    sendMessage: function(content, senderName, senderRole, senderId) {
      if (!currentSessionId) return;
      var s = this.getSocket();
      s.emit('send_message', {
        sessionId: currentSessionId,
        content: content,
        senderName: senderName,
        senderRole: senderRole,
        senderId: senderId
      });
    },

    // HTTP Routes
    getAdminSessions: function() {
      return $http.get(API_BASE + '/chat/sessions');
    },

    getSessionMessages: function(sessionId) {
      return $http.get(API_BASE + '/chat/' + sessionId);
    }
  };
}]);
