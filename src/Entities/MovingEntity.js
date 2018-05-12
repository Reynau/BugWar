const Entity = require('./Entity.js')

class MovingEntity extends Entity {

	constructor (id, x, y, xLimit, yLimit) {
		super(id, x, y)
		// Maximum x and y
		this.mx = xLimit
		this.my = yLimit
		// Old position
		this.ox = x
		this.oy = y
		// X and Y speed
		this.vx = 1
		this.vy = 1

		this.last_update_timestamp = 0
	}

	collideWithPlayer (players) {
		let self = this
		let collide = false
		for (let team in players) {
			players[team].forEach((player) => {
				if (collide || player.id === self.id) return
				collide = (player.x === self.x && player.y === self.y)
			})
		}
		return collide
	}

	draw () {
		ctx.beginPath()
		ctx.rect(this.x * 15, this.y * 15, 10, 10)
		ctx.fillStyle = "magenta"
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = "green"
		ctx.stroke()
		ctx.closePath()
	}
}

module.exports = MovingEntity