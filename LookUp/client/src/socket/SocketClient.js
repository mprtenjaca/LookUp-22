
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/types/globalTypes'
import { MESS_TYPES } from '../redux/actions/messageAction'
import { NOTIFY_TYPES } from '../redux/actions/notifyAction'


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
    const { auth, notify } = useSelector(state => state)
    const dispatch = useDispatch()

    // joinUser
    useEffect(() => {
        socket.emit('joinUser', auth.user._id)
    },[socket, auth.user])

    // Message
    useEffect(() => {
        socket.on('addMessageToClient', msg =>{
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
            dispatch({
                type: MESS_TYPES.ADD_USER, 
                payload: {
                    ...msg.user, 
                    text: msg.text,
                    listing: msg.listing
                }
            })
        })

        return () => socket.off('addMessageToClient')
    },[socket, dispatch])

    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})
        })

        return () => socket.off('createNotifyToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('removeNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socket.off('removeNotifyToClient')
    },[socket, dispatch])



    return (
        <>
        </>
    )
}

export default SocketClient