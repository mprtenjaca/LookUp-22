import { GLOBALTYPES } from '../types/globalTypes.js'
import { getDataAPI } from '../../utils/fetchData'

export const CATEGORY_TYPES = {
    GET_CATEGORY_ITEMS: 'GET_CATEGORY_ITEMS',
}

export const getCategoryItems = (category, auth) => async (dispatch) => {
    try {
        const res = await getDataAPI('category/' + category, auth.token)

        dispatch({
            type: CATEGORY_TYPES.GET_CATEGORY_ITEMS,
            payload: res.data
        })

        dispatch({type: CATEGORY_TYPES.LOADING, payload: false})

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}