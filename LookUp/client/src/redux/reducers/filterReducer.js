import { LISTING_TYPES } from '../actions/listingAction'
import { EditData } from '../types/globalTypes';

export const FILTER_TYPES = {
    PRICE_FILTER: 'PRICE_FILTER',
    CONDITION_FILTER: 'CONDITION_FILTER',
    LOCATION_FILTER: 'LOCATION_FILTER',
}

const initialState = {
    priceFilters: [],
    conditionFilters: [],
    locationFilters: [],
}

const filterReducer = (state = [], action) => {
    switch (action.type){
        case FILTER_TYPES.PRICE_FILTER:
            return [...state, action.payload]
        case FILTER_TYPES.CONDITION_FILTER:
            return {conditionFilters: action.payload}
        case FILTER_TYPES.LOCATION_FILTER:
            return [...state, action.payload]
        default:
            return state;
    }
}


export default filterReducer