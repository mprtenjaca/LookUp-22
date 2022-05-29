
export const UTIL_TYPES = {
    HEADER_DISPLAY: 'HEADER_DISPLAY',
}

const initialState = {
    hideHeader: false
}

const utilReducer = (state = initialState, action) => {
    console.log(action.payload)
    switch (action.type){
        case UTIL_TYPES.HEADER_DISPLAY:
            return {
                ...state,
                hideHeader: action.payload
            };
        default:
            return state;
    }
}


export default utilReducer