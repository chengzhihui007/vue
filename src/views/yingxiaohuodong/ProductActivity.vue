<template>
<div>
<br/>
  <!--工具条-->
        <el-form :inline="true">
           <el-form-item>
                <el-date-picker v-model="filters.date" type="date" placeholder="开始时间查询">
                </el-date-picker>
            </el-form-item>
             <el-form-item  style="margin-right: 10px;" class="inline fl">
                <el-select  v-model="filters.status"  clearable   placeholder="请选择活动状态">
					<el-option key="0" label="未开始" value="0"/>
					<el-option key="1" label="进行中" value="1"/>
					<el-option key="2" label="已结束" value="2"/>
			    </el-select>
            </el-form-item>                
            <el-form-item > 
                <el-button type="primary" @click="getList()">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button   type="primary"  @click="handleAdd">添加</el-button>
            </el-form-item>            
        </el-form>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">
       
            <el-table-column prop="id" label="序号"  width="100" >
                <template scope="num">
                    {{num.$index+1}}
                    <!-- <div class="deleted-text" v-if="scope.row.deleted">  {{datas.length - scope.$index}}</div>
                    <div v-else>  {{datas.length - scope.$index}}</div> -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="活动主题" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.name }}</div>
                    <div v-else>{{ scope.row.name }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="image" label="图片" width="150" >
                    <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">
                        <img :src="scope.row.image" style="width: 100%"></img>
                        </div>
                    <div v-else>
                        <img :src="scope.row.image" style="width: 100%"></img>
                    </div>
                </template>                
            </el-table-column>
            <el-table-column prop="link" label="PC详情链接" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.link }}</div>
                    <div v-else>{{ scope.row.link }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="link2" label="APP详情链接" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.link2 }}</div>
                    <div v-else>{{ scope.row.link2 }}</div>
                    {{scope.row.ktqx?'【显示申请开通权限】':'【不显示申请开通权限】'}}
                    
                </template>            
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.startTime }}</div>
                    <div v-else>{{ scope.row.startTime }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.endTime }}</div>
                    <div v-else>{{ scope.row.endTime }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="status" label="状态" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.status }}</div>
                    <div v-else>{{ scope.row.status }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.createTime }}</div>
                    <div v-else>{{ scope.row.createTime }}</div>
                </template>            
            </el-table-column>            
            <el-table-column prop="operator" label="最近操作账号" width="120" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.operator }}</div>
                    <div v-else>{{ scope.row.operator }}</div>
                </template>            
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <div v-if="scope.row.deleted">
                    <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >已删除</el-button>
                    </div>
                    <div v-else>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
   <!--编辑界面-->
    <el-dialog  :title='dialogTitle'  :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="110px" >
              <el-form-item label="活动主题" prop="name">
                    <el-input  v-model="editForm.name" placeholder="活动主题不超过10个汉字"></el-input>
                </el-form-item>
              <el-form-item  label="活动图片" prop="image" >
             <!-- <el-upload    
                  class="upload-demo"
                  action="/api/file/imageUpload/"
                  accept="image/*"
                  :on-success="handleImageSuccess"
                  :on-remove="handleRemove"
                  :limit="1"
                  :before-upload="handleBeforeUpload"                        
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload> -->
                <el-upload
                  class="avatar-uploader"
                  action="/api/file/imageUpload/"
                  :show-file-list="false"
                  :on-success="handleImageSuccess"
                  :before-upload="handleBeforeUpload"
                  :http-request="fnUploadRequest">
                  <img v-if="editForm.image" :src="editForm.image" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>                                 
            </el-form-item>
              <el-form-item label="PC链接地址" prop="link">
                    <el-input  v-model="editForm.link" placeholder="请填写活动链接地址"></el-input>
                </el-form-item>            
              <el-form-item label="APP链接地址" prop="link2">
                    <el-input  v-model="editForm.link2" placeholder="请填写活动链接地址"></el-input>
                    <el-radio-group v-if="ktqxSelectable" v-model="editForm.ktqx">
                      <el-radio :label="true">显示【申请开通权限】</el-radio>
                      <el-radio :label="false">不显示【申请开通权限】</el-radio>
                    </el-radio-group>
                    <el-radio-group v-else disabled v-model="editForm.ktqx">
                      <el-radio :label="true">显示【申请开通权限】</el-radio>
                      <el-radio :label="false">不显示【申请开通权限】</el-radio>
                    </el-radio-group>
                </el-form-item>
                            
              <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        format='yyyy-MM-dd HH:mm'
                      v-model="editForm.startTime"
                      type="datetime"
                      placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>            
              <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        format='yyyy-MM-dd HH:mm'                    
                      v-model="editForm.endTime"
                      type="datetime"
                      placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>            
        
            <el-form-item>
              <el-button @click="resetForm('editForm')">取消</el-button>
              <el-button type="primary" @click="editSubmit('editForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>  
