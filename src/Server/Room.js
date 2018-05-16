class Room {
	
	constructor (id, name, nTeams, playersPerTeam, password) {
		this.id = id
		this.name = name
		this.nTeams = nTeams
		this.playersPerTeam = playersPerTeam
		this.password = password

		this.nPlayers = 0
		this.players = {
			1: {nPlayers: 0},
			2: {nPlayers: 0},
			3: {nPlayers: 0},
			4: {nPlayers: 0},
		}

		this.started = false // If a game has started, you cant join it
	}

	isAvailable () {
		return (!this.started && 
				this.nPlayers < this.nTeams * this.playersPerTeam)
	}

	playerJoin (playerSocket) {
		let team = this.searchTeamSlot()
		if (team) {
			playerSocket = this.assignRandomPosition(playerSocket)
			this.players[team][playerSocket.id] = playerSocket
			this.players[team].nPlayers += 1
			this.nPlayers += 1

			playerSocket.emit("room_joined", {
				room: this.id,
				team: team,
			})
			console.log("Player joined room " + this.id + " at team " + team + " successfully.")

			// When new player is ready, update all the players with the new player
			playerSocket.on('player_data', this.onPlayerData())
			playerSocket.on('player_move', this.onPlayerMove())
		}
		else console.log("Cannot find any available team")
	}

	playerLeave (socketId) {
		for (let team in this.players) {
			if (this.players[team][socketId]) {
				this.players[team][socketId] = null
				--this.players[team].nPlayers
				--this.nPlayers
				this.sendPlayerData()
				console.log("Player leaved room " + this.id)
				return
			}
		}
	}

	onPlayerMove () {
		let self = this
		return function (data) {
			console.log("Received player_move data: ", data)
			for (let team in self.players) {
				for (let socketId in self.players[team]) {
					if (socketId === "nPlayers") continue
					if (self.players[team][socketId]) {
						self.players[team][socketId].emit('player_move', data)
					}
				}
			}
		}
	}

	onPlayerData () {
		let self = this
		return function () {
			let data = self.generatePlayerData()
			for (let team in self.players) {
				for (let socketId in self.players[team]) {
					if (socketId === "nPlayers") continue
					if (self.players[team][socketId]) {
						self.players[team][socketId].emit('player_data', data)
					}
				}
			}
		}
	}

	sendPlayerData () {
		let data = this.generatePlayerData()
		for (let team in this.players) {
			for (let socketId in this.players[team]) {
				if (socketId === "nPlayers") continue
				if (this.players[team][socketId]) {
					this.players[team][socketId].emit('player_data', data)
				}
			}
		}
	}

	generatePlayerData () {
		let data = {
			1: { },
			2: { },
			3: { },
			4: { },
		}
		for (let team in this.players) {
			for (let socketId in this.players[team]) {
				if (socketId === "nPlayers") continue
				if (this.players[team][socketId]) {
					let player = this.players[team][socketId]
					data[team][socketId] = {
						x: player.x,
						y: player.y,
					}
				}
			}
		}
		return data
	}

	searchTeamSlot () {
		let minTeam = null
		let minPlayers = this.playersPerTeam

		for (let team in this.players) {
			if (this.players[team].nPlayers < minPlayers) {
				minTeam = team
				minPlayers = this.players[team].nPlayers
			}
		}

		return minTeam
	}

	assignRandomPosition (player) {
		let x = this.random_round(0,49)
		let y = this.random_round(0,49)

		player.x = x
		player.y = y

		return player
	}

	random_round (min, max) {
	  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

module.exports = Room