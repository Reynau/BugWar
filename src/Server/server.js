const io = require('socket.io')(80)

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'})

  socket.on('my other event', function (data) {
    console.log(data)
  })

  socket.on('disconnect', function () {
    io.emit('user disconnected')
  })
})