export const GLOBALTYPES = {
    AUTH: "AUTH",
    ALERT: "ALERT",
    PEER: 'PEER',
    SOCKET: 'SOCKET'
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}

export const DeleteConversationUser = (users, ids) => {
    const newData = users.filter((item) => {
        console.log("TEST")
        if(!(item._id === ids.userID && item.listing._id === ids.itemID)){
            return item
        }
    })
    console.log(newData)
    return newData;
}

export const DeleteConversationData = (data, ids) => {
    const newData = data.filter((item) => {
        if(!(item._id === ids.userID && item.listing._id === ids.itemID)){
            return item
        }
    })
    return newData;
}