<template>
  <section>
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
    >
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="queryform.title"
            placeholder="请输入标题关键字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="queryform.createTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-select
          clearable
          v-model="queryform.compere"
          placeholder="请选择主持人"
        >
          <el-option
            v-for="item in compereFrom"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-select
           clearable
          v-model="queryform.teacher"
          placeholder="请选择嘉宾"
        >
          <el-option
            v-for="item in teacherFrom"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>

        </el-select>

      </el-form>
      <el-form :inline="true">
        <el-select
          clearable
          v-model="queryform.targer"
          placeholder="请选择指标"
        >
          <el-option
            v-for="item in targerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-form-item>
          <el-input
            v-model="queryform.min"
            @keyup.native="minHandleClick"
            placeholder="请输入指标最低"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryform.max"
            @keyup.native="maxHandleClick"
            placeholder="请输入指标最高"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="findAdvanceKnowList()"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col
      :span="24"
      class="toolbar"
    >
      <el-button
        type="primary"
        @click="handleAdd()"
      >新增</el-button>
      <el-button
        type="primary"
        @click="handleInfuse(0,6)"
      >点赞量注水</el-button>
      <el-button
        type="primary"
        @click="handleInfuse(1,0)"
      >播放量注水</el-button>

      <!--<el-button
        type="primary"
        @click="handleInfuse(0,1)"
      >点赞量注水-财源</el-button>
      <el-button
        type="primary"
        @click="handleInfuse(1,1)"
      >播放量注水-财源</el-button>-->
    </el-col>

    <!--列表-->
    <el-table
      :data="AdvanceKnowList"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="period"
        label="期数"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        prop="compere"
        label="主持人"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="teacher"
        label="嘉宾"
        min-width="100"
      >
      </el-table-column>
      <!-- <el-table-column prop="title" label="播放实数/总数" min-width="100" :formatter="formatview"  >
            </el-table-column>
            <el-table-column prop="jianJie" label="点赞实数/总数" min-width="100" :formatter="formatlike"  >
            </el-table-column>-->

     <!-- <el-table-column
        label="播放量-源达.实数|总数|公众号"
        width="160"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
          |
      <span>{{ scope.row.view }}</span>
          |
        <span>{{ scope.row.view_gzh }}</span>

        </template>
      </el-table-column>

      <el-table-column
        label="点赞量-源达.实数|总数|公众号"
        width="160"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
          |
 <span>{{ scope.row.like }}</span>
           |
          <span>{{ scope.row.like_gzh }}</span>   

        </template>
      </el-table-column>-->

      <el-table-column
        label="播放量-实数|总数"
        width="190"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
          |
          <span>{{ scope.row.view }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="点赞量.实数|总数"
        width="190"
      >
        <template scope="scope">
          <span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
          |
          <span>{{ scope.row.like }}</span>

        </template>
      </el-table-column>

      <el-table-column
        prop="share"
        label="分享数"
        min-width="160"
      >
      </el-table-column>
      <!--<el-table-column
        prop="shareCy"
        label="财源.分享数"
        min-width="100"
      >
      </el-table-column>-->
      <el-table-column
        prop="createTime"
        label="添加时间"
        sortable
        width="166"
      >
      </el-table-column>
     <!-- <el-table-column
        prop="jianJie"
        label="状态"
        min-width="100"
      >
      </el-table-column>-->
      <el-table-column
        label="操作"
        width="200"
      >
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row.advanceKnowId)"
          >修改</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.row.advanceKnowId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size=this.pageSize
      layout="total, prev, pager, next, jumper"
      :total=this.total
    ></el-pagination>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        :model="addForm"
        label-width="110px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="(限20个字以内)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="期数"
          prop="period"
        >
          <el-date-picker
            v-model="addForm.period"
            type="date"
            format="MM-dd"
            value-format="MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="图片文件"
          prop="cover"
        >
          <el-upload
            class="upload-demo"
            action="/api/file/imageUpload/"
            accept=".jpg,.png"
            :on-success="handleChangeAddTP"
            :on-remove="handleRemoveAddTP"
            :limit="1"
            :before-upload="beforeJpgUpload"
            :on-exceed="handleExceed"
            :file-list="coverFileList"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传图片</el-button>
            <div
              style="float: right;margin-left: 15px;"
              class="el-upload__tip"
            >上传jpg/png图片文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="图片名称"
          prop="cover"
          style="display: none"
        >
          <el-input v-model="addForm.cover"></el-input>
        </el-form-item>
        <el-form-item label="主持人">
          <el-select
            v-model="addForm.compere"
            placeholder="请选择主持人"
          >
            <el-option
              v-for="item in compereFrom"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="嘉宾"
          prop="teacher"
        >
          <el-select
            v-model="addForm.teacher"
            placeholder="请选择嘉宾"
          >
            <el-option
              v-for="item in teacherFrom"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="语音文件"
          prop="playAddress"
        >
          <el-upload
            class="upload-demo"
            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
            accept=".mp4"
            :on-success="handleChangeAddAF"
            :on-remove="handleRemoveAddAF"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="playAddressFileList"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传语言</el-button>
            <div
              style="float: right;margin-left: 15px;"
              class="el-upload__tip"
            >点击上传语言</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="语音地址"
          prop="playAddress"
          style="display: none"
        >
          <el-input v-model="addForm.playAddress"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
        >提交</el-button>
      </div>
    </el-dialog>
    <!--新增页面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        :model="addForm"
        label-width="110px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="addForm.title"
            auto-complete="off"
            style="width:300px;"
            placeholder="(限20个字以内)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="期数"
          prop="period"
        >
          <el-date-picker
            v-model="addForm.period"
            type="date"
            format="MM-dd"
            value-format="MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="图片文件"
          prop="cover"
        >
          <el-upload
            class="upload-demo"
            action="/api/file/imageUpload/"
            accept=".jpg,.png"
            :on-success="handleChangeAddTP"
            :on-remove="handleRemoveAddTP"
            :before-upload="beforeJpgUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="coverFileList"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传图片</el-button>
            <div
              style="float: right;margin-left: 15px;"
              class="el-upload__tip"
            >上传jpg/png图片文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="图片名称"
          prop="cover"
          style="display: none"
        >
          <el-input v-model="addForm.cover"></el-input>
        </el-form-item>
        <el-form-item label="主持人">
          <el-select
            v-model="addForm.compere"
            placeholder="请选择主持人"
          >
            <el-option
              v-for="item in compereFrom"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="嘉宾"
          prop="teacher"
        >
          <el-select
            v-model="addForm.teacher"
            placeholder="请选择嘉宾"
          >
            <el-option
              v-for="item in teacherFrom"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="语音文件"
          prop="playAddress"
        >
          <el-upload
            class="upload-demo"
            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
            accept=".mp4"
            :on-success="handleChangeAddAF"
            :on-remove="handleRemoveAddAF"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="playAddressFileList"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传语言</el-button>
            <div
              style="float: right;margin-left: 15px;"
              class="el-upload__tip"
            >点击上传语言</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="语音地址"
          prop="playAddress"
          style="display: none"
        >
          <el-input v-model="addForm.playAddress"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit()"
          :loading="editLoading"
        >提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="注水"
      :visible.sync="zhushuiVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="zhushuiObj"
        ref="zhushuiObj"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="注水数"
          prop="Infuse"
          :rules="[
          { required: true, message: '不能为空'}
        ]"
        >
          <el-input
            type="Infuse"
            v-model.number="zhushuiObj.Infuse"
            @keyup.native="zhuShuiHandleClick"
            auto-complete="off"
            placeholder="请输入增加数量"
            min="0"
            maxLength="8"
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
        <el-button @click.native="clearZhuShui()">取消</el-button>
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
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      var len = 0;
      for (var i = 0; i < value.length; i++) {
        var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {//汉字两个字节
          len+=2;
        }else{
          len+=1;
        }
      }
      if(len > 40){
        callback(new Error("标题字数不能超过20个汉字"));
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
      InfuseType: null,
      channel: "",
      total: 0,
      page: 1,
      pageSize: 15,
      currentPage: 1,
      listLoading: false,
      editLoading: false,
      sels: [], //列表选中列
      //编辑界面数据
      editForm: {},
      //新增界面数据
      addForm: {
        title: "",
        period: "",
        cover: "",
        compere: "",
        teacher: "",
        playAddress: "",
        audioLength: ""
      },
      query: {
        title: "",
        compere: "",
        teacher: "",
        createTime: "",
        targer: "",
        min: null,
        max: null
      },
      queryform: {
        title: "",
        compere: "",
        teacher: "",
        createTime: "",
        targer: "",
        min: null,
        max: null
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
      compereFrom: [],
      AdvanceKnowList: [],
      previewVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      addFormVisible: false, //新增界面是否显示
      previewObj: {},
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
        teacher: [
          { required: true, message: "请输入直播老师", trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请选择图片文件", trigger: "change" }
        ],
        playAddress: [
          { required: true, message: "请选择语言文件", trigger: "change" }
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
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { validator: validatePass, trigger: ['change', 'blur'] }
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
        period: [
          {
            required: true,
            message: "请选择期数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    clearZhuShui() {
      this.$refs.zhushuiObj.clearValidate();
      this.zhushuiObj.Infuse = '';
      this.zhushuiVisible = false
    },
    zhuShuiHandleClick() {
      this.zhushuiObj.Infuse = this.zhushuiObj.Infuse.replace(/[^\d]/g,'');
    },
    minHandleClick() {
      this.query.min = this.query.min.replace(/[^\d]/g,'');
    },
    maxHandleClick() {
      this.query.max = this.query.max.replace(/[^\d]/g,'');
    },
    handleClose() {
      this.$refs.addForm.clearValidate();
    },
    async addSubmit() {
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          let res = await api.addAdvanceKnow(this.addForm);
          debugger;
          if (res.state == true) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "添加失败(请检查是否录入数据，早知晓默认为一天一条)",
              type: "error"
            });
          }
          this.addFormVisible = false;
          this.loadAdvanceKnowList();
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      var para = {
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.loadAdvanceKnowList(para);
      console.log(this.page);
    },
    async editSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await api.updateAdvanceKnow(this.addForm);
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
          this.loadAdvanceKnowList();
        }
      });
    },
    async handleEdit(scope, id) {
      this.editFormVisible = true;
      let res = await api.getAdvacnceKnow(id);
      res = res.data;
      this.addForm = { ...res };
      this.coverFileList = [{ name: res.cover, url: res.cover }];
      this.playAddressFileList = [
        { name: res.playAddress, url: res.playAddress }
      ];
    },
    async handleAdd() {
      this.addFormVisible = true;
      this.addForm = { ...{} };
      this.coverFileList = [];
      this.playAddressFileList = [];
      this.$refs["addForm"].resetFields();
    },
    async handleDel(id) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      }).then(async () => {
        let res = await api.deleteAdvanceKnow(id);
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
        this.loadAdvanceKnowList();
      });
    },
    async findAdvanceKnowList() {
        this.query.title = this.queryform.title;
        this.query.compere = this.queryform.compere;
        this.query.teacher = this.queryform.teacher;
        this.query.createTime = this.queryform.createTime;
        this.query.targer = this.queryform.targer;
        this.query.min = this.queryform.min;
        this.query.max = this.queryform.max;
        this.query.pageNo = 1;
        this.page = 1;
        this.loadAdvanceKnowList();
    },
    async loadAdvanceKnowList() {
      (this.query.pageNo = this.page),
        (this.query.pageSize = this.pageSize),
        console.log(this.query);
      let res = await api.getAdvanceKnowList(this.query);
      this.AdvanceKnowList = res.list;
      this.total = res.total;
    },
    async selectTeacherList() {
      let res = await api.selectPersonList({ flag: 0 });
      this.teacherFrom = res;
    },
    async selectCompereList() {
      let res = await api.selectPersonList({ flag: 1 });
      this.compereFrom = res;
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
      this.$refs.addForm.clearValidate('cover');
    },
    handleRemoveAddTP(response, file, fileList) {},
    handleChangeAddAF(response, file, fileList) {

      this.editLoading = true;

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
        _this.addForm.audioLength = data.durationMsec;

        ws.close();
      };
      ws.onclose = function() {
        console.log("连接已关闭...");
      };
    },
    handleRemoveAddAF(response, fileList) {
      this.addForm.playAddress = "";
      this.addForm.audioLength = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件~`);
    },
    beforeJpgUpload(file) {
      debugger;
      const isJPG = file.type == 'image/jpeg';
      const isPNG = file.type == 'image/png';
      const isLt2M = file.size / 1024 / 1024 <= 0.5;
      if (!isJPG&&!isPNG) {
        this.$message.error('图片格式不正确，请重新上传!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传封面图图片大小不能超过500KB！');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    beforeAvatarUpload(file) {
      const isMP4 = file.type === 'video/mp4';
      if (!isMP4) {
        this.$message.error('上传文件格式错误');
      }
      return isMP4;
    },
    async handleInfuse(type, b) {
      if (this.sels.length != 0) {
        this.zhushuiVisible = true;
        this.InfuseType = type;
        this.channel = b;
      } else {
        this.$message({
          message: " 选择一条数据",
          type: "warning"
        });
      }
    },
    async zhushuiSubmit() {
      this.$refs.zhushuiObj.validate(async valid => {
        this.setInfuse(this.InfuseType, this.channel);
        if (valid) {
          let res;
          debugger;
          if (this.InfuseType === 0) {
            res = await api.updateLike(this.sels);
          } else {
            res = await api.updateView(this.sels);
          }
          if (res.state) {
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
          this.zhushuiObj.Infuse = 0;
          this.loadAdvanceKnowList();
        }
      });
    },
    handleSelectionChange(val) {
      this.sels = val;
    },
    setInfuse(type, b) {
      if (type === 0) {
        this.sels.forEach(a => {
          a.like = Number(this.zhushuiObj.Infuse);
          a.view = 0;
          a.channel = b;
        });
      } else {
        this.sels.forEach(a => {
          a.view = Number(this.zhushuiObj.Infuse);
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
    }
  },

  mounted() {
    this.loadAdvanceKnowList();
    this.selectTeacherList();
    this.selectCompereList();
  }
};
</script>
<style  >
.active {
  color: blue;
}
</style  >