const BUTTON_STATE = {
	STATIC: 1,
	HOVER: 2,
	CLICK: 3,
	HIDE: 4,
}

class Button {

	constructor (x, y, w, h, text, colors, fn) {
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.halfWidth = w/2
		this.halfHeight = h/2
		this.text = text
		this.colors = colors
		this.callback = fn
		this.state = BUTTON_STATE.STATIC
	}

	normal () {
		this.state = BUTTON_STATE.STATIC
	}

	hover () {
		this.state = BUTTON_STATE.HOVER
	}

	click () {
		this.state = BUTTON_STATE.CLICK
		return this.callback()
	}

	isActive () {
		return this.state = BUTTON_STATE.HIDE
	}

	hide () {
		this.state = BUTTON_STATE.HIDE
	}

	isInside (pos) {
		return pos.x > this.x && pos.x < this.x+this.width && pos.y < this.y+this.height && pos.y > this.y
	}

	drawStaticButton () {
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.colors.background
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = this.colors.borderColor
		ctx.stroke()
		ctx.font = "20px Georgia"
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = this.colors.textColor
		ctx.fillText(this.text, this.x + this.halfWidth, this.y + this.halfHeight)
		ctx.closePath()
	}

	drawHoverButton () {
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.colors.hoverBackground
		ctx.fill()
		ctx.lineWidth = 1
		ctx.strokeStyle = this.colors.borderColor
		ctx.stroke()
		ctx.font = "20px Georgia"
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = this.colors.textColor
		ctx.fillText(this.text, this.x + this.halfWidth, this.y + this.halfHeight)
		ctx.closePath()
	}

	draw () {
		switch(this.state) {
			case BUTTON_STATE.STATIC: this.drawStaticButton(); break
			case BUTTON_STATE.HOVER: this.drawHoverButton(); break
			case BUTTON_STATE.CLICK: this.drawHoverButton(); break
			case BUTTON_STATE.HIDE: break
		}
		
	}
}

module.exports = Button