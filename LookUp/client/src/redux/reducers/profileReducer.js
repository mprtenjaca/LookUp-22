import { PROFILE_TYPES } from '../actions/profileAction.js'
import { EditData } from '../types/globalTypes'

const initialState = {
    loading: false,
    ids: [],
    users: [],
    listings: []
}

const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER_PROFILE:
            return {
                ...state,
                users: [...state.users, action.payload]
            };
        case PROFILE_TYPES.GET_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            };
        case PROFILE_TYPES.GET_LISTINGS:
            return {
                ...state,
                listings: [...state.listings, action.payload]
            };
        case PROFILE_TYPES.UPDATE_LISTING:
            return {
                ...state,
                listings: EditData(state.listings, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default profileReducer