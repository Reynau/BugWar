class Client {

	constructor () { 
		this.socket = null
	}

	connect () {
		this.socket = io.connect('http://localhost')

		//this.joinRoom('1')
		
		this.socket.on('room_joined', function (data) {
			console.log("Room " + data.room + " joined successfully at team " + data.team)
			//this.socket.emit('leave_room')
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
}

module.exports = Client