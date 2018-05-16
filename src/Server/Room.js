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
			this.players[team][playerSocket.id] = playerSocket
			this.players[team].nPlayers += 1
			this.nPlayers += 1
			playerSocket.emit("room_joined", {
				room: this.id,
				team: team,
			})
			console.log("Player joined room " + this.id + " at team " + team + " successfully.")
		}
		else console.log("Cannot find any available team")
	}

	playerLeave (socketId) {
		for (let team in this.players) {
			if (this.players[team][socketId]) {
				this.players[team][socketId] = null
				--this.players[team].nPlayers
				--this.nPlayers
				console.log("Player leaved room " + this.id)
				return
			}
		}
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
}

module.exports = Room