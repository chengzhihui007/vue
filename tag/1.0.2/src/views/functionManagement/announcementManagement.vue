<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="queryform.title" placeholder="请输入标题关键字搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="发布时间"
            v-model="queryform.createTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getGongGaoList(1)">查询</el-button>
                    <el-button type="primary" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
     :row-class-name="tableRowClassName"
      :data="shiZhanList"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      empty-text="暂无公告信息"
    >
     	<el-table-column prop="" label="序号" min-width="40"   align="center">
				  <template scope="num" >
                    <div>{{shiZhanList.length - num.$index}}</div>
                </template>
			</el-table-column>
      <el-table-column prop="title" label="公告标题" min-width="100" align="center">
        	     <template scope="scope">
                    <div>{{ scope.row.title }}</div>
                </template>     
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="100"  align="center">
                <template scope="scope" >
                    <div  >{{ scope.row.createTime.slice(0,16) }}</div>
                </template>     
      </el-table-column>
      <el-table-column prop="account" label="操作账号" min-width="100"  align="center">
                <template scope="scope" >
                    <div  >{{ scope.row.account }}</div>
                </template>     
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template scope="scope">
         <el-button size="small"   @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.delete==0">修改</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-else disabled>修改</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)" v-if="scope.row.delete==0">删除</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-else disabled>已删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="this.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.total"
    ></el-pagination>

    <!--编辑界面-->
    <el-dialog title="修改公告" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="handleClose" width="700px">
      <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
     <el-form-item label="公告标题:" prop="title">
          <el-input 
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="请输入公告标题,限20字以内"
          ></el-input>
        </el-form-item>
      <el-form-item label="公告内容" prop="content">
                     <el-input 
                      :rows="5"
                      type="textarea"
            v-model="addForm.content"
            auto-complete="off"
            style="width:300px;"
            placeholder=""
          ></el-input>
                </el-form-item>
          <el-form-item label="公告图片：" prop="cover_url">
          <el-upload
            class="avatar-uploader"
            action="/api/file/imageUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemoveAdd"
            :before-upload="beforeAvatarUpload"
            :http-request="fnUploadRequest"
          >
            <img v-if="coverURL" :src="coverURL" width="600px" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增页面-->
    <el-dialog title="新增公告" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="handleClose"  width="700px"> 
      <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
         <el-form-item label="公告标题:" prop="title">
          <el-input 
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="请输入公告标题,限20字以内"
          ></el-input>
        </el-form-item>
      <el-form-item label="公告内容" prop="content">
                     <el-input 
                      :rows="5"
                      type="textarea"
            v-model="addForm.content"
            auto-complete="off"
            style="width:300px;"
            placeholder=""
          ></el-input>
                </el-form-item>
          <el-form-item label="公告图片：" prop="cover_url">
          <el-upload
            class="avatar-uploader"
            action="/api/file/imageUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemoveAdd"
            :before-upload="beforeAvatarUpload"
            :http-request="fnUploadRequest">

            <img v-if="coverURL" :src="coverURL" width="600px" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit()" :loading="editLoading">发布</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { imageDefault, pdfDefault } from "../../common/js/urls";
