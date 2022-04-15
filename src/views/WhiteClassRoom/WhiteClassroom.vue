<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" >
            <el-form :inline="true" >
                <el-form-item>
                    <el-input v-model="query.title" placeholder="请输入标题关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker type="date" placeholder="选择日期" v-model="query.queryTime" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-select v-model="query.teacher" placeholder="请选择老师">
                    <el-option
                    v-for="item in teacherFrom"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
              
                
            </el-form>
            <el-form :inline="true" >
                <el-select v-model="query.targer" placeholder="请选择指标">
                    <el-option  
                    v-for="item in targerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 <el-form-item>
                    <el-input v-model="query.min" placeholder="请输入指标最低"></el-input>
                </el-form-item>
                 <el-form-item>
                    <el-input v-model="query.max" placeholder="请输入指标最高"></el-input>
                </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="getKtWhiteClassroomList()">查询</el-button>
                </el-form-item>
             </el-form>
        </el-col>
         <el-col :span="24" class="toolbar" >
                    <el-button type="primary"  @click="handleAdd()">新增</el-button>


             <el-button type="primary"  @click="handleInfuse(0,0)">点赞量注水-源达</el-button>
             <el-button type="primary"  @click="handleInfuse(1,0)">播放量注水-源达</el-button>

             <el-button type="primary"  @click="handleInfuse(0,1)">点赞量注水-财源</el-button>
             <el-button type="primary"  @click="handleInfuse(1,1)">播放量注水-财源</el-button>
             </el-col>
        <!--列表-->
        <el-table :data="AdvanceKnowList"   style="width: 100%;" v-loading="listLoading" @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column prop="period" label="期数" min-width="100" >
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" >
            </el-table-column>
            <el-table-column prop="setName" label="所属套系" min-width="100" >
            </el-table-column>
            <el-table-column prop="teacher" label="老师" min-width="100" >
            </el-table-column>

            <el-table-column label="播放量-源达.实数|总数|公众号" width="160">
                <template scope="scope">
                    <span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
                    |
                    <span>{{ scope.row.view }}</span>
                     |
                    <span>{{ scope.row.view_gzh }}</span>
                </template>
            </el-table-column>

            <el-table-column label="点赞量-源达.实数|总数|公众号" width="160">
                <template scope="scope">
                    <span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
                    |
                    <span>{{ scope.row.like }}</span>
                     |
                    <span>{{ scope.row.like_gzh }}</span>
                </template>
            </el-table-column>


            <el-table-column label="播放量-财源.实数|总数" width="160">
                <template scope="scope">
                    <span v-bind:class="{active: (scope.row.viewRCy)}">{{ scope.row.viewRCy }}</span>
                    |
                    <span>{{ scope.row.viewCy }}</span>

                </template>
            </el-table-column>

            <el-table-column label="点赞量-财源.实数|总数" width="160">
                <template scope="scope">
                    <span v-bind:class="{active: (scope.row.likeRCy)}">{{ scope.row.likeRCy }}</span>
                    |
                    <span>{{ scope.row.likeCy }}</span>

                </template>
            </el-table-column>




            <!--  <el-table-column prop="title" label="播放实数/总数" min-width="100" :formatter="formatview"  >
              </el-table-column>
              <el-table-column prop="jianJie" label="点赞实数/总数" min-width="100" :formatter="formatlike"  >
              </el-table-column>-->
            <el-table-column prop="share" label="源达.分享数" min-width="100" >
            </el-table-column>
            <el-table-column prop="shareCy" label="财源.分享数" min-width="100" >
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间"   :formatter="timeFormat"sortable width="160" >
            </el-table-column>
            <el-table-column label="编辑" width="200">
                <template scope="scope">
                    <el-button size="small"   @click="handleEdit(scope.row.whiteClassroomId)">修改</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.row.whiteClassroomId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.query.pageSize layout="total, prev, pager, next, jumper" :total=this.total style="text-align: center;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="编辑" :visible.sync="addFormVisible"  :close-on-click-modal="false" width="50%">
            <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
               <el-form-item label="选择套系" prop="setId">
                <el-select v-model="addForm.setId" placeholder="请选择选择套系"  :disabled="!editOrAdd" @change="selectChange">
                    <el-option
                    v-for="item in ktSetFrom"
                    :key="item.setId"
                    :label="item.name"
                    :value="item.setId">
                    </el-option>
                </el-select>
                 </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="addForm.title" auto-complete="off" style="width:300px;" placeholder="(限20个字以内)" ></el-input>
                </el-form-item>
                <el-form-item label="期数" prop="period">
                    <!-- <el-date-picker
                    v-model="addForm.period"
                    type="date"
                    format="MM-dd"
                    value-format="MM-dd"
                    placeholder="选择日期">
                    </el-date-picker> -->
                    <el-input-number v-model="addForm.period" controls-position="right"   :min="1" ></el-input-number>
                </el-form-item>
                <el-form-item label="图片文件" prop="cover">
                    <el-upload  class="upload-demo" action="/api/file/imageUpload/" accept=".jpg,.png"   :on-success="handleChangeAddTP" :on-remove="handleRemoveAddTP" :limit="1" :on-exceed="handleExceed" :file-list="coverFileList">
                          <el-button size="small" type="primary">点击上传图片</el-button>
                          <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传jpg/png图片文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="图片名称" prop="cover" style="display: none" >
                    <el-input   v-model="addForm.cover"></el-input>
                </el-form-item>
                
                 <el-form-item label="老师"  prop="teacher">
                <el-select v-model="addForm.teacher" placeholder="请选择老师">
                    <el-option
                    v-for="item in teacherFrom"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 </el-form-item>
                  <el-form-item label="课程简介" prop="content">
                    <el-input  type="textarea" v-model="addForm.content" auto-complete="off"></el-input>
                  </el-form-item>
                 <el-form-item label="视频文件" prop="playAddress">
                    <el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
                          <el-button size="small" type="primary">点击上传视频</el-button>
                          <div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上视频</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="视频文件" prop="playAddress" style="display: none" >
                    <el-input   v-model="addForm.playAddress"></el-input>
                </el-form-item>

                <el-form-item label="创建日期"  >
                    <el-date-picker
                            v-model="addForm.create_time"
                            type="date"
                            placeholder="选择创建日期">
                    </el-date-picker>
                    <font v-if="true" size="3" color="gray">{{"如果需要录入旧数据请选择该课程的创建时间,正常录入数据无需选择!"}}</font>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false;clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    	<el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
      <el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
        <el-form-item label="注水数" prop="Infuse" :rules="[
          { required: true, message: '不能为空'},
          { type: 'number', message: '必须为数字值'}
        ]">
      <el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" ></el-input>
      </el-form-item>
      	<el-form-item>
					<p>您确定为这些标题手动增加  <font size="5" color="red">{{zhushuiObj.Infuse}}</font>    个注水数吗？</p>
				</el-form-item>
    </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="zhushuiVisible = false">取消</el-button>
				<el-button type="primary" @click.native="zhushuiSubmit()" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
    </section>
