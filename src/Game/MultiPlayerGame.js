const HUD = require('./HUD.js')
const BasicGame = require('./BasicGame.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')
const Client = require('../Client/Client.js')

var game_vars = {
	map_width: 50,
	map_height: 50,
}

class MultiPlayerGame extends BasicGame {

	constructor (client) {
		super()

		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my)

		this.events = new Events()
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())

		this.items = undefined

		this.client = client
		this.client.onPlayerData(this.updatePlayerData())

		this.hud = new HUD(this.players)
	}

	updatePlayerData () {
		let mx = game_vars.map_width
		let my = game_vars.map_height
		let self = this

		return function (data) {
			console.log("Player data received.")
			self.players = {
				1: [],
				2: [],
				3: [],
				4: [],
			}
			console.log(data)

			for (let team in data) {
				for (let id in data[team]) {
					let playerData = data[team][id]
					let player = undefined
					if (id === self.client.socket.id) {
						player = new Player(id, playerData.x, playerData.y, mx, my, team)
					}
					else {
						player = new IA(id, playerData.x, playerData.y, mx, my, team)
					}
					self.players[team].push(player)
				}
			}
		}
	}
}

module.exports = MultiPlayerGame