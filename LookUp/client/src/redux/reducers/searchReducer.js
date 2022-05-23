
export const SEARCH_TYPES = {
    SEARCH_FILTER: 'SEARCH_FILTER',
}

const initialState = {
    listings: [],
}

const searchReducer = (state = [], action) => {
    switch (action.type){
        case SEARCH_TYPES.SEARCH_FILTER:
            return {listings: action.payload}
        default:
            return state;
    }
}


export default searchReducer