const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')

var game_vars = {
	map_width: 10,
	map_height: 10,
}

class SinglePlayer {

	constructor () {
		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my);

		this.events = new Events();
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())

		this.items = undefined;
		this.hud = undefined;

		this.players = {
			1: [new Player(1, 0, 0, mx, my, 1)],
			2: [new IA(2, 0, my-1, mx, my, 2)],
			3: [new IA(3, mx-1, 0, mx, my, 3)],
			4: [new IA(4, mx-1, my-1, mx, my, 4)],
		}
	}

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

	drawText (x, y, text) {
		ctx.beginPath()
		ctx.font = "20px Arial"
		ctx.fillStyle = "black"
		ctx.fillText(text, x, y)
		ctx.closePath()
	}

	drawTeamPoints () {
		let y = 25
		let count = 1
		for (let team in this.players) {
			let points = 0
			for (let p = 0; p < this.players[team].length; ++p) {
				points += this.players[team][p].points
			}
			ctx.beginPath()
			ctx.font = "20px Arial"
			ctx.fillStyle = "black"
			ctx.textAlign="start"
			ctx.fillText("Team " + team + " points: " + points, canv.width - 350, y * team)
			ctx.closePath()
			//this.drawText("Team " + team + " points: " + points, canv.width - 250, y * count)
			++count
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
		// update players
		// update items
		// update map
		// update hud
		this.events.transmit()
		return STATE.GAME
	}

	draw () {
		this.map.draw()
		this.drawPlayers()
		this.drawTeamPoints()
		// draw items
		// draw players
		// draw hud
	}
}

module.exports = SinglePlayer