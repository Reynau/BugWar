const MovingEntity = require('./MovingEntity.js')

class IA extends MovingEntity {
	constructor (id, x, y, xLimit, yLimit, team) {
		super(id, x, y, xLimit, yLimit)

		this.team = team
		this.points = 0
	}

	moveAutonomously (players, events) {
		let dir = this.random_round(1,4)
		switch(dir) {
			case 1: this.x += 1; break
			case 2: this.x -= 1; break
			case 3: this.y += 1; break
			case 4: this.y -= 1; break
		}

		if (this.x < 0 || this.y < 0 || this.x >= this.mx || this.y >= this.my) {
			this.x = this.ox
			this.y = this.oy
		}
		else if (this.collideWithPlayer(players)) {
			this.x = this.ox
			this.y = this.oy
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

		// Update player position
		this.moveAutonomously(players, events)
	}

	random (min, max) {
	  	return Math.random() * (max - min + 1) + min;
	}

	random_round (min, max) {
	  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

module.exports = IA