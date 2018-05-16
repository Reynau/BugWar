class Client {

	constructor (playerMoveCallback) {
		var self = this

		this.socket = io.connect('http://localhost');

		this.socket.emit('join_room', '1')
		
		this.socket.on('room_joined', function (data) {
			console.log("Room " + data.room + " joined successfully at team " + data.team)
			//this.socket.emit('leave_room')
		});
	}
}

module.exports = Client