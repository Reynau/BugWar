class Keyboard {

	constructor () {
		this._pressed = {}

		this.lastKey = null

		this.A = 65
		this.W = 87
		this.D = 68
		this.S = 83

		this.LEFT = 37
		this.UP = 38
		this.RIGHT = 39
		this.DOWN = 40
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