import util from "../../common/js/util";
import api from "../../api/api.js";
import utils from '../../api/utils.js';
export default {
  data() {
       var validateZhuShui = (rule, value, callback) => {
         var reg = /^\d{1,10}$/; //正规表达式对象
        if (reg.test(value)==false) {//汉字两个字节
            callback(new Error("注水数不能超过10位"));
        }else{
          callback();
        } 
      };
      var validatePass = (rule, value, callback) => {//验证标题2O个汉子，或者24个字母
      var len = 0;
      for (var i = 0; i < value.length; i++) {
          var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {//汉字两个字节
           len+=2;
        }else{
           len+=1;
        }
      }
      if(len>40){
        callback(new Error("公告标题请在20字以内"));
      }else{
         callback();
      }
      };
    var numbers = (rule, value, callback) => {
      setTimeout(() => {
        if (this.strlen(value) > rule.num) {
          callback(new Error("字数超过限制！"));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      dingzhi:1,
      display:false,
      InfuseType: null,
      channel: "",
      total: 0,
      page: 1,
      sl:'',
      blockList:[],
      strategy:[{name:'否',id:0},{name:'是',id:1}],//是否同步策略板块
      strategyFind:[{name:'否',id:0},{name:'是',id:1},{name:'全部',id:2}],//查询增加一个全部选项
      pageSize: 15,
      currentPage: 1,
      listLoading: false,
      editLoading: false,
      sels: [], //列表选中列
      //编辑界面数据
      editForm: {},
      //新增界面数据
      coverURL: '',
      addForm: {
        title: ""
        // period: "",
        // cover: "",
        // //compere: "",
        // //teacher: "",
        // playAddress: "",
        // synchron:"否"
        // //audioLength: ""
      },
      query: {
        title: "",
        createTime: null
      },
        queryform: {
            title: "",
            createTime: null
        },
      shiZhanList:[],
      playAddressFileList: [],
      strategyFrom:[],
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      addFormVisible: false, //新增界面是否显示
      zhushuiVisible: false,
      zhushuiObj: { Infuse: null },
      editFormRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            validator: numbers,
            message: "内容超出限制",
            trigger: "blur",
            num: 40
          }
        ],
        period: [
          {
            type: "date",
            required: true,
            message: "请选择期数",
            trigger: "blur"
          }
        ]
      },
      addFormRules: {
      
        title:[
          { required: true, message: "请填写公告标题", trigger: "change" },
          { validator: validatePass, trigger: 'change' }
        ],
        content:[
          { required: true, message: "请填写公告内容", trigger: "change" },
        ]/*,
        cover_url:[
          { required: true, message: "请上传课程封面图", trigger: "change" }
        ]*/
      }
    };
  },
  methods: {
             tableRowClassName({row, rowIndex}) {
                return row.delete == 1 ? 'disable' : 'enable';
            },

        handleClose() {
      this.$refs.addForm.clearValidate();
    },
       async addSubmit() {
           if(this.addForm.title.match(/^[ ]*$/)){
               this.$message({
                   message:"公告标题不能输入空格!",
                   type: "error"
               });
               return false;
           }

           if(this.addForm.content.match(/^[ ]*$/)){
               this.$message({
                   message:"公告内容不能输入空格!",
                   type: "error"
               });
               return false;
           }
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          this.addForm.account = JSON.parse(sessionStorage.getItem('user')).name
          let res = await api.gonggaoAdd(this.addForm);
          if (res.state == true) {
            this.$message({
              message: "发布成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "发布失败",
              type: "error"
            });
          }
          this.addFormVisible = false;
          this.gonggaoList();
        }
      });
    },
      handleAvatarSuccess(res, file) {
      // this.$set(this.addForm, 'cover_url', imageDefault + res.message);
      // this.coverURL = imageDefault + res.message;
      // this.$refs.addForm.clearValidate('cover_url');
      // this.coverFileList = [
      //   { name: this.addForm.cover_url, url: this.addForm.cover_url }
      // ];
    },
      fnUploadRequest(option) {
          utils.ossput(new Date().getTime().toString(), option.file).then(res => {
              this.$set(this.addForm, 'cover_url', res.url);
              this.coverURL = res.url;
              this.$refs.addForm.clearValidate('cover_url');
              this.coverFileList = [
                  { name: this.addForm.cover_url, url: this.addForm.cover_url }
              ];
          });
      },
    handleRemoveAdd(response, fileList) {
      // this.coverURL = "";
      // this.coverFileList = [];
    },
    beforeAvatarUpload(file) {
    const isJPG = file.type == 'image/jpeg';
    const isPNG = file.type == 'image/png';
    const isLt2M = file.size / 1024 / 1024 <= 0.5;
    if (!isJPG&&!isPNG) {
        this.$message.error('图片格式不正确，请重新上传!');
    }
    if (!isLt2M) {
        this.$message.error('上传封面图图片大小不能超过500KB！');
    }
    return (isJPG||isPNG) && isLt2M;
      },
   beforeViewUpload(file) {
    const isVIEW = file.type == 'video/mp4';
    if (!isVIEW) {
    this.$message.error('视频格式错误');
    }
    return isVIEW ;
      },
      
    handleCurrentChange(val) {
      this.page = val;
      this.gonggaoList(val);
    },
    async editSubmit() {
        if(this.addForm.title.match(/^[ ]*$/)){
            this.$message({
                message:"公告标题不能输入空格!",
                type: "error"
            });
            return false;
        }

        if(this.addForm.content.match(/^[ ]*$/)){
            this.$message({
                message:"公告内容不能输入空格!",
                type: "error"
            });
            return false;
        }

      this.$refs.addForm.validate(async valid => {
        if (valid) {
           this.addForm.account = JSON.parse(sessionStorage.getItem('user')).name
          let res = await api.gonggaoEdit(this.addForm);
          if (res.state == true) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
          this.editFormVisible = false;
          this.gonggaoList();
        }
      });
    },
    async handleEdit(scope, row) {      
      this.editFormVisible = true;
      this.addForm = Object.assign({}, row);  
      this.coverURL = this.addForm.cover_url;
      this.playAddressFileList = [
        { name: row.playAddress, url: row.playAddress }
      ];
    },
    async handleAdd() {
      this.coverURL = '';
      this.addFormVisible = true;
      this.display =false;
      this.sl =0;
      this.addForm = { ...{} };
     this.blockList=[];
      this.playAddressFileList = [];
      this.strategyBlockList();//获取策略板块
    },
    async handleDel(row) {
      this.$confirm("删除后该公告用户将不可见,确定要删除该公告吗?", "删除确认", {
        type: "warning"
      }).then(async () => {
        let res = await api.gonggaoDelete(row);
        if (res.state == true) {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "删除失败！",
            type: "error"
          });
        }
        this.gonggaoList();
      });
    },
    async getGongGaoList() {
        this.query.title = this.queryform.title;
        this.query.createTime = this.queryform.createTime;
        if (this.queryform.createTime) {
            this.query.createTime = this.queryform.createTime + " 00:00:00";
        }
        this.gonggaoList(1);
    },
    async gonggaoList(val){

        this.query.page = 1;
       if (val != null && val != '') {
           this.query.page = val;
           this.page = val;
           this.currentPage = val;
       }
      this.query.pageSize = this.pageSize;
    let res =  await api.gonggaoList(this.query);
   this.shiZhanList=res.data.result;
    this.total = res.data.total
    },
    formatview(row, column) {
      return row.viewR + "/" + row.view;
    },
    formatlike(row, column) {
      return row.likeR + "/" + row.like;
    },
    handleChangeAddTP(response, file, fileList) {
      console.log(imageDefault + response.message);
      this.addForm.cover = imageDefault + response.message;
    },
    handleRemoveAddTP(response, file, fileList) {},
    handleChangeAddAF(response, file, fileList) {
      this.editLoading = true;
      this.$refs.addForm.clearValidate('playAddress');
      var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
      ws.onopen = function() {
        console.log("已连接");
        ws.send(JSON.stringify(response));
      };
      var _this = this;
      ws.onmessage = function(evt) {
        _this.editLoading = false;
        console.log("已发送");
        var data = JSON.parse(evt.data);
        _this.addForm.playAddress = data.origUrl;
        //_this.addForm.audioLength = data.durationMsec;

        ws.close();
      };
      ws.onclose = function() {
        console.log("连接已关闭...");
      };
    },
    handleRemoveAddAF(response, fileList) {
      this.addForm.playAddress = "";
      //this.addForm.audioLength = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件~`);
    },
 

    handleSelectionChange(val) {
      this.sels = val;
    },
    setInfuse() {
        this.sels.forEach(a => {
          a.like = Number(this.zhushuiObj.Infuse);
        });
    },
    strlen(str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      return len;
    },
   async strategyBlockList(){
       var res =await  api.strategyBlockList(1);//策略板块
       this.blockList = res.data
    },
    async strategyBlockListByKey(key){
 await  api.strategyBlockList(1).then((res)=>{
                this.blockList = res.data
                this.blockList.forEach(eles => {
                eles.status = false;
                // eles.dis = 0;
                this.$set(eles, 'dis', 0);
                });
                 api.strategyBlockListByKey(key,1).then((res)=>{
                    res.data.forEach(element => {
                    this.blockList.forEach(ele => {
                    if(element.id == ele.id){
                       // ele.status = true;
                        // ele.dis = 1;
                        this.$set(ele, 'dis', 1);
                    }
                    });
                });
                })
                    })
    },
      async strategyEditBlockListByKey(key,row){
        await  api.strategyBlockList(1).then((res) =>{
          this.blockList =res.data
          api.strategyBlockListByKey(key,1).then((res)=>{
          res.data.forEach(element => {
            this.blockList.forEach(ele => {
              if(element.id == ele.id){
                // ele.dis = 1;
                this.$set(ele, 'dis', 1)
              }
            });
         });
        row.platename.split("、").forEach(ele => {
         this.blockList.forEach(element => {
           if(ele == element.dict_value){
             element.status =true;
           }
         });
       }); 
         });//策略板块
        })
    
    }
  },

  mounted() {
    this.gonggaoList();
  }
};
</script>
<style>
.deleted-text{
        color: #999999;
    }
.active {
  color: blue;
}
.el-table .cell {
  white-space: pre-line;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>