import { GLOBALTYPES, DeleteData } from '../types/globalTypes'
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, NOTIFY_TYPES } from './notifyAction'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}



export const addMessage = ({msg, auth, socket}) => async (dispatch) =>{

    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
    // dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})

    const { _id, avatar, firstName, lastName, username } = auth.user
    socket.emit('addMessage', {...msg, user: { _id, avatar, firstName, lastName, username } })

    const notifyMsg = {
        id: auth.user._id,
        recipients: msg.recipient,
        listing: msg.listing,
        type: "message",
        text: msg.text,
        // url: `/message/${id}?itemId=${urlItemId}`
      }; 

    try {
        await postDataAPI('message', msg, auth.token)
        dispatch(createNotify({ msg: notifyMsg, auth, socket }))

    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getConversations = ({auth, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)
        
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, listing: item.listing})
                }
            })
        })

        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })

    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getMessages = ({auth, id, itemID, listing, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?itemId=${itemID}&limit=${page * 25}`, auth.token)

        const newData = {...res.data, messages: res.data.messages.reverse()}
        const listingId = newData.messages.length > 0 ? newData.messages[0].listing : listing
        
        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page, listing: listingId}})
    } catch (err) {
        console.log(err)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}})
    }
}

export const loadMoreMessages = ({auth, id, itemID, listing, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?itemId=${itemID}&limit=${page * 25}`, auth.token)

        const newData = {...res.data, messages: res.data.messages.reverse()}
        const listingId = newData.messages.length > 0 ? newData.messages[0].listing : listing
        
        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page, listing: listingId}})
    } catch (err) {
        console.log(err)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}})
    }
}

export const deleteMessages = ({msg, data, auth}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({auth, id, itemID}) => async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: {userID: id, itemID}})
    try {
        await deleteDataAPI(`conversation/${id}?itemId=${itemID}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}