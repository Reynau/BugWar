class Player {
	constructor (id, x, y, xLimit, yLimit, team) {
		this.id = id
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
			id: this.id,
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
		if (data.id !== this.id) {
			console.log("Player id and data id is not the same!")
			return
		}
		this.x = data.x
		this.y = data.y
		this.ox = data.ox
		this.oy = data.oy
		this.vx = data.vx
		this.vy = data.vy
		this.team = data.team
		this.points = data.points
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

	incrementPoints (points) {
		this.points += points
	}

	move (dx, dy, players, events) {
		this.x += dx
		this.y += dy

		if (this.x < 0 || this.y < 0 || this.x >= this.mx || this.y >= this.my) {
			this.x = this.ox
			this.y = this.oy
		}
		else if (this.collideWithPlayer(players)) {
			this.x = this.ox
			this.y = this.oy
		}
		else events.publish("player_update", this.generateUpdateEvent())
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
		if (keyboard.isDown(keyboard.UP)) this.move(0, -this.vy, players, events)
		else if (keyboard.isDown(keyboard.LEFT)) this.move(-this.vx, 0, players, events)
		else if (keyboard.isDown(keyboard.DOWN)) this.move(0, this.vy, players, events)
		else if (keyboard.isDown(keyboard.RIGHT)) this.move(this.vx, 0, players, events)
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