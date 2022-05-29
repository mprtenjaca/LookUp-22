import axios from 'axios';

export const getDataAPI = async (url, token) => {

    const config = {
        headers: { Authorization: token },
    };
    
    const res = await axios.get(`/api/${url}`, config);
    return res;
}

export const postDataAPI = async (url, post, token) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.post(`/api/${url}`, post, config);
    return res;
}

export const putDataAPI = async (url, post, token) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.put(`/api/${url}`, post, config)
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.patch(`/api/${url}`, post, config)
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.delete(`/api/${url}`, config)
    return res;
}