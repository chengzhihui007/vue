import axios from 'axios';
import {post} from "../common/js/axios_promise";
let base = 'http://ydgpzbj.ydtg.com.cn:84';
let path='http://47.93.180.11:9094';
//let path='http://127.0.0.1:9094';
//获取课程列表
export const classes = params => {
    return axios.get(`${base}/index/yapi/ydgpGetclasses`, {params: params});
};
export const mpaper = params => {
    return axios.get(`${base}/index/yapi/mpaper`, {params: params});
};

export const scorelist = params => {
    return axios.get(`${base}/index/yapi/scorelist`, {params: params});
};

//发送弹幕
export const seedbarrage = params => {
    return axios.post(`${base}/index/yapi/ydgpdanmu`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};

export const scoredel = params => {
    return axios.post(`${base}/index/yapi/scoredel`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};

//新增课程
export const classesAdd = params => {
    return axios.post(`${base}/index/yapi/ydgpClassesAdd`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};
//更新课程
export const classesUp = params => {
    return axios.post(`${base}/index/yapi/ydgpClassesUp`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};
//删除课程
export const classesDel = params => {
    return axios.post(`${base}/index/yapi/ydgpClassesDel`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};

//公告列表
export const noticelist = params => {
    return axios.get(`${base}/index/yapi/noticelist`, {params: params});
};

//添加公告
export const noticeup = params => {
    return axios.post(`${base}/index/yapi/noticeup`, params, {headers: {"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'}});
};



////////////////////////////////////////pc客户端推送//////////////////////////////////////////////////////////
//查询
export const MessageList = params => {

    return axios.post(`${path}/Message/list`, params, {headers:{"Content-Type": 'application/json'}});
};
//新增
export const MessageSave = params => {
    return axios.post(`${path}/Message/save`, params, {headers:{"Content-Type": 'application/json'}});
};
//更新
export const MessageEdit = params => {
    return axios.post(`${path}/Message/update`, params, {headers:{"Content-Type": 'application/json'}});
};
//删除
export const MessageDel = params => {
    return axios.post(`${path}/Message/delete`,params,{headers:{"Content-Type": 'application/json'}});
};








