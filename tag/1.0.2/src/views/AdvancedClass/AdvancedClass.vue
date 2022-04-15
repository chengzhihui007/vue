<template>
  <section>
    <!--工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px;"
    >
      <el-form
        :inline="true"
        :model="filters"
      >
        <el-form-item>
          <el-input
            v-model="filters.title"
            placeholder="请输入标签关键字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.teacher"
            placeholder="请选择老师"
          >
            <el-option
              v-for="list in teacherFrom"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.datetime"
            type="datetime"
            placeholder="发布时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="filters.type"
            placeholder="请选择指标"
          >
            <el-option
              label="请选择"
              value=""
            ></el-option>
            <el-option
              label="点赞量"
              value="like"
            ></el-option>
            <el-option
              label="播放量"
              value="view"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="filters.min"
            placeholder="请输入最低指标"
          ></el-input>
        </el-form-item>
        <el-form-item>
          -
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.max"
            placeholder="请输入最高指标"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getList()"
          >查询</el-button>
        </el-form-item>

        <div>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleAdd"
            >新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              v-if=" username!=='quanzi1'"
              @click.native="batchLikeView('like','批量点赞')"
            >批量点赞</el-button>
            <el-button
              type="primary"
              v-if=" username!=='quanzi1'"
              @click.native="batchLikeView('view','批量浏览')"
            >批量浏览</el-button>
          </el-form-item>
        </div>
      </el-form>

    </el-col>

    <!--列表-->
    <el-table
      ref="multipleTable"
      :data="datas"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        prop="period"
        label="期数"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        min-width="200"
      ></el-table-column>
      <!--<el-table-column prop="teacher_name" label="老师" min-width="100"></el-table-column>-->
      <el-table-column
        prop="view"
        label="播放总数"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="like"
        label="点赞总数"
        min-width="100"
      ></el-table-column>
      <!--<el-table-column prop="comment" label="分享数" min-width="100"></el-table-column>-->
      <el-table-column
        prop="create_time"
        label="发布时间"
        min-width="100"
      ></el-table-column>
      <el-table-column
        label="操作"
        min-width="150"
      >
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col
      :span="24"
      class="toolbar"
    >
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size=this.pageSize
        layout="total, prev, pager, next, jumper"
        :total=this.total
      >
      </el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog
      :title=dialogTitle
      :visible.sync="FormVisible"
      v-loading="editLoading"
      :close-on-click-modal="false"
      v-on:close="clearEdit"
      width="50%"
    >
      <el-form
        :model="addForm"
        label-width="110px"
        :rules="editFormRules"
        ref="addForm"
      >

        <el-form-item
          label="类型："
          prop="teacher_name"
        >
          <el-select
            label="类型"
            v-model="addForm.teacher_name"
            placeholder="请选择类型"
            @change="changelaoshi(addForm.teacher_name)"
          >
            <el-option
              v-for="(list,index) in teacherFrom"
              :key="index"
              :label="list.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="期数："
          prop="period"
        >
          <!--                    <el-date-picker
                            v-model="addForm.period"
                            type="date"
                            format="MM-dd"
                            value-format="MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>-->
          <el-input
            v-model="addForm.period"
            auto-complete="off"
            style="width:100px;"
          ></el-input>期
        </el-form-item>

        <el-form-item
          label="标题："
          prop="title"
        >
          <el-input
            v-model="addForm.title"
            auto-complete="off"
            placeholder="不超过20个汉字"
            style="width:500px;"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="封面图片"
          prop="pic_url"
        >
          <el-upload
            class="upload-demo"
            action="/api/file/imageUpload/"
            accept=".jpg,.png"
            :limit="1"
            :on-success="fileSuccess"
            :on-error="fileError"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
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
          label="课程简介："
          prop="content"
        >
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="addForm.content"
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="MP4文件:"
          prop="play_address"
        >
          <el-upload
            class="upload-demo"
            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
            accept=".mp4"
            :limit="1"
            :on-success="MP4fileSuccess"
            :on-error="fileError"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList_pdf"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传MP4文件</el-button>
            <div
              style="float: right;margin-left: 15px;"
              class="el-upload__tip"
            >上传MP4文件</div>
          </el-upload>

        </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="FormVisible = false; clearEdit()">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit()"
          :loading="editLoading"
        >提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="BatchViewDialogTitle"
      :visible.sync="BatchViewDialogVisible"
    >
      <el-form
        :model="viewlikeFrom"
        ref="viewlikeFrom"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="注水数"
          prop="count"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            type="number"
            v-model="viewlikeFrom.count"
            placeholder="请输入添加数量"
            v-on:input="viewEvent(viewlikeFrom.count)"
            style="width:220px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <p>您确定为这些标题手动增加 <font
              size="5"
              color="red"
            >{{viewlikeFrom.count}}</font> 个浏览吗？</p>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        center="true"
      >
        <el-button @click="BatchViewDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="batchViewSubmit()"
        >确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
