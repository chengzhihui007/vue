<template>
<div>
<br/>
    <el-tabs v-model="activeName" type="border-card"   @tab-click="handleClick">
    <el-tab-pane v-for="(group, index) in groups" :key="index" :label="group.groupsName" :name="group.id">
      <!--工具条-->
        <el-form :inline="true" style="float: right">
              <el-form-item>
                <span style="color:red">可针对特定星级添加营销图，若不添加则默认展示全部可见营销位！</span><el-button   type="primary"  @click="handleAdd">添加</el-button>
            </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">

            <!--<el-table-column prop="id" label="序号"  width="100" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">  {{datas.length - scope.$index}}</div>
                    <div v-else>  {{datas.length - scope.$index}}</div>
                </template>
            </el-table-column>-->
                                  <el-table-column prop="name" label="活动主题" width="200" >
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
            <el-table-column prop="link" label="链接" width="350" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.link }}</div>
                    <div v-else>{{ scope.row.link }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="qxlb" label="用户权限" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.link }}</div>
                    <div v-else>{{ scope.row.qxlb=='3;4;5'?'全部可见':scope.row.qxlb.replace('3','多空决策').replace('4','风口决策').replace('5','主力决策').replace(';','、') }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="pubTime" label="编辑时间" width="300" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.pubTime }}</div>
                    <div v-else>{{ scope.row.pubTime }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operator" label="最近操作账号" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.operator }}</div>
                    <div v-else>{{ scope.row.operator }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200">
                <template scope="scope">
                    <div v-if="scope.row.qxlb=='3;4;5'">
                    <el-button  size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.rowe)" >删除</el-button>
                    </div>
                    <div v-else>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button  type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
        </el-tab-pane>
        </el-tabs>
   <!--编辑界面-->
    <el-dialog  :title='dialogTitle'  :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
              <el-form-item label="营销入口位">
                     {{activeName==1? '用户中心精选（入口1）':'用户中心精选（入口2）'}}
                </el-form-item>
                <el-form-item  label="活动主题" prop="name">
                    <el-input  v-model="editForm.name" placeholder="活动主题不超过10个汉字和特殊字符"></el-input>
                </el-form-item>
              <el-form-item  label="营销图片" prop="image" >
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
              <el-form-item label="链接地址" prop="link">
                    <el-input  v-model="editForm.link" placeholder="请输入链接地址"></el-input>
                </el-form-item>
            <el-form-item label="用户权限" prop="qxlbs">
                <el-checkbox-group v-if="editForm.qxlb=='3;4;5'" disabled v-model="editForm.qxlbs">
                    <el-checkbox label="3">多空决策</el-checkbox>
                    <el-checkbox label="4">风口决策</el-checkbox>
                    <el-checkbox label="5">主力决策</el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-else v-model="editForm.qxlbs">
                    <el-checkbox v-if="editForm.czqxs.indexOf('3')!=-1" disabled label="3">多空决策</el-checkbox>
                    <el-checkbox v-else  label="3">多空决策</el-checkbox>
                    <el-checkbox v-if="editForm.czqxs.indexOf('4')!=-1" disabled label="4">风口决策</el-checkbox>
                    <el-checkbox v-else  label="4">风口决策</el-checkbox>
                    <el-checkbox v-if="editForm.czqxs.indexOf('5')!=-1" disabled label="5">主力决策</el-checkbox>
                    <el-checkbox v-else  label="5">主力决策</el-checkbox>
                </el-checkbox-group>
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
import '../../../common/js/DateFormat';
import api from "../../../api/api.js"
import utils from '../../../api/utils.js';

import {imageDefault} from "../../../common/js/urls";
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
                callback(new Error("标题字数不能超过10个汉字"));
            }else{
                callback();
            }
        };
        return {
            isShowAllError:true,
            fileList:[],
            labelPosition:'top',
            activeName:1,
            listLoading: false,
            groups:[{groupsName:'营销位1',id:1},{groupsName:'营销位2',id:2}],
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
                czqxs:[]
            },
            rules: {
                qxlbs:[
                    {required: true, message: '请选择用户权限', trigger: 'blur'},
                  {validator:(rule, value, callback)=>{
                      value.sort()
                      if(value.join(';')=='3;4;5'){
                          if(this.isShowAllError)
                            {
                                callback(new Error("全部可见已添加，请勿重复添加"))
                            }
                      }
                        callback()
                    },trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请填写活动主题', trigger: 'blur'},
                    { validator: validatePass, trigger: ['change', 'blur'] }
                ],
                link: [
                    // {required: true, message: '请填写营销页面链接', trigger: 'blur'},
                  {validator:(rule, value, callback)=>{
                        try{
                            if (value != null && value != '') {
                                new URL(value)
                            }
                        }catch(e){
                            callback(new Error("请正确填写链接地址"))
                        }
                        callback()
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
                    {required: true, message: '请上传营销图片', trigger: 'blur'}
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
                    this.$confirm('若删除该营销内容则用户将可见默认营销内容，确认要删除吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.deleteMarketingAdvertising(row.id)
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
                                fmid:this.activeName==1?1170400:1170500,
                                image:this.editForm.image,
                                link:this.editForm.link,
                                qxlb:this.editForm.qxlbs.join(";"),
                                type:1,
                                operator:this.userName
                            }
                            let resp=await api.insertPayingUser(params)
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
                                fmid:this.activeName==1?1170400:1170500,
                                name:this.editForm.name,
                                image:this.editForm.image,
                                link:this.editForm.link,
                                qxlb:this.editForm.qxlbs.join(";"),

                                operator:this.userName
                            }
                            let resp=await api.updatePayingUser(params)
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
        handleAdd: async function () {
            let czqxs=[]
                let params={
                    rk:this.activeName
                }
                let resp=await api.existQxPayingUser(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                data.forEach(d=>{
                    czqxs.push(d)
                })
            this.dialogVisible = true;
            this.dialogTitle='营销位管理'
            this.formAdd=true
            this.isShowAllError=true
            this.editForm={
                name:'',
                image:'',
                link:'',
                qxlb:'',
                qxlbs:[],
                czqxs:czqxs
                }
        },
       async handleEdit(index,row){
            let czqxs=[]
                let params={
                    rk:this.activeName,
                    id:row.id,
                }
                let resp=await api.existQxPayingUser(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                data.forEach(d=>{
                    czqxs.push(d)
                })
            this.dialogVisible = true;
            this.dialogTitle='营销位管理'
            this.isShowAllError=row.qxlb!='3;4;5'
            this.formAdd=false
            let qxlbs=row.qxlb.split(";");
            // for(let i=0;i<qxlbs.length;i++){
            //     qxlbs[i]=+qxlbs[i]
            // }
            this.editForm={
                id:row.id,
                name:row.name,
                image:row.image,
                link:row.link ,
                qxlb:row.qxlb,
                qxlbs:qxlbs,
                czqxs:czqxs,
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
                    pageSize: this.pageSize,
                    type:1,
                    rk:this.activeName
                }
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.status&&(params.status=this.filters.status)
                let resp=await api.findPayingUserByPage(params)
                if(!resp){
                    return;
                }

                let data=resp.data;

                data.list.forEach(d=>{

                    d.pubTime=new Date(d.pubTime).format('yyyy-MM-dd hh:mm')
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
