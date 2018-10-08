const Room = require('./Room.js')
const io = require('socket.io')()

class Server {

	constructor () {
		this.port = 80;

		this.rooms = {
			'1': new Room('1','name', 35, 4, 2,'pswd'),
			'2': new Room('2','name', 15, 4, 2,'pswd'),
			'3': new Room('3','name', 5, 4, 2,'pswd'),
		}
		this.players = {}

		io.on('connection', this.onPlayerConnect.bind(this))
		io.listen(this.port)
		console.log("Server listening to port " + this.port)
	}

	onPlayerConnect (socket) {
		console.log("Player " + socket.id + " has connected")
		this.players[socket.id] = socket

		socket.on('list_rooms', this.listRooms(socket))
		socket.on('join_room', this.playerJoinRoom(socket))
		socket.on('leave_room', this.playerLeaveRoom(socket))
		socket.on('disconnect', this.onPlayerDisconnect(socket))
	}

	listRooms (socket) {
		let self = this
		return function () {
			let rooms = []
			for (let room in self.rooms) {
				rooms.push(room)
			}
			socket.emit('list_rooms', rooms)
		}
	}

	onPlayerDisconnect (socket) {
		let self = this
		return function () {
			let room = self.players[socket.id].room
			if (room) self.rooms[room].playerLeave(socket.id)

			self.players[socket.id] = null
			console.log("Player " + socket.id + " has disconnected")
		}
	}

	playerJoinRoom (socket) {
		let self = this
		return function (room) {
			// Check if player has already a room.
			// If it has already one, leaves it.
			if (self.players[socket.id].room && self.players[socket.id].room !== room) {
				console.warn("Player " + socket.id + "without leaving room is trying to go to another room")
				(self.playerLeaveRoom(socket))()
			}
			// If room is available, join the room
			if (self.isRoomAvailable(room)) {
				self.players[socket.id].room = room
				self.rooms[room].playerJoin(self.players[socket.id])
			}
			else {
				socket.emit('room_unavailable')
			}
		}
	}

	playerLeaveRoom (socket) {
		let self = this
		return function () {
			let room = self.players[socket.id].room
			if (room) {
				self.players[socket.id].room = null
				self.rooms[room].playerLeave(socket.id)
				socket.emit('room_left')
			}
		}
	}

	isRoomAvailable (roomId) {
		let room = this.rooms[roomId]
		return (room && room.isAvailable())
	}
}

let server = new Server()