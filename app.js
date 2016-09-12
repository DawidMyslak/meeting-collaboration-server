var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
});

var nextWidgetId = 1;
var users = [];

io.on('connection', function (socket) {
  var user = {
    id: socket.id,
    name: 'User'
  };
  users.push(user);

  socket.emit('REFRESH_USERS', {
    type: 'REFRESH_USERS',
    users: users
  });
  socket.broadcast.emit('REFRESH_USERS', {
    type: 'REFRESH_USERS',
    users: users
  });

  socket.on('ADD_WIDGET', function (action) {
    action.id = nextWidgetId;
    nextWidgetId++;
    socket.emit('ADD_WIDGET', action);
    socket.broadcast.emit('ADD_WIDGET', action);
  });

  socket.on('UPDATE_WIDGET', function (action) {
    socket.emit('UPDATE_WIDGET', action);
    socket.broadcast.emit('UPDATE_WIDGET', action);
  });

  socket.on('disconnect', function () {
    users = users.filter(function (user) {
      return (user.id !== socket.id);
    });

    socket.broadcast.emit('REFRESH_USERS', {
      type: 'REFRESH_USERS',
      users: users
    });
  });
});

server.listen(3001);

console.log('Server is running on port 3001');
