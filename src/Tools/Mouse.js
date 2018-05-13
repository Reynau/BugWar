class Mouse {

	constructor (canvas) {
		this.x = 0
		this.y = 0
		this.cx = null
		this.cy = null
		this.clicked = false

		this.canvas = canvas
	}

	onMouseClick () {
		let self = this
		return function (event) {
			let rect = self.canvas.getBoundingClientRect()
			self.cx = event.clientX - rect.left
			self.cy = event.clientY - rect.top
			self.clicked = true
		}
	}

	onMouseMove () {
		let self = this
		return function (event) {
			let rect = self.canvas.getBoundingClientRect()
			self.x = event.clientX - rect.left
			self.y = event.clientY - rect.top
		}
	}

	getClickPosition () {
		return {x: this.cx, y: this.cy}
	}

	getPosition () {
		return {x: this.x, y: this.y}
	}

	clean () {
		/*this.clicked = false
		this.cx = null
		this.cy = null*/
	}
}

module.exports = Mouse