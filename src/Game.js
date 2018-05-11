var game_vars = {
	map_width: 10,
	map_height: 10,
}

function Game () {

	var map;
	var hud;
	var players = {
		1: [],
		2: [],
		3: [],
		4: [],
	}
	var items;

	function init () {
		map = Map(game_vars.map_width, game_vars.map_height);
		map.init();
	}

	function update () {
		// update players
		// update items
		// update map
		// update hud
		return STATE.GAME;
	}

	function draw () {
		map.draw();
		// draw items
		// draw players
		// draw hud
	}

	init();
	return {
		update: update,
		draw: draw
	}
}