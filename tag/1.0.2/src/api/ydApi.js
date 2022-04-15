import axios from 'axios';
import {post} from "../common/js/axios_promise";

//let base = 'http://47.95.35.24:8764';
//let base="http://47.93.180.11:8764";
let base = 'http://zdgzh.zslxt.com/8764';
//let base = 'http://127.0.0.1:8764';

/**
 * 锦囊下拉框
 */
export const teamBagList = params => {

    return axios.post(`${base}/teamBagController/selectByList`,params, {headers: {"Content-Type": 'application/json'}});
};
 

 

/**
 * 进阶课套系查询最新期数
 */

export const selectAdvancedForPeriod = params => {
    //console.log(params);
    return axios.post(`${base}/teamAdvancedCourseController/selectSetForPeriod`,params, {headers: {"Content-Type": 'application/json'}});
};




/**
 * 入门课套系查询最新期数
 */

export const selectSetForPeriod = params => {
    //console.log(params);
    return axios.post(`${base}/teamStartCourseController/selectSetForPeriod`,params, {headers: {"Content-Type": 'application/json'}});
};




/**
 * 
 * 进阶课注水
 */
export const advancedCoursebatchViewAdd = params => {
    return axios.post(`${base}/teamAdvancedCourseController/saveBatchAdd`,params, {headers: {"Content-Type": 'application/json'}});

};

/**
 * 进阶课管理 列表
 */

