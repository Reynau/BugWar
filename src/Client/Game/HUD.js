class HUD {

	constructor (players, width, height) {
		this.players = players
		this.map_width = width
		this.map_height = height
	}

	setPlayers (players) {
		this.players = players
	}

	drawText (text, x, y) {
		ctx.beginPath()
		ctx.font = "20px Arial"
		ctx.fillStyle = "black"
		ctx.textAlign = "start"
		ctx.fillText(text, x, y)
		ctx.closePath()
	}

	drawTeamPoints () {
		let x = this.map_width * 15 + 25
		let y = 50

		let points = { 
			1: 0,
			2: 0,
			3: 0,
			4: 0
		}

		this.players.forEach(player => {
			points[player.team] += player.points
		})

		for (let team in points) {
			this.drawText("Team " + team + " points: " + points[team], x, y * team)
		}
	}

	draw () {
		this.drawTeamPoints()
	}
}

module.exports = HUD