
class Room {
	
	constructor (roomId, roomData, gameData) {
		this.id = roomId

		// Info for room listing
		this.name = roomData.name
		this.description = roomData.description
		this.maxPlayers = roomData.maxPlayers

		this.events = new Events()
		this.game = new Game(gameData, this.events)
	}

	isAvailable () {
		return this.game.isAvailable()
	}

	join (player) {
		this.game.join(player)
	}

	leave (player) {
		this.game.leave(player)
	}

	getRoomData () {
		return {
			name: this.name,
			description: this.description,
			players: this.game.players.length,
			maxPlayers: this.maxPlayers
		}
	}
}

module.export = Room