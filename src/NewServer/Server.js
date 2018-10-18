const io = require('socket.io')()
const RoomManager = require('./RoomManager')

class Server {

	constructor () {
		this.players = {}
		this.port = port
		this.roomManager = new RoomManager()
	}

	onPlayerConnect (socket) {
		this.players[socket.id] = socket

		socket.on('disconnect', this.disconnectPlayer.bind(this, socket))
		socket.on('list_rooms', this.sendListRooms.bind(this, socket))
		socket.on('join_room',  this.playerJoinRoom.bind(this, socket))
		socket.on('leave_room', this.playerLeaveRoom.bind(this, socket))

		// Not implemented yet
		socket.on('create_room', this.playerCreateRoom.bind(this, socket))
		socket.on('delete_room', this.playerDeleteRoom.bind(this, socket))
	}

	disconnectPlayer (socket) {
		let roomId = this.players[socket.id].room
		if (roomId) this.roomManager.playerLeaveRoom(socket.id, roomId)

		this.players[socket.id] = null
		socket.disconnect()
	}

	sendListRooms (socket) {
		let rooms = this.roomManager.getRooms()
		socket.emit('list_rooms', rooms)
	}

	playerJoinRoom (socket, roomId) {
		// This should never happen. If so, means player is manipulating game sockets
		if (this.players[socket.id].room) {
			console.warn("Server.js: Player " + socket.id + " is trying to join two rooms at the same time.")
			this.disconnectPlayer(socket)
			return
		}

		if (this.roomManager.isRoomAvailable(roomId)) {
			this.players[socket.id].room = roomId
			this.roomManager.playerJoinRoom(socket, roomId)
		}
		else {
			socket.emit('room_unavailable')
		}
	}

	playerLeaveRoom (socket) {
		let room = this.players[socket.id].room

		if (room == undefined) {
			console.warn("Server.js: Player " + socket.id + " is trying leave a room withot being in any.")
			this.disconnectPlayer(socket)
			return
		}

		this.players[socket.id].room = null
		this.rooms[room].playerLeave(socket.id)
		socket.emit('room_left')
	}

	playerCreateRoom (socket, roomData) {

	}

	playerDeleteRoom (socket, roomId) {

	}
}