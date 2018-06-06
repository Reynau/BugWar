const Button = require('./Button.js')
const {STATE} = require('../Constants.js')

class Menu {

	constructor () {
		this.buttons = [
			new Button(
				15, 
				15, 
				200, 50, 
				"Single Player", 
				{
					background: "#9bc1ff",
					hoverBackground: "#a8fff4",
					borderColor: "black",
					textColor: "black",
				},
				function () {
					return STATE.SINGLEPLAYER_GAME
				}
			),
			new Button(
				15, 
				80, 
				200, 50, 
				"Double Player", 
				{
					background: "#9bc1ff",
					hoverBackground: "#a8fff4",
					borderColor: "black",
					textColor: "black",
				},
				function () {
					return STATE.DOUBLEPLAYER_GAME
				}
			),
			new Button(
				15, 
				145, 
				200, 50, 
				"MultiPlayer", 
				{
					background: "#9bc1ff",
					hoverBackground: "#a8fff4",
					borderColor: "black",
					textColor: "black",
				},
				function () {
					return STATE.ROOM_SELECTOR
				}
			),
		]
	}

	update (mouse, keyboard) {
		let click = (mouse.clicked) ? mouse.getClickPosition() : false
		let mousePos = mouse.getPosition()

		let changeState = null
		this.buttons.forEach((btn) => {
			if (btn.isInside(mousePos)) btn.hover()
			else btn.normal()

			if (click && btn.isInside(click)) changeState = btn.click()
		})
		return changeState
	}

	draw () {
		this.buttons.forEach((btn) => btn.draw())
	}
}

module.exports = Menu