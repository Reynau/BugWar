const HUD = require('./HUD.js')
const BasicGame = require('./BasicGame.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const OnlineEnemyPlayer = require('../Entities/OnlineEnemyPlayer.js')
const {STATE} = require('../Constants.js')

class MultiPlayerGame extends BasicGame {

	constructor (connectionController) {
		super()

		this.connectionController = connectionController
		this.connectionController.onMapData(this.generateMap())
		this.connectionController.onPlayerData(this.updatePlayerData())
		this.connectionController.onPlayerMove(this.updatePlayerMove())

		this.events = new Events()
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())
		this.events.subscribe("player_update", this.connectionController.sendPlayerMove())

		this.items = undefined

		this.hud = new HUD(this.players)
	}

	startGame () {
		let self = this

		return function () {
			self.connectionController.onPlayerReady(self.playerReady())
			self.connectionController.onGameStart(self.initGame())
		}
	}

	backMenu () {
		let self = this
		
		return function () {
			self.state = self.GAME_STATE.STOPPED
			self.changeState = STATE.MENU
			self.connectionController.disconnect()
		}
	}

	playerReady () {
		let self = this

		return function (data) {	
			self.startButton.text = data.readyPlayers + " of " + data.nPlayers + " players are ready!"
		}
	}

	initGame () {
		let self = this

		return function () {
			console.log("Init game received!")
			self.state = self.GAME_STATE.RUNNING
			self.startButton.hide()
		}
	}

	generateMap () {
		let self = this

		return function (data) {
			console.log("Map data received: ", data)
			let mx = data.map_width
			let my = data.map_height

			self.generateGame(mx, my)
			self.map = new GameMap(mx, my)
		}
	}

	updatePlayerMove () {
		let self = this

		return function (data) {
			console.log("Received player_move data: ", data)

			self.players.forEach(player => {
				if (player.id === self.connectionController.socket.id) return

				if (player.id === data.id) {
					player.onMovePlayerData(data)
					return
				}
			})
		}
	}

	updatePlayerData () {
		let mx = this.width
		let my = this.height
		let self = this

		return function (data) {
			console.log("Player data received.")
			self.players = []
			console.log(data)
			data.forEach(playerData => {
				let player = undefined
				if (playerData.id === self.connectionController.socket.id) {
					player = new Player(playerData.id, playerData.x, playerData.y, mx, my, playerData.team, 1)
				}
				else {
					player = new OnlineEnemyPlayer(playerData.id, playerData.x, playerData.y, mx, my, playerData.team)
				}
				self.players.push(player)
			})
			self.hud.setPlayers(self.players)
		}
	}
}

module.exports = MultiPlayerGame