import { CATEGORY_TYPES } from '../actions/categoryAction'

const initialState = {
    loading: false,
    listings: [],
    result: 0,
    page: 2
}

const categoryReducer = (state = initialState, action) => {
    switch (action.type){
        case CATEGORY_TYPES.GET_CATEGORY_ITEMS:
            return {
                ...state,
                listings: action.payload.listings ? action.payload.listings : []
            };
        default:
            return state;
    }
}

export default categoryReducer