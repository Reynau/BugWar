class HUD {

	constructor (players) {
		this.players = players
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
		let x = canv.width - 350
		let y = 25
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