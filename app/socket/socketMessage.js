const Message = require("../models/Message")
const Thread = require("../models/Thread")

function socketMessage(io, socket, users) {

    const getUser = (userId) => {
       return users.find(user=>user.userId == userId)
    }

    socket.on('messageSent', async ({ senderId, receiverId, message }) => {

        const user = getUser(receiverId)
       
        io.to(user.socketId).emit('messageReceived', {senderId,message} )

    })

}


module.exports = socketMessage