class Client {

	constructor () { 
		this.socket = null
	}

	connect () {
		this.socket = io.connect('http://localhost')

		this.socket.on('room_joined', function (data) {
			console.log("Room " + data.room + " joined successfully at team " + data.team)
		});
	}

	disconnect () {
		this.socket.disconnect()
	}

	getListOfRooms (callback) {
		this.socket.emit('list_rooms')
		this.socket.on('list_rooms', callback)
	}

	joinRoom (roomId, joinedCallback, notAvailableCallback) {
		this.socket.emit('join_room', roomId)
		this.socket.on('room_joined', joinedCallback)
		this.socket.on('room_unavailable', notAvailableCallback)
	}

	onPlayerData (callback) {
		this.socket.emit('player_data')
		this.socket.on('player_data', callback)
	}

	onPlayerMove (callback) {
		this.socket.on('player_move', callback)
	}

	sendPlayerMove (data) {
		this.socket.emit('player_move', data)
	}
}

module.exports = Client