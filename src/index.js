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