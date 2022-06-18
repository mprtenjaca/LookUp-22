import { GLOBALTYPES } from '../types/globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { validateListing } from '../../utils/validate'
import { createNotify, removeNotify } from './notifyAction'
// import { createNotify, removeNotify } from './notifyAction'

export const LISTING_TYPES = {
    CREATE_LISTING: 'CREATE_LISTING',
    LOADING_LISTING: 'LOADING_LISTING',
    GET_LISTINGS: 'GET_LISTINGS',
    UPDATE_LISTING: 'UPDATE_LISTING',
    GET_LISTING: 'GET_LISTING',
    DELETE_LISTING: 'DELETE_LISTING'
}


export const createListing = ({productData, auth, socket}) => async (dispatch) => {
    let media = []

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        if(productData.photos.length > 0){
            media = await imageUpload(productData.photos)
        }

        const res = await postDataAPI('listings', { productData, images: media }, auth.token)

        dispatch({ 
            type: LISTING_TYPES.CREATE_LISTING, 
            payload: {...res.data.newListing, user: auth.user} 
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })

        // Notify
        const msg = {
            id: res.data.newListing._id,
            recipients: auth.user._id,
            listing: res.data.newListing,
            type: 'new-listing',
            text: 'You successfully added a new listing!',
            url: `/item/${res.data.newListing._id}`,
            image: media[0].url
        }

        dispatch(createNotify({msg, auth, socket}))

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

export const updateListing = ({productData, auth, socket}) => async (dispatch) => {
    let media = []
    const newImages = productData.photos.filter(img => !img.url)
    const oldImages = productData.photos.filter(img => img.url)

    if(newImages.length === 0 && oldImages.length === 0){
        return;
    }

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        if(productData.photos.length > 0 && newImages.length > 0){
            media = await imageUpload(newImages)
            Array.prototype.push.apply(media, oldImages)
        }else{
            media = oldImages
        }

        const res = await patchDataAPI(`listing/${productData._id}`, { productData, images: media }, auth.token)

        dispatch({ type: LISTING_TYPES.UPDATE_LISTING, payload: res.data.newListing })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getListing = ({detailItem, id, auth}) => async (dispatch) => {
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

export const deleteListing = ({listing, auth, socket}) => async (dispatch) => {
    dispatch({ type: LISTING_TYPES.DELETE_LISTING, payload: listing })

    try {
        const res = await deleteDataAPI(`listing/${listing._id}`, auth.token)

        // Notify
        const msg = {

            id: res.data.deletedListing._id,
            recipients: auth.user._id,
            listing: res.data.deletedListing,
            type: 'new-listing',
            text: 'You successfully deleted listing.',
            url: "",
            image: listing.photos[0].url
        }
        // dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const saveListing = ({listing, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, listing._id]}
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`saveListing/${listing._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSaveListing = ({listing, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== listing._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`unSaveListing/${listing._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updateListingStatus = ({listing, auth}) => async (dispatch) => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

    try {
        const res = await patchDataAPI(`updateListingStatus/${listing._id}`, null, auth.token)
        dispatch({ type: LISTING_TYPES.UPDATE_LISTING, payload: res.data.updatedListing })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const deleteSavedListing = ({listing, auth}) => async (dispatch) => {
    const newUser = {...auth.user, saved: auth.user.saved.filter(id => id !== listing._id) }
    dispatch({ type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}})

    try {
        await patchDataAPI(`deleteSavedListing/${listing._id}`, null, auth.token)
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}