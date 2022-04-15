import axios from 'axios';

let base = 'http://ydgpzbj.ydtg.com.cn:84';

//
export const save = params => {
    return axios.get(`${base}/Message/save`, {params: params});
};
export const get = params => {
    return axios.get(`${base}/Message/get`, {params: params});
};

export const update = params => {
    return axios.get(`${base}/Message/update`, {params: params});
};


export const list = params => {
    return axios.post(`${base}/Message/list`, params, {headers: {"Content-Type": 'application/json'}});
};






