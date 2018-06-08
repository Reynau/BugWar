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
		for (let team in this.players) {
			let points = 0
			for (let p = 0; p < this.players[team].length; ++p) {
				points += this.players[team][p].points
			}
			this.drawText("Team " + team + " points: " + points, x, y * team)
		}
	}

	draw () {
		this.drawTeamPoints()
	}
}

module.exports = HUD