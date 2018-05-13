const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')

var game_vars = {
	map_width: 10,
	map_height: 10,
}

class MultiPlayer {

	constructor () {
		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my);

		this.events = new Events();
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.map.update())

		this.items = undefined;
		this.hud = undefined;

		this.players = {
			1: [/*new Player(1, 0, 0, mx, my, 1)*/],
			2: [/*new IA(2, 0, my-1, mx, my, 2)*/],
			3: [/*new IA(3, mx-1, 0, mx, my, 3)*/],
			4: [/*new IA(4, mx-1, my-1, mx, my, 4)*/],
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
				this.players[team][p].update(this.players, keyboard, this.events)
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

	update (mouse, keyboard) {
		this.updatePlayers(keyboard);
		// update players
		// update items
		// update map
		// update hud
		this.events.transmit();
		return STATE.GAME;
	}

	draw () {
		this.map.draw();
		this.drawPlayers();
		// draw items
		// draw players
		// draw hud
	}
}

module.exports = MultiPlayer