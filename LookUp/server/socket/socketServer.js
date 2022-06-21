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
    })

    // Disconnect
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })

    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(user.socketId).emit('addMessageToClient', msg)
    })

    // Notification
    socket.on('createNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        if(msg.recipients.includes(msg.user.id)){
            socket.emit('createNotifyToClient', msg)
        }else{
            client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
        }
        
    })

    socket.on('removeNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    })
}

export default SocketServer