const Game = require('./Game.js')
const Menu = require('./Menu.js')
const Keyboard = require('./Keyboard.js')
const {STATE} = require('./Constants.js')

var keyboard;
var game, menu;
var scene;

function init () {
	game = new Game();
	menu = new Menu();
	scene = game;
}

function update () {
	var state = scene.update(keyboard);
	switch (state) {
		case STATE.GAME: scene = game; break;
		case STATE.MENU: scene = menu; break;
	}
}

function draw () {
	scene.draw();
}

function loop () {
	update();
	draw();
}

window.onload = function () {
	canv = document.getElementById("gc");
	ctx = canv.getContext("2d");

	keyboard = new Keyboard();
	document.addEventListener("keydown", function(event) { keyboard.onKeydown(event); });
	document.addEventListener("keyup", function(event) { keyboard.onKeyup(event); });

	init();
	setInterval(loop, 1000/30);
}