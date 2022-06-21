import { GLOBALTYPES, DeleteData } from '../types/globalTypes.js'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { LISTING_TYPES } from './listingAction.js'
// import { createNotify, removeNotify } from '../actions/notifyAction'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER_PROFILE: 'GET_USER_PROFILE',
    GET_ID: 'GET_PROFILE_ID',
    GET_LISTINGS: 'GET_PROFILE_LISTINGS',
    UPDATE_LISTING: 'UPDATE_PROFILE_LISTING',
    UPDATE_LISTINGS: 'UPDATE_PROFILE_LISTINGS'
}


export const getProfileUser = ({id, auth}) => async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id})

    try {
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})

        const res = await getDataAPI(`user/${id}`, auth.token)
        const userListings = await getDataAPI(`/user_listings/${id}`, auth.token)

        if(id === auth.user._id){

            dispatch({
                type: LISTING_TYPES.GET_LISTINGS,
                payload: {...userListings.data, _id: id, page: 2}
            })
        }
        
        dispatch({
            type: PROFILE_TYPES.GET_USER_PROFILE,
            payload: res.data.user
        })

        dispatch({
            type: PROFILE_TYPES.GET_LISTINGS,
            payload: {...userListings.data, _id: id, page: 2}
        })

        dispatch({type: PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        console.log(err)
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
    
}


export const updateProfileUser = ({userData, avatar, auth}) => async (dispatch) => {
    if(!userData.firstName)
    return dispatch({type: GLOBALTYPES.ALERT, payload: {error: "Please add your first name."}})

    try {
        let media;
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        if(avatar) media = await imageUpload([avatar])

        const res = await patchDataAPI("user", {
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user, ...userData,
                    avatar: avatar ? media[0].url : auth.user.avatar,
                }
            }
        })

        dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}})
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response.data.msg}
        })
    }
}
