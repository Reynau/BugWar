class IA {
	constructor (x, y, xLimit, yLimit, team) {
		// Maximum x and y
		this.mx = xLimit
		this.my = yLimit
		// Actual position
		this.x = x
		this.y = y
		// Old position
		this.ox = x
		this.oy = y
		// X and Y speed
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

	moveAutonomously (events) {
		let dir = this.random_round(1,4)
		console.log(dir)
		switch(dir) {
			case 1: this.x += this.vx; break
			case 2: this.x -= this.vx; break
			case 3: this.y += this.vy; break
			case 4: this.y -= this.vy; break
		}

		if (this.x < 0 || this.y < 0 || this.x >= this.mx || this.y >= this.my) {
			this.x = this.ox
			this.y = this.oy
		}
		else events.publish("player_update", this.generateUpdateEvent())
	}

	update (keyboard, events) {
		// Update last timestamp
		var timestamp = Date.now();
		if (timestamp - this.last_update_timestamp < 500) return;
		this.last_update_timestamp = timestamp;

		// Save old position
		this.ox = this.x
		this.oy = this.y

		// Update player position
		this.moveAutonomously(events)
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

	random (min, max) {
	  	return Math.random() * (max - min + 1) + min;
	}
	random_round (min, max) {
	  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

module.exports = IA