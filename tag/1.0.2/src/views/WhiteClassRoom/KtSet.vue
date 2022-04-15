<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="200" >
            </el-table-column>
            <el-table-column prop="name" label="套系名称" width="300" >
            </el-table-column>
            <el-table-column prop="content" label="课程简介" width="500" >
            </el-table-column>
            <el-table-column label="操作" min-width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.delFlag">停用</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="editFormRules">
                <el-form-item label="套系名称" prop="name" >
                    <el-input v-model="editForm.name" auto-complete="off" v-if="this.editOrAdd==true"></el-input>
                    <el-input v-model="editForm.name" auto-complete="off" v-else="" :disabled="true"></el-input>
                </el-form-item>
                 <el-form-item label="套系简介" prop="content">
                    <el-input v-model="editForm.content" auto-complete="off"></el-input>
                </el-form-item>
                  <el-form-item label="图片文件" prop="cover">
                    <el-upload  class="upload-demo" action="/api/file/imageUpload/" accept=".jpg,.png"   :on-success="handleChangeAddTP" :on-remove="handleRemoveAddTP" :limit="1" :on-exceed="exceed" :file-list="coverFileList">
                          <el-button size="small" type="primary">点击上传图片</el-button>
                          <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传jpg/png图片文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="图片名称"  prop="cover" style="display: none" >
                    <el-input   v-model="editForm.cover"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>



    </section>
</template>

<script>
import {imageDefault} from "../../common/js/urls";
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
      datas: [],
      coverFileList: [],
      dialogTitle: "添加",
      editOrAdd: false,
      listLoading: false,
      dialogVisible: false, //编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {
        name: "",
        content: "",
        cover: ""
      },
      editFormRules: {
        name: [{ required: true, message: "请输入套系名称！", trigger: "blur" },
         {
            validator: numbers,
            message: "内容超出限制",
            trigger: "blur",
            num: 10
          }],
        content: [
          { required: true, message: "请输入内容！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.getUsers();
    },
    //获取列表数据
    async getList() {
      this.listLoading = true;
      let list = await api.getKtSetList({delFlag:null});
      this.datas = list;
      this.listLoading = false;
    },
    //控制停用启用
    handleDel: function(index, row) {
      if (row.delFlag == true) {
        this.$confirm("确认停用吗?", "提示", {
          type: "warning"
        })
          .then(async () => {
            let result = await api.updateKtSet({delFlag:false,setId:row.setId});
            this.listLoading = true;
            this.getList();
          })
          .catch(() => {});
      }
      if (row.delFlag == false) {
        this.$confirm("确认启用吗?", "提示", {
          type: "warning"
        })
          .then(async () => {
            let result = await api.updateKtSet({delFlag:true,setId:row.setId});
            this.listLoading = true;
            this.getList();
          })
          .catch(() => {});
      }
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editOrAdd = false;
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.editForm = Object.assign({}, row);
      this.coverFileList = [{ name: row.cover, url: row.cover }];
    },
    //显示新增界面
    handleAdd: function() {
      this.editOrAdd = true;
      this.dialogTitle = "添加";
      this.dialogVisible = true;
      this.coverFileList = [];
      this.editForm = {
        name: "",
        content: "",
        cover: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            if (this.editOrAdd == false) {
              let result = await api.updateKtSet(this.editForm);
            }
            if (this.editOrAdd == true) {
              let result = await api.addKtSet(this.editForm);
            }
            this.editLoading = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$refs["editForm"].resetFields();
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    handleChangeAddTP(response, file, fileList) {
        if(response.status=='1'){
        this.editForm.cover = imageDefault+response.message
        }
    },
    handleRemoveAddTP() {},
    exceed(){
        this.$message({
              message: "图片数量超出限制！",
              type: "warning"
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
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>

</style>