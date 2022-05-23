import { GLOBALTYPES } from '../types/globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { validateListing } from '../../utils/validate'
// import { createNotify, removeNotify } from './notifyAction'

export const LISTING_TYPES = {
    CREATE_LISTING: 'CREATE_LISTING',
    LOADING_LISTING: 'LOADING_LISTING',
    GET_LISTINGS: 'GET_LISTINGS',
    UPDATE_LISTING: 'UPDATE_LISTING',
    GET_LISTING: 'GET_LISTING',
    DELETE_LISTING: 'DELETE_LISTING'
}


export const createListing = ({productData, auth}) => async (dispatch) => {
    let media = []

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        if(productData.photos.length > 0){
            media = await imageUpload(productData.photos)
        }

        const res = await postDataAPI('listings', { productData, images: media }, auth.token)

        console.log(res)
        dispatch({ 
            type: LISTING_TYPES.CREATE_LISTING, 
            payload: {...res.data.newListing, user: auth.user} 
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })

        // Notify
        const msg = {
            id: res.data.newListing._id,
            text: 'added a new listing.',
            url: `/listing/${res.data.newListing._id}`,
            productData, 
            image: media[0].url
        }

        // dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        console.log(err.message)
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response}
        })
    }
}

export const getListings = (token) => async (dispatch) => {
    try {
        dispatch({ type: LISTING_TYPES.LOADING_LISTING, payload: true })
        const res = await getDataAPI('listings', token)
        
        dispatch({
            type: LISTING_TYPES.GET_LISTINGS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: LISTING_TYPES.LOADING_LISTING, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updateListing = ({content, images, auth, status}) => async (dispatch) => {
    let media = []
    const imgNewUrl = images.filter(img => !img.url)
    const imgOldUrl = images.filter(img => img.url)

    if(status.content === content 
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)

        const res = await patchDataAPI(`listing/${status._id}`, { 
            content, images: [...imgOldUrl, ...media] 
        }, auth.token)

        dispatch({ type: LISTING_TYPES.UPDATE_LISTING, payload: res.data.newListing })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

// export const likePost = ({post, auth, socket}) => async (dispatch) => {
//     const newPost = {...post, likes: [...post.likes, auth.user]}
//     dispatch({ type: LISTING_TYPES.UPDATE_LISTING, payload: newPost})

//     socket.emit('likePost', newPost)

//     try {
//         await patchDataAPI(`post/${post._id}/like`, null, auth.token)
        
//         // Notify
//         const msg = {
//             id: auth.user._id,
//             text: 'like your post.',
//             recipients: [post.user._id],
//             url: `/post/${post._id}`,
//             content: post.content, 
//             image: post.images[0].url
//         }

//         dispatch(createNotify({msg, auth, socket}))

//     } catch (err) {
//         dispatch({
//             type: GLOBALTYPES.ALERT,
//             payload: {error: err.response.data.msg}
//         })
//     }
// }

// export const unLikePost = ({post, auth, socket}) => async (dispatch) => {
//     const newPost = {...post, likes: post.likes.filter(like => like._id !== auth.user._id)}
//     dispatch({ type: LISTING_TYPES.UPDATE_LISTING, payload: newPost})

//     socket.emit('unLikePost', newPost)

//     try {
//         await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

//         // Notify
//         const msg = {
//             id: auth.user._id,
//             text: 'like your post.',
//             recipients: [post.user._id],
//             url: `/post/${post._id}`,
//         }
//         dispatch(removeNotify({msg, auth, socket}))

//     } catch (err) {
//         dispatch({
//             type: GLOBALTYPES.ALERT,
//             payload: {error: err.response.data.msg}
//         })
//     }
// }

export const getListing = ({detailItem: detailItem, id, auth}) => async (dispatch) => {
    if(detailItem.every(item => item._id !== id)){
        try {
            const res = await getDataAPI(`listing/${id}`, auth.token)

            console.log(res.data)
            dispatch({ type: LISTING_TYPES.GET_LISTING, payload: res.data.item })
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {error: err.response.data.msg}
            })
        }
    }
}

export const deleteListing = ({post, auth, socket}) => async (dispatch) => {
    dispatch({ type: LISTING_TYPES.DELETE_LISTING, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new listing.',
            // recipients: res.data.newListing.user.followers,
            url: `/listing/${post._id}`,
        }
        // dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const saveListing = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`saveListing/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSaveListing = ({post, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSaveListing/${post._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}