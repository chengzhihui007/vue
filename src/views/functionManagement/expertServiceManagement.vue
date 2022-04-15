<template>
  <section>
    <!--工具条-->
    <!--  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                    <el-form-item style="float:right;">
                        <el-button type="primary"  @click="handleAdd" >添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
    </el-col>-->

    <!--列表-->
    <el-table
      ref="multipleTable"
      :data="datas"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      @sort-change="sortChang"
      style="width: 100%; margin-top:2%;"
    >
      <!--     <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    {{datas.length - num.$index}}
                </template>
      </el-table-column>-->
      <el-table-column prop="name" label="老师昵称" min-width="100"></el-table-column>
      <el-table-column prop="grade" label="老师级别" min-width="100"></el-table-column>
      <el-table-column label="头像" min-width="100">
        <img
          width="30"
          height="30"
          :src="image"
          class="image"
        >
      </el-table-column>
      <el-table-column prop="label" label="标签" min-width="100"></el-table-column>
      <el-table-column prop="path" label="链接地址" min-width="100"></el-table-column>
      <el-table-column prop="plate" label="所属板块" min-width="100"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="100"></el-table-column>
      <el-table-column prop="account" label="操作账号" min-width="100"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="this.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="this.total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属板块：" prop="plate">
          <span>{{editForm.plate}}</span>
        </el-form-item>
        <el-form-item label="老师昵称：" prop="name">
          <el-input
            v-model="editForm.name"
            auto-complete="off"
            placeholder="请填写老师昵称"
            style="width:500px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="老师级别：" prop="grade">
          <el-input
            v-model="editForm.grade"
            auto-complete="off"
            placeholder="请填写老师级别"
            style="width:500px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="老师头像：" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/file/imageUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemoveAdd"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.image" :src="editForm.image" width="600px" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接地址：" prop="path">
          <el-input
            v-model="editForm.path"
            auto-complete="off"
            placeholder="填写老师介绍页链接地址"
            style="width:500px;"
          ></el-input>
        </el-form-item>
        <el-row :gutter="10">
        <el-col>
            <el-form-item label="老师标签：" prop='label'> 
                <template v-for="(v, i) in styleList" >
                    <el-input placeholder="请填写老师标签" 
                      :key="i"
                        v-model="styleList[i]"
                        :disabled="idens=='0'"
                        style="width: 500px"
                    ></el-input>
                    <el-button type="primary" :key="i" :disabled="styleList.length ==1" icon="el-icon-delete" @click="styleList.splice(i, 1)"></el-button>                                    
                </template>
                <div><el-button type="primary" :disabled="idens=='0' || styleList.length >=2" @click="addStyle"><i class="el-icon-plus"></i></el-button></div>
            </el-form-item>
        </el-col>
        </el-row>
        <span style="color: red;">{{ msg }}</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {imageDefault,pdfDefault} from "../../common/js/urls";
import UeEdit from "../UeEdit.vue";
import api from "../../api/api.js";
import axios from "axios";
export default {
  components: { UeEdit },
  data() {
    return {
      idens:'1',
      styleList:[],
      msg: "",
      username: "",
      value: "",
      setVisible: false,
      dialogTitle: "新增",
      setForm: {},
      isClose: "0",
      radio: "1",
      editOrAdd: false,
      filters: {
        content: "",
        name: "",
        teacherName: "",
        datetime: ""
      },
      datas: [],
      total: 0,
      page: 1,
      pageSize: 15,
      listLoading: false,
      chakanFormVisible: false,
      sels: [], //列表选中列

      showUeEdit: false,
      dialogVisible: false, //编辑界面是否显示
      ZsFormVisible: false,
      editLoading: true,
      ZsLoading: false,
      editFormRules: {
        name: [
          { required: true, message: "请填写老师昵称", trigger: "blur" },
          { min: 1, max: 10, message: "名称最多不超过8个汉字", trigger: "blur" }

        ],
        grade: [
          { required: true, message: "请选择对应分组", trigger: "blur" },
          { min: 1, max: 10, message: "级别最多不超过10个汉字", trigger: "blur" }
          ],
       image: [
          { required: true, message: "请上传老师头像", trigger: "blur" },
          ],
        //链接地址
        styleList: [
        { required: true, message: "请填写老师标签", trigger: "blur" },
        { min: 1, max: 6, message: "标签最多不超过六个汉子", trigger: "blur" }
        ],
      },
      //编辑界面数据
      editForm: {
        del_flag: 1,
        image:''
      },
      defaultModules: {
        toolbar: ["image"]
      }
    };
  },
  methods: {
    addStyle() {
            this.styleList.push('')
            if(this.styleList.length >2){
                 this.$message.error('老师标签最多只能添加2个');
            }
        },
    handleClose() {
      this.$refs.editForm.clearValidate();
    },
    //获取列表
    async getList() {
      let result = await api.findExpertManageList(this.page, this.pageSize); //列表
      this.datas = result.data.result;
      this.datas = result.data.result;
      this.total = result.data.total;
    },
    listenThisUe(thisUe) {
      this.editForm[thisUe.name] = thisUe.data;
      return thisUe;
    },
    handleAvatarSuccess(res, file) {
      this.editForm.image = imageDefault + res.message;
      this.coverFileList = [
        { name: this.editForm.image, url: this.editForm.image }
      ];
    },
    handleRemoveAdd(response, fileList) {
      this.editForm.image = "";
      this.coverFileList = [];
    },
    beforeAvatarUpload(file) {
    const isJPG = file.type == 'image/jpeg';
    const isPNG = file.type == 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG&&!isPNG) {
    this.$message.error('图片格式不正确，请重新上传!');
    }
    if (!isLt2M) {
    this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
      },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      this.getPanListShow(this.page, this.pageSize, "ID desc");
    },
    //显示编辑界面
    async handleEdit(index, row) {
      this.styleList=[];
     if(row.label!=null&&row.label!=""){
      row.label.split('、').forEach(element => {
           this.styleList.push(element);
      });
     }else{
       this.addStyle();
     }
      this.msg = "";
      this.editOrAdd = false;
      this.isClose = "1";
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.editForm = Object.assign({}, row);
      let para = Object.assign({}, this.editForm);
    },
    //显示新增界面
    handleAdd: function() {
      this.msg = "";
      this.dialogTitle = "新增";
      this.isClose = "0";
      this.editOrAdd = true;
      this.dialogVisible = true;
      this.editForm = {
        del_flag: 1
      };
      this.clearEdit();
    },
    //恢复编辑页面为默认
    clearEdit() {
      let tmpObj = {};
      this.showUeEdit = false;
      this.editForm = Object.assign({}, tmpObj);
    },
    sortChang(a, b) {
      if (a.order == "descending") {
        this.getPanListShow(this.page, this.pageSize, a.prop + " desc");
      } else {
        this.getPanListShow(this.page, this.pageSize, a.prop);
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    async editSubmit() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            para.label =  this.styleList.join('、'); 
            let result = await api.editExpertManage(para);
            this.editLoading = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$refs["editForm"].resetFields();
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
.el-dialog.el-dialog--small {
  overflow-x: hidden;
}
.el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
  margin-right: -14px;
  padding-right: 34px;
}
.ql-container.ql-snow {
  max-height: 200px;
  overflow-y: auto;
}
.el-pagination {
  text-align: center;
}
</style>
<style>
.el-message-box__message p:first-child {
  text-align: center;
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