const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const messages = [];
const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('set username', (username) => {
    console.log({ username })
    if (username) {
      users.push({ id: socket.id, username });
      socket.emit('username set', username);
      socket.emit('first connect', messages);
    }
  });

  socket.on('chat message', (data) => {
    const user = users.find(user => user.id === socket.id);
    console.log({ data })

    if (user) {
      messages.push({ username: user.username, message: data.message });
      io.emit('chat message', { username: user.username, message: data.message });
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
