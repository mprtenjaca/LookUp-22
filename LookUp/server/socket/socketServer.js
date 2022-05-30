let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )
    return newData;
}

const addUser = (userId, socketId) => {
    !users.some(user => user.id === userId) && 
    users.push({id: userId, socketId: socketId})
}

const SocketServer = (socket) => {
    // Connect
    socket.on('joinUser', userId => {
        addUser(userId, socket.id)
        console.log("users: ", users)
    })

    // Disconnect
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })

    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        console.log(msg)
        console.log(users.find(user => user.id === msg.recipient))
        user && socket.to(user.socketId).emit('addMessageToClient', msg)
    })
}

export default SocketServer