<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <div>
                    <el-form-item>
                        <el-button type="primary"     @click="handleAdd">新增</el-button>
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
            <el-table-column prop="columnName" label="所属栏目" width="300" >
            </el-table-column>

          

            <el-table-column label="操作" min-width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.del_flag">启用</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">停用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="editFormRules">
                <el-input v-if="false" v-model="editForm.team_id"  style="width:120px;"   ></el-input>
                      
              <el-form-item label="所属栏目" prop="column_id" >
                <el-select  v-model="editForm.column_id"   clearable placeholder="--请选择栏目--"  >
                  <el-option
                      v-for="list in columnFrom"
                      :key="list.column_id"
                      :label="list.name"
                      :value="list.column_id">
                  </el-option>
                </el-select>
                <!-- <font v-if="editForm.delFlag" size="2" color="red">{{"编辑栏目时不建议更改栏目,如果需要请先停用!"}}</font> -->
              </el-form-item>

                <el-form-item label="套系名称" prop="name" >
                    <el-input v-model="editForm.name"  placeholder="（限10个汉字）"  auto-complete="off" v-if="this.editOrAdd==true"></el-input>
                    <el-input v-model="editForm.name" auto-complete="off" v-else="" :disabled="true"></el-input>
                     
                </el-form-item>
                 <el-form-item label="套系简介" prop="content">
                    <el-input v-model="editForm.content"  :onkeyup="checkContent(editForm.content)"  auto-complete="off"></el-input>
                      {{this.checkMsg}}
                </el-form-item>

                		<el-form-item  label="设置封面"   prop="cover" >
                        <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                          <img v-if="editForm.cover" :src="editForm.cover" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
import {teamSetPageList,teamSetSave,teamSetUpdate,teamSetDel,teamColumnPageList} from "../../api/ydApi.js";
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
       checkMsg:"",
       team_id:"",
       team_name:"",
      columnFrom:{},
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
        cover: "",
        column_id:""
      },
      editFormRules: {
        column_id:[
                        { required: true, message: '--请选择栏目--', trigger: 'change' }
					]
					,
        name: [{ required: true, message: "请输入套系名称！", trigger: "blur" },
         {

                max:10,
                 trigger: "blur",
                message: "（限10个汉字）"
 
          }],
        content: [
          { required: true, message: "请输入内容！", trigger: "blur" } 
        ]
      }
    };
  },
  methods: {
      getStrLenght(content) {
            var len=0;
                for (var i = 0; i < content.length; i++) {
                    var a = content.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//判断如果输的是汉字，字符串长度+2
                        len += 1;
                    }
                    else {
                        len += 0.5;
                    }
                }
                return len;
        },
           checkContent(content){
                let  len =    this.getStrLenght(content);
                this.checkMsg = len+"/50";
           },

     async selectColumnList(para){

              teamColumnPageList(para).then(res => {
                    
             let arr = [];
               console.log(res);
                for(let i=0;i<res.data.length;i++){

                    arr.push(res.data[i]);

                }
                this.columnFrom=arr;
                this.listLoading = false;

                });



              
          

			},
      handleAvatarSuccess(res, file) {
                this.editForm.cover =imageDefault + res.message;
            },
      beforeAvatarUpload(file) {
               /* const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }

                return isJPG && isLt2M;*/
                return true;
            },

    handleCurrentChange(val) {
      this.getUsers();
    },
    //获取列表数据
    async getList() {
      this.listLoading = true;

         let para ={
           team_id:this.team_id
         };
          teamSetPageList(para).then(res => {
                   
                    this.datas = res.data;

                    
                    this.listLoading = false;

                });


    },
    //控制停用启用
    handleDel: function(index, row) {
      if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }
                
      if (row.del_flag == false) {
        this.$confirm("确认停用吗?", "提示", {
          type: "warning"
        })
          .then(async () => {

            teamSetDel({del_flag:true,setId:row.setId,team_id:this.team_id}).then((res) => {
                                
                  this.listLoading = true;
                  this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                  this.getList();
               });

         
           
          })
          .catch(() => {});
      }
      if (row.del_flag == true) {
        this.$confirm("确认启用吗?", "提示", {
          type: "warning"
        })
          .then(async () => {

                teamSetDel({del_flag:false,setId:row.setId,team_id:this.team_id}).then((res) => {
                                
                  this.listLoading = true;
                  this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                  this.getList();
               });

          
          })
          .catch(() => {});
      }
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

      this.editOrAdd = false;
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      console.log(row);
      this.editForm = Object.assign({}, row);
      this.coverFileList = [{ name: row.cover, url: row.cover }];
    },
    //显示新增界面
    handleAdd: function() {
      if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }
                
      this.editOrAdd = true;
      this.dialogTitle = "新增";
      this.dialogVisible = true;
      this.coverFileList = [];
      this.editForm = {
        name: "",
        content: "",
        cover: "",
        team_id:this.team_id
      };
    },
    //编辑
    editSubmit: function() {

           let  len  =    this.getStrLenght(this.editForm.content);
               if(len > 50 ){

                    this.$message({
                        message: "简介（限50个汉字）！",
                        type: "error"
                    });
                     return  false;
               }

      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            if (this.editOrAdd == false) {

              teamSetUpdate(this.editForm).then((res) => {
                                   
                                      this.editLoading = false;

                                       if(!res.data.success){
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                      }else{
                                          this.$message({
                                              message: res.data.message,
                                              type: "error"
                                          });
                                      }

                                        
                                        this.$refs["editForm"].resetFields();
                                        this.dialogVisible = false;
                                        this.getList();

                                });


             
            }
            if (this.editOrAdd == true) {
                teamSetSave(this.editForm).then((res) => {
                   
                                      this.editLoading = false;
                                        if(!res.data.success){
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                      }else{
                                          this.$message({
                                              message: res.data.message,
                                              type: "error"
                                          });
                                      }
                                        this.$refs["editForm"].resetFields();
                                        this.dialogVisible = false;
                                        this.getList();

                                });
            }
            
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
          var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;

    this.getList();
    let para = {team_id:this.team_id};
     this.selectColumnList(para);
  }
};
</script>

<style  >

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}


</style>