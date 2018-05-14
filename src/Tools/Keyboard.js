class Keyboard {

	constructor () {
		this._pressed = {}

		this.lastKey = null

		this.LEFT = 65
		this.UP = 87
		this.RIGHT = 68
		this.DOWN = 83
	}
	
	isDown (keyCode) {
		return this._pressed[keyCode]
	}

	lastKeyPressed () {
		return this.lastKey
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
		this.lastKey = event.keyCode
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
	}
}

module.exports = Keyboard