</template>

<script>
import {imageDefault} from "../../common/js/urls";
import util from "../../common/js/util";
import api from "../../api/api.js";
export default {
  data() {
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
      InfuseType: null,

        channel:"",
      total: 0,
      pageSize: 15,
      currentPage: 1,
      listLoading: false,
      editOrAdd: true,
      sels: [], //列表选中列
      //编辑界面数据
      editForm: {},
      //新增界面数据
      addForm: {
        title: "",
        period: "",
        cover: "",
        setId: "",
        teacher: "",
        playAddress: "",
        content: "",
        videoLength:""
      },
      query: {
        title: "",
        compere: "",
        teacher: "",
        queryTime: "",
        targer: "",
        min: null,
        max: null,
        pageNo: 1,
        pageSize: 15,
      },
      targerList: [
        {
          id: 1,
          name: "浏览量"
        },
        {
          id: 2,
          name: "点赞量"
        }
      ],
      coverFileList: [],
      playAddressFileList: [],
      teacherFrom: [],
      ktSetFrom: [],
      AdvanceKnowList: [],
      previewVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      addFormVisible: false, //新增界面是否显示
      previewObj: {},
      zhushuiVisible: false,
      zhushuiObj: { Infuse: null },
      addFormRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            validator: numbers,
            message: "内容超出限制",
            trigger: "blur",
            num: 40
          }
        ],
        teacher: [
          { required: true, message: "请输入直播老师", trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请选择图片文件", trigger: "change" }
        ],
        playAddress: [
          { required: true, message: "请选择语言文件", trigger: "change" }
        ],
        setId:[{ required: true, message: "请选择套系", trigger: "change" }],
        period: [
          {
            required: true,
            message: "请选择期数",
            trigger: "blur"
          }
        ],
        content: [
          { required: true, message: "请添加课程简介！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      async addSubmit() {
         this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                      this.editLoading = true
                      if (this.editOrAdd) {
                        await api.addKtWhiteClassroom(this.addForm);
                      } else {
                        await api.updateKtWhiteClassroom(this.addForm);
                      }
                        this.addFormVisible = false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.editLoading = false;
                        //setTimeout("window.location.reload()",600);
                        this.getKtWhiteClassroomList();
                   });
                }
      });
         
    },
    async handleEdit(id) {
      this.addFormVisible = true;
      this.editLoading=true;
      let res = await api.getKtWhiteClassroom(id);
      this.addForm = { ...res };
      this.coverFileList = [{ name: res.cover, url: res.cover }];
      this.playAddressFileList = [
        { name: res.playAddress, url: res.playAddress }
      ];
      this.editOrAdd = false;
      this.editLoading=false;
      this.$refs["addForm"].resetFields();
    },
    async handleAdd() {
      this.query.pageNo = 1
      let res = await api.getKtWhiteClassroomList(this.query)
      this.addFormVisible = true;
      this.addForm = { ...{} };
      this.$set(this.addForm,'period',~~res.list[0].period + 1)
      this.coverFileList = [];
      this.playAddressFileList = [];
      this.editOrAdd = true;
      this.$refs["addForm"].resetFields();
      this.query.pageSize = 15
    },
    async handleDel(id) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      }).then(async () => {
        let res = await api.deleteKtWhiteClassroom(id);
          if (res.success == true) {
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
         this.getKtWhiteClassroomList();
      });
    },
    async getKtWhiteClassroomList() {
      let res = await api.getKtWhiteClassroomList(this.query);
      this.AdvanceKnowList = res.list;
      this.total = res.total;
    },
    async selectTeacherList() {
      let res = await api.selectPersonList({ flag: 0 });
      this.teacherFrom = res;
    },
    async selectktSetList() {
      let res = await api.getKtSetList({delFlag:true});
      this.ktSetFrom = res;
    },
    formatview(row, column) {
      return row.viewR + "/" + row.view;
    },
    formatlike(row, column) {
      return row.likeR + "/" + row.like;
    },
    handleChangeAddTP(response, file, fileList) {
      this.addForm.cover = imageDefault+response.message;
    },
    handleRemoveAddTP(response, file, fileList) {
       this.addForm.cover = ""
    },
    handleChangeAddAF(response, file, fileList) {
        this.editLoading = true;
      let _this = this;
      var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
      ws.onopen = function() {
      ws.send(JSON.stringify(response))
      }
      ws.onmessage  = function (evt){
          _this.editLoading = false;
        let res = JSON.parse(evt.data);
        _this.addForm.playAddress = res.origUrl
        _this.addForm.videoLength = res.durationMsec
        ws.close(); 
      }
      
    },
    handleRemoveAddAF(response, fileList) {
      this.addForm.playAddress = ""
      this.addForm.videoLength = ""
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件~`);
    },
    async handleInfuse(type,b) {
      if (this.sels.length != 0) {
        this.zhushuiVisible = true;
        this.InfuseType = type;
        this.channel = b
      } else {
        this.$message({
          message: " 选择一条数据",
          type: "warning"
        });
      }
    },
    async zhushuiSubmit() {
      this.editLoading=true;
      this.$refs.zhushuiObj.validate(async valid => {
        this.setInfuse(this.InfuseType,this.channel);
        if (valid) {
          let res = await api.KtWCLikeOrView(this.sels);
          if (res.success) {
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
          this.editLoading=false;
          this.zhushuiObj.Infuse = 0;
          this.getKtWhiteClassroomList();
        }
      });
    },
    handleSelectionChange(val) {
      this.sels = val;
    },
    setInfuse(type,b) {
      if (type === 0) {
        this.sels.forEach(a => {
            a.like = ~~this.zhushuiObj.Infuse
            a.view = 0;
            a.channel = b;
        });
      } else {
        this.sels.forEach(a => {
          a.view = ~~this.zhushuiObj.Infuse;
          a.like = 0;
          a.channel = b;
        });
      }
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
    timeFormat(row, column){
        var timestamp = new Date(row.createTime);//直接用 new Date(时间戳) 格式转化获得当前时间
        return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
    },
    async selectChange(){
       let res = await api.getKtSetList({setId:this.addForm.setId})
       this.$set(this.addForm,'content',res[0].content)
    },
    handleCurrentChange(val){
     this.query.pageNo = val
     this.getKtWhiteClassroomList();
    }
  },
  mounted() {
    this.getKtWhiteClassroomList();
    this.selectTeacherList();
    this.selectktSetList();
  }
};
</script>
<style  >
    .active {
        color:blue;
    }
</style  >