import { imageDefault, pdfDefault } from "../../common/js/urls";
import {
  AdvancedClassList,
  AdvancedClassSave,
  AdvancedClassUpdate,
  AdvancedClassDel
} from "../../api/cyApi.js";
/*    import util from '../../common/js/util';
    import api from '../../api/api.js';*/
export default {
  data() {
    var checktitle = (rule, value, callback) => {
      setTimeout(() => {
        if (this.strlen(value) > rule.num) {
          callback(new Error("字数超过限制！"));
        } else {
          callback();
        }
      }, 500);
    };
    var checknumbers = (rule, value, callback) => {
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          console.log("fds");
        }
      }, 1000);
    };

    return {
      options: [],
      value: "",
      filters: {
        title: "",
        type: "",
        teacher: "",
        createTime: "",
        min: "",
        max: ""
      },
      BatchViewDialogTitle: "",
      BatchViewDialogVisible: false,
      viewlikeFrom: {
        type: "",
        count: ""
      },
      datas: [],
      total: 0,
      page: 1,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,

      sels: [], //列表选中列
      FormVisible: false,

      //编辑界面数据
      editForm: {},
      //新增界面数据
      addForm: {},
      fileList: [],
      fileList_pdf: [],

      username: "",
      setVisible: false,
      dialogTitle: "新增",
      setForm: {},
      radio: "1",
      editOrAdd: false,
      editLoading: false,
      teacherFrom: [],
      teachername: "",
      teacherid: "",
      ZsLoading: false,
      editFormRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            validator: checktitle,
            message: "限20个汉字以内",
            trigger: "blur",
            num: 40
          }
        ],
        period: [
          //                        { required: true, message: "请输入期数", trigger: "blur" },
          /*{ validator: checknumbers, message: "请输入数字 ", trigger: "blur"}*/
        ],
        cover: [{ required: true, message: "请上传图片", trigger: "blur" }],
        /*                    pdf:[
                        { required: true, message: "请上传pdf文件", trigger: "blur" },
                    ],
                    teacher_name:[
                        { required: true, message: "请选择老师", trigger: "blur" },
                    ],*/

        content: [
          { required: true, message: "请输入课程简介", trigger: "blur" }
        ]
      },
      //编辑界面数据
      editForm: {},
      defaultModules: {
        toolbar: ["image"]
      }
    };
  },
  methods: {
    //获取列表
    async getList() {
      // var admin = sessionStorage.getItem("user");
      // var a = JSON.parse(admin);
      // this.username=a.user_name;
      let para = {
        offset: this.page,
        limit: this.pageSize,
        title: this.filters.title,
        createtime: ""
      };

      AdvancedClassList(JSON.stringify(para)).then(res => {
        //console.log("fdsfdsfsdfdsfds");
        this.datas = res.data.rows;
        this.total = res.data.total;
      });
      //console.log("aaaaa"+JSON.stringify(para));
      // let result=await api.getShiZhanKeList(para);
      /*                for( var i=0;i<result.list.length;i++)
                {
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].create_time=Y+M+D+h+m+s;
                }
                this.datas=result.list;
                this.total=result.total;*/
      //console.log("fdsfds:::"+ JSON.stringify(result));
    },

    listenThisUe(thisUe) {
      this.editForm[thisUe.name] = thisUe.data;
      return thisUe;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },

    fileSuccess(response, file, fileList) {
      console.log(JSON.stringify(file));
      if (response.status == "0") {
        this.$message.error("上传失败");
      } else {
        if (response.message.indexOf(".pdf") > -1) {
          this.addForm.pdf = pdfDefault + response.message;
          this.fileList_pdf = [
            { name: this.addForm.pdf, url: this.addForm.pdf }
          ];
        } else {
          this.addForm.cover = imageDefault + response.message;
          this.fileList = [
            { name: this.addForm.cover, url: this.addForm.cover }
          ];
        }
      }
    },
    MP4fileSuccess(response, file, fileList) {
      this.editLoading = true;

      var ws = new WebSocket("ws://118.190.117.218:5956");
      ws.onopen = function() {
        console.log("已连接");
        ws.send(JSON.stringify(response));
      };
      var _this = this;
      ws.onmessage = function(evt) {
        _this.editLoading = false;
        console.log("已发送");
        var data = JSON.parse(evt.data);
        _this.addForm.play_address = data.origUrl;
        _this.addForm.play_length = data.durationMsec;

        ws.close();
      };
      ws.onclose = function() {
        console.log("连接已关闭...");
      };
      /*  console.log(response);
                 this.editruleForm.play_address = response.origUrl
                 this.editruleForm.video_length = response.durationMsec
                 console.log(response.origUrl);
                 console.log(response.duration);*/
    },

    fileError(err, file, fileList) {
      console.log(JSON.stringify(err));
      this.$message.error("上传文件失败");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(async () => {
        if (file.name.indexOf(".mp4") > -1) {
          this.addForm.pdf = "";
          this.fileList_pdf = [];
        } else {
          this.addForm.cover = "";
          this.fileList = [];
        }
      });
    },

    //删除
    async handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(async () => {
          this.listLoading = true;

          var result = await api.deleteShiZhanKe(row.actual_course_id);

          this.listLoading = false;
          if (result.status == "1") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error("删除失败");
          }

          this.getList();
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit(index, row) {
      //console.log("row:::" + JSON.stringify(row));
      this.editOrAdd = false;
      this.FormVisible = true;
      this.addForm = Object.assign({}, row); //await api.findRiJianSo(row);

      if (row.cover == null || row.cover == "") this.fileList = [];
      else this.fileList = [{ name: row.cover, url: row.cover }];

      if (row.pdf == null || row.pdf == "") this.fileList_pdf = [];
      else this.fileList_pdf = [{ name: row.pdf, url: row.pdf }];

      //this.teachername=row.teacher_name;
      //this.teacherid=row.teacher;

      //console.log(this.teachername+"  "+this.teacherid);
    },
    //显示新增界面
    handleAdd: function() {
      this.dialogTitle = "新增";
      this.editOrAdd = true;
      this.FormVisible = true;
      this.addForm = {
        cover: "",
        title: "",
        period: "",

        class_set_id: "",
        pic_url: "",
        play_address: "",
        content: "",
        create_time: "",
        play_length: ""
      };
      this.clearEdit();
      //this.$refs.editForm.resetFields();
    },
    //恢复编辑页面为默认
    clearEdit() {
      let tmpObj = {};
      this.addForm = Object.assign({}, tmpObj);
      this.fileList = [];
      this.fileList_pdf = [];
    },

    //提交
    async editSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            //this.addForm.teacher_name=this.teachername;
            //this.addForm.teacher=this.teacherid;

            var result = "";
            if (this.editOrAdd) {
              let para = Object.assign({}, this.addForm);

              AdvancedClassSave(JSON.stringify(para)).then(res => {
                //console.log("fdsfdsfsdfdsfds");
                this.datas = res.data.rows;
                this.total = res.data.total;
              });
              //result= await api.addShiZhanKe(para);
            } else {
              this.addForm.update_time = util.formatDate.format(
                new Date(),
                "yyyy-MM-dd hh:mm:ss"
              );
              let para = Object.assign({}, this.addForm);
              console.log(JSON.stringify(this.addForm));
              result = await api.updateShiZhanKe(para);
            }

            this.FormVisible = false;
            if (result.status == "1") {
              this.$message({ message: "提交成功", type: "success" });
              this.getList();
            } else {
              this.$message.error("提交失败");
            }
            this.editLoading = false;
            this.clearEdit();
          });
        }
      });
    },
    viewEvent(a) {
      this.viewlikeFrom.count = a;
    },
    batchLikeView(type, title) {
      this.viewlikeFrom = {};
      this.viewlikeFrom.type = type;
      this.BatchViewDialogTitle = title;
      if (this.sels.length < 1) {
        this.$message({
          message: "请选择至少选择一行！",
          type: "error"
        });
        this.BatchViewDialogVisible = false;
      } else {
        this.BatchViewDialogVisible = true;
      }
    },
    async batchViewSubmit() {
      this.$refs.viewlikeFrom.validate(async valid => {
        if (valid) {
          this.setInfuse(this.viewlikeFrom.type);
          var dataArray = [];

          for (var i = 0; i < this.sels.length; i++) {
            var para = {
              actual_course_id: this.sels[i].actual_course_id,
              like: this.sels[i].like,
              view: this.sels[i].view,
              t: this.sels[i].t,
              zs_count: this.sels[i].zs_count,
              play_address: this.sels[i].play_address
            };
            dataArray.push(para);
          }
          var result = await api.updateShiZhiKe_LikeViewCount(dataArray);
          if (result.status == "1") {
            this.$message({
              message: "注水成功",
              type: "success"
            });
          } else {
            this.$message.error("注水失败");
          }
          this.BatchViewDialogVisible = false;
          this.getList();
        }
      });
    },

    selsChange: function(sels) {
      this.sels = sels;
    },
    setInfuse(type) {
      if (type == "like") {
        this.sels.forEach(a => {
          if (
            Number(this.viewlikeFrom.count) + Number(a.like) >
            Number(a.view)
          ) {
            a.like = a.view;
            this.$message({
              message: "超过阅读量已调整为阅读量最低！",
              type: "warning"
            });
          } else {
            a.like = Number(this.viewlikeFrom.count) + Number(a.like);
          }

          a.t = "like";
          a.zs_count = this.viewlikeFrom.count;
        });
      } else {
        this.sels.forEach(a => {
          //console.log(a.view);
          a.view = Number(a.view) + Number(this.viewlikeFrom.count);

          a.t = "view";
          a.zs_count = this.viewlikeFrom.count;
        });
      }
    },

    //老师列表
    async selectTeacherList() {
      let paras = {
        flag: 0
      };
      let lists = await api.selectPersonList(paras);
      let arr = [];
      for (let i = 0; i < lists.length; i++) {
        arr.push(lists[i]);
      }
      this.teacherFrom = arr;
      this.listLoading = false;
      //console.log(JSON.stringify(this.teacherFrom));
    },
    changelaoshi: function(index) {
      this.teachername = this.teacherFrom[index].name;
      this.teacherid = this.teacherFrom[index].id;
      //console.log("index::::"+index +"teachername:::"+this.teachername+"name::::"+ this.teacherid);
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
    // this.selectTeacherList();
    this.getList();
  }
};
</script>

<style>
.el-dialog.el-dialog--small {
  overflow-x: hidden;
}
.el-dialog__body {
  max-height: 800px;
  overflow-y: auto;
  /*         margin-right: -14px;
                padding-right: 34px;*/
}
.ql-container.ql-snow {
  max-height: 200px;
  overflow-y: auto;
}
.el-pagination {
  text-align: center;
}
</style>