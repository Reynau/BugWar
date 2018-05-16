(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Client {

	constructor (playerMoveCallback) {
		var self = this

		this.socket = io.connect('http://localhost');

		this.socket.emit('join_room', '1')
		
		this.socket.on('room_joined', function (data) {
			console.log("Room " + data.room + " joined successfully at team " + data.team)
			//this.socket.emit('leave_room')
		});
	}
}

module.exports = Client
},{}],2:[function(require,module,exports){
module.exports = {
	STATE: {
		MENU: 1,
		SINGLEPLAYER_GAME: 2,
		MULTIPLAYER_GAME: 3,
	},
}
},{}],3:[function(require,module,exports){
class Entity {

	constructor (id, x, y) {
		this.id = id
		this.x = x
		this.y = y
	}
}

module.exports = Entity
},{}],4:[function(require,module,exports){
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
},{"./MovingEntity.js":5}],5:[function(require,module,exports){
const Entity = require('./Entity.js')

class MovingEntity extends Entity {

	constructor (id, x, y, xLimit, yLimit) {
		super(id, x, y)
		// Maximum x and y
		this.mx = xLimit
		this.my = yLimit
		// Old position
		this.ox = x
		this.oy = y
		// X and Y speed
		this.vx = 0
		this.vy = 0

		this.last_update_timestamp = 0
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

	incrementPoints (points) {
		if (!Number.isInteger(points)) {
			console.log("Invalid increment")
		}
		else this.points += points
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

module.exports = MovingEntity
},{"./Entity.js":3}],6:[function(require,module,exports){
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
},{"./MovingEntity.js":5}],7:[function(require,module,exports){
const HUD = require('./HUD.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')

class BasicGame {

	constructor () { }

	updatePlayerPoints (team, id, points) {
		this.players[team].forEach((player) => {
			if (player.id === id) player.incrementPoints(points)
		})
	}

	mapUpdateCallback () {
		let self = this
		return function (playerData) {
			let points = self.map.searchClosedPolygon(playerData)
			self.updatePlayerPoints(playerData.team, playerData.id, points)
		}
	}

	playerUpdateCallback () {
		let self = this
		return function (playerData) {
			let points = self.map.playerMovedTo(playerData.x, playerData.y, playerData.team)
			self.updatePlayerPoints(playerData.team, playerData.id, points)
		}
	}

	updatePlayers (keyboard) {
		for (let team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].update(this.players, keyboard, this.events)
			}
		}
	}

	drawPlayers () {
		for (let team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].draw()
			}
		}
	}

	update (mouse, keyboard) {
		this.updatePlayers(keyboard)

		this.events.transmit()
		return STATE.GAME
	}

	draw () {
		this.map.draw()
		this.drawPlayers()
		this.hud.draw()
	}
}

module.exports = BasicGame
},{"../Constants.js":2,"../Entities/IA.js":4,"../Entities/Player.js":6,"../Map/Map.js":12,"../Tools/Events.js":15,"./HUD.js":8}],8:[function(require,module,exports){
class HUD {

	constructor (players) {
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
},{}],9:[function(require,module,exports){
const HUD = require('./HUD.js')
const BasicGame = require('./BasicGame.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')
const Client = require('../Client/Client.js')

var game_vars = {
	map_width: 50,
	map_height: 50,
}

class MultiPlayerGame extends BasicGame {

	constructor () {
		super()

		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my)

		this.events = new Events()
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())

		this.items = undefined

		this.client = new Client()

		this.players = {
			1: [new Player(1, 0, 0, mx, my, 1)],
			2: [new IA(2, 0, my-1, mx, my, 2), new IA(2, 0, my-5, mx, my, 2)],
			3: [new IA(3, mx-1, 0, mx, my, 3), new IA(3, mx-5, 0, mx, my, 3)],
			4: [new IA(4, mx-1, my-1, mx, my, 4), new IA(4, mx-5, my-1, mx, my, 4)],
		}

		this.hud = new HUD(this.players)
	}
}

module.exports = MultiPlayerGame
},{"../Client/Client.js":1,"../Constants.js":2,"../Entities/IA.js":4,"../Entities/Player.js":6,"../Map/Map.js":12,"../Tools/Events.js":15,"./BasicGame.js":7,"./HUD.js":8}],10:[function(require,module,exports){
const HUD = require('./HUD.js')
const BasicGame = require('./BasicGame.js')
const GameMap = require('../Map/Map.js')
const Events = require('../Tools/Events.js')
const Player = require('../Entities/Player.js')
const IA = require('../Entities/IA.js')
const {STATE} = require('../Constants.js')

var game_vars = {
	map_width: 50,
	map_height: 50,
}

class SinglePlayerGame extends BasicGame {

	constructor () {
		super()
		
		let mx = game_vars.map_width
		let my = game_vars.map_height

		this.map = new GameMap(mx, my);

		this.events = new Events();
		this.events.subscribe("player_update", this.playerUpdateCallback())
		this.events.subscribe("player_update", this.mapUpdateCallback())

		this.items = undefined

		this.players = {
			1: [new Player(1, 0, 0, mx, my, 1)],
			2: [new IA(2, 0, my-1, mx, my, 2), new IA(2, 0, my-5, mx, my, 2)],
			3: [new IA(3, mx-1, 0, mx, my, 3), new IA(3, mx-5, 0, mx, my, 3)],
			4: [new IA(4, mx-1, my-1, mx, my, 4), new IA(4, mx-5, my-1, mx, my, 4)],
		}

		this.hud = new HUD(this.players)
	}
}

module.exports = SinglePlayerGame
},{"../Constants.js":2,"../Entities/IA.js":4,"../Entities/Player.js":6,"../Map/Map.js":12,"../Tools/Events.js":15,"./BasicGame.js":7,"./HUD.js":8}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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

		let stack = []
		stack.push({x:x, y:y})

		while (stack.length > 0) {
			let elem = stack.pop()
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

					stack.push({x:nx, y:ny})
				}
			}
		}
		return false
	}

	paintArea (x, y, team) {
		let points = 0

		let visited = this.getBlankMap()
		let queue = []
		queue.push({x:x, y:y})

		while (queue.length > 0) {
			let elem = queue.shift()
			let x = elem.x
			let y = elem.y
			visited[x][y] = 1
			points += this.matrix[x][y].blockBox(team)

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

		return points
	}

	searchClosedPolygon (playerData) {
		let points = 0

		let x = playerData.x
		let y = playerData.y
		let team = playerData.team

		if (!this.matrix[x][y].blocked) return 0

		// Start bfs in each non-blocked direction
		for (let i = -1; i <= 1; ++i) {
			for (let j = -1; j <= 1; ++j) {
				if (i === 0 && j === 0) continue
				let nx = x+i
				let ny = y+j

				if (this.isOutOfBounds(nx, ny) || this.matrix[nx][ny].isBlockedBy(team)) continue
				if (!this.findWall(nx, ny, team)) points += this.paintArea(nx, ny, team)
			}
		}

		return points
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
		let points = this.matrix[x][y].incrementLevel(team)
		return points // Verbose but clear
	}
}

