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

	update (keyboard, events) {
		var timestamp = Date.now();
		if (timestamp - this.last_update_timestamp < 1000) return;
		this.last_update_timestamp = timestamp;

		this.ox = this.x
		this.oy = this.y
		if (keyboard.isDown(keyboard.UP)) this.y -= this.vy
		if (keyboard.isDown(keyboard.LEFT)) this.x -= this.vx
		if (keyboard.isDown(keyboard.DOWN)) this.y += this.vy
		if (keyboard.isDown(keyboard.RIGHT)) this.x += this.vx

		events.publish("player_update", this.generateUpdateEvent())
	}

	draw () {
		ctx.beginPath()
		ctx.rect(this.y * 15, this.x * 15, 10, 10)
		ctx.fillStyle = "magenta"
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = "green"
		ctx.stroke()
		ctx.closePath()
	}
}

module.exports = Player