class Keyboard {

	constructor () {
		this._pressed = {}

		this.lastKey = {
			1: null,
			2: null
		}

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

	lastKeyPressed (keyboardGroup) {
		return this.lastKey[keyboardGroup];
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
		switch (event.keyCode) {
			case this.A:
			case this.W:
			case this.D:
			case this.S: this.lastKey[1] = event.keyCode; break;

			case this.LEFT:
			case this.UP:
			case this.RIGHT:
			case this.DOWN: this.lastKey[2] = event.keyCode; break;
		}
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
	}
}

module.exports = Keyboard