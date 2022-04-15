/**
 * Created by Administrator on 2017/8/3.
 */


import axios from 'axios'
import Promise from 'es6-promise';


//通过polyfill() 解决Promise的兼容问题
Promise.polyfill();
// //通过修改原型链,来更方便的使用axios
// Vue.prototype.$http = axios

//post请求 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;';//application/x-www-form-urlencoded

// 超时时间
axios.defaults.timeout = 150000;

//添加响应拦截器
axios.interceptors.response.use((res) =>{

    //对响应数据做些事
    return res;
}, (error) => {
    return Promise.reject(error);
});

export async function post(url, params) {
    try{
        let body = await axios.post(url, params);
        return body.data;
    }catch (err){
        console.log(err);
    }

}

export async function get(url) {
    try{
        let body = await axios.get(url);
        return body.data;
    }catch (err){
        console.log(err);
    }

}


export async function put(url, b) {
    try{
        let body = await axios.put(url,b);
        return body.data;
    }catch (err){
        console.log(err);
    }

}
export async function del(url) {
    try{
        let body = await axios.delete(url);
        return body.data;
    }catch (err){
        console.log(err);
    }
}