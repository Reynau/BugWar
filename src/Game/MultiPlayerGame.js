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

	constructor () {
		super()

		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my)

		this.events = new Events()
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())

		this.items = undefined

		this.client = new Client()

		this.players = {
			1: [new Player(1, 0, 0, mx, my, 1)],
			2: [new IA(2, 0, my-1, mx, my, 2), new IA(2, 0, my-5, mx, my, 2)],
			3: [new IA(3, mx-1, 0, mx, my, 3), new IA(3, mx-5, 0, mx, my, 3)],
			4: [new IA(4, mx-1, my-1, mx, my, 4), new IA(4, mx-5, my-1, mx, my, 4)],
		}

		this.hud = new HUD(this.players)
	}
}

module.exports = MultiPlayerGame