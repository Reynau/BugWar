const Room = require('./Room.js')
const io = require('socket.io')()

class Server {

	constructor () {
		this.port = 80;

		this.rooms = {
			'1': new Room('1','name',4,2,'pswd'),
			'2': new Room('2','name',4,2,'pswd'),
			'3': new Room('3','name',4,2,'pswd'),
		}
		this.players = {}

		io.on('connection', this.onPlayerConnect())
		io.listen(this.port)
		console.log("Server listening to port " + this.port)
	}

	onPlayerConnect () {
		let self = this
		return function (socket) {
			console.log("Socked with id " + socket.id + " has connected")
			self.players[socket.id] = socket

			socket.on('list_rooms', self.listRooms(socket))
			socket.on('join_room', self.playerJoinRoom(socket))
			socket.on('leave_room', self.playerLeaveRoom(socket))
			socket.on('disconnect', self.onPlayerDisconnect(socket))
		}
	}

	listRooms (socket) {
		let self = this
		return function () {
			console.log("Generating list of rooms...")
			let rooms = []
			for (let room in self.rooms) {
				rooms.push(room)
			}
			console.log("Emiting list: ", rooms)
			socket.emit('list_rooms', rooms)
		}
	}

	onPlayerDisconnect (socket) {
		let self = this
		return function () {
			console.log("Player with id " + socket.id + " disconnected. Leaving room if any...")
			let room = self.players[socket.id].room

			self.players[socket.id] = null
			if (room) self.rooms[room].playerLeave(socket.id)
			else console.log("No room found on disconnected player.")
		}
	}

	playerJoinRoom (socket) {
		let self = this
		return function (room) {
			// Check if player has already a room.
			// If it has already one, leaves it.
			if (self.players[socket.id].room && self.players[socket.id].room !== room) {
				self.playerLeaveRoom(socket)
			}
			// If room is available, join the room
			if (self.isRoomAvailable(room)) {
				console.log("Room " + room + " is available. Joining in...")
				self.players[socket.id].room = room
				self.rooms[room].playerJoin(self.players[socket.id])
			}
			else {
				console.log("Room " + room + " is not available.")
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