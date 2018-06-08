const HUD = require('./HUD.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const Button = require('../Menu/Button')
const {STATE} = require('../Constants.js')

class BasicGame {

	constructor (width, height) {
		let self = this

		this.width = width
		this.height = height
		this.changeState = STATE.GAME

		this.backButton = new Button(
			15, 
			height * 15 + 25, 
			200, 50, 
			"Back to menu", 
			{
				background: "#9bc1ff",
				hoverBackground: "#a8fff4",
				borderColor: "black",
				textColor: "black",
			},
			function () {
				self.changeState = STATE.MENU
			}
		)
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

	drawPlayers () {
		for (let team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].draw()
			}
		}
	}

	backButtonClicked (mouse) {
		let click = (mouse.clicked) ? mouse.getClickPosition() : false
		let mousePos = mouse.getPosition()

		if (this.backButton.isInside(mousePos)) this.backButton.hover()
		else this.backButton.normal()

		if (click && this.backButton.isInside(click)) {
			this.backButton.click()
		}
	}

	update (mouse, keyboard) {
		if (this.backButtonClicked(mouse)) {
			return this.changeState
		}
			
		this.updatePlayers(keyboard)

		this.events.transmit()
		return this.changeState
	}

	draw () {
		this.map.draw()
		this.drawPlayers()
		this.hud.draw()
		this.backButton.draw();
	}
}

module.exports = BasicGame