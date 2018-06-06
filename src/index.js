const SinglePlayerGame = require('./Game/SinglePlayerGame.js')
const DoublePlayerGame = require('./Game/DoublePlayerGame.js')
const MultiPlayerGame = require('./Game/MultiPlayerGame.js')
const Menu = require('./Menu/Menu.js')
const RoomSelector = require('./Menu/RoomSelector.js')
const Keyboard = require('./Tools/Keyboard.js')
const Mouse = require('./Tools/Mouse.js')
const FPS = require('./Game/FPS.js')
const {STATE} = require('./Constants.js')

const ConnectionController = require('./Controllers/ConnectionControler.js')

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
	connectionController = new ConnectionController()
	menu = new Menu()
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

function update () {
	var changeState = scene.update(mouse, keyboard);
	switch (changeState) {
		case STATE.MENU: scene = menu; break
		case STATE.ROOM_SELECTOR: scene = new RoomSelector(connectionController); break
		case STATE.SINGLEPLAYER_GAME: scene = new SinglePlayerGame(); break
		case STATE.DOUBLEPLAYER_GAME: scene = new DoublePlayerGame(); break
		case STATE.MULTIPLAYER_GAME: scene = new MultiPlayerGame(connectionController); break
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