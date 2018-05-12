const Game = require('./Game.js')
const Menu = require('./Menu.js')
const Keyboard = require('./Keyboard.js')
const {STATE} = require('./Constants.js')

var keyboard;
var game, menu;
var scene;

var lastFrame = 0;
var delta = 0;
var renderInQueue = false;

function init () {
	game = new Game();
	menu = new Menu();
	scene = game;
}

function updateDelta (timestamp) {
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

function draw () {
	renderInQueue = false
	scene.draw()
}

function loop (timestamp) {
	// place the rAF *before* the draw() to assure as close to
	// 60fps with the setTimeout fallback.
	if (!renderInQueue) { 
		window.requestAnimationFrame(draw)
		renderInQueue = true
	}
	updateDelta(timestamp)
	update()
}

window.onload = function () {
	canv = document.getElementById("gc");
	ctx = canv.getContext("2d");

	keyboard = new Keyboard();
	document.addEventListener("keydown", function(event) { keyboard.onKeydown(event); });
	document.addEventListener("keyup", function(event) { keyboard.onKeyup(event); });

	init()
	setInterval(loop, 16)
}