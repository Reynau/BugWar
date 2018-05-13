class FPS {

	constructor () {
		// FPS vars
		this.fps = 60
		this.framesThisSecond = 0
		this.lastFpsUpdate = 0
	}

	incrementFramesThisSecond () {
		this.framesThisSecond += 1
	}

	update (timestamp) {
		// Exponential moving average
		if (timestamp > this.lastFpsUpdate + 1000) { // update every second
	        this.fps = 0.25 * this.framesThisSecond + (1 - 0.25) * this.fps // compute the new FPS
	 
	        this.lastFpsUpdate = timestamp
	        this.framesThisSecond = 0
	    }
	}

	draw () {
		ctx.beginPath()
		ctx.font = "20px Arial"
		ctx.fillStyle = "black"
		ctx.fillText("FPS: " + Math.round(this.fps), canv.width - 150, 30)
		ctx.closePath()
	}
}

module.exports = FPS