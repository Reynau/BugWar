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