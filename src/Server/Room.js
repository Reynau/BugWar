class Room {
	
	constructor (id, name, mapSize, nTeams, playersPerTeam, password) {
		this.id = id
		this.name = name
		this.mapSize = mapSize
		this.nTeams = nTeams
		this.playersPerTeam = playersPerTeam
		this.password = password

		this.nPlayers = 0
		this.readyPlayers = 0

		this.players = {}
		this.teams = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
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
			playerSocket.on('map_data', this.onMapData(playerSocket))
			playerSocket.on('player_ready', this.onPlayerReady(playerSocket))

			playerSocket = this.assignRandomPosition(playerSocket)
			playerSocket.team = team
			this.players[playerSocket.id] = playerSocket
			this.teams[team] += 1
			this.nPlayers += 1

			playerSocket.emit("room_joined", {
				room: this.id,
				team: team,
			})
			console.log("Player " + playerSocket.id + " joined room " + this.id + " at team " + team + " successfully.")

			// When new player is ready, update all the players with the new player
			playerSocket.on('player_data', this.onPlayerData.bind(this))
			playerSocket.on('player_move', this.onPlayerMove.bind(this))
		}
		else console.log("Cannot find any available team")
	}

	playerLeave (socketId) {
		let socket = this.players[socketId]
		this.players[socketId] = null

		socket.disconnect()

		--this.teams[socket.team]
		--this.nPlayers

		this.sendPlayerData()
		console.log("Player " + socketId + " leaved room " + this.id)
	}

	onPlayerReady (playerSocket) {
		let self = this

		return function () {
			if (self.players[playerSocket.id].ready) return

			self.players[playerSocket.id].ready = true
			++self.readyPlayers

			console.log("Room " + self.id + ": " + self.readyPlayers + " of " + self.nPlayers + " players ready!")

			if (self.readyPlayers === self.nPlayers) {

				for (let socketId in self.players) {
					if (self.players[socketId]) {
						self.players[socketId].emit('player_ready', { readyPlayers: self.readyPlayers, nPlayers: self.nPlayers })
						self.players[socketId].emit('game_start')
					}
				}

				console.log("Room " + self.id + ": All players ready. Game has started!")
			}
			else {
				for (let socketId in self.players) {
					if (self.players[socketId])
						self.players[socketId].emit('player_ready', { readyPlayers: self.readyPlayers, nPlayers: self.nPlayers })
				}
			}
		}
	}

	onPlayerData () {
		let data = this.generatePlayerData()

		for (let socketId in this.players) {
			if (this.players[socketId]) 
				this.players[socketId].emit('player_data', data)
		}
	}

	onPlayerMove () {
		for (let socketId in this.players) {
			if (this.players[socketId]) 
				this.players[socketId].emit('player_move', data)
		}
	}

	onMapData (playerSocket) {
		let self = this

		return function () {
			playerSocket.emit('map_data', { map_width: self.mapSize, map_height: self.mapSize })
		}
	}

	sendPlayerData () {
		let data = this.generatePlayerData()

		for (let socketId in this.players) {
			if (this.players[socketId]) {
				this.players[socketId].emit('player_data', data)
			}
		}
	}

	generatePlayerData () {
		let data = []

		for (let socketId in this.players) {
			if (this.players[socketId]) {
				let player = this.players[socketId]
				data.push({
					id: socketId,
					x: player.x,
					y: player.y,
					team: player.team
				})
			}
		}

		return data
	}

	searchTeamSlot () {
		let minTeam = null
		let minPlayers = this.playersPerTeam

		for (let team in this.teams) {
			if (this.teams[team] < minPlayers) {
				minTeam = team
				minPlayers = this.teams[team]
			}
		}

		return minTeam
	}

	assignRandomPosition (player) {
		let x = this.random_round(0,this.mapSize-1)
		let y = this.random_round(0,this.mapSize-1)

		player.x = x
		player.y = y

		return player
	}

	random_round (min, max) {
	  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

module.exports = Room