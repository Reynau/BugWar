const Button = require('./Button.js')
const {STATE} = require('../Constants.js')

class RoomSelector {

	constructor (client) {
		let self = this

		this.client = client
		this.changeState = null

		this.buttons = [
			new Button(
				15, 
				15, 
				200, 50, 
				"Back to menu", 
				{
					background: "#9bc1ff",
					hoverBackground: "#a8fff4",
					borderColor: "black",
					textColor: "black",
				},
				function () {
					self.client.disconnect()
					self.changeState = STATE.MENU
				}
			),
		]

		this.client.connect()
		this.client.getListOfRooms(this.onListOfRooms())
	}

	createRoomButton (x, y, roomId) {
		let self = this
		return new Button(
			x, 
			y, 
			200, 50, 
			"Room " + roomId, 
			{
				background: "#ffbc9b",
				hoverBackground: "#ffe5b2",
				borderColor: "black",
				textColor: "black",
			},
			function () {
				self.client.joinRoom(
					roomId, 
					() => self.changeState = STATE.MULTIPLAYER_GAME,
					() => console.log("Room unavailable")
				)
			}
		)
	}

	onListOfRooms () {
		let self = this
		return function (data) {
			console.log("List of rooms received: ", data)
			let i = 0
			for (let room in data) {
				let btn = self.createRoomButton(15, 100 + i*(50+15), data[room])
				self.buttons.push(btn)
				++i
			}
		}
	}

	update (mouse, keyboard) {
		let click = (mouse.clicked) ? mouse.getClickPosition() : false
		let mousePos = mouse.getPosition()

		this.buttons.forEach((btn) => {
			if (btn.isInside(mousePos)) btn.hover()
			else btn.normal()

			if (click && btn.isInside(click)) {
				btn.click()
			}
		})
		return this.changeState
	}

	draw () {
		this.buttons.forEach((btn) => btn.draw())
	}
}

module.exports = RoomSelector