module.exports = Map
},{"./Box.js":11}],13:[function(require,module,exports){
const BUTTON_STATE = {
	STATIC: 1,
	HOVER: 2,
	CLICK: 3,
}

class Button {

	constructor (x, y, w, h, text, colors, fn) {
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.halfWidth = w/2
		this.halfHeight = h/2
		this.text = text
		this.colors = colors
		this.callback = fn
		this.state = BUTTON_STATE.STATIC
	}

	normal () {
		this.state = BUTTON_STATE.STATIC
	}

	hover () {
		this.state = BUTTON_STATE.HOVER
	}

	click () {
		this.state = BUTTON_STATE.CLICK
		return this.callback()
	}

	isInside (pos) {
		return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y
	}

	drawStaticButton () {
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.colors.background
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = this.colors.borderColor
		ctx.stroke()
		ctx.font = "20px Georgia"
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = this.colors.textColor
		ctx.fillText(this.text, this.x + this.halfWidth, this.y + this.halfHeight)
		ctx.closePath()
	}

	drawHoverButton () {
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.colors.hoverBackground
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = this.colors.borderColor
		ctx.stroke()
		ctx.font = "20px Georgia"
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = this.colors.textColor
		ctx.fillText(this.text, this.x + this.halfWidth, this.y + this.halfHeight)
		ctx.closePath()
	}

	draw () {
		switch(this.state) {
			case BUTTON_STATE.STATIC: this.drawStaticButton(); break
			case BUTTON_STATE.HOVER: this.drawHoverButton(); break
			case BUTTON_STATE.CLICK: this.drawHoverButton(); break
		}
		
	}
}

module.exports = Button
},{}],14:[function(require,module,exports){
const Button = require('./Button.js')
const {STATE} = require('../Constants.js')

class Menu {

	constructor (mouse) {
		this.mouse = mouse
		this.buttons = [
			new Button(
				15, 
				15, 
				200, 50, 
				"Single Player", 
				{
					background: "#9bc1ff",
					hoverBackground: "#a8fff4",
					borderColor: "black",
					textColor: "black",
				},
				function () {
					return STATE.SINGLEPLAYER_GAME
				}
			)
		]
	}

	update (mouse, keyboard) {
		let click = (mouse.clicked) ? mouse.getClickPosition() : false
		let mousePos = mouse.getPosition()

		let changeState = null
		this.buttons.forEach((btn) => {
			if (btn.isInside(mousePos)) btn.hover()
			else btn.normal()

			if (click && btn.isInside(click)) changeState = btn.click()
		})
		return changeState
	}

	draw () {
		this.buttons.forEach((btn) => btn.draw())
	}
}

module.exports = Menu
},{"../Constants.js":2,"./Button.js":13}],15:[function(require,module,exports){
class Events {
	
	constructor () {
		this.events = {}
		this.eventData = {}
	}

	subscribe (eventName, fn) {
		this.events[eventName] = this.events[eventName] || []
    	this.events[eventName].push(fn)
	}

	unsubscribe (eventName, fn) {
		if (this.events[eventName]) {
			for (var i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1)
					return
				}
			}
		}
	}

	publish (eventName, data) {
		if (this.events[eventName]) {
			this.eventData[eventName] = this.eventData[eventName] || []
			this.eventData[eventName].push(data)
		}
	}

	transmit () {
		for (var eventName in this.events) {
			this.eventData[eventName] = this.eventData[eventName] || []
			this.events[eventName].forEach((fn) => {
				this.eventData[eventName].forEach((data) => fn(data))
			})
			this.eventData[eventName] = []
		}
	}
}

