import { LISTING_TYPES } from '../actions/listingAction'
import { EditData } from '../types/globalTypes';

const detailItemReducer = (state = [], action) => {
    switch (action.type){
        case LISTING_TYPES.GET_LISTING:
            return [...state, action.payload]
        case LISTING_TYPES.UPDATE_LISTING:
            return EditData(state, action.payload._id, action.payload)
        default:
            return state;
    }
}


export default detailItemReducer