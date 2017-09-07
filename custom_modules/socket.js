var io = require('socket.io')();
this.io = io;
var room;

// io.on('connection', function(socket) {
//     console.log("Connecting to socket...");
//     this.socket = socket;
//     socket.on('chat message', function(msg) {
//         io.emit('chat message', msg);
//     })
// })
io.sockets.on('connection', function(socket) {
  socket.on('join', function(channel, userData, callback) {
      this.userData = userData;
      var oldChannel = this.channel;
      if (oldChannel) {
        console.log('Leaving channel' + oldChannel);
        this.leave(oldChannel);
      }
      this.channel = channel;
        console.log('Entering channel' + channel);
        this.join(channel);
        callback();
      });
  
  socket.on('chat message', function(msg) {
    var channel = socket.channel;
      if (channel) {
        var nickname = socket.userData.nickname;
        socket.broadcast.to(channel).emit('chat message', msg, nickname);
      } else {
        socket.emit('error', 'no channel');
      }
    });
});


// module.exports.joinRoom = function(roomid, callback){
//     io.on('connection', function(socket){
//         room = 'chat-' + roomid;
//         console.log("Joining chatroom: " + 'chat-' + roomid);
//         socket.join('chat-' + roomid);
//         socket.on('chat message', function(msg) {
//             io.to(room).emit('chat message', msg);
//         })
//     });
//}


module.exports = this;