module.exports = Events
},{}],16:[function(require,module,exports){
class FPS {

	constructor () {
		// FPS vars
		this.fps = 60
		this.framesThisSecond = 0
		this.lastFpsUpdate = 0
	}

	incrementFramesThisSecond () {
		this.framesThisSecond += 1
	}

	update (timestamp) {
		// Exponential moving average
		if (timestamp > this.lastFpsUpdate + 1000) { // update every second
	        this.fps = 0.25 * this.framesThisSecond + (1 - 0.25) * this.fps // compute the new FPS
	 
	        this.lastFpsUpdate = timestamp
	        this.framesThisSecond = 0
	    }
	}

	draw () {
		ctx.beginPath()
		ctx.font = "20px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("FPS: " + Math.round(this.fps), canv.width - 150, 30)
		ctx.closePath()
	}
}

module.exports = FPS
},{}],17:[function(require,module,exports){
class Keyboard {

	constructor () {
		this._pressed = {}

		this.lastKey = null

		this.LEFT = 65
		this.UP = 87
		this.RIGHT = 68
		this.DOWN = 83
	}
	
	isDown (keyCode) {
		return this._pressed[keyCode]
	}

	lastKeyPressed () {
		return this.lastKey
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
		this.lastKey = event.keyCode
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
	}
}

module.exports = Keyboard
},{}],18:[function(require,module,exports){
class Mouse {

	constructor (canvas) {
		this.x = 0
		this.y = 0
		this.cx = null
		this.cy = null
		this.clicked = false

		this.canvas = canvas
	}

	onMouseClick () {
		let self = this
		return function (event) {
			let rect = self.canvas.getBoundingClientRect()
			self.cx = event.clientX - rect.left
			self.cy = event.clientY - rect.top
			self.clicked = true
		}
	}

	onMouseMove () {
		let self = this
		return function (event) {
			let rect = self.canvas.getBoundingClientRect()
			self.x = event.clientX - rect.left
			self.y = event.clientY - rect.top
		}
	}

	getClickPosition () {
		return {x: this.cx, y: this.cy}
	}

	getPosition () {
		return {x: this.x, y: this.y}
	}

	clean () {
		/*this.clicked = false
		this.cx = null
		this.cy = null*/
	}
}

module.exports = Mouse
},{}],19:[function(require,module,exports){
const Client = require('./Client/Client.js')
const SinglePlayerGame = require('./Game/SinglePlayerGame.js')
const MultiPlayerGame = require('./Game/MultiPlayerGame.js')
const Menu = require('./Menu/Menu.js')
const Keyboard = require('./Tools/Keyboard.js')
const Mouse = require('./Tools/Mouse.js')
const FPS = require('./Tools/FPS.js')
const {STATE} = require('./Constants.js')

var client;

// Game vars
var fps, mouse, keyboard
var game, menu
var scene

var timestep = 1000 / 60
var lastFrame = Date.now()
var delta = 0

// Render vars
var renderInQueue = false;

function init () {
	fps = new FPS()
	menu = new Menu(mouse)
	scene = menu
}

function clearCanvas () {
	ctx.beginPath()
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canv.width, canv.height)
	ctx.closePath()
}

function updateDelta () {
	let timestamp = Date.now()
	delta = timestamp - lastFrame
	lastFrame = timestamp
}

function update () {
	var changeState = scene.update(mouse, keyboard);
	switch (changeState) {
		case STATE.MENU: scene = menu; break
		case STATE.SINGLEPLAYER_GAME: scene = new MultiPlayerGame(); break
		//case STATE.MULTIPLAYER_GAME: scene = new MultiPlayerGame(serverConnectionData); break
	}

	mouse.clean()
}

function draw (timestamp) {
	renderInQueue = false
	clearCanvas()
	scene.draw()
	fps.incrementFramesThisSecond()
	fps.update(timestamp)
	fps.draw()
}

function loop () {
	updateDelta()
	while (delta >= timestep) {
		update()
		delta -= timestep
	}

	// Rendering goes independent of logic. Logic always run.
	if (!renderInQueue) {
		window.requestAnimationFrame(draw)
		renderInQueue = true
	}
}

window.onload = function () {
	canv = document.getElementById("gc")
	ctx = canv.getContext("2d")

	keyboard = new Keyboard()
	mouse = new Mouse(canv)
	document.addEventListener("keydown", function(event) { keyboard.onKeydown(event) })
	document.addEventListener("keyup", function(event) { keyboard.onKeyup(event) })
	canv.addEventListener('click', mouse.onMouseClick())
	canv.addEventListener('mousemove', mouse.onMouseMove())

	init()
	setInterval(loop, timestep)
}
},{"./Client/Client.js":1,"./Constants.js":2,"./Game/MultiPlayerGame.js":9,"./Game/SinglePlayerGame.js":10,"./Menu/Menu.js":14,"./Tools/FPS.js":16,"./Tools/Keyboard.js":17,"./Tools/Mouse.js":18}]},{},[19]);
