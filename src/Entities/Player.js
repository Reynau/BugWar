const MovingEntity = require('./MovingEntity.js')

class Player extends MovingEntity {
	constructor (id, x, y, xLimit, yLimit, team) {
		super(id, x, y, xLimit, yLimit)

		this.team = team
		this.points = 0
	}

	move (players, events) {
		this.x += this.vx
		this.y += this.vy

		if (this.x < 0 || this.y < 0 || this.x >= this.mx || this.y >= this.my) {
			this.x = this.ox
			this.y = this.oy
			this.vx = 0
			this.vy = 0
		}
		else if (this.collideWithPlayer(players)) {
			this.x = this.ox
			this.y = this.oy
			this.vx = 0
			this.vy = 0
		}
		
		if (this.x !== this.ox || this.y !== this.oy) events.publish("player_update", this.generateUpdateEvent())
	}

	update (players, keyboard, events) {
		// Update last timestamp
		var timestamp = Date.now();
		if (timestamp - this.last_update_timestamp < 500) return;
		this.last_update_timestamp = timestamp;

		// Save old position
		this.ox = this.x
		this.oy = this.y

		// Update player position if necessary
		switch (keyboard.lastKeyPressed()) {
			case keyboard.UP: this.vx = 0; this.vy = -1; break
			case keyboard.LEFT: this.vx = -1; this.vy = 0; break
			case keyboard.DOWN: this.vx = 0; this.vy = 1; break
			case keyboard.RIGHT: this.vx = 1; this.vy = 0; break
		}

		this.move(players, events)
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