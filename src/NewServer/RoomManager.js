
class RoomManager {
	constructor () {
		this.rooms = []
		this.idQueue = []	// Queue of available roomIds
	}

	getRooms () {
		return this.rooms
	}

	playerJoinRoom (playerId, roomId) {
		this.rooms[roomId].join(playerId)
	}

	playerLeaveRoom (playerId, roomId) {
		this.rooms[roomId].leave(playerId)
	}

	isRoomAvailable (roomId) {
		return this.rooms[roomId].isAvailable()
	}

	createRoom (roomData) {
		let roomId = this.idQueue.length > 0 ? this.idQueue.shift() : this.rooms.length
		let room = new Room(roomId, roomData)
		this.rooms[roomId] = room
	}

	deleteRoom (roomId) {
		this.rooms[roomId] = null
		this.idQueue.push(roomId)
	}
}