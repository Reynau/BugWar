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
},{}],4:[function(require,module,exports){
const GameMap = require('./Map.js')
const Events = require('./Events.js')
const Player = require('./Player.js')
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
			1: [new Player(5,5,1)],
			2: [],
			3: [],
			4: [],
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
				this.players[team][p].update(keyboard, this.events)
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
		this.map.draw();
		this.drawPlayers();
		// draw items
		// draw players
		// draw hud
	}
}

module.exports = Game
},{"./Constants.js":2,"./Events.js":3,"./Map.js":6,"./Player.js":8}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./Box.js":1}],7:[function(require,module,exports){
class Menu {

	constructor () {
		
	}

	update () {

	}

	draw () {
		
	}
}

module.exports = Menu
},{}],8:[function(require,module,exports){
class Player {
	constructor (x, y, team) {
		this.x = x
		this.y = y
		this.ox = x
		this.oy = y
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

	move (dx, dy, events) {
		this.x += dx
		this.y += dy

		events.publish("player_update", this.generateUpdateEvent())
	}

	update (keyboard, events) {
		// Update last timestamp
		var timestamp = Date.now();
		if (timestamp - this.last_update_timestamp < 500) return;
		this.last_update_timestamp = timestamp;

		// Save old position
		this.ox = this.x
		this.oy = this.y

		// Update player position if necessary
		if (keyboard.isDown(keyboard.UP)) this.move(0, -this.vy, events)
		else if (keyboard.isDown(keyboard.LEFT)) this.move(-this.vx, 0, events)
		else if (keyboard.isDown(keyboard.DOWN)) this.move(0, this.vy, events)
		else if (keyboard.isDown(keyboard.RIGHT)) this.move(this.vx, 0, events)
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
},{}],9:[function(require,module,exports){
const Game = require('./Game.js')
const Menu = require('./Menu.js')
const Keyboard = require('./Keyboard.js')
const {STATE} = require('./Constants.js')

var keyboard;
var game, menu;
var scene;

var timestep = 1000 / 60

var lastFrame = Date.now();
var delta = 0;
var renderInQueue = false;

function init () {
	game = new Game();
	menu = new Menu();
	scene = game;
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
},{"./Constants.js":2,"./Game.js":4,"./Keyboard.js":5,"./Menu.js":7}]},{},[9]);
