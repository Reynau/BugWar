class Client {

	constructor (playerMoveCallback) {
		var self = this

		this.socket = io.connect('http://localhost');

		this.socket.on('playerMove', playerMoveCallback)
		
		this.socket.on('this', function (data) {
			console.log(data);
			self.socket.emit('my other event', { my: 'data' });
		});
	}
}

module.exports = Client