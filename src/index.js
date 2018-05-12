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