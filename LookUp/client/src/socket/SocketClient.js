
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/types/globalTypes'
import { MESS_TYPES } from '../redux/actions/messageAction'


const spawnNotification = (body, icon, url, title) => {
    let options = {
        body, icon
    }
    let n = new Notification(title, options)

    n.onclick = e => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}

const SocketClient = ({socket}) => {
    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    // joinUser
    // useEffect(() => {
    //     socket.emit('joinUser', auth.user)
    // },[socket, auth.user])

    // Message
    useEffect(() => {
        socket.on('addMessageToClient', msg =>{
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
            dispatch({
                type: MESS_TYPES.ADD_USER, 
                payload: {
                    ...msg.user, 
                    text: msg.text
                }
            })
        })

        return () => socket.off('addMessageToClient')
    },[socket, dispatch])



    return (
        <>
        </>
    )
}

export default SocketClient