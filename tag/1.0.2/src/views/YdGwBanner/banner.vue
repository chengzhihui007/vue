<template>
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <!--列表-->
		<el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column label="图片" width="300">
                <template scope="scope">
                    <img :src="scope.row.cover" width="100" height="100"  />
                </template>
            </el-table-column>
             <el-table-column prop="link"  width="100" label="链接">
            </el-table-column>
            <el-table-column prop="user_name"  width="100" label="发布人">
            </el-table-column>
			<el-table-column prop="update_time"  width="200" :formatter="formatfoatUpdatetime" label="发布时间">
			</el-table-column>
		  <el-table-column label="操作" width="150">
		     <template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"   @click="handleDel(scope.row)">删除</el-button>
                  <!-- <el-button type="danger" size="small"  @click="handleJy(scope.$index,  scope.row.banner_id)" v-if="scope.row.del_flag==0">停用</el-button>
                    <el-button type="danger" size="small"  @click="handleQy(scope.$index,  scope.row.banner_id)" v-else>启用</el-button> -->
			</template>
			</el-table-column>
		</el-table>
      <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item  label="轮播图图片："   prop="cover" >
                    <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="editForm.cover" :src="editForm.cover" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="链接："  prop="title">
					<el-input v-model="editForm.link" auto-complete="off"></el-input>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import api from '../../api/api.js';
import {imageDefault,pdfDefault} from "../../common/js/urls";
export default {
    data() {
        return {
                banner_id:'',
                cover:'',
                link:'',
                dialogTitle: "新增",
                editOrAdd:false,
                datas: [],
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    cover:'',
                    link:'',
                },
                users:{},
                editFormRules: {
                    cover: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ]
                }
         }
    },
    methods: {
         //显示新增界面
            handleAdd: function () {
                if(this.datas.length>=5){
                    this.$message({
                        message: "最多只能添加5个轮播图",
                        type: "warning"
                    });
                    return;
                }
                this.dialogTitle = "添加轮播图";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.clearEdit()
         },
         //删除
         handleDel: function(row) {
                this.$confirm("确定要删除该轮播图吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                this.listLoading = true;
                let result = await api.deleteYdGwBanner(row.banner_id);
                if (result == 1) {
                    this.listLoading = false;
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.getlunbo();
                } else {
                    this.listLoading = false;
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                }
            })
            .catch(() => {

            });
            },
        //显示编辑界面
            async handleEdit (index, row) {
                this.dialogTitle = "编辑轮播图信息";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //控制停用启用
           handleJy: function (index,id) {
               this.$confirm('确认停用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let result=await api.setYdGwjybanner(id);
                        this.getlunbo();
                    }).catch(() => {
                    });
            },
            handleQy: function (index,id) {
               this.$confirm('确认启用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let result=await api.setYdGwqybanner(id);
                        this.getlunbo();
                    }).catch(() => {
                    });
            },
        async addSubmit() {
               this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        if(this.editOrAdd){
                        this.editForm.user_name=this.users.user_name;
                        this.editForm.user_id=this.users.user_id;
                        let para = Object.assign({}, this.editForm);
                        await api.addYdGwbanner(para)
                    }else{
                        let para = Object.assign({}, this.editForm);
                        await api.updateYdGwbanner(para)
                    }
                    this.dialogVisible = false;
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.editLoading = false;
                    this.getlunbo();
                });
              }
           });
         },
        async getlunbo() {
            var admin = sessionStorage.getItem("user");
            this.users= JSON.parse(admin);
            let paras = {  };
            let list=await api.getYdGwbanner(paras);
            this.datas=list;
         },
        //恢复编辑页面为默认
        clearEdit(){
            let tmpObj={
                cover:"",
                link:"",
            }
             this.editForm = Object.assign({}, tmpObj);
            },
            handleAvatarSuccess(res, file) {
            this.editForm.cover =imageDefault + res.message;
            //this.editForm.cover ='http://192.168.11.103:10001/image/' + res.message;
            },
            beforeAvatarUpload(file) {
                return true;
            },
            formatfoatUpdatetime:function(row){
                var timestamp = new Date(row.update_time);
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            }
          },
    mounted() {
        this.getlunbo();
    }
}
</script>
<style lang="scss">
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
    .toolbar .el-form-item {
        margin-bottom: 20px;
    }
</style>