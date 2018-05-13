const Box = require('./Box.js')

var map_vars = {
	box_width: 15,
	box_height: 15,
}

class Map {

	constructor (width, height) {
		this.width = width
		this.height = height

		this.matrix = []

		for (var i = 0; i < this.width; ++i) {
			this.matrix[i] = []
			for (var j = 0; j < this.height; ++j) {
				this.matrix[i][j] = new Box()
			}
		}
	}

	isOutOfBounds (x, y) {
		return (x < 0 || y < 0 || x >= this.width || y >= this.height)
	}

	getBlankMap () {
		let blankMap = []
		for (var i = 0; i < this.width; ++i) {
			blankMap[i] = []
			for (var j = 0; j < this.height; ++j) {
				blankMap[i][j] = 0
			}
		}
		return blankMap
	}

	findWall (x, y, team) {
		let visited = this.getBlankMap()

		let queue = []
		queue.push({x:x, y:y})

		while (queue.length > 0) {
			let elem = queue.shift()
			let x = elem.x
			let y = elem.y
			visited[x][y] = 1

			for (let i = -1; i <= 1; ++i) {
				for (let j = -1; j <= 1; ++j) {
					if (i === 0 && j === 0) continue

					let nx = x+i
					let ny = y+j

					if (this.isOutOfBounds(nx, ny)) return true
					if (this.matrix[nx][ny].isBlockedBy(team) || visited[nx][ny]) continue

					queue.push({x:nx, y:ny})
				}
			}
		}
		return false
	}

	paintArea (x, y, team) {
		let visited = this.getBlankMap()

		let queue = []
		queue.push({x:x, y:y})

		while (queue.length > 0) {
			let elem = queue.shift()
			let x = elem.x
			let y = elem.y
			visited[x][y] = 1
			this.matrix[x][y].blockBox(team)

			for (let i = -1; i <= 1; ++i) {
				for (let j = -1; j <= 1; ++j) {
					if (i !== 0 && j !== 0) continue

					let nx = x+i
					let ny = y+j
					if (this.isOutOfBounds(nx, ny)) {
						// This should never happen!!
						console.log("Going out of bounds while paiting pos: ", nx, ny)
						continue
					}
					if (this.matrix[nx][ny].isBlockedBy(team) || visited[nx][ny]) continue

					queue.push({x:nx, y:ny})
				}
			}
		}
	}

	searchClosedPolygon (data) {
		let x = data.x
		let y = data.y
		let team = data.team

		if (!this.matrix[x][y].blocked) return

		// Start bfs in each non-blocked direction
		for (let i = -1; i <= 1; ++i) {
			for (let j = -1; j <= 1; ++j) {
				if (i === 0 && j === 0) continue
				let nx = x+i
				let ny = y+j

				if (this.isOutOfBounds(nx, ny) || this.matrix[nx][ny].isBlockedBy(team)) continue
				if (!this.findWall(nx, ny, team)) this.paintArea(nx, ny, team)
			}
		}
	}

	update () {
		var self = this
		return function (data) {
			self.searchClosedPolygon(data)
		}
	}

	draw () {
		for (var i = 0; i < this.width; ++i) {
			for (var j = 0; j < this.height; ++j) {
				var x = i * map_vars.box_width
				var y = j * map_vars.box_height
				var w = map_vars.box_width
				var h = map_vars.box_height
				this.matrix[i][j].draw(x, y, w, h)
			}
		}
	}

	playerMovedTo (x, y, team) {
		this.matrix[x][y].incrementLevel(team)
		return 0
	}
}

module.exports = Map