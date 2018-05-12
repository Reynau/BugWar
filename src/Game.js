const GameMap = require('./Map.js')
const Events = require('./Events.js')
const Player = require('./Player.js')
const {STATE} = require('./Constants.js')

var game_vars = {
	map_width: 10,
	map_height: 10,
}

class Game {

	constructor () {
		this.events = new Events();
		this.events.subscribe("player_update", this.playerUpdateCallback())

		this.map = new GameMap(game_vars.map_width, game_vars.map_height);
		this.items = undefined;
		this.hud = undefined;

		this.players = {
			1: [new Player(5,5,1)],
			2: [],
			3: [],
			4: [],
		}
	}


	playerUpdateCallback () {
		var _self = this
		return function (data) {
			_self.map.playerMovedTo(data.x, data.y, data.team)
		}
	}

	updatePlayers (keyboard) {
		for (var team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].update(keyboard, this.events)
			}
		}
	}

	drawPlayers () {
		for (var team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].draw()
			}
		}
	}

	clearCanvas () {
		ctx.beginPath()
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, canv.width, canv.height)
		ctx.closePath()
	}

	update (keyboard) {
		this.updatePlayers(keyboard);
		// update players
		// update items
		// update map
		// update hud
		this.events.transmit();
		return STATE.GAME;
	}

	draw () {
		this.clearCanvas()
		this.map.draw();
		this.drawPlayers();
		// draw items
		// draw players
		// draw hud
	}
}

module.exports = Game