const HUD = require('./HUD.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const Button = require('../Menu/Button')
const {STATE} = require('../Constants.js')

class BasicGame {

	constructor () {
		this.GAME_STATE = {
			STOPPED: 1,
			RUNNING: 2
		}
		this.generateGame(0, 0)

		this.players = []
	}

	generateGame (width, height) {
		this.width = width
		this.height = height
		this.state = this.GAME_STATE.STOPPED
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
			this.backMenu()
		)

		this.startButton = new Button(
			250, 
			height * 15 + 25, 
			200, 50, 
			"Start", 
			{
				background: "#9bc1ff",
				hoverBackground: "#a8fff4",
				borderColor: "black",
				textColor: "black",
			},
			this.startGame()
		)
	}

	startGame () {
		let self = this
		
		return function () {
			self.state = self.GAME_STATE.RUNNING
		}
	}

	backMenu () {
		let self = this
		
		return function () {
			self.state = self.GAME_STATE.STOPPED
			self.changeState = STATE.MENU
		}
	}

	updatePlayerPoints (team, id, points) {
		this.players.forEach(player => {
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
		this.players.forEach(player => player.update(this.players, keyboard, this.events))
	}

	drawPlayers () {
		this.players.forEach(player => player.draw())
	}

	checkButton (mouse, button) {
		if (!button.isActive()) return

		let click = (mouse.clicked) ? mouse.getClickPosition() : false
		let mousePos = mouse.getPosition()

		if (button.isInside(mousePos)) button.hover()
		else button.normal()

		if (click && button.isInside(click)) {
			button.click()
		}
	}

	update (mouse, keyboard) {
		this.checkButton(mouse, this.backButton)
		this.checkButton(mouse, this.startButton)

		if (this.state === this.GAME_STATE.RUNNING) {
			this.updatePlayers(keyboard)
			this.events.transmit()
		}

		return this.changeState
	}

	draw () {
		this.map.draw()
		this.drawPlayers()
		this.hud.draw()
		this.backButton.draw()
		this.startButton.draw()
	}
}	

module.exports = BasicGame