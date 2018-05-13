class Keyboard {

	constructor () {
		this._pressed = {}

		this.LEFT = 65
		this.UP = 87
		this.RIGHT = 68
		this.DOWN = 83
	}
	
	isDown (keyCode) {
		return this._pressed[keyCode]
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
	}
}

module.exports = Keyboard