const HUD = require('./HUD.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')

class BasicGame {

	constructor () { }

	updatePlayerPoints (team, id, points) {
		this.players[team].forEach((player) => {
			if (player.id === id) player.incrementPoints(points)
		})
	}

	mapUpdateCallback () {
		let self = this
		return function (playerData) {
			let points = self.map.searchClosedPolygon(playerData)
			self.updatePlayerPoints(playerData.team, playerData.id, points)
		}
	}

	playerUpdateCallback () {
		let self = this
		return function (playerData) {
			let points = self.map.playerMovedTo(playerData.x, playerData.y, playerData.team)
			self.updatePlayerPoints(playerData.team, playerData.id, points)
		}
	}

	updatePlayers (keyboard) {
		for (let team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].update(this.players, keyboard, this.events)
			}
		}
	}

	drawPlayers () {
		for (let team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].draw()
			}
		}
	}

	update (mouse, keyboard) {
		this.updatePlayers(keyboard)

		this.events.transmit()
		return STATE.GAME
	}

	draw () {
		this.map.draw()
		this.drawPlayers()
		this.hud.draw()
	}
}

module.exports = BasicGame