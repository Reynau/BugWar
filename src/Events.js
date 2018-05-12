class Events {
	
	constructor () {
		this.events = {}
		this.eventData = {}
	}

	subscribe (eventName, fn) {
		this.events[eventName] = this.events[eventName] || []
    	this.events[eventName].push(fn)
	}

	unsubscribe (eventName, fn) {
		if (this.events[eventName]) {
			for (var i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1)
					return
				}
			}
		}
	}

	publish (eventName, data) {
		if (this.events[eventName]) {
			this.eventData[eventName] = this.eventData[eventName] || []
			this.eventData[eventName].push(data)
		}
	}

	transmit () {
		for (var eventName in this.events) {
			this.eventData[eventName] = this.eventData[eventName] || []
			this.events[eventName].forEach((fn) => {
				this.eventData[eventName].forEach((data) => fn(data))
			})
			this.eventData[eventName] = []
		}
	}
}

module.exports = Events