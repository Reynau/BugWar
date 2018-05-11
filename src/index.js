var game, menu;
var scene;

var STATE = {
	MENU: 1,
	GAME: 2,
}

var Key = {
	_pressed: {},
	
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	}
};

function init () {
	game = Game();
	menu = Menu();
	scene = game;
}

function update () {
	var state = scene.update();
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

	document.addEventListener("keydown", function(event) { Key.onKeydown(event); });
	document.addEventListener("keyup", function(event) { Key.onKeyup(event); });

	init();
	setInterval(loop, 1000/30);
}