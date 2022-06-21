import { LISTING_TYPES } from '../actions/listingAction'
import { EditData, DeleteData, UpdateUserListings } from '../types/globalTypes'

const initialState = {
    loading: false,
    listings: [],
    result: 0,
    page: 2,
    _id: ''
}

const listingReducer = (state = initialState, action) => {
    switch (action.type){
        case LISTING_TYPES.CREATE_LISTING:
            return {
                ...state,
                listings: [action.payload, ...state.listings]
            };
        case LISTING_TYPES.LOADING_LISTING:
            return {
                ...state,
                loading: action.payload
            };
        case LISTING_TYPES.GET_LISTINGS:
            return {
                ...state,
                listings: action.payload.listings,
                result: action.payload.result,
                page: action.payload.page,
                _id: action.payload._id
            };
        case LISTING_TYPES.UPDATE_LISTING:
            return {
                ...state,
                listings: EditData(state.listings, action.payload._id, action.payload)
            };
        case LISTING_TYPES.UPDATE_LISTINGS:
            return {
                ...state,
                listings: action.payload.listings,
                result: action.payload.result,
                page: action.payload.page,
                _id: action.payload._id
            };
        case LISTING_TYPES.DELETE_LISTING:
            return {
                ...state,
                listings: DeleteData(state.listings, action.payload._id)
            };
        default:
            return state;
    }
}

export default listingReducer