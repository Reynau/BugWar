var map_vars = {
	box_width: 15,
	box_height: 15,
}

function Map (w, h) {

	return {
		width: w,
		height: h,

		matrix: [],

		init: function () {
			for (var i = 0; i < this.width; ++i) {
				this.matrix[i] = [];
				for (var j = 0; j < this.height; ++j) {
					this.matrix[i][j] = Box();
				}
			}
		},

		draw: function () {
			for (var i = 0; i < this.width; ++i) {
				for (var j = 0; j < this.height; ++j) {
					var x = i * map_vars.box_width;
					var y = j * map_vars.box_height;
					var w = map_vars.box_width;
					var h = map_vars.box_height;
					this.matrix[i][j].draw(x, y, w, h);
				}
			}
		},
	}
	
}