</div>
</template>
<script>
import '../../common/js/DateFormat';
import api from "../../api/api.js"
import utils from '../../api/utils.js';

import {imageDefault} from "../../common/js/urls";
export default {
    data() {
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
            if(len>20){
                callback(new Error("活动主题最多不超过10个汉字"));
            }else{
                callback();
            }
        };
        return {
            ktqxSelectable:false,
            fileList:[],
            labelPosition:'top',
            activeName:'A',
            listLoading: false,            
            groups:[{groupsName:'A',status:1},{groupsName:'B',status:1},{groupsName:'C',status:1},],
            datas:[],
            pageNum: 1,
            pageSize: 15,
            total: 0,    
            filters:{
                date:'',
                status:''
            },
            dialogVisible: false,//编辑界面是否显示                    
            dialogTitle:'',
            formAdd:false,
            editForm:{

            },
            rules: {
                name: [
                    {required: true, message: '请填写活动主题名称', trigger: 'blur'},
                    { validator: validatePass, trigger: ['change', 'blur'] }
                ],  
                link: [
                  {validator:(rule, value, callback)=>{
                        try{
                            if(value){
                                new URL(value)
                            }
                        }catch(e){
                            callback(new Error("请正确填写链接地址"))
                        }
                        callback()
                    },trigger: 'blur'}                     
                ],  
                link2: [
                  {validator:(rule, value, callback)=>{
                        try{
                            if(value){
                                new URL(value)
                                this.ktqxSelectable=true
                                // this.editForm.ktqx=true
                                callback()
                            }else{
                                this.ktqxSelectable=false
                                // this.editForm.ktqx=false                                
                                callback()
                            }
                        }catch(e){
                            this.ktqxSelectable=false
                            // this.editForm.ktqx=false
                            callback(new Error("请正确填写链接地址"))
                        }
                    },trigger: 'blur'}                     
                ],  
                startTime: [
                    {required: true, message: '请填写活动开始时间', trigger: 'blur'},
                ],  
                endTime: [
                    {required: true, message: '请填写活动结束时间', trigger: 'blur'},
                    {validator:(rule, value, callback)=>{
                        
                        if(new Date(value).format('yyyy-MM-dd hh:mm')<=new Date(this.editForm.startTime).format('yyyy-MM-dd hh:mm')){
                            callback(new Error("结束时间必须在开始时间以后"))
                        }
                        callback()
                    },trigger: 'blur'}                      
                ],  
                image: [
                    {required: true, message: '请上传活动图片', trigger: 'blur'}
                ],              
                replyContent: [
                    {required: true, message: '请输入回复内容', trigger: 'blur'},
                    // {max: 500, message: '长度在500个字符', trigger: 'blur'},
                    {validator:(rule, value, callback)=>{
                        let c=value||'';
                        let div=document.createElement("div");div.innerHTML=c;c=div.textContent||'';
                        if(c.length>150){
                            callback(new Error("长度在150个汉字"))
                        }
                        callback()
                    },trigger: 'blur'}                        
                ] 
            },            
        }
    },
    methods: {
        
        handleCurrentChange(val) {
           this.pageNum = val;
           this.getList();
        }, 
        handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
        },
        handleBeforeUpload(file){
            if("image/jpeg"!=file.type&&"image/jpg"!=file.type&&"image/png"!=file.type){
                this.$message.warning(`格式错误请重新上传，仅支持（jpg、png）`);
                return false;
            }    
        },            
        handleImageSuccess(res, file) {
          // this.editForm.image =imageDefault + res.message;
        },
        fnUploadRequest(option) {
            utils.ossput(new Date().getTime().toString(), option.file).then(res => {
                this.editForm.image = res.url;
            });
        },
        handleRemove(response, fileList) {
            this.editForm.replyImage = "";
        },            
        beforeImageUpload(file) {
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
        async showStatus(index,row){
                let p={
                    id:row.id,
                    show:!row.show
                }
                this.editForm = Object.assign({}, row);
                    this.$confirm('确定'+(p.show?'显示到前台？':'取消显示？'), '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.showStatus(p)
                                     if(!resp||!resp.state){
                                    this.$message({
                                            message: '操作失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        // this.page=1;
                                        this.getList()
                                   }
                    }).catch((e) => {
                        console.error(e)
                    });            
        },
        async handleDel(index, row) {
                    this.$confirm('若删除该内容则不可恢复，确定要删除该内容吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.deleteProductActivityById(row.id)
                                     if(!resp||!resp.state){
                                    this.$message({
                                            message: '删除失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        // this.page=1;
                                        this.getList()
                                   }
                    }).catch((e) => {
                        console.error(e)
                    });
            },
        async editSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                        if(this.formAdd){
                            let params={
                                name:this.editForm.name,
                                image:this.editForm.image,
                                link:this.editForm.link,
                                link2:this.editForm.link2,
                                ktqx:this.editForm.ktqx,                                  
                                startTime:new Date(this.editForm.startTime).format('yyyy-MM-dd hh:mm'),
                                endTime:new Date(this.editForm.endTime).format('yyyy-MM-dd hh:mm'),
                                operator:this.userName
                            }
                            let resp=await api.insertProductActivity(params)
                               if(!resp||!resp.state){
                                this.$message({
                                        message: '添加失败: '+((resp?resp.data:'')),
                                        type: 'error'
                                    });
                               }else if(resp.state){
                                     this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getList()
                               }
                                this.dialogVisible = false;    
                        }else{
                            let params={
                                id:this.editForm.id,
                                name:this.editForm.name,
                                image:this.editForm.image,
                                link:this.editForm.link,
                                link2:this.editForm.link2,     
                                ktqx:this.editForm.ktqx,                           
                                startTime:new Date(this.editForm.startTime).format('yyyy-MM-dd hh:mm'),
                                endTime:new Date(this.editForm.endTime).format('yyyy-MM-dd hh:mm'),
                                operator:this.userName
                            }
                            let resp=await api.updateProductActivity(params)
                               if(!resp||!resp.state){
                                this.$message({
                                        message: '修改失败: '+((resp?resp.data:'')),
                                        type: 'error'
                                    });
                               }else if(resp.state){
                                     this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getList()
                               }
                                this.dialogVisible = false;                            
                        }
                    });
                }
            });
        },        
      
        resetForm(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },    
        handleAdd: function () {
            this.ktqxSelectable = false
            this.dialogVisible = true;
            this.dialogTitle='添加产品活动'
            this.formAdd=true
            this.editForm={
                name:'',
                image:'',
                link:'',
                link2:'',
                ktqx:false,
                startTime:new Date(),
                endTime:''            
                }
        },            
        handleEdit(index,row){
            this.ktqxSelectable = true
            this.dialogVisible = true;
            this.dialogTitle='修改产品活动'
            this.formAdd=false
            this.editForm={
                id:row.id,
                name:row.name,
                image:row.image,
                link:row.link,
                link2:row.link2,
                ktqx:row.ktqx,
                startTime:row.startTime,
                endTime:row.endTime            
                }            
        },
        handleClick(){
            this.getList()
        },
        async getGroups(){
            this.groups=[];           
            let userId = JSON.parse(sessionStorage.getItem('user')).user_id;
            let menuId = '92'
            let result=await api.findMenuByUserWriter(userId,menuId);
            if(!result||!result.state){
                return;
            }
            let data=result.data;
            this.groups=data;
            for(let i in this.groups){
                if(this.groups[i].status){
                    this.activeName=this.groups[i].groupsName
                    return;
                }
            }
        },
        async getList() {
                this.listLoading = true;
                let params={
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                } 
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.status&&(params.status=this.filters.status)
                let resp=await api.findProductActivityByPage(params)
                if(!resp){
                    return;
                }

                let data=resp.data;
                
                data.list.forEach(d=>{
                    let curDate=new Date();
                    if(curDate<new Date(d.startTime)){
                        d.status='未开始'
                    }
                    if(curDate>=new Date(d.startTime)&&curDate<new Date(d.endTime)){
                        d.status='进行中'
                    }
                    if(curDate>=new Date(d.endTime)){
                         d.status='已结束'
                    }

                    d.createTime=new Date(d.createTime).format('yyyy-MM-dd hh:mm')
                })
                this.datas=data.list
                this.total = data.total;
                this.listLoading = false;
        },
    },
   async mounted() {
        var user = sessionStorage.getItem('user');
        var userArray = JSON.parse(user);
        this.team_id = userArray.team_id;
        this.team_name = userArray.team_name;
        this.userName=userArray.user_name       
         this.getList()
    },
}
</script>
<style>
    .deleted-text{
        color: #999999;
    }    
    .head {
        display: flex;
        align-items: center;
    }
    .head > div {
        margin-right: 10px;
    }
</style>
<style>
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