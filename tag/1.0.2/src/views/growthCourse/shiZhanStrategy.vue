<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="queryForm.title" placeholder="请输入标题关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="发布时间"
            v-model="queryForm.createTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-select v-model="queryForm.synchron" placeholder="是否同步策略板块">
          <el-option v-for="item in strategyFind" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form>
      <el-form :inline="true">
        <el-select v-model="queryForm.zhibiao" placeholder="请选择指标">
          <el-option v-for="item in targerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-form-item>
          <el-input v-model="queryForm.min" @keyup.native="minHandleClick" placeholder="请输入指标最低"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.max" @keyup.native="maxHandleClick" placeholder="请输入指标最高"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="queryList">查询</el-button>
        </el-form-item>
<!--        <el-form-item style="float:right;">-->
<!--          <el-button type="primary" @click="handleAdd()">添加</el-button>-->
<!--        </el-form-item>-->
      </el-form>
    </el-col>
    <el-col :span="24" class="toolbar">
        <el-button type="primary" @click="handleInfuse(0,0)">点赞量注水</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
    </el-col>

    <!--列表-->
    <el-table
      :data="shiZhanList"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
    
     <!--  <el-table-column prop="id" label="序号" min-width="100"></el-table-column> -->
     	<el-table-column prop="playAddress" label="视频地址" min-width="1" v-if="dingzhi==0" sortable>
          <template scope="scope">
                    <div >{{ scope.row.playAddress }}</div>
                </template>     
			</el-table-column>
         <el-table-column disabled="true"
            :selectable='isDisabled'
            type="selection"
            width="55"

         >
         </el-table-column>
     	<el-table-column prop="" label="序号" min-width="100"   align="center">
				  <template scope="num" >
                    <div>{{shiZhanList.length - num.$index}}</div>
                </template>
			</el-table-column>
      <el-table-column prop="title" label="标题" min-width="100" align="center">
        	     <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.title }}</div>
                    <div v-else>{{ scope.row.title }}</div>
                </template>     
      </el-table-column>
      <el-table-column prop="setsystem" label="所属套系" min-width="100"  align="center">
                <template scope="scope" >
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.setsystem }}</div>
                    <div v-else >{{ scope.row.setsystem }}</div>
                </template>     
      </el-table-column>
      <el-table-column
        :label="'点赞量 \n 实数 | 总数'"
        width="120"
        align="center"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.likeR)}" >{{ scope.row.likeR }}</span> | <span>{{ scope.row.like }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'是否理解 \n 完全|基本|没有'"
        width="160"
        align="center"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.udsall)}">{{ scope.row.udsall }}</span>|<span>{{ scope.row.udsbasic }}</span>|<span>{{ scope.row.udsno }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="synchron" label="是否同步策略板块" min-width="140" align="center" >
          <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.synchron }}</div>
                    <div v-else>{{ scope.row.synchron }}</div>
                </template>    
      </el-table-column>
      <el-table-column prop="platename" label="同步板块名称" min-width="110" align="center">
           <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.platename }}</div>
                    <div v-else>{{ scope.row.platename }}</div>
                </template>    
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="130" align="center">
             <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.createTime }}</div>
                    <div v-else>{{ scope.row.createTime }}</div>
                </template>   
      </el-table-column>
      <el-table-column prop="account" label="最近操作账号" min-width="110" align="center">
            <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.account }}</div>
                    <div v-else>{{ scope.row.account }}</div>
                </template>   
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template scope="scope">
          <div v-if="scope.row.del==1">
          <el-button size="small" disabled @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" disabled size="small" @click="handleDel(scope.row.id)">已删除</el-button>
          </div>
           <div v-else>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
          </div>
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
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
        <el-form-item label="套系选择:" prop="setsystem">
          <el-select v-model="addForm.setsystem" placeholder="请选择套系分类" @change="changeBlockList(addForm.setsystem)" >
            <el-option
              v-for="item in strategyFrom"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题填写:" prop="title">
          <el-input
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="标题不超过12个汉字"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传封面图：" prop="cover_url">
          <el-upload
            class="avatar-uploader"
            action="/api/file/imageUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemoveAdd"
            :before-upload="beforeAvatarUpload"
            :http-request="fnUploadRequest"
          >
            <img v-if="addForm.cover_url" :src="addForm.cover_url" width="600px" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传视频:" prop="playAddress">
          <el-upload
            class="upload-demo"
            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
            accept=".mp4"
            :on-success="handleChangeAddAF"
            :on-remove="handleRemoveAddAF"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="playAddressFileList"
            :before-upload="beforeViewUpload"
          >
            <el-button size="small" type="primary">上传</el-button>
