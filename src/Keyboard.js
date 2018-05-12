class Keyboard {

	constructor () {
		this._pressed = {}

		this.LEFT = 37
		this.UP = 38
		this.RIGHT = 39
		this.DOWN = 40
	}
	
	isDown (keyCode) {
		return this._pressed[keyCode]
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
		console.log("Key Pressed: " + event.keyCode)
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
		console.log("Key Released: " + event.keyCode)
	}
}

module.exports = Keyboard