// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var PythonShell = require('python-shell');
var chatType = '';

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));
app.use('/chat', express.static(__dirname + '/public'));


// Routing
app.get('/', function(req,res) {
  res.send('Hi');
 });

app.get('/chat/:type', function(req,res) {
  chatType = req.params.type;
  res.sendFile(__dirname + '/public/index.html');
 });

app.get('/merchant', function(req,res) {
  res.sendFile(__dirname + '/public/merchant.html');
});


// Chatroom
var numUsers = 0;
var chatType = '';

io.on('connection', function (socket) {
    var chatTypeF = function(data){
      if(chatType == 'ai'){

        text = {
          args:[data]
        };

        PythonShell.run('cb.py', text, function (err, results) {
          if (err) throw err;
          socket.emit('new message', {
            username: 'bot',
            message: results[0]
          });
        }); 
        
    } else if(chatType = 'human'){
        console.log('human');
        socket.broadcast.emit('new message', {
        username: 'bot',
        message: data
      });
    }
  }

  var addedUser = false;

  // when the client emits 'new message', this listens and executes  
    socket.on('new message', function(data){
      chatTypeF(data);
    });
  
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