<!--             <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传</div>
 -->          </el-upload>
        </el-form-item> 
        <el-form-item label="是否同步策略板块:" prop="synchron">
            <el-radio-group  v-model="sl">
                <el-radio    v-for="(it, k) in strategy" :key="k"  :label="it.id" @change="is_Synchron(it.id,2)" >{{it.name}}</el-radio>
            </el-radio-group>
        </el-form-item>
          <el-form-item label="策略板块:" prop="platename" v-show="display">
            <el-checkbox  v-model="item.status" :disabled="item.dis ==1"  v-for="(item, k1) in blockList" :key="k1" :label="item.dict_value" ></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelEdit">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增页面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
            <el-form-item label="套系选择:" prop="setsystem">
          <el-select v-model="addForm.setsystem" placeholder="请选择套系分类" @change="changeBlockList(addForm.setsystem)" >
            <el-option
              v-for="item in strategyFrom"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题填写:" prop="title">
          <el-input 
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="标题不超过12个汉字"
          ></el-input>
        </el-form-item>
          <el-form-item label="上传封面图：" prop="cover_url">
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
        <el-form-item label="上传视频:" prop="playAddress">
          <el-upload
            class="upload-demo"
            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
            accept=".mp4"
            :on-success="handleChangeAddAF"
            :on-remove="handleRemoveAddAF"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="playAddressFileList"
            :before-upload="beforeViewUpload"
          >
            <el-button size="small" type="primary">上传</el-button>