export const teamAdvancedPageList = params => {
    console.log(params);
    return axios.post(`${base}/teamAdvancedCourseController/selectByPageList`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 进阶课管理 新增
 */
export const teamAdvancedSave = params => {
    return axios.post(`${base}/teamAdvancedCourseController/save`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 进阶课管理 删除
 */
export const teamAdvancedDel = params => {
    console.log(params);
    return axios.post(`${base}/teamAdvancedCourseController/delete`,params, {headers: {"Content-Type": 'application/json'}});
};





/**
 * 
 * 入门课注水
 */
export const startCoursebatchViewAdd = params => {
    return axios.post(`${base}/teamStartCourseController/saveBatchAdd`,params, {headers: {"Content-Type": 'application/json'}});

};

/**
 * 入门课管理 列表
 */

export const teamStartPageList = params => {
    console.log(params);
    return axios.post(`${base}/teamStartCourseController/selectByPageList`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 入门课管理 新增
 */
export const teamStarSave = params => {
    return axios.post(`${base}/teamStartCourseController/save`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 入门课管理 删除
 */
export const teamStarDel = params => {
    console.log(params);
    return axios.post(`${base}/teamStartCourseController/delete`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 套系管理 列表
 */

export const teamSetPageList = params => {
    return axios.post(`${base}/teamSetController/getKtSetList`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 套系管理 新增
 */
export const teamSetSave = params => {
    return axios.post(`${base}/teamSetController/addKtSet`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 套系管理 修改
 */
export const teamSetUpdate = params => {
    return axios.post(`${base}/teamSetController/updateKtSet`,params, {headers: {"Content-Type": 'application/json'}});
};



/**
 * 套系管理 删除
 */
export const teamSetDel = params => {
    console.log(params);
    return axios.post(`${base}/teamSetController/deleteKtSet`,params, {headers: {"Content-Type": 'application/json'}});
};




/**
 * 栏目管理 列表
 */

export const teamColumnPageList = params => {
    console.log(params);
    return axios.post(`${base}/teamColumnController/selectColumnByPage`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 栏目管理 新增
 */
export const teamColumnSave = params => {
    return axios.post(`${base}/teamColumnController/save`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 栏目管理 删除
 */
export const teamColumnDel = params => {
    console.log(params);
    return axios.post(`${base}/teamColumnController/deleteColumn`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 锦囊管理 列表
 */

export const teamBagPageList = params => {
    return axios.post(`${base}/teamBagController/selectByPageList`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 锦囊管理 新增
 */
export const teamBagSave = params => {
    return axios.post(`${base}/teamBagController/save`,params, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 锦囊管理 删除
 */
export const teamBagDel = id => {
    console.log(id);
    return axios.get(`${base}/teamBagController/delete?id=` + id, {headers: {"Content-Type": 'application/json'}});
};
/**
 * 
 * 锦囊管理注水
 */
export const batchViewAdd = params => {
    return axios.post(`${base}/teamBagController/saveBatchView`,params, {headers: {"Content-Type": 'application/json'}});

};


//------------------------------------------------------------------------------------------------------
//研报点金列表
export const yanbaoList= params => {
    return axios.post(`${base}/yanbao/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//研报点金新增
export const yanbaosave= params => {
    //console.log(params)
    return axios.post(`${base}/yanbao/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//研报点金更新
export const yanbaoupdate= params => {
    return axios.post(`${base}/yanbao/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//研报点金删除
export const yanbaodelect= params => {
    console.log(params)
    return axios.post(`${base}/yanbao/delete`,params,{headers: {"Content-Type": 'application/json'}});

};

//研报点金注水
export const yanbaoupdateview= params => {
    return axios.post(`${base}/yanbao/updatelike`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘中观点列表
export const panzhongList= params => {
    return axios.post(`${base}/panzhong/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘中观点新增
export const panzhongsave= params => {
    console.log(params);
    return axios.post(`${base}/panzhong/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘中观点更新
export const panzhongupdate= params => {
    return axios.post(`${base}/panzhong/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//盘中观点删除
export const panzhongdelect= params => {
    return axios.post(`${base}/panzhong/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//盘中观点注水
export const panzhongupdateview= params => {
    return axios.post(`${base}/panzhong/updatelike`,params, {headers: {"Content-Type": 'application/json'}});
};

//观点直播标签列表
export const viewlableList= params => {
    return axios.post(`${base}/teamView/getlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//观点直播标签新增
export const viewlablesave= params => {
    console.log(params);
    return axios.post(`${base}/teamView/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//观点直播标签更新
export const viewlableupdate= params => {
    return axios.post(`${base}/teamView/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//观点直播标签删除
export const viewlabledelect= params => {
    return axios.post(`${base}/teamView/delete`,params,{headers: {"Content-Type": 'application/json'}});
};
//观点直播标签置顶
export  const viewlabletop=params=>{
    return axios.post(`${base}/teamView/updatetop`,params,{headers: {"Content-Type": 'application/json'}});
};

//观点直播标签启用查询
export  const getQiyonglist=params=>{
    return axios.post(`${base}/teamView/getQiyonglist`,params,{headers: {"Content-Type": 'application/json'}});
};

//免费文字直播列表
export const viewlivefreeList= params => {
    return axios.post(`${base}/viewliveFree/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//免费文字直播新增
export const viewlivefreesave= params => {
    console.log(params);
    return axios.post(`${base}/viewliveFree/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//免费文字直播更新
export const viewlivefreeupdate= params => {
    return axios.post(`${base}/viewliveFree/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//免费文字直播删除
export const viewlivefreedelect= params => {
    return axios.post(`${base}/viewliveFree/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//免费文字直播注水
export const viewlivefreeupdateview= params => {
    return axios.post(`${base}/viewliveFree/updatelike`,params, {headers: {"Content-Type": 'application/json'}});
};

//付费文字直播列表
export const viewlivepayList= params => {
    return axios.post(`${base}/viewlivePay/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//付费文字直播新增
export const viewlivepaysave= params => {
    console.log(params);
    return axios.post(`${base}/viewlivePay/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//付费文字直播更新
export const viewlivepayupdate= params => {
    return axios.post(`${base}/viewlivePay/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//付费文字直播删除
export const viewlivepaydelect= params => {
    return axios.post(`${base}/viewlivePay/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//付费文字直播注水
export const viewlivepayupdateview= params => {
    return axios.post(`${base}/viewlivePay/updatelike`,params, {headers: {"Content-Type": 'application/json'}});
};
//付费同步至免费条数
export  const  selectpaytwo= params => {
    return axios.post(`${base}/viewlivePay/selectpaytwo`,params, {headers: {"Content-Type": 'application/json'}});
};

//文章直播标签列表
export const articlelableList= params => {
    return axios.post(`${base}/teamArticle/getlist`,params, {headers: {"Content-Type": 'application/json'}});
};



//文章直播标签新增
export const articlelablesave= params => {
    console.log(params);
    return axios.post(`${base}/teamArticle/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//文章直播标签更新
export const articlelableupdate= params => {
    return axios.post(`${base}/teamArticle/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//文章直播标签删除
export const articlelabledelect= params => {
    return axios.post(`${base}/teamArticle/delete`,params,{headers: {"Content-Type": 'application/json'}});
};
//文章直播标签置顶
export  const articlelabletop=params=>{
    return axios.post(`${base}/teamArticle/updatetop`,params,{headers: {"Content-Type": 'application/json'}});
};

//文章直播标签启用查询
export  const getArticleQiyonglist=params=>{
    return axios.post(`${base}/teamArticle/getQiyonglist`,params,{headers: {"Content-Type": 'application/json'}});
};

//战队文章列表
export const ArticleList= params => {
    return axios.post(`${base}/teamArticleList/findlist`,params, {headers: {"Content-Type": 'application/json'}});
};

//战队文章新增
export const Articlesave= params => {
    console.log(params);
    return axios.post(`${base}/teamArticleList/save`,params, {headers: {"Content-Type": 'application/json'}});
};

//战队文章更新
export const Articleupdate= params => {
    return axios.post(`${base}/teamArticleList/update`,params, {headers: {"Content-Type": 'application/json'}});
};

//战队文章删除
export const Articledelect= params => {
    return axios.post(`${base}/teamArticleList/delete`,params,{headers: {"Content-Type": 'application/json'}});
};

//战队文章注水
export const Articleupdateview= params => {
    return axios.post(`${base}/teamArticleList/updatelike`,params, {headers: {"Content-Type": 'application/json'}});
};
/*
 * 选股股票跟踪、股票池接口
 * */
export const getGuPiaoChiList= params =>{
    return axios.post(`${base}/XgStockPool/getlist`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgStockPool/getlist", json);
};

export const addGuPiaoChi= params =>{
    return axios.post(`${base}/XgStockPool/save`,params, {headers:{"Content-Type": 'application/json'}});
    //return post("/api/XgStockPool/save", json);
};
export const updateGuPiaoChi= params=>{
    return axios.post(`${base}/XgStockPool/update`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgStockPool/update", json);
};
export const  close= params=>{
    return axios.post(`${base}/XgStockPool/close`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgStockPool/close", json);
};
export const  updateGuPiaoChi_LikeViewCount = params=>{
    return axios.post(`${base}/XgStockPool/updateLikeViewCount`,params, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgStockPool/updateLikeViewCount", json);
};
export const  deleteGuPiaoChi = params=>{
    return axios.post(`${base}/XgStockPool/delete?id=`+params,null, {headers: {"Content-Type": 'application/json'}});
   //return post("/api/XgStockPool/delete?id=" + id);
};
export const getGuPiaoChiInfo= params=>{
    return axios.post(`${base}/XgStockPool/get`,params,{headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgStockPool/get?id=" + id);
};

export const  getGuPiaoGenZongList=params=> {
    return axios.post(`${base}/XgHistoryStock/getlist`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/getlist", json);
};
export const  addGuPiaoGenZong=params=>{
    return axios.post(`${base}/XgHistoryStock/save`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/save", json);
};
export const updateGuPiaoGenZong=params=>{

   return axios.post(`${base}/XgHistoryStock/update`,params, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/update", json);
};
export const  deleteGuPiaoGenZong= params=> {
    return axios.post(`${base}/XgHistoryStock/delete`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/delete?id=" + id);
};
export const  getGuPiaoGenZongInfo=params=>{

    return axios.post(`${base}/XgHistoryStock/get?id=`+params,null, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/get?id=" + id);
};
export const  getGuPiaoGenZongInfo2=params=>{

   return axios.post(`${base}/XgHistoryStock/get2?where=`+params,null, {headers:{"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/get2?where=" + where);
};
export const getyundzhToken=params=>{
    return axios.post(`${base}/dzhtoken/get`,params, {headers: {"Content-Type": 'application/json'}});
    //return get('/api/dzhtoken/get');
};
//成功案例新增
export const addChengGongAnli= params => {
    console.log(params)
    return axios.post(`${base}/successCaseController/save`,params,{headers: {"Content-Type": 'application/json'}});
};

//成功案例更新
export const updateChengGongAnli= params => {
    return axios.post(`${base}/successCaseController/update`,params,{headers: {"Content-Type": 'application/json'}});
};

//成功案例删除
export const deleteChengGongAnli= params => {
    return axios.get(`${base}/successCaseController/deleteSuccessCase?ID=`+params,{headers: {"Content-Type": 'application/json'}});
};
export const getCGAl= params => {
    return axios.post(`${base}/successCaseController/getSuccessCaseList`,params,{headers: {"Content-Type": 'application/json'}});
};
//成功案例获取跟踪次数出入池时间
export const getgenzongCount= params => {
    return axios.post(`${base}/XgHistoryStock/SuccessCase_Judge?code=`+params,null, {headers:{"Content-Type": 'application/json'}});
};

/***战队管理**/
export const  selTeamName=params=>{
      return axios.post(`${base}/WarTeamController/SelTeamName?TeamName=`+params,null, {headers:{"Content-Type": 'application/json'}});
  };
export const  getReName=params=>{
    return axios.post(`${base}/WarTeamController/VerificationName?TeamName=`+params,null, {headers:{"Content-Type": 'application/json'}});//是否重名
};


export const  setqy=params=>{

    return axios.get(`${base}/WarTeamController/updateflag?flag=0&ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/get?id=" + id);
};
export const  setjy=params=>{

    return axios.get(`${base}/WarTeamController/updateflag?flag=1&ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/get?id=" + id);
};

//置顶
export const  settop=params=>{

    return axios.get(`${base}/WarTeamController/updatetop?ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
   // return post("/api/XgHistoryStock/get?id=" + id);
};
export const  getTeam=params=> {
    return axios.post(`${base}/WarTeamController/getWarTeam`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/getlist", json);
};
export const updateTeam= params => {
    return axios.post(`${base}/WarTeamController/update`,params,{headers: {"Content-Type": 'application/json'}});
};
export const addTeam= params => {
    return axios.post(`${base}/WarTeamController/save`,params,{headers: {"Content-Type": 'application/json'}});
};
/**
 *  战队聊天/问股 列表
 */

export const askstockList = params => {
    return axios.post(`${base}/AskStockController/getAskStock`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 *  战队聊天/问股 修改
 */
export const askstockUpdate = params => {
    return axios.post(`${base}/AskStockController/update`,params, {headers: {"Content-Type": 'application/json'}});
};



/**
 *  战队聊天/问股 删除
 */
export const askstockDel = params => {
  
    return axios.get(`${base}/AskStockController/deleteAskStock?ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
};

/**
 *  战队聊天/问股 显示到前台
 */
export const Front = params => {
    
    return axios.get(`${base}/AskStockController/Front?ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
};

/**
 *
 * 战队股票池添加
 */
export const addTeamStockpool= params => {
    return axios.post(`${base}/teamStockpool/save`,params,{headers: {"Content-Type": 'application/json'}});
};
/**
 *
 * 战队股票池修改
 */
export const updateTeamStockpool= params => {
    return axios.post(`${base}/teamStockpool/update`,params,{headers: {"Content-Type": 'application/json'}});
};
/**
 *
 * 战队股票池列表
 */
export const  getTeamStockpoolList=params=> {
    return axios.post(`${base}/teamStockpool/getList`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/getlist", json);
};
/**
 *
 * 战队股票池删除
 */
export const deleteTeamStockpool = params => {

    return axios.get(`${base}/teamStockpool/delete?id=`+params,null, {headers: {"Content-Type": 'application/json'}});
};
/**
 *
 * 股票池跟踪添加
 */
export const addstockhistory= params => {
    return axios.post(`${base}/teamStockpoolHistory/save`,params,{headers: {"Content-Type": 'application/json'}});
};
/**
 *
 * 战队股票池修改
 */
export const updatestockhistory= params => {
    return axios.post(`${base}/teamStockpoolHistory/update`,params,{headers: {"Content-Type": 'application/json'}});
};
/**
 *
 * 战队股票池列表
 */
export const  getstockhistoryList=params=> {
    return axios.post(`${base}/teamStockpoolHistory/getList`,params, {headers: {"Content-Type": 'application/json'}});
    //return post("/api/XgHistoryStock/getlist", json);
};
/**
 *
 * 战队股票池删除
 */
export const deletestockhistory = params => {

    return axios.get(`${base}/teamStockpoolHistory/delete?id=`+params,null, {headers: {"Content-Type": 'application/json'}});
};


/**
 * 
 * 实战课注水
 */
export const updateShiZhiKe_LikeViewCount = params => {
    return axios.post(`${base}/TeamActualCourseController/updateLikeViewCount`,params, {headers: {"Content-Type": 'application/json'}});
};
/**
 * 实战课管理 列表
 */

export const getShiZhanKeList = params => {
    console.log(params);
    return axios.post(`${base}/TeamActualCourseController/getlist`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 实战课管理 新增
 */
export const addShiZhanKe = params => {
    console.log(params);
    return axios.post(`${base}/TeamActualCourseController/save`,params, {headers: {"Content-Type": 'application/json'}});
};
/**
 * 实战课管理修改
 */
export const updateShiZhanKe = params => {
    return axios.post(`${base}/TeamActualCourseController/update`,params, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 实战课管理 删除
 */
export const deleteShiZhanKe = params => {
    console.log(params);
    return axios.get(`${base}/TeamActualCourseController/delete?ID=`+params,null, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 实战课管理重名
 */
export const Verification = params => {
    return axios.post(`${base}/TeamActualCourseController/VerificationName?Name=`+params,null, {headers: {"Content-Type": 'application/json'}});
};

/**
 * 
 * 实战课批量分享
 */
export const updateShareCount = params => {
    return axios.post(`${base}/TeamActualCourseController/updateShareCount`,params, {headers: {"Content-Type": 'application/json'}});

};

/**
 * 
 * 阿丁问题征集
 */
export const QuestionList = params => {
    return axios.post(`${base}/TeamQuestionController/getQuestion`,params, {headers: {"Content-Type": 'application/json'}});
};