const HUD = require('./HUD.js')
const BasicGame = require('./BasicGame.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const OnlineEnemyPlayer = require('../Entities/OnlineEnemyPlayer.js')
const {STATE} = require('../Constants.js')

var game_vars = {
	map_width: 35,
	map_height: 35,
}

class MultiPlayerGame extends BasicGame {

	constructor (connectionController) {
		let mx = game_vars.map_width
		let my = game_vars.map_height

		super(mx, my)

		this.map = new GameMap(mx, my)
		this.connectionController = connectionController
		this.events = new Events()
		this.items = undefined

		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())
		this.events.subscribe("player_update", this.connectionController.sendPlayerMove())

		this.connectionController.onPlayerData(this.updatePlayerData())
		this.connectionController.onPlayerMove(this.updatePlayerMove())

		this.hud = new HUD(this.players)
	}

	updatePlayerMove () {
		let self = this

		return function (data) {
			console.log("Received player_move data: ", data)
			for (let team in self.players) {
				for (let id in self.players[team]) {
					if (self.players[team][id].id === self.connectionController.socket.id) continue

					if (self.players[team][id].id === data.id) {
						self.players[team][id].onMovePlayerData(data)
						return
					}
				}
			}
		}
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

			for (let team in data) {
				for (let id in data[team]) {
					let playerData = data[team][id]
					let player = undefined
					if (id === self.connectionController.socket.id) {
						player = new Player(id, playerData.x, playerData.y, mx, my, team, 1)
					}
					else {
						player = new OnlineEnemyPlayer(id, playerData.x, playerData.y, mx, my, team)
					}
					self.players[team].push(player)
				}
			}
			self.hud.setPlayers(self.players)
		}
	}
}

module.exports = MultiPlayerGame