<!--             <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传</div>-->
          </el-upload>
        </el-form-item> 
        <el-form-item label="是否同步策略板块:" prop="synchron">
            <el-radio-group v-model="sl">
                <el-radio    v-for="(it, k) in strategy" :key="k"  :label="it.id" @change="is_Synchron(it.id,1)">{{it.name}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="策略板块:" prop="platename" v-show="display">
            <el-checkbox  v-model="item.status" :disabled="item.dis ==1"  v-for="(item, k1) in blockList" :key="k1" :label="item.dict_value" ></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取消</el-button>
        <el-button type="primary" @click.native="addSubmit()" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="注水"
      :visible.sync="zhushuiVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="zhushuiObj"
        :rules="zhuShuiRules"
        ref="zhushuiObj"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="注水数"
          prop="Infuse"
        >
          <el-input
            type="Infuse"
            maxlength="8"
            v-model="zhushuiObj.Infuse"
            auto-complete="off"
            @keyup.native="infuseHandleClick"
            placeholder="请输入要注水数值"
            min="0"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <p>您确定为这些标题手动增加 <font
              size="5"
              color="red"
            >{{zhushuiObj.Infuse}}</font> 个注水数吗？</p>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="zhushuiVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="zhushuiSubmit()"
          :loading="editLoading"
        >提交</el-button>
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

      var checkname = (rule, value, callback) => {
          setTimeout(() => {
              if(this.addForm.title.match(/^[ ]*$/)){
                  callback(new Error("视频标题不能输入空格!"));
                  return false;
              } else {
                  callback();
              }
          }, 500);
      };

       var validateZhuShui = (rule, value, callback) => {
         var reg = /^\d{1,10}$/; //正规表达式对象
        if (reg.test(value)==false) {//汉字两个字节
            callback(new Error("注水数不能超过10位"));
        }else{
          callback();
        } 
      };
      var validatePass = (rule, value, callback) => {//验证标题12个汉子，或者24个字母
      var len = 0;
      for (var i = 0; i < value.length; i++) {
          var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {//汉字两个字节
           len+=2;
        }else{
           len+=1;
        }
      }
      if(len>24){
        callback(new Error("标题字数不能超过12个汉字"));
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
      ws:null,
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
        title: "",
        period: "",
        cover: "",
        //compere: "",
        //teacher: "",
        playAddress: "",
        synchron:"否"
        //audioLength: ""
      },
      query: {
        title: "",
        createTime: null,
        synchron: "",
        zhibiao: "", 
        min: null,
        max: null
      },
        queryForm: {
            title: "",
            createTime: null,
            synchron: "",
            zhibiao: "",
            min: null,
            max: null
        },
      targerList: [
        {
          id: 1,
          name: "点赞量总数"
        },
        {
          id: 2,
          name: "点赞量实数"
        }
      ],
      shiZhanList:[],
      //coverFileList: [],
      playAddressFileList: [],
      //teacherFrom: [],
      //compereFrom: [],
      strategyFrom:[],
      //AdvanceKnowList: [],
      //previewVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      addFormVisible: false, //新增界面是否显示
      //previewObj: {},
      zhushuiVisible: false,
      zhushuiObj: { Infuse: '' },
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
   /*      playAddress: [
          { required: true, message: "请选择语言文件", trigger: "change" }
        ], */
        period: [
          {
            type: "date",
            required: true,
            message: "请选择期数",
            trigger: "blur"
          }
        ]
      },
      zhuShuiRules:{
         Infuse:[
          { required: true, message: '请输入要注水数量'}
         ]
      },
      addFormRules: {
        setsystem: [
          { required: true, message: "请选择课程所属套系", trigger: "change" },
        ],
        title:[
          { required: true, message: "请填写视频标题", trigger: "change" },
          { validator: validatePass, trigger: 'change' },
            { validator: checkname, message: "视频标题不能输入空格!", trigger: ['change']}
          //{ min: 1, max: 12, message: "标题字数不能超过12个汉字", trigger: "change" }
        ],
        playAddress:[
          { required: true, message: "请填上传视频", trigger: "change" },
          {}//视频格式错误
        ],
        cover_url:[
          { required: true, message: "请上传课程封面图", trigger: "change" }
        ]
       /*  platename:[
          { required: true, message: "请选择同步该视频的板块名称", trigger: "blur" },
        ] */
      }
    };
  },
  methods: {
      cancelEdit() {
          this.editFormVisible = false
          if (this.ws) {
              this.ws.close();
          }
          this.editLoading = false;
      },
      cancel() {
          this.addFormVisible = false;
          if (this.ws) {
              this.ws.close();
          }
          this.editLoading = false;
      },
      handleClose() {
         this.$refs.addForm.clearValidate();
      },
      infuseHandleClick() {
        this.zhushuiObj.Infuse = this.zhushuiObj.Infuse.replace(/[^\d]/g,'');
      },
      minHandleClick() {
          this.query.min = this.query.min.replace(/[^\d]/g,'');
      },
      maxHandleClick() {
          this.query.max = this.query.max.replace(/[^\d]/g,'');
      },
    is_Synchron(id,addOrEdit){
      if(addOrEdit ==1){//区分添加和修改
       if(id == 1){
        this.display =true;
        //this.strategyBlockList();
      }else{
        this.display =false;
      }
      }else {
      if(id == 1){
        this.display =true;
      }else{
        this.display =false;
      }
      }
     
    },
    async changeBlockList(id){//根据id去查询jurisdiction权限 3星，4星
    this.strategyFrom.forEach(element => {
      if(element.id == id){
        if(element.jurisdiction== '免费'){
           this.strategyBlockListByKey(1);
        }else if(element.jurisdiction== '热点决策及以上'){
          this.strategyBlockListByKey(2);
        }else if(element.jurisdiction== '价值决策及以上'){
          this.strategyBlockListByKey(3);
        }else if(element.jurisdiction== '主力决策'){
          this.strategyBlockListByKey(4);
        }
      }
    });
    },
       async addSubmit() {

      this.$refs["addForm"].validate(async valid => {
        if (valid) {
            this.editLoading = true;
          if(this.sl == 1){
            this.addForm.synchron ='是'
          }else{
            this.addForm.synchron ='否'
          }
          var bankuai='';
          this.blockList.forEach(element => {
            if(element.status == 1){
              bankuai =bankuai+  element.dict_value+"、"
            }
          }); 
          if(bankuai.length== 0&&this.sl == 1){
            this.$message({
              message: "请选择同步该视频的板块名称",
              type: "error"
            });
            rerurn
          }
          if(bankuai.slice(bankuai.length-1)=='、'){
            this.addForm.platename=bankuai.slice(0,bankuai.length-1)
          }else{
            this.addForm.platename=bankuai
          }
        /*this.strategyFrom.forEach(element => {
            if(element.id == this.addForm.setsystem){
              //this.addForm.setsystemId =this.addForm.setsystem
              this.addForm.setsystem =element.title
            }
          }); */
          this.addForm.account = JSON.parse(sessionStorage.getItem('user')).name;
          if(this.display == false ){
           this.addForm.platename =null;
          }
          let res = await api.addShiZhanStrategy(this.addForm);
          if (res.state == true) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
          }
          this.addFormVisible = false;
            this.editLoading = false;
          this.shiZhanStrategyList();
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
     //  this.coverURL = "";

      // this.addForm.cover_url = "";
      //this.coverFileList = [];
    },
    beforeAvatarUpload(file) {
    const isJPG = file.type == 'image/jpeg';
    const isPNG = file.type == 'image/png';
    const isLt2M = file.size / 1024 / 1024 <= 0.1;
    if (!isJPG&&!isPNG) {
        this.$message.error('图片格式不正确，请重新上传!');
    }
    if (!isLt2M) {
        this.$message.error('图片大小不超过100KB，请重新上传');
    }
    return (isJPG || isPNG) && isLt2M;
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
      var para = {
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.shiZhanStrategyList(para);
    },
    async editSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
                   var bankuai='';
          this.blockList.forEach(element => {//拼接板块
            if(element.status == 1){
              bankuai =bankuai+  element.dict_value+"、"
            }
          }); 
            if(bankuai.length== 0&&this.sl == 1){
            this.$message({
              message: "请选择同步该视频的板块名称",
              type: "error"
            });
            rerurn
          }
          if(bankuai.slice(bankuai.length-1)=='、'){
            this.addForm.platename=bankuai.slice(0,bankuai.length-1)
          }else{
            this.addForm.platename=bankuai
          }
           if(this.sl == 1){
            this.addForm.synchron ='是'
          }else{
            this.addForm.synchron ='否'
            this.addForm.platename="";
          }
          this.strategyFrom.forEach(element => {
            if(element.title == this.addForm.setsystem){
              //this.addForm.setsystemId =this.addForm.setsystem
              this.addForm.setsystem = element.id
            }
          }); 
          if(this.display == false){
            this.addForm.platename =null;
          }
          this.addForm.account = JSON.parse(sessionStorage.getItem("user")).user_name;
          let res = await api.editShiZhanStrategy(this.addForm);
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
            var para = {
                pageNo: this.page
            }
          this.shiZhanStrategyList(para);
        }
      });
    },
    async handleEdit(scope, row) {      
      this.editFormVisible = true;
      this.selectStrategyList();
     if(row.synchron=="是"){
       this.sl =1;
       this.display =true;
      }else{
      this.sl =0;
      this.display =false;
      }
      this.addForm = Object.assign({}, row);  
      this.coverURL = this.addForm.cover_url;
      this.strategyFrom.forEach(element => {
        if(element.title == row.setsystem){
          if(element.jurisdiction== '免费'){
              this.strategyEditBlockListByKey(1,row)
          }else if(element.jurisdiction== '热点决策及以上'){
              this.strategyEditBlockListByKey(2,row)
          }else if(element.jurisdiction== '价值决策及以上'){
             this.strategyEditBlockListByKey(3,row)
          }else if(element.jurisdiction== '主力决策'){
            this.strategyEditBlockListByKey(4,row)
          }
        }
      });
      //});
      this.playAddressFileList = [
        { name: row.playAddress, url: row.playAddress }
      ];
    },
    async handleAdd() {
      this.coverURL = '';
      this.addFormVisible = true;
      this.display =false;
      this.selectStrategyList();
      this.sl =0;
      this.addForm = { ...{} };
     // this.coverFileList = [];
     this.blockList=[];
      this.playAddressFileList = [];
      this.strategyBlockList();//获取策略板块
      //this.$refs["addForm"].resetFields();
    },
    async handleDel(id) {
      this.$confirm("若删除该视频不可恢复,确定删除该视频吗?", "提示", {
        type: "warning"
      }).then(async () => {
        let res = await api.deleteShiZhanStrategy(id);
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
        var para = {
                pageNo: this.page
        }
        this.shiZhanStrategyList(para);
      });
    },
    async queryList () {
        this.query.title = this.queryForm.title;
        this.query.createTime = this.queryForm.createTime;
        if (this.queryForm.createTime) {
            this.query.createTime = this.queryForm.createTime + " 00:00";
        }
        this.query.synchron = this.queryForm.synchron;
        this.query.zhibiao = this.queryForm.zhibiao;
        this.query.min = this.queryForm.min;
        this.query.max = this.queryForm.max;
        this.shiZhanStrategyList();
    },
    async shiZhanStrategyList(para){
      if (para) {
          this.query.page = para.pageNo;
      } else {
          this.query.page = 1;
      }
      this.query.pageSize = this.pageSize;
    let res =  await api.shiZhanStrategyList(this.query);
    debugger
    this.shiZhanList=res.data.result;
    this.total = res.data.total;
    this.currentPage = res.data.page;
    },
     async selectStrategyList() {
      let res = await api.findShiZhanManageListAll();
      this.strategyFrom = res.data;
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
      debugger;
      this.ws = ws;
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
      isDisabled(row, index) {
            if (row.del == 1) {
                return 0;
            } else {
                return 1;
            }
      },
    async handleInfuse(type, b) {
   

      if (this.sels.length != 0) {
        this.zhushuiObj.Infuse =null;
        this.zhushuiVisible = true;
        //this.InfuseType = type;
        //this.channel = b;
      } else {
        this.$message({
          message: " 选择一条数据",
          type: "warning"
        });
      }
      this.$nextTick(() => {
        this.$refs.zhushuiObj.clearValidate();
      });
    },
    async zhushuiSubmit() {
      this.$refs.zhushuiObj.validate(async valid => {
        this.setInfuse();
        if (valid) {
          if(this.sels[0].like<0){
              this.$message({
              message: "不可以输入负数 ",
              type: "error"
            });
          }else{
                let res = await api.shiZhanStrategyZhuShui(this.sels);
          if (res.state == true) {
            this.$message({
              message: "注水成功",
              type: "success"
            });
            this.zhushuiVisible = false;
          } else {
            this.$message({
              message: "注水失败",
              type: "error"
            });
          }
          this.zhushuiObj.Infuse = null;
              var para = {
                  pageNo: this.page
              }
          this.shiZhanStrategyList(para);
          }
        }
      });
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
    this.shiZhanStrategyList();
    this.selectStrategyList();
    //this.loadAdvanceKnowList();
    //this.selectTeacherList();
    //this.selectCompereList();
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