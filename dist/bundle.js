(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
		

	incrementLevel (team) {
		// Cannot increment level of a blocked box
		if (this.blocked) return

		// If team is different, change to new team
		if (this.team !== team) this.changeTeam(team)
		else {
			this.level += 1
			if (this.level === 4) this.blocked = true
		}
	}

	blockBox (team) {
		// Cannot change a blocked box
		if (this.blocked) return false

		this.team = team
		this.level = 4
		this.blocked = true
		return true
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
},{}],2:[function(require,module,exports){
module.exports = {
	STATE: {
		MENU: 1,
		GAME: 2,
	},
}
},{}],3:[function(require,module,exports){
class IA {
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

	moveAutonomously (players, events) {
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

		// Update player position
		this.moveAutonomously(players, events)
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
const GameMap = require('./Map.js')
const Events = require('./Events.js')
const Player = require('./Entities/Player.js')
const IA = require('./Entities/IA.js')
const {STATE} = require('./Constants.js')

var game_vars = {
	map_width: 10,
	map_height: 10,
}

class Game {

	constructor () {
		this.events = new Events();
		this.events.subscribe("player_update", this.playerUpdateCallback())

		this.map = new GameMap(game_vars.map_width, game_vars.map_height);
		this.items = undefined;
		this.hud = undefined;

		this.players = {
			1: [new Player(1, 0, 0, game_vars.map_width, game_vars.map_height, 1)],
			2: [new IA(2, 0, 9, game_vars.map_width, game_vars.map_height, 2)],
			3: [new IA(3, 9, 0, game_vars.map_width, game_vars.map_height, 3)],
			4: [new IA(4, 9, 9, game_vars.map_width, game_vars.map_height, 4)],
		}
	}


	playerUpdateCallback () {
		var _self = this
		return function (data) {
			_self.map.playerMovedTo(data.x, data.y, data.team)
		}
	}

	updatePlayers (keyboard) {
		for (var team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].update(this.players, keyboard, this.events)
			}
		}
	}

	drawPlayers () {
		for (var team in this.players) {
			for (let p = 0; p < this.players[team].length; ++p) {
				this.players[team][p].draw()
			}
		}
	}

	clearCanvas () {
		ctx.beginPath()
		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, canv.width, canv.height)
		ctx.closePath()
	}

	update (keyboard) {
		this.updatePlayers(keyboard);
		// update players
		// update items
		// update map
		// update hud
		this.events.transmit();
		return STATE.GAME;
	}

	draw () {
		this.clearCanvas()
		this.map.draw();
		this.drawPlayers();
		// draw items
		// draw players
		// draw hud
	}
}

module.exports = Game
},{"./Constants.js":2,"./Entities/IA.js":3,"./Entities/Player.js":4,"./Events.js":5,"./Map.js":8}],7:[function(require,module,exports){
class Keyboard {

	constructor () {
		this._pressed = {}

		this.LEFT = 65
		this.UP = 87
		this.RIGHT = 68
		this.DOWN = 83
	}
	
	isDown (keyCode) {
		return this._pressed[keyCode]
	}

	onKeydown (event) {
		this._pressed[event.keyCode] = true
	}

	onKeyup (event) {
		delete this._pressed[event.keyCode]
	}
}

module.exports = Keyboard
},{}],8:[function(require,module,exports){
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
		this.matrix[x][y].incrementLevel(team);
	}
}

module.exports = Map
},{"./Box.js":1}],9:[function(require,module,exports){
class Menu {

	constructor () {
		
	}

	update () {

	}

	draw () {
		
	}
}

module.exports = Menu
},{}],10:[function(require,module,exports){
const Game = require('./Game.js')
const Menu = require('./Menu.js')
const Keyboard = require('./Keyboard.js')
const {STATE} = require('./Constants.js')

// Game vars
var keyboard;
var game, menu;
var scene;

// Time vars
var timestep = 1000 / 60
var lastFrame = Date.now();
var delta = 0

// FPS vars
var fps = 60
var framesThisSecond = 0
var lastFpsUpdate = 0

// Render vars
var renderInQueue = false;

function init () {
	game = new Game();
	menu = new Menu();
	scene = game;
}

function calculateFPS (timestamp) {
	// Exponential moving average
	if (timestamp > lastFpsUpdate + 1000) { // update every second
        fps = 0.25 * framesThisSecond + (1 - 0.25) * fps; // compute the new FPS
 
        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
    }
    drawFPS()
}

function drawFPS () {
	ctx.beginPath()
	ctx.font = "20px Arial"
	ctx.fillText("FPS: " + Math.round(fps), 170, 30)
	ctx.closePath()
}

function updateDelta () {
	let timestamp = Date.now()
	delta = timestamp - lastFrame
	lastFrame = timestamp
}

function update () {
	var state = scene.update(keyboard);
	switch (state) {
		case STATE.GAME: scene = game; break;
		case STATE.MENU: scene = menu; break;
	}
}

function draw (timestamp) {
	renderInQueue = false
	scene.draw()
	++framesThisSecond
	calculateFPS(timestamp)
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
	canv = document.getElementById("gc");
	ctx = canv.getContext("2d");

	keyboard = new Keyboard();
	document.addEventListener("keydown", function(event) { keyboard.onKeydown(event); });
	document.addEventListener("keyup", function(event) { keyboard.onKeyup(event); });

	init()
	setInterval(loop, timestep)
}
},{"./Constants.js":2,"./Game.js":6,"./Keyboard.js":7,"./Menu.js":9}]},{},[10]);
