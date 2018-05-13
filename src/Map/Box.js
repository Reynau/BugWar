var COLORS = {
	NEUTRAL: '#ababab',

	RED: {
		1: '#ffa5a0',
		2: '#ff756d',
		3: '#ff3e32',
		4: '#ff2216',
	},

	BLUE: {
		1: '#a0c9ff',
		2: '#6dacff',
		3: '#519cff',
		4: '#1479ff',
	},

	GREEN: {
		1: '#b2ffa8',
		2: '#87ff77',
		3: '#5aff44',
		4: '#27ff0a',
	},

	YELLOW: {
		1: '#fffbc6',
		2: '#fff799',
		3: '#fff66b',
		4: '#fff11c',
	},
}

class Box {
	
	constructor () {
		this.team = 0
		this.level = 0
		this.blocked = false
	}

	isBlockedBy (team) {
		return (this.team === team && this.blocked)
	}
		

	incrementLevel (team) {
		// Cannot increment level of a blocked box
		if (this.blocked) return 0

		let points = 0
		// If team is different, change to new team
		if (this.team !== team) {
			if (this.team !== 0) points += this.level * 10
			else points += 5 // Neutral box
			this.changeTeam(team)
		}
		else {
			this.level += 1
			points += this.level * 5
			if (this.level === 4) {
				this.blocked = true
				points += 10
			}
		}
		return points
	}

	blockBox (team) {
		// Cannot change a blocked box
		if (this.blocked) return 0

		let points = 0
		if (this.team !== 0 && this.team !== team) {
			points += this.level * 10
		}

		this.team = team
		this.level = 4
		this.blocked = true

		points += 60 //1*5 + 2*5 + 3*5 + 4*5 + 10

		return points
	}

	changeTeam (team) {
		// If box is blocked cannot change his team
		if (this.blocked) return false

		this.team = team
		this.level = 1
		return true
	}

	resetBox () {
		this.team = 0
		this.level = 0
		this.blocked = false
	}

	draw (x, y, w, h) {
		var color;
		switch(this.team) {
			case 0: color = COLORS.NEUTRAL; break
			case 1: color = COLORS.RED[this.level]; break
			case 2: color = COLORS.BLUE[this.level]; break
			case 3: color = COLORS.GREEN[this.level]; break
			case 4: color = COLORS.YELLOW[this.level]; break
		}
		var stroke_color = (this.blocked ? "white" : "black")

		ctx.beginPath()
		ctx.rect(x, y, w, h)
		ctx.fillStyle = color
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = stroke_color
		ctx.stroke()
		ctx.closePath()
	}
}

module.exports = Box