import {get, post,put,syncget, del } from '../common/js/axios_promise.js';

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

export default {
    /**
     * 四维股池列表信息
     */
    getFourDimensionalPoolPage(json) {
        return post('/api/fourdimensionalpoolController/getFourDimensionalPoolPage', json)
    },
    /**
     * 四维股池增加信息
     */
    addFourDimensionalPool(json) {
        return post('/api/fourdimensionalpoolController/addFourDimensionalPool', json)
    },
    /**
     * 四维股池更新信息
     */
    updateFourDimensionalPool(json) {
        return post('/api/fourdimensionalpoolController/updateFourDimensionalPoolById', json)
    },
    /**
     * 四维股池删除信息
     */
    deleteFourDimensionalPoolById(id) {
        return post('/api/fourdimensionalpoolController/deleteFourDimensionalPoolById?id='+id)
    },

    /**
     * 四维股池--查询推荐个股最近上榜营业部信息
     */
    getSeatsListByStockCode(stockCode) {
        return post('/api/fourdimensionalpoolController/getSeatsListByStockCode?stockCode='+stockCode)
    },


    /**
     * 收盘点评列表信息
     */
    getClosingCommentPage(json) {
        return post('/api/closingCommentController/getClosingCommentPage', json)
    },

    /**
     * 收盘点评增加信息
     */
    addClosingComment(json) {
        return post('/api/closingCommentController/addClosingComment', json)
    },
    /**
     * 收盘点评更新信息
     */
    updateClosingCommentById(json) {
        return post('/api/closingCommentController/updateClosingCommentById', json)
    },
    /**
     * 收盘点评删除信息
     */
    deleteClosingCommentById(id) {
        return post('/api/closingCommentController/deleteClosingCommentById?id=' +id)
    },

    /**
     * 标签列表信息
     */
    selectViewPointLableList(json) {
        return post('/api/jpViewpointLabelController/selectViewPointLableList', json)
    },
    /**
     * 批量点赞与浏览
     */
    batchLikeviewPointAdd(json) {
        return post('/api/jpViewpointController/saveBatchAdd', json) 
   },

    /**
     * 观点直播 添加数据
     */
    viewPointSave(json) {
        return post('/api/jpViewpointController/save', json)
    },

    /**
     * 获取观点直播 删除数据数据
     */
    viewPointDel(id) {
        return post('/api/jpViewpointController/delete?id=' + id)
    },

    /**
     * 获取观点直播列表信息
     */
    viewPointListPage(json) {

        return post('/api/jpViewpointController/searchList', json);
    },

    /**
     * 标签 添加数据
     */
    viewPintSave(json) {
        return post('/api/jpViewpointLabelController/save', json)
    },

    /**
     * 标签 停用启用数据
     */
    viewPintIsFlag(id,flag) {
        return post('/api/jpViewpointLabelController/delete?id=' + id+"&flag="+flag)
    },

    /**
     * 标签列表
     */
    getViewPintLable(json) {
        return post('/api/jpViewpointLabelController/searchList', json);
    },

    /**
     * 实战解盘  盘前解读
     */
    addpanqianjiedu(json) {
        return post('/api/ShiZhanJiePanController/save', json)
    },
    /**
     * 盘前解读 获取盘前解读列表信息
     */
    panQianJieDuPage(json){

        return post('/api/ShiZhanJiePanController/selectPqjdByPage', json)
    },

    /**
     * 盘前解读 批量点赞注水
     */
    pqjdBatchLikeAdd(json) {
        return post('/api/ShiZhanJiePanController/saveBatchAdd', json)
    },

    /**
     * 尊享 股票池批量点赞与浏览
     */
    batchViewStockAdd(json) {
        return post('/api/gpcEnjoyStockPoolController/saveBatchView', json)
    },

    /**
     * 股票池 添加数据
     */
    gpcSave(json) {
        return post('/api/gpcEnjoyStockPoolController/save', json)
    },

    /**
     * 尊享股票池 跟踪列表
     */
    selectrackingList(json) {
        return post('/api/gpcEnjoyStockPoolController/selectrackingList', json);
    },



    /**
     * 股票跟踪 添加数据
     */
    trackSave(json) {
        return post('/api/gpcEnjoyStockPoolController/track', json)
    },


    /**
     * 股票池 还原
     */
    hySave(json) {
        return post('/api/StockPool/hySave', json)
    },

    /**
     * 下线 添加数据
     */
    downlineSave(json) {
        return post('/api/gpcEnjoyStockPoolController/downline', json)
    },


    /**
     * 变更 添加数据
     */
    changeSave(json) {
        return post('/api/gpcEnjoyStockPoolController/change', json)
    },

    /**
     * 尊享股票池
     */
    stockPoolPage(json) {

        return post('/api/gpcEnjoyStockPoolController/searchList', json);
    },

    /**
     * 精品课  选择栏目回显
     */
    selectColumnForPeriod(json) {
        return post('/api/ktBoutiqueCourseController/selectColumnForPeriod', json)
    },
    /**
     * 精品课 批量点赞与浏览
     */
    bcBatchLikeAndViewAdd(json) {
        return post('/api/ktBoutiqueCourseController/saveBatchAdd', json)
    },

    /**
     * 精品课删除 添加数据
     */
    deleteBoutiqueCourse(json) {
        return post('/api/ktBoutiqueCourseController/delete', json)
    },
    /**
     * 精品课 添加数据
     */
    boutiqueCourseSave(json) {
        return post('/api/ktBoutiqueCourseController/savektBoutiqueCourse', json)
    },
    /**
     * 精品课列表信息
     */
    boutiqueCoursePage(json) {

        return post('/api/ktBoutiqueCourseController/selectktBoutiqueCourse', json);
    },

    /**
     * 栏目 删除数据数据
     */
    deleteColumn(id) {
        return post('/api/ktBoutiqueCourseController/deleteColumn?id=' + id)
    },
    /**
     * 栏目 添加数据
     */
    columnSave(json) {
        return post('/api/ktBoutiqueCourseController/save', json)
    },
    /**
     * 栏目列表
     */
    getColumnPage() {

        return post('/api/ktBoutiqueCourseController/selectColumnByPage');
    },
    /**
     * 批量点赞与浏览
     */
    batchLikeAndViewAdd(json) {
        return post('/api/ktStarComeController/saveBatchAdd', json)
    },
    /**
     * 大咖来了 删除数据数据
     */
    starComeDel(id) {
        return post('/api/ktStarComeController/delete?id=' + id)
    },
    /**
     * 大咖来了 添加数据
     */
    starComeSave(json) {
        return post('/api/ktStarComeController/save', json)
    },

    /**
     * 获取主持人老师列表信息
     */
    selectPersonList(json) {
        return post('/api/ktStarComeController/selectPersonList', json)
    },

    /**
     * 获取大咖来了列表信息
     */
    starComePage(json) {

        return post('/api/ktStarComeController/selectKtStartComeByPage', json);
    },
    //--------------------------------
    /**
     * 基础课列表信息
     */
    getJichukeList(json) {
        return post('/api/jichukeController/selectJichukeByPage', json);
    },
    /**
     * 基础课类型列表信息
     */
    getLeixingList(json) {
        return post('/api/jichukeController/selectLeixingByPage', json);
    },
    /**
     * 获取类型
     */
    getaricleInfo(json) {
        return post('/api/jichukeController/getAricleInfo', json);
    },

    /**
     * 更新基础课程
     */
    updateAricle(json) {
        return post('/api/jichukeController/updateAricle', json);
    },
    /**
     * 发布基础课程
     */
    addAricle(json) {
        return post('/api/jichukeController/addAricle', json);
    },

    /**
     * 更新课程类型
     */
    updateLeixing(json) {
        return post('/api/jichukeController/updateLeixing', json);
    },
    /**
     * 保存课程类型
     */
    addLeixing(json) {
        return post('/api/jichukeController/addLeixing', json);
    },

    /**
     * 删除基础课程
     */
    deleteArice(json) {
        return post('/api/jichukeController/deleteAricle', json);
    },
    /**
     *
     *点赞注水
     */
    updateLikejichu(json) {
        return post('/api/jichukeController/updatelike', json);
    },
    /**
     * 启用停用
     */
    updateQiyong(json) {
        return post('/api/jichukeController/updateQiyong', json);
    },
    //--------------------------------
    /**
     * 获取用户登陆信息
     */
    UseInfo(json) {
        return post('/api/user/login_admin', json);
    },

    UserInfoList(json) {
        return post("/api/user/getUserInfoList", json);
    },
    /**
     * 获取用户登陆后的菜单信息
     */
    getMenuInfo(json) {
        return post('/api/menu/getUserMenu', json);
    },
    /**
     * 获取菜单消息*/
    getMenu() {
        return post('/api/menu/getMenu', '');
    },
    getMenubyUser(json) {
        return post('/api/menu/getMenuByuser', json);
    },
    adduserMenu(json) {
        return post('/api/menu/addUserMenu', json);
    },
    //盘中观点
    getPanZhongList(json) {
        return post('/api/panzhong/findlist', json);
    },
    addpanzhong(json) {
        return post('/api/panzhong/save', json);

    },
    editpanzhong(json) {
        return post('/api/panzhong/update', json);
    },
    deletepanzhong(id) {
        return post('/api/panzhong/delete?id=' + id);
    },
    updateLikepanzhong(id) {
        return post('/api/panzhong/updatelike', id);
    },
    //公开课列表
    getPublicCourseList(json) {
        return post('/api/publiccourse/findlist', json);
    },
    //添加
    addPublicCourse(json) {
        return post('/api/publiccourse/save', json);
    },
    //公开课列表删除
    deletepubliccourse(id) {
        return post('/api/publiccourse/delete?id=' + id);
    },
    //公开课列表更新
    updatePublicCourse(json) {
        return post('/api/publiccourse/save', json);
    },
    //公开课列表点赞量与浏览
    updateLikepublicCourse(json) {
        return post('/api/publiccourse/updatelike', json);
    },
    //标签管理
    getBiaoqianInfo(json) {
        return post('/api/biaoqian/getlist', json);
    },
    editbiaoqian(json) {
        return post('/api/biaoqian/update', json);
    },
    addbiaoqian(json) {
        return post('/api/biaoqian/save', json);
    },
    deletbiaoqian(id) {
        return post('/api/biaoqian/delete', id);
    },
    selectbyid(id) {
        return post('/api/biaoqian/selectbyid', id);
    },
    selectBiaoqianList(json) {
        return post('/api/biaoqian/getQiyonglist', json);
    },
    selectbyname(json) {
        return post('/api/biaoqian/selectbyname', json);
    },
    //研报点金
    getYabBaoList(json) {
        return post('/api/yanbao/findlist', json);
    },
    addYanbao(json) {
        return post('/api/yanbao/save', json);
    },
    updateYanbao(json) {
        return post('/api/yanbao/update', json);
    },
    deleteYanBao(id) {
        return post('/api/yanbao/delete?id=' + id);
    },
    updateLikeyanbao(json) {
        return post('/api/yanbao/updatelike', json);
    },
    getyundzhToken() {
        return get('/api/dzhtoken/get');
    },
    /*
     * 实战课接口
     * */

    getShiZhanKeList(json) {
        return post("/api/ktActualCourse/getlist", json);
    },
    addShiZhanKe(json) {
        return post("/api/ktActualCourse/save", json);
    },
    updateShiZhanKe(json) {
        return post("/api/ktActualCourse/update", json);
    },
    updateShiZhiKe_LikeViewCount(json) {
        return post("/api/ktActualCourse/updateLikeViewCount", json);
    },
    deleteShiZhanKe(id) {
        return post("/api/ktActualCourse/delete?id=" + id);
    },
    getShiZhanKeInfo(id) {
        return post("/api/ktActualCourse/get?id=" + id);
    },

    /*
     * 选股股票跟踪、股票池接口
     * */

    getGuPiaoChiList(json) {
        return post("/api/StockPool/getlist", json);
    },
    addGuPiaoChi(json) {
        return post("/api/StockPool/save", json);
    },
    updateGuPiaoChi(json) {
        return post("/api/StockPool/update", json);
    },
    // close(json) {
    //     return post("/api/StockPool/close", json);
    // },
    updateGuPiaoChi_LikeViewCount(json) {
        return post("/api/StockPool/updateLikeViewCount", json);
    },
    deleteGuPiaoChi(id) {
        return post("/api/StockPool/delete?id=" + id);
    },
    getGuPiaoChiInfo(id) {
        return post("/api/StockPool/get?id=" + id);
    },

    // getGuPiaoGenZongList(json) {
    //     return post("/api/XgHistoryStock/getlist", json);
    // },
    // addGuPiaoGenZong(json) {
    //     return post("/api/XgHistoryStock/save", json);
    // },
    // updateGuPiaoGenZong(json) {
    //     return post("/api/XgHistoryStock/update", json);
    // },
    // deleteGuPiaoGenZong(id) {
    //     return post("/api/XgHistoryStock/delete?id=" + id);
    // },
    // getGuPiaoGenZongInfo(id) {
    //     return post("/api/XgHistoryStock/get?id=" + id);
    // },
    // getGuPiaoGenZongInfo2(where) {
    //     return post("/api/XgHistoryStock/get2?where=" + where);
    // },
    getyundzhToken() {
        return get('/api/dzhtoken/get');
    },
    /**热点狙击 */
    getHotsniperList(page, size, categoryId, json) {

        return post('/api/commonartic/list/' + page + '/' + size + '/' + categoryId, json)
    },
    hotsniperView(type, json) {
        return post('/api/commonartic/view/' + type + '/', json)
    },
    operation(status, id) {
        return post('/api/commonartic/operation/' + status + '/', id)
    },
    postdata(status, categoryId, json){
        return post('/api/commonartic/postdata/' + status + '/' + categoryId + '/', json)
    },
    /**
     * 早知晓接口
     */
    getAdvanceKnowList(json) {
        return post('/api/advanceKnow/getAdvanceKnowList', json)
    },
    addAdvanceKnow(json) {
        return post('/api/advanceKnow/insert', json)
    },
    updateAdvanceKnow(json) {
        return post('/api/advanceKnow/update', json)
    },
    deleteAdvanceKnow(id) {
        return post('/api/advanceKnow/delete?id=' + id)
    },
    getAdvacnceKnow(id) {
        return post('/api/advanceKnow/getAdvanceKnow?id=' + id)
    },
    updateLike(json) {
        return post('/api/advanceKnow/updateLike', json)
    },
    updateView(json) {
        return post('/api/advanceKnow/updateView', json)
    },
    /***系统设置接口***/
    getZhushuiyonghu(json) {
        return post('/api/zhushuiyonghu/findlist', json);
    },
    updateZhushuiyonghu(json) {
        return post('/api/zhushuiyonghu/update', json);
    },
    addZhushuiyonghu(json) {
        return post('/api/zhushuiyonghu/save', json);
    },
    /***成功案例**/
    getChengGongAnli(json) {
        return post('/api/successCaseController/getSuccessCaseList', json);
    },
    updateChengGongAnli(json) {
        return post('/api/successCaseController/update', json);
    },
    addChengGongAnli(json) {
        return post('/api/successCaseController/save', json);
    },
    deleteChengGongAnli(id) {
        return get('/api/successCaseController/deleteSuccessCase?ID=' + id)
    },
    getgenzongCount(code) {
        return post('/api/XgHistoryStock/get2?where=' + code);
    },
    /**
     * 小白课堂接口
     * 套系
     */

    getKtSetList(json) {
        return post('api/KtSet/getKtSetList', json)
    },
    addKtSet(json) {
        return post('api/KtSet/addKtSet', json)
    },
    updateKtSet(json) {
        return post('api/KtSet/updateKtSet', json)
    },
    addKtWhiteClassroom(json) {
        return post('api/ktWhiteClassroom/addKtWhiteClassroom', json)
    },
    updateKtWhiteClassroom(json) {
        return post('api/ktWhiteClassroom/updateKtWhiteClassroom', json)
    },
    deleteKtWhiteClassroom(id) {
        return post('api/ktWhiteClassroom/deleteKtWhiteClassroom?id=' + id)
    },
    getKtWhiteClassroomList(json) {
        return post('api/ktWhiteClassroom/getKtWhiteClassroomList', json)
    },
    getKtWhiteClassroom(id) {
        return post('api/ktWhiteClassroom/getKtWhiteClassroom?id=' + id)
    },
    KtWCLikeOrView(json) {
        return post('api/ktWhiteClassroom/KtWCLikeOrView', json)
    },
    /***老师管理**/
    selTeacherName(teacherName)//老师查询
     {
        return post('/api/TeacherController/SelTeacherName?TeacherName='+teacherName)
    },
    getReName(TeacherName)
    {
        return post('/api/TeacherController/VerificationName?TeacherName=' + TeacherName)//是否重名
    },
    getTeacher(json) {

        return post('/api/TeacherController/getTeachers', json);
    },
    setqy(id) {
        return get('/api/TeacherController/updateflag?flag=0&ID=' + id)
    },
    //置顶
    settop(id) {
        return get('/api/TeacherController/updatetop?ID=' + id)
    },
    //禁用
    setjy(id) {
        return get('/api/TeacherController/updateflag?flag=1&ID=' + id)
    },
    updateTeacher(json) {
        return post('/api/TeacherController/update', json);
    },
    addTeacher(json) {
        return post('/api/TeacherController/save', json);
    },
    /***轮播图管理**/
    getbanner(json) {
        return post('/api/BannerController/getBannerList', json);
    },
    deleteBanner(id,source) {
        return get('/api/BannerController/deleteBanner?ID='+id)
    },
    //置顶
    setbannertop(id) {
        return get('/api/BannerController/BannerTop?ID=' + id)
    },
    setqybanner(id) {
        return get('/api/BannerController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setjybanner(id) {
        return get('/api/BannerController/updateflag?flag=1&ID=' + id)
    },
    updatebanner(json) {
        return post('/api/BannerController/update', json);
    },
    addbanner(json) {
        return post('/api/BannerController/save', json);
    },
    /***财源轮播图管理**/
    getbannercy(json) {
        return post('/api/BannerCyController/getBannerList', json);
    },
    deleteBannercy(id,source) {
        return get('/api/BannerCyController/deleteBanner?ID='+id)
    },
    //置顶
    setbannertopcy(id) {
        return get('/api/BannerCyController/BannerTop?ID=' + id)
    },
    setqybanner(id) {
        return get('/api/BannerCyController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setjybannercy(id) {
        return get('/api/BannerCyController/updateflag?flag=1&ID=' + id)
    },
    updatebannercy(json) {
        return post('/api/BannerCyController/update', json);
    },
    addbannercy(json) {
        return post('/api/BannerCyController/save', json);
    },
    /***行情管理**/
    getHqMarketDetail(id) {
        return post('api/HqMarketController/getHqMarketDetail?id=' + id)
    },
    getHqMarket(json) {
        return post('/api/HqMarketController/getHqMarketList', json);
    },
    updateHqMarket(json) {
        return post('/api/HqMarketController/update', json);
    },
    addHqMarket(json) {
        return post('/api/HqMarketController/save', json);
    },
    getHqBytitle(title) {
        return post('/api/HqMarketController/getHqListByTitle?title=' + title)
    },
    /** 获取公告的列表信息//jffadd*/
    getNoticeTableInfo(json) {
        return post('/api/NoticeController/getNoticeList', json);
    },
    /** * 编辑公告*/
    editNoticeInfo(json) {
        return post('/api/NoticeController/update', json);
    },
    /*** 新增公告 */
    addNoticeInfo(json) {
        return post('/api/NoticeController/save', json);
    },
    deleteNotice(id) {
        return get('/api/NoticeController/deleteNotice?ID=' + id)
    },
    getNoticeBytitle(title) {
        return post('/api/NoticeController/getNoticeListByTitle?title=' + title)
    },
    /**午间分析 */
    wuJianFenXiPage(json) {
        return post('/api/wuJianFenXiController/selectWuJianFenXiByPage', json);
    },
    /**午间分析修改新增保存 */
    wuJianFenXiSave(json) {
        return post('/api/wuJianFenXiController/wuJianFenXiSave', json);
    },
    /**午间分析注水 */
    batchLikeAndViewAddWuJianFenXi(json) {
        return post('/api/wuJianFenXiController/saveBatchAddWuJianFenXi', json)
    },
    /**午间分析删除 */
    starComewuJianFenXiDel(id) {
        return post('/api/wuJianFenXiController/deleteWuJianFenXi?id=' + id);
    },

    getbanner(json) {
        return post('/api/BannerController/getBannerList', json);
    },
    deleteBanner(id) {
        return get('/api/BannerController/deleteBanner?ID=' + id)
    },
    setqybanner(id) {
        return get('/api/BannerController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setjybanner(id) {
        return get('/api/BannerController/updateflag?flag=1&ID=' + id)
    },
    updatebanner(json) {
        return post('/api/BannerController/update', json);
    },
    addbanner(json) {
        return post('/api/BannerController/save', json);
    },
    /***行情管理**/
    getHqMarketDetail(id) {
        return post('api/HqMarketController/getHqMarketDetail?id=' + id)
    },
    getHqMarket(json) {
        return post('/api/HqMarketController/getHqMarketList', json);
    },
    updateHqMarket(json) {
        return post('/api/HqMarketController/update', json);
    },
    addHqMarket(json) {
        return post('/api/HqMarketController/save', json);
    },
    getHqBytitle(title) {
        return post('/api/HqMarketController/getHqListByTitle?title=' + title)
    },
    /** 获取公告的列表信息//jffadd*/
    getNoticeTableInfo(json) {
        return post('/api/NoticeController/getNoticeList', json);
    },
    /** * 编辑公告*/
    editNoticeInfo(json) {
        return post('/api/NoticeController/update', json);
    },
    /*** 新增公告 */
    addNoticeInfo(json) {
        return post('/api/NoticeController/save', json);
    },
    deleteNotice(id) {
        return get('/api/NoticeController/deleteNotice?ID=' + id)
    },
    getNoticeBytitle(title) {
        return post('/api/NoticeController/getNoticeListByTitle?title=' + title)
    },
    getbanner(json) {
        return post('/api/BannerController/getBannerList', json);
    },
    deleteBanner(id) {
        return get('/api/BannerController/deleteBanner?ID=' + id)
    },
    setqybanner(id) {
        return get('/api/BannerController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setjybanner(id) {
        return get('/api/BannerController/updateflag?flag=1&ID=' + id)
    },
    updatebanner(json) {
        return post('/api/BannerController/update', json);
    },
    addbanner(json) {
        return post('/api/BannerController/save', json);
    },
    /***行情管理**/
    getHqMarketDetail(id) {
        return post('api/HqMarketController/getHqMarketDetail?id=' + id)
    },
    getHqMarket(json) {
        return post('/api/HqMarketController/getHqMarketList', json);
    },
    updateHqMarket(json) {
        return post('/api/HqMarketController/update', json);
    },
    addHqMarket(json) {
        return post('/api/HqMarketController/save', json);
    },
    getHqBytitle(title) {
        return post('/api/HqMarketController/getHqListByTitle?title=' + title)
    },
    /***财源指标管理**/
    getZhiBiaoDetail(id) {
        return post('api/MarketController/getMarketDetail?id=' + id)
    },
    getZhiBiao(json) {
        return post('/api/MarketController/getMarketList', json);
    },
    updateZhiBiao(json) {
        return post('/api/MarketController/update', json);
    },
    addZhiBiao(json) {
        return post('/api/MarketController/save', json);
    },
    getByZhiBiaoTitle(title) {
        return post('/api/MarketController/getListByTitle?title=' + title)
    },
    /** 获取公告的列表信息//jffadd*/
    getNoticeTableInfo(json) {
        return post('/api/NoticeController/getNoticeList', json);
    },
    listShouPanDianPin(json) {
        return post("/api/shouPanDianPin/list", json);
    },
    deleteShouPanDianPin(json) {
        return post("/api/shouPanDianPin/delete", json);
    },
    saveShouPanDianPin(json) {
        return post("/api/shouPanDianPin/save", json);
    },
    updateShouPanDianPin(json) {
        return post("/api/shouPanDianPin/update", json);
    },
    zhuShuiShouPanDianPin(json) {
        return post("/api/shouPanDianPin/zhuShui", json);
    },
    //源达官网轮播图
    getYdGwbanner(json) {
        return post('/api/ydGwBannerController/getBannerList', json);
    },
    deleteYdGwBanner(id) {
        return get('/api/ydGwBannerController/deleteBanner?ID=' + id)
    },
    setYdGwqybanner(id) {
        return get('/api/ydGwBannerController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setYdGwjybanner(id) {
        return get('/api/ydGwBannerController/updateflag?flag=1&ID=' + id)
    },
    updateYdGwbanner(json) {
        return post('/api/ydGwBannerController/update', json);
    },
    addYdGwbanner(json) {
        return post('/api/ydGwBannerController/save', json);
    },
    //源达官网专家介绍
    getYdGwExpertintroduction(json) {
        return post('/api/ydGwExpertintroductionController/getExpertintroductionList', json);
    },
    deleteYdGwExpertintroduction(id) {
        return get('/api/ydGwExpertintroductionController/deleteExpertintroduction?ID=' + id)
    },
    setYdGwqyExpertintroduction(id) {
        return get('/api/ydGwExpertintroductionController/updateflag?flag=0&ID=' + id)
    },
    //禁用
    setYdGwjyExpertintroduction(id) {
        return get('/api/ydGwExpertintroductionController/updateflag?flag=1&ID=' + id)
    },
    updateYdGwExpertintroduction(json) {
        return post('/api/ydGwExpertintroductionController/update', json);
    },
    addYdGwExpertintroduction(json) {
        return post('/api/ydGwExpertintroductionController/save', json);
    },
    /**cctv 列表*/
    cctvPage(json) {
        return post('/api/cctv/pageList', json);
    },
    /**cctv删除记录 */
    cctvRecordDel(id) {
        return post('/api/cctv/delete?id=' + id);
    },
    /**cctv删除记录 */
    cctvRecordOffline(id) {
        return post('/api/cctv/offline?id=' + id);
    },
    /**cctv添加记录 */
    cctvRecordAdd(json) {
        return post('/api/cctv/save',json);
    },
    /**cctv更新记录 */
    cctvRecordUpdate(json) {
        return post("/api/cctv/update", json);
    },
    /** cctv课程列表*/
    cctvCourseTypePage(json) {
        return post('/api/cctv_type/list', json);
    },
    /**
     * 获取cctv 可用课程列表
     */
    cctvCourseAvailableList(json) {
        return post('/api/cctv_type/availableList', json)
    },
    cctvCourseTypeAdd(json) {
        return post('/api/cctv_type/save', json);
    },
    cctvCourseTypeOffline(id) {
        return post('/api/cctv_type/offline?id='+id);
    },
    cctvCourseTypeOnline(id) {
        return post('/api/cctv_type/online?id='+id);
    },

    /** 央广财经FM**/
    ygcjfmList(json) {
        return post("/api/ygcj/selectByPageList",json)
    },
    ygcjfmadd(json) {
        return post("/api/ygcj/save",json)
    },
    ygcjfmupdate(json) {
        return post("/api/ygcj/update",json)
    },
    ygcjfmdelete(id) {
        return post("/api/ygcj/delete?id=" + id)
    },
    ygcjfmbatchLikeView(json) {
        return post("/api/ygcj/batchLikeView", json)
    },

    //收盘策略
    shoupanList(json) {
        return post('/api/shoupan/findlist', json);
    },
    saveshoupan(json) {
        return post('/api/shoupan/save', json);
    },
    updateshoupan(json) {
        return post('/api/shoupan/update', json);
    },
    deleteshoupan(json) {
        console.log(json)
        return post('/api/shoupan/delete' ,json);
    },
    updatelikeshoupan(json) {
        return post('/api/shoupan/updatelike', json)
    },

     //龙虎1号列表
    selectDragonTigerByPage(json){
        return post('/api/cyDragonTiger1/selectDragonTigerByPage',json);
    },
    addDragonTiger(json){
        return post('/api/cyDragonTiger1/addDragonTiger',json);
    },
    updateDragonTiger(json){
        return post('/api/cyDragonTiger1/updateDragonTiger',json);
    },
    deleteDragonTiger(id){
        return post('/api/cyDragonTiger1/delectDragonTiger?id='+id);
    },
    getDragonTiger(id){
        return post('/api/cyDragonTiger1/get?id='+id);
    },
    getFlag(){
        return post('/api/cyDragonTiger1/getFlag');
    },
    /**
     * 查询推荐个股最近上榜营业部信息
     */
    getSeatsListBySec_code(sec_code) {
        return post('/api/cyDragonTiger1/getSeatsListByStockCode?sec_code='+sec_code)
    },

    //龙虎实战精选列表
    selectShiZhanByPage(json){
        return post('/api/shizhan/selectShiZhanByPage',json);
    },
    addShiZhan(json){
        return post('/api/shizhan/addShiZhan',json);
    },
    updateShiZhan(json){
        return post('/api/shizhan/updateShiZhan',json);
    },
    delectShiZhan(id){
        return post('/api/shizhan/delectShiZhan?id='+id);
    },
    getShiZhan(id){
        return post('/api/shizhan/get?id='+id);
    },
    getShiZhanFlag(group){
        return post('/api/shizhan/getShiZhanFlag?group='+group);
    },

    //股票跟踪
    addStockTracking(json){
        return post('/api/stockTracking/addStockTracking',json);
    },
    updateStockTracking(json){
        return post('/api/stockTracking/updateStockTracking',json);
    },
    deleteStockTracking(id){
        return post('/api/stockTracking/delectStockTracking?id='+id);
    },
    getStockTrackingList(json){
        return post('/api/stockTracking/selectStockTrackingByPage',json);
    },
    getStockStatus(sec_code,groups){
        return post('/api/stockTracking/getStockStatus?sec_code='+sec_code+"&groups="+groups);
    },
    getNewStockStatus(sec_code){
        return post('/api/stockTracking/getNewStockStatus?sec_code='+sec_code);
    },

    //财源使用说明书
    useexplainList(json) {
        return post('/api/UseExplainController/getUseExplainList', json);
    },
    saveuseexplain(json) {
        return post('/api/UseExplainController/save', json);
    },
    deleteuseexplain(json) {
        //console.log(json)
        return post('/api/UseExplainController/deleteUseExplain' ,json);
    },
    combinationInfoList(pageNo,pageSize) {//财源板块组合管理列表
        return post("/api/combination/findCombinationList?pageNo="+pageNo+"&pageSize="+pageSize );
    },
    newCombinationInfoList(pageNo,pageSize) {//新财源板块组合管理列表
        return post("/api/combination/findNewCombinationList?pageNo="+pageNo+"&pageSize="+pageSize );
    },
    deletCombination(id,del_flag,name) {//财源板块组合禁用
        //console.log(json)
        return post("/api/combination/deletCombination?id="+id+"&del_flag="+del_flag+"&name="+name );
    },
    deletNewCombination(id,del_flag,name) {//财源板块组合禁用
        //console.log(json)
        return post("/api/combination/deletNewCombination?id="+id+"&del_flag="+del_flag );
    },
    findStarList(Star) {//财源板块组合管理编辑页面显示
        return post("/api/star/findStarList?Star=" + Star);
    },
    findStarByExperts(Star) {//新财源板块组合管理显示添加页面的专家服务
        return post("/api/star/findStarByExperts");
    },
    addmenuBytar(json) {//财源板块组合管理编辑页面提交
        return post('/api/star/addmenuBytar' ,json);
    },
    addmenuByStarAndC(json) {//新财源板块组合管理添加或修改
        return post('/api/star/addmenuByStarAndC' ,json);
    },
    findIdByStar(name,menu_name,product) {//财源板块组合管理编辑页面提交
        return post("/api/star/findIdByStar?name="+name+"&menu_name="+menu_name+"&product="+product);
    },
    findcombinationByNameAndBlack(json) {//财源板块组合管理  添加的组合是否存在数据库
        return post('/api/combination/findcombinationByNameAndBlack' ,json);
    },
    findNewCombinationByNameAndBlack(json) {//新板块板块组合管理  添加的组合是否存在数据库
        return post('/api/combination/findNewCombinationByNameAndBlack' ,json);
    },
    findCombinationByStar(name) {//根据星级查下Combination
        return post('/api/combination/findCombinationByStar?name='+name );
    },
    findNewCombinationByStar() {//根据星级查下NewCombination
        return post('/api/combination/findNewCombinationByStar' );
    },
    findProductPowersList(page,pageSize) {//产品权限管理列表
        return post('/api/groups/findProductPowersList?page='+page+'&PageSize='+pageSize );
    },
    updateGroupsAndMenu(starId,id,zhongId,menu_name,name) {//产品权限管理修改 this.starId,para.id,para.zhongId,para.menu_name,para.name
        return post('/api/groups/updateGroupsAndMenu?starId='+starId+'&id='+id+"&zhongId="+zhongId+"&menu_name="+menu_name);
    },
    addGroupsAndMenu(id,menuId,name) {//产品权限管理添加
        return post('/api/groups/addGroupsAndMenu?id='+id+"&menuId="+menuId+"&name="+name );
    },
    findGroupsAndMenu(id,menuId) {//产品权限管理添加页面查询组合是否存在
        return post('/api/groups/findGroupsAndMenu?id='+id+"&menuId="+menuId );
    },
    deletGroups(zhongId,del_flag) {//产品权限管理添加页面查询组合是否存在
        return post('/api/groups/deletGroups?zhongId='+zhongId+"&del_flag="+del_flag);
    },
    findGroupsFlag(zhongId) {//是否可以禁用
        return post('/api/groups/findGroupsFlag?zhongId='+zhongId);
    },
    deleteUser(id) {//后台用户权限管理
        return post('/api/user/deleteUserById?id='+id);
    },

    findMenuByUserWriter(userId,menuId) {//收盘点评和龙虎实战精选查询组的权限
        return post('/api/menu/findMenuByUserWriter?userId='+userId+"&menuId="+menuId);
    },
    /*功能管理*/
    findExpertManageList(page,pageSize){//专家服务老师管理列表
        return post('/api/functionManage/list?page='+page+"&pageSize="+pageSize);
    },
    //添加策略
    addCeLue(json){
        return post('/api/cy4Strategy/addCy4Strategy',json);
    },
    //更新策略
    updateCeLue(json){
        return post('/api/cy4Strategy/updateCy4Strategy',json);
    },
    findExpertManageListAll(){//专家服务老师管理列表
        return post('/api/functionManage/slistAll');
    },
    findShiZhanManageListAll(){//实战策略列表
        return post('/api/functionManage/slistAll');
    },
    //获取热点策略列表(原热点风口列表)
    selectCy4HotTuyereByPage(json){
        return post('/api/cy4HotTuyere/selectCy4HotTuyereByPage',json);
    },
    findShiZhanManageList(page,pageSize,name){//实战策略套系管理列表
        return post('/api/functionManage/slist?page='+page+"&pageSize="+pageSize+"&name="+name);
    },
    findIndexManageListAll(){//实战策略列表
        return post('/api/functionManage/zlistAll');
    },
    findindexClassManageList(page,pageSize,name){//指标课程套系管理
        return post('/api/functionManage/zlist?page='+page+"&pageSize="+pageSize+"&name="+name);
    },
    editExpertManage(json){//修改专家服务老师
        return post('/api/functionManage/eedit',json);
    },
    addShiZhanManage(json){//实战策略套系添加
        return post('/api/functionManage/sadd',json);
    },
    eidtShiZhanManage(json){//实战策略套系修改
        return post('/api/functionManage/sedit',json);
    },
    sexistShiZhanManage(id){//实战策略套系修改
        return get('/api/functionManage/sexist?id=' + id);
    },
    deleteShiZhanManage(id,jinyong){//实战策略套系删除
        return post('/api/functionManage/sdelete?id='+id+"&jinyong="+jinyong);
    },
    findShiZhanByTitle(json){//添加之前查询是否添加过相同的实战管理名称
        return post('/api/functionManage/getSByName',json);
    },
    addIndexClassManage(json){//指标课堂套系添加
        return post('/api/functionManage/zadd',json);
    },
    eidtIndexClassManage(json){//指标课堂套系修改
        return post('/api/functionManage/zedit',json);
    },
    zexistIndexClassManage(id){
        return get('/api/functionManage/zexist?id=' + id);
    },
    deleteIndexClassManage(id,jinyong){//指标课堂套系删除
        return post('/api/functionManage/zdelete?id='+id+"&jinyong="+jinyong);
    },
    findIndexClassByTitle(json){//添加之前查询是否添加过相同的实战管理名称
        return post('/api/functionManage/getZByName',json);
    },
     getLableManageList(json){//慧选股观点直播标签管理列表
        return post('/api/functionManage/llist',json);
    },
    addLabelManage(json){//慧选股观点直播标签管理添加
        return post('/api/functionManage/addllist',json);
    },
    editLabelManage(json){//慧选股观点直播标签管理修改
        return post('/api/functionManage/editllist',json);
    },
    labelMagageIsFlag(json){//慧选股观点直播标签启用禁用
        return post('/api/functionManage/labelMagageIsFlag',json);
    },
   //公告管理
   gonggaoList(json){//查询公告管理列表
    return post('/api/functionManage/glist',json)
   },
   gonggaoAdd(json){//公告管理添加
    return post('/api/functionManage/addglist',json)
   },
   gonggaoEdit(json){//公告管理编辑
    return post('/api/functionManage/editglist',json)
   },
   gonggaoDelete(json){//公告管理删除
    return post('/api/functionManage/deleteglist',json)
   },
    //添加热点
    addHotTuyere(json){
        return post('/api/cy4HotTuyere/addCy4HotTuyere',json);
    },
    //更新热点
    updateCy4HotTuyere(json){
        return post('/api/cy4HotTuyere/updateCy4HotTuyere',json);
    },
    //删除热点
    delectCy4HotTuyere(id){
        return post('/api/cy4HotTuyere/delectCy4HotTuyere?id='+id);
    },
    //添加主题
    addTheme(json){
        return post('/api/cy4ThemeInvestment/addCy4ThemeInvestment',json);
    },
    //获取主题策略列表（原主题列表）
    selectCy4ThemeInvestmentByPage(json){
        return post('/api/cy4ThemeInvestment/selectCy4ThemeInvestmentByPage',json);
    },
    //获取主题策略历史列表（）
    selectCy4ThemeInvestmentHistoryByPage(json){
        return post('/api/cy4ThemeInvestmentHistory/selectCy4ThemeInvestmentHistoryByPage',json);
    },
    // 导出主题策略
    exporZhuTiByPage(json){
        window.open('/api/cy4ThemeInvestment/export?'+urlEncode(json))
    },
    // 导出主题策略
    exporZhuTiHistoryByPage(json){
        window.open('/api/cy4ThemeInvestmentHistory/exportHistory?'+urlEncode(json))
    },
    //主题列表启用停用
    updateStatus(id,status){
        return post('/api/cy4ThemeInvestment/updateStatus?id='+id+"&status="+status);
    },

    //获取主题列表启用的条数(当返回9999时，表示已存在已启动的主题)
    getStatus(json){
        return post('/api/cy4ThemeInvestment/getStatus',json);
    },
    //删除主题
    delectCy4ThemeInvestment(id){
        return post('/api/cy4ThemeInvestment/delectCy4ThemeInvestment?id='+id);
    },
    //更新主题
    updateCy4ThemeInvestment(json){
        return post('/api/cy4ThemeInvestment/updateCy4ThemeInvestment',json);
    },
    //查询价值策略股池留痕记录
    selectJiaZhiCeLueHistoryByPage(json){
        return post('/api/jiaZhiCeLueHistory/selectJiaZhiCeLueHistoryByPage',json)
    },
    //查询研报策略股池留痕记录
    selectYanBaoCeLueHistoryByPage(json){
        return post('/api/yanbaoCeLueHistory/selectYanBaoCeLueHistoryByPage',json)
    },
    //查询热点策略股池留痕记录
    selectReDianCeLueHistoryByPage(json){
        return post('/api/reDianCeLueHistory/selectReDianCeLueHistoryByPage',json)
    },
    //查询主题策略股池留痕记录
    selectZtclHistoryByPage(json){
        return post('/api/ztclHistory/selectztclHistoryByPage',json)
    },
    //查询资金揭秘股池留痕记录
    selectZiJinJieMiHistoryByPage(json){
        return post('/api/ziJinJieMiHistory/selectZiJinJieMiHistoryByPage',json)
    },
    // 导出价值策略股池留痕记录
    exporJiaZhiCeLueByPage(json){
        window.open('/api/jiaZhiCeLueHistory/exportHistory?'+urlEncode(json))
    },
    // 导出研报策略股池留痕记录
    exporYanBaoCeLueByPage(json){
        window.open('/api/yanbaoCeLueHistory/exportHistory?'+urlEncode(json))
    },
    //导出热点策略股池留痕记录
    exporReDianCeLueByPage(json){
        window.open('/api/reDianCeLueHistory/exportHistory?'+urlEncode(json))
    },
    //导出主题策略股池留痕记录
    exporZtclCeLueByPage(json){
        window.open('/api/ztclHistory/exportHistory?'+urlEncode(json))
    },
    //导出资金揭秘股池留痕记录
    exporZiJinJieMiByPage(json){
        window.open('/api/ziJinJieMiHistory/exportHistory?'+urlEncode(json))
    },
    //特色指标列表
    selectCy4IndicatorByPage(json){
        return post('/api/celuexuangu/tesezhibiao',json);
    },
    //更新指标列表
    updateCy4Indicator(json){
        return post('/api/celuexuangu/updateTesezhibiao',json);
    },
    //条件设置---选股范围
    addCy4StockSelection(json){
        return post('/api/cy4StockSelection/addCy4StockSelection',json);
    },
    //获取选股范围
    getCy4StockSelection(json){
        return post('/api/cy4StockSelection/getCy4StockSelection',json);
    },
    //删除选股范围
    deleteCy4StockSelection(json){
        return post('/api/cy4StockSelection/deleteCy4StockSelection',json);
    },
    //条件设置---基本面选股
    addCy4FundamentalStockSelection(json){
        return post('/api/cy4FundamentalStockSelection/addCy4FundamentalStockSelection',json);
    },
    //获取基本面选股
    getCy4FundamentalStockSelection(json){
        return post('/api/cy4FundamentalStockSelection/getCy4FundamentalStockSelection',json);
    },
    //删除基本面选股
    deleteCy4FundamentalStockSelection(json){
        return post('/api/cy4FundamentalStockSelection/deleteCy4FundamentalStockSelection',json);
    },
    //条件设置---特色指标选股
    addCy4CharacteristicStock(json){
        return post('/api/cy4CharacteristicStock/addCy4CharacteristicStock',json);
    },
    //获取特色指标选股
    getCy4CharacteristicStock(json){
        return post('/api/cy4CharacteristicStock/getCy4CharacteristicStock',json);
    },
    //删除特色指标选股
    deleteCy4CharacteristicStock(json){
        return post('/api/cy4CharacteristicStock/deleteCy4CharacteristicStock',json);
    },
    //获取今日操作日志
    getOperationLog(json){
        return post('/api/cy4OperationLog/getCy4OperationLog',json);
    },
    //分页获取操作日志
    selectOperationLogByPage(json){
        return post('/api/cy4OperationLog/selectCy4OperationLogByPage',json);
    },
    //获取最新策略介绍回显
    getStrategy(json){
        return post('/api/cy4Strategy/get',json);
    },


    /**=============财源4.0接口================*/
    //解盘视频
    findSolutionVideoByPage(obj){
        return get('/api/solutionVideos?'+urlEncode(obj));
    },
    insertSolutionVideo(obj){
        return post('/api/solutionVideos',obj);
    },
    updateSolutionVideo(obj){
        return put('/api/solutionVideos',obj);
    },
    deleteSolutionVideoById(id){
        return del('/api/solutionVideos/'+id);
    },
    //热点聚焦
    findHotSpotFocusByPage(obj){
        return get('/api/hotSpotFocuss?'+urlEncode(obj));
    },
    // 导出热点聚焦
    exportHotSpotFocusByPage(obj){
        window.open('/api/hotSpotFocuss/export?'+urlEncode(obj))
        // return get('/api/hotSpotFocuss/export?'+urlEncode(obj));
    },
    exportHotSpotFocusHistory(obj) {
        window.open('/api/hotSpotFocuss/exportHistory?'+urlEncode(obj))
    },
    findHotSpotFocusById(id){
        return get('/api/hotSpotFocuss/'+id);
    },
    insertHotSpotFocus(obj){
        return post('/api/hotSpotFocuss',obj);
    },
    updateHotSpotFocus(obj){
        return put('/api/hotSpotFocuss',obj);
    },
    deleteHotSpotFocusById(id){
        return del('/api/hotSpotFocuss/'+id);
    },
    //热点聚焦历史记录
    findHistoryByPage(obj){
        return get('/api/hotSpotFocuss/findHistoryByPage?'+urlEncode(obj));
    },
    findTeSeZhiBiaoHistoryByPage(obj) {
        return get('/api/dataTraceTeSeZhiBiao/findTeSeZhiBiaoHistoryByPage?'+ urlEncode(obj))
    },
    exportTeSeZhiBiaoHistory(obj) {
        window.open('/api/dataTraceTeSeZhiBiao/exportTeSeZhiBiaoHistory?'+urlEncode(obj))
    },
    findDuoTouQiDongByPage(obj) {
        return get('/api/dataTraceTeSeZhiBiao/findDuoTouQiDongByPage?'+ urlEncode(obj))
    },
    exportDuoTouQiDongHistory(obj) {
        window.open('/api/dataTraceTeSeZhiBiao/exportDuoTouQiDongHistory?'+urlEncode(obj))
    },
    //股票搜索
    searchStock(stockName){
        return  get("https://newf10.ydtg.com.cn/apis/fis/v1/pcapp/qtd/keyDemons?searchKey="+encodeURI(stockName)+"&page=1&size=10")
    },
    ////数据统计
    //findLogin(obj){
    //    return get('/api/dataStatistics/login?'+urlEncode(obj));
    //},
    //findPlateByPage(obj){
    //    return get('/api/dataStatistics/plate?'+urlEncode(obj));
    //},
    //findFunctionByPage(obj){
    //    return get('/api/dataStatistics/function?'+urlEncode(obj));
    //},
    //findActivityByPage(obj){
    //    return get('/api/dataStatistics/activity?'+urlEncode(obj));
    //},
    //专家服务
    findExpertServiceByPage(obj){
        return get('/api/expertServices?'+urlEncode(obj));
    },
    replyExpertService(obj){
        return put('/api/expertServices/replyContent',obj);
    },
    deleteReplyExpertServiceById(id){
        return del('/api/expertServices/replyContent/'+id);
    },
    //营销活动
    findProductActivityByPage(obj){
        return get('/api/productActivity?'+urlEncode(obj));
    },
    insertProductActivity(obj){
        return post('/api/productActivity',obj);
    },
    updateProductActivity(obj){
        return put('/api/productActivity',obj);
    },
    deleteProductActivityById(id){
        return del('/api/productActivity/'+id);
    },
    findProductServiceByPage(obj){
        return get('/api/productService?'+urlEncode(obj));
    },
    insertProductService(obj){
        return post('/api/productService',obj);
    },
    updateProductService(obj){
        return put('/api/productService',obj);
    },
    deleteProductServiceById(id){
        return del('/api/productService/'+id);
    },
    findPaidMarketingPageByPage(obj){
        return get('/api/paidMarketingPage?'+urlEncode(obj));
    },
    updatePaidMarketingPage(obj){
        return put('/api/paidMarketingPage',obj);
    },
    findFreeUserByPage(obj){
        return get('/api/marketingAdvertising/freeUser?'+urlEncode(obj));
    },
    findPayingUserByPage(obj){
        return get('/api/marketingAdvertising/payingUser?'+urlEncode(obj));
    },
    updateFreeUser(obj){
        return put('/api/marketingAdvertising/freeUser',obj);
    },
    insertPayingUser(obj){
        return post('/api/marketingAdvertising/payingUser',obj);
    },
    updatePayingUser(obj){
        return put('/api/marketingAdvertising/payingUser',obj);
    },
    existQxPayingUser(obj){
        return get('/api/marketingAdvertising/payingUser/existQx?'+urlEncode(obj));
    },
    //导航退出
    findNavigationExitByPage(obj){
        return get('/api/marketingAdvertising/navigationExit?'+urlEncode(obj));
    },
    insertNavigation(obj){
        return post('/api/marketingAdvertising/navigation',obj);
    },
    insertExit(obj){
        return post('/api/marketingAdvertising/exit',obj);
    },
    updateNavigation(obj){
        return put('/api/marketingAdvertising/navigation',obj);
    },
    updateExit(obj){
        return put('/api/marketingAdvertising/exit',obj);
    },
    existQxOfNavigationExit(obj){
        return get('/api/marketingAdvertising/navigationExit/existQx?'+urlEncode(obj));
    },
    existQbkjOfNavigationExit(obj){
        return get('/api/marketingAdvertising/navigationExit/existQbkj?'+urlEncode(obj));
    },
    disableFreeUser(id){
        return del('/api/marketingAdvertising/disableFreeUser/'+id);
    },
    deleteMarketingAdvertising(id){
        return del('/api/marketingAdvertising/'+id);
    },
    cancelDisableFreeUser(id){
        return del('/api/marketingAdvertising/cancelDisableFreeUser/'+id);
    },
    //首页右下角轮播图
    findRightBottomCarouselByPage(obj){
        return get('/api/marketingAdvertising/rightBottomCarousel?'+urlEncode(obj));
    },
    insertRightBottomCarousel(obj){
        return post('/api/marketingAdvertising/rightBottomCarousel',obj);
    },
    updateRightBottomCarousel(obj){
        return put('/api/marketingAdvertising/rightBottomCarousel',obj);
    },
    topOfRightBottomCarousel(obj){
        return put('/api/marketingAdvertising/rightBottomCarousel/top',obj);
    },
    existQxOfRightBottomCarousel(obj){
        return get('/api/marketingAdvertising/rightBottomCarousel/existQx?'+urlEncode(obj));
    },
    existQbkjOfRightBottomCarousel(obj){
        return get('/api/marketingAdvertising/rightBottomCarousel/existQbkj?'+urlEncode(obj));
    },
    //APP
    findOpenScreen(obj){
        return get('/api/marketingAdvertising/openScreen?'+urlEncode(obj));
    },
    updateOpenScreen(obj){
        return put('/api/marketingAdvertising/openScreen',obj);
    },
    findHomBoxByPage(obj){
        return get('/api/marketingAdvertising/homeBox?'+urlEncode(obj));
    },
    insertHomeBox(obj){
        return post('/api/marketingAdvertising/homeBox',obj);
    },
    existQxOfHomeBox(obj){
        return get('/api/marketingAdvertising/homeBox/existQx?'+urlEncode(obj));
    },
    existQbkjOfHomeBox(obj){
        return get('/api/marketingAdvertising/homeBox/existQbkj?'+urlEncode(obj));
    },
    //成长课堂
    //实战策略
    shiZhanStrategyList(json){//添加之前查询是否添加过相同的实战管理名称
        return post('/api/shiZhanStrategy/list',json);
    },
    deleteShiZhanStrategy(id){
        return post('/api/shiZhanStrategy/delete?id='+id);
    },
    addShiZhanStrategy(json){
        return post('/api/shiZhanStrategy/add',json);
    },
    editShiZhanStrategy(json){
        return post('/api/shiZhanStrategy/edit',json);
    },
    shiZhanStrategyZhuShui(json){//实战策略注水
        return post('/api/shiZhanStrategy/editZhuiShui',json);
    },
    strategyBlockList(dict_key){
        return post('/api/dict/getDict?dict_key='+dict_key);
    },
    strategyBlockListByKey(key,dict_key){
        return post('/api/dict/getDictByKey?key='+key+"&dict_key="+dict_key);
    },
    //指标课堂
    indexClassList(json){//添加之前查询是否添加过相同的实战管理名称
        return post('/api/indexClass/list',json);
    },
    deleteIndexStrategy(id){
        return post('/api/indexClass/delete?id='+id);
    },
    addIndexStrategy(json){
        return post('/api/indexClass/add',json);
    },
    editIndexClass(json){
        return post('/api/indexClass/edit',json);
    },
    indexClassZhuShui(json){//实战策略注水
        return post('/api/indexClass/editZhuiShui',json);
    },

    //选股范围常用板块搜索
    findPlates(param){
        return post('/api/celuexuangu/changyongbankuai?param='+param)
    },
    //热点主题版块搜索
    getBanKuai(name){
        return post('/api/celuexuangu/getbankuai?name='+name)
    },

    //当所有条件为空时，删除对应节点
    deleJieDian(moudle_flag){
        return post('/api/celuexuangu/delSelectCondition?moudle_flag='+moudle_flag);
    },

    //获取策略选股接口(明星分析师)
    getMingXingFenXiShi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){  //
        return post('/api/celuexuangu/mingxingfenxishi?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //获取策略选股接口(明星机构)
    getMinXingJiGouResult(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/mingxingjigou?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //获取策略选股接口(涨幅空间最大)
    getZhangFuKongJianResult(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zhangfukongjian?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },


    //高成长选股结果
    getGaoChengZhang(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaochengzhang?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //低估值选股结果
    getDiGuZhi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/diguzhi?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //高分红选股结果
    getGaoFenHong(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaofenghong?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //高盈利选股结果
    getGaoYingLi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaoyingli?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //高送转(高送转选股结果,暂缓开发)
    getGaoSongZhuan(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaosongzhuan?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //增持回购(更名为股东增持)选股结果
    getZengChiHuiGou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zengchihuigou?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //高运营(高运营选股结果,暂缓开发)
    getGaoYunYing(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaoyunying?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //白马绩优选股结果
    getBaiMaJiYou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/baimajiyou?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },

    //热点风口选股结果--底部一买
    getReDianFengKou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/redianfengkou?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //热点风口选股结果--底部二买
    getReDianFengKou2(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/redianfengkou2?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //热点风口选股结果--主升浪选股
    getReDianFengKou3(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/redianfengkou3?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //主题投资-底部一买战法
    getZhuTiTouZi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zhutitouzi?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //主题投资-趋势二买战法
    getZhuTiTouZi2(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zhutitouzi2?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //主题投资-主升浪战法
    getZhuTiTouZi3(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zhutitouzi3?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //高管资金选股结果
    getGaoGuanZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/gaoguanzijin?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //龙虎资金选股结果
    getLongHuZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/longhyuzijin?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },
    //主力资金选股结果
    getZhuLiZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,json){
        return post('/api/celuexuangu/zhulizijin?page='+page+'&size='+size+'&satisfaction_mode_jbm='+satisfaction_mode_jbm+'&contain_ST_jbm='+contain_ST_jbm+'&satisfaction_mode_tszb='+satisfaction_mode_tszb+'&contain_ST_tszb='+contain_ST_tszb+'&iden='+iden,json);
    },

    //获取特色指标元素
    getTeSeZhiBiao(){
        return post('/api/celuexuangu/getTesezhibiao')
    },
    //根据活动状态获取拉新活动
    getLaXinHuoDong(json){
        return post('/api/laxinhuodong/getLaXinHuoDong' ,json);
    },

}
