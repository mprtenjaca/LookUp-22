
export const UTIL_TYPES = {
    HEADER_DISPLAY: 'HEADER_DISPLAY',
    TEST: 'TEST',
}

const initialState = {
    hideHeader: false,
    test: [],
}

const utilReducer = (state = initialState, action) => {
    switch (action.type){
        case UTIL_TYPES.HEADER_DISPLAY:
            return {
                ...state,
                hideHeader: action.payload
            };
    case UTIL_TYPES.TEST:
        return {
            ...state,
            test: action.payload
        };
        default:
            return state;
    }
}


export default utilReducer