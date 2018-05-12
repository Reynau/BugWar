class Player {
	constructor (x, y, team) {
		this.x = x
		this.y = y
		this.ox = x
		this.oy = y
		this.vx = 1
		this.vy = 1
		this.team = team
		this.points = 0

		this.last_update_timestamp = 0;
	}

	generateUpdateEvent () {
		return {
			x: this.x,
			y: this.y,
			ox: this.ox,
			oy: this.oy,
			vx: this.vx,
			vy: this.vy,
			team: this.team,
			points: this.points,
		}
	}

	playerGetUpdate (data) {
		this.x = data.x
		this.y = data.y
		this.ox = data.ox
		this.oy = data.oy
		this.vx = data.vx
		this.vy = data.vy
		this.team = data.team
		this.points = data.points
	}

	move (dx, dy, events) {
		this.x += dx
		this.y += dy

		events.publish("player_update", this.generateUpdateEvent())
	}

	update (keyboard, events) {
		// Update last timestamp
		var timestamp = Date.now();
		if (timestamp - this.last_update_timestamp < 500) return;
		this.last_update_timestamp = timestamp;

		// Save old position
		this.ox = this.x
		this.oy = this.y

		// Update player position if necessary
		if (keyboard.isDown(keyboard.UP)) this.move(0, -this.vy, events)
		else if (keyboard.isDown(keyboard.LEFT)) this.move(-this.vx, 0, events)
		else if (keyboard.isDown(keyboard.DOWN)) this.move(0, this.vy, events)
		else if (keyboard.isDown(keyboard.RIGHT)) this.move(this.vx, 0, events)
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

module.exports = Player