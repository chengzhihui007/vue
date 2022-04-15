import axios from 'axios';
import {post} from "../common/js/axios_promise";

const urlEncode = function (data, isPrefix = false) {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    for (let key in data) {
      let value = data[key]
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) {
        continue
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
        })
      } else {
        _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    return _result.length ? prefix + _result.join('&') : ''
  }
 
//let base = 'http://192.168.11.103:8761';

// let base = 'http://127.0.0.1:9091';
let base = 'http://101.200.232.183:9091';

// let base = 'http://47.95.35.24:8761';
//47.93.180.11
 

/**
 * 龙虎课堂 批量点赞与浏览
 */

export const lhClassroomListLikeView = params => {
    return axios.post(`${base}/kcLhClassroomController/saveBatchAdd`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 龙虎课堂 列表
 */

export const lhClassroomPageList = params => {
    return axios.post(`${base}/kcLhClassroomController/selectByPageList`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 龙虎课堂 新增
 */
export const lhClassroomSave = params => {
    return axios.post(`${base}/kcLhClassroomController/save`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 龙虎课堂 下线
 */
export const lhClassroomDel = id => {
    console.log(id);
    return axios.get(`${base}/kcLhClassroomController/delete?id=` + id, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 尊享股票池 批量点赞与浏览
 */

export const batchViewStockAdd = params => {
    return axios.post(`${base}/gpcEnjoyStockPoolController/saveBatchView`,params, {headers: {"Content-Type": 'application/json'}});

};

/**
 * 尊享股票池 列表
 */

export const stockPoolPageList = params => {
  return axios.post(`${base}/gpcEnjoyStockPoolController/searchList`,params, {headers: {"Content-Type": 'application/json'}});

};
/**
 * 尊享股票池 新增
 */
export const gpcSave = params => {

    return axios.post(`${base}/gpcEnjoyStockPoolController/save`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 尊享股票池 跟踪列表
 */
export const selectrackingList= params => {
    return axios.post(`${base}/gpcEnjoyStockPoolController/selectrackingList`,params, {headers: {"Content-Type": 'application/json'}});

};
/**
 * 股票跟踪 添加数据
 */
export const trackSave= params => {
    console.log(params);
    return axios.post(`${base}/gpcEnjoyStockPoolController/track`,params, {headers: {"Content-Type": 'application/json'}});

};
/**
 * 下线 添加数据
 */
export const downlineSave= params => {

    return axios.post(`${base}/gpcEnjoyStockPoolController/downline`,params, {headers: {"Content-Type": 'application/json'}});

};

//热点狙击列表
export const hotSniperList= params => {
    return axios.post(`${base}/hotsniper/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点狙击新增
export const hotsave= params => {
    return axios.post(`${base}/hotsniper/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点狙击更新
export const hotupdate= params => {
    return axios.post(`${base}/hotsniper/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点狙击删除
export const hotdelect= params => {
    return axios.post(`${base}/hotsniper/delete`,params,{headers: {"Content-Type": 'application/json'}});

};

//热点狙击注水
export const updateview= params => {
    return axios.post(`${base}/hotsniper/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//投研金股列表
export const goldSearchList= params => {
    return axios.post(`${base}/GoldSearch/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//投研金股新增
export const goldSearchsave= params => {
    return axios.post(`${base}/GoldSearch/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//投研金股更新
export const goldSearchupdate= params => {
    return axios.post(`${base}/GoldSearch/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//投研金股删除
export const goldSearchdelect= params => {
    return axios.post(`${base}/GoldSearch/delete`,params,{headers: {"Content-Type": 'application/json'}});

};

//投研金股注水
export const goldSearchupdateview= params => {
    return axios.post(`${base}/GoldSearch/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘前解读列表
export const plateList= params => {
    return axios.post(`${base}/panqian/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘前解读新增
export const platesave= params => {
    //console.log(params)
    return axios.post(`${base}/panqian/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘前解读更新
export const plateupdate= params => {
    return axios.post(`${base}/panqian/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘前解读删除
export const platedelect= params => {
    return axios.post(`${base}/panqian/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//盘前解读注水
export const plateupdateview= params => {
    return axios.post(`${base}/panqian/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//午间分析列表
export const analyList= params => {
    return axios.post(`${base}/wujianfenxi/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//午间分析新增
export const analysave= params => {
    console.log(params)
    return axios.post(`${base}/wujianfenxi/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//午间分析更新
export const analyupdate= params => {
    return axios.post(`${base}/wujianfenxi/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//午间分析删除
export const analydelect= params => {
    return axios.post(`${base}/wujianfenxi/delete`,params,{headers: {"Content-Type": 'application/json'}});

};

//午间分析注水
export const analyupdateview= params => {
    return axios.post(`${base}/wujianfenxi/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//收盘点评列表
export const listShouPanDianPin= params => {
    return axios.post(`${base}/shouPanDianPin/list`,params, {headers: {"Content-Type": 'application/json'}});
};

//收盘点评新增
export const saveShouPanDianPin= params => {
    //console.log(params)
    return axios.post(`${base}/shouPanDianPin/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//收盘点评更新
export const updateShouPanDianPin= params => {
    return axios.post(`${base}/shouPanDianPin/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//收盘点评删除
export const deleteShouPanDianPin= params => {
    return axios.post(`${base}/shouPanDianPin/delete`,params,{headers: {"Content-Type": 'application/json'}});

};

//收盘点评注水
export const zhuShuiShouPanDianPin= params => {
    return axios.post(`${base}/shouPanDianPin/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//进阶课列表
//查询
export const AdvancedClassList = params => {

    console.log(params);
    return axios.post(`${base}/AdvancedClass/list`, params, {headers:{"Content-Type": 'application/json'}});


};
export const AdvancedClassSave = params => {

    return axios.post(`${base}/AdvancedClass/save`, params, {headers:{"Content-Type": 'application/json'}});
};
export const AdvancedClassUpdate = params => {
    return axios.post(`${base}/AdvancedClass/update`, params, {headers:{"Content-Type": 'application/json'}});
};
export const AdvancedClassDel = params => {
    return axios.post(`${base}/AdvancedClass/del`, params, {headers:{"Content-Type": 'application/json'}});
};

//热点课堂列表
export const hotcourseList = params => {
    return axios.post(`${base}/hotcourse/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点课堂新增
export const hotcoursesave= params => {
    console.log("qqqqqqqqqqqqqq")
    return axios.post(`${base}/hotcourse/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点课堂更新
export const hotcourseupdate= params => {
    return axios.post(`${base}/hotcourse/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//热点课堂删除
export const hotcoursedelect= params => {
    return axios.post(`${base}/hotcourse/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//热点课堂注水
export const hotcourseupdateview= params => {
    return axios.post(`${base}/hotcourse/updateview`,params, {headers: {"Content-Type": 'application/json'}});
};

//公开课提醒列表
export const openclassList = params => {
    return axios.post(`${base}/openclasstx/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//公开课提醒新增
export const openclasssave= params => {
    console.log(params)
    return axios.post(`${base}/openclasstx/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//公开课提醒更新
export const openclassupdate= params => {
    return axios.post(`${base}/openclasstx/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//公开课提醒删除
export const openclassdelect= params => {
    return axios.post(`${base}/openclasstx/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

 //财源使用说明书
 export const useexplainList= params => {
    return axios.post(`${base}/UseExplainController/getUseExplainList`,params,{headers: {"Content-Type": 'application/json'}});
};
export const saveuseexplain= params => {
    console.log(params);
    return axios.post(`${base}/UseExplainController/save`,params,{headers: {"Content-Type": 'application/json'}});
};
export const deleteuseexplain= params => {
    return axios.post(`${base}/UseExplainController/deleteUseExplain?ID=`+params,params,{headers: {"Content-Type": 'application/json'}});
};


/** 获取公告的列表信息//jffadd*/
export const  getNoticeTableInfo=params=>{
    return axios.post(`${base}/NoticeController/findlist`,params,{headers: {"Content-Type": 'application/json'}});
};
export const  editNoticeInfo=params=>{
    return axios.post(`${base}/NoticeController/update`,params,{headers: {"Content-Type": 'application/json'}});
};

export const  addNoticeInfo=params=>{
    return axios.post(`${base}/NoticeController/save`,params,{headers: {"Content-Type": 'application/json'}});
};
export const  deleteNotice=params=>{
    return axios.post(`${base}/NoticeController/deleteNotice?ID=`+params,{headers: {"Content-Type": 'application/json'}});
};
export const  getNoticeBytitle=params=>{
    return axios.post(`${base}/NoticeController/getNoticeListByTitle?title=`+params,{headers: {"Content-Type": 'application/json'}});
}
// 实战直播 标签管理
export const  listPracticalLiveLabel=params=>{
    return axios.post(`${base}/practicalLiveLabel/list?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  isExistPracticalLiveLabel=params=>{
    return axios.post(`${base}/practicalLiveLabel/isExist?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  insertPracticalLiveLabel=params=>{
    return axios.post(`${base}/practicalLiveLabel/insert?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  updatePracticalLiveLabel=params=>{
    return axios.post(`${base}/practicalLiveLabel/update?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  deletePracticalLiveLabel=params=>{
    return axios.post(`${base}/practicalLiveLabel/delete?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
// 实战直播
export const  listPracticalLive=params=>{
    return axios.post(`${base}/practicalLive/list?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  insertPracticalLive=params=>{
    return axios.post(`${base}/practicalLive/insert`,params,{headers: {"Content-Type": 'application/json'}});
}
export const  updatePracticalLive=params=>{
    return axios.post(`${base}/practicalLive/update`,params,{headers: {"Content-Type": 'application/json'}});
}
export const  deletePracticalLive=params=>{
    return axios.post(`${base}/practicalLive/delete?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
// 实战解盘
export const  listPracticalSolution=params=>{
    return axios.post(`${base}/practicalSolution/list?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  insertPracticalSolution=params=>{
    return axios.post(`${base}/practicalSolution/insert?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  updatePracticalSolution=params=>{
    return axios.post(`${base}/practicalSolution/update?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
export const  deletePracticalSolution=params=>{
    return axios.post(`${base}/practicalSolution/delete?`+urlEncode(params),{headers: {"Content-Type": 'application/json'}});
}
