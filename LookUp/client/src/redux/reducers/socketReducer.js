import { GLOBALTYPES } from '../types/globalTypes'

const initialState = {
    socket: null
}

const socketReducer = (state = [], action) => {
    switch (action.type){
        case GLOBALTYPES.SOCKET:
            console.log(action.payload)
            return action.payload
        default:
            return state;
    }
}


export default socketReducer