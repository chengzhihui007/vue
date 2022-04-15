<template>
<div>
<br/>
  <el-tabs v-model="activeName" type="border-card"   @tab-click="handleClick">
    <el-tab-pane v-for="(group, index) in groups" :key="index" :label="group.groupsName" :name="group.groupsName">
        <!--工具条-->
        <el-form :inline="true">
           <el-form-item>
                <el-date-picker v-model="filters.date" type="date" placeholder="回复时间查询">
                </el-date-picker>
            </el-form-item>
            <el-form-item > 
                <el-input v-model="filters.account" placeholder="用户账号查询"></el-input>
            </el-form-item>
            <el-form-item  style="margin-right: 10px;" class="inline fl">
                <el-select  v-model="filters.isReply"  clearable   placeholder="请选择回复状态">
					<el-option key="false" label="未回复" value="false"/>
					<el-option key="true" label="已回复" value="true"/>
			    </el-select>
            </el-form-item>                
            <el-form-item > 
                <el-button type="primary" @click="getList()">查询</el-button>
            </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">
       
          <!--  <el-table-column prop="id" label="序号"  width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">  {{datas.length - scope.$index}}</div>
                    <div v-else>  {{datas.length - scope.$index}}</div>
                </template>
            </el-table-column>
            -->
            <el-table-column prop="account" label="用户账号" width="200" >
            </el-table-column>
            <el-table-column prop="askContentShow" label="提问内容" width="350" >
                <template scope="scope">
                    <div v-html="scope.row.askContentShow"></div>
                </template>
            </el-table-column>
            <el-table-column prop="replyContentShow" label="答复内容" width="350" >
                <template scope="scope">
                    <div v-html="scope.row.replyContentShow"></div>
                </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作账号" width="150" >
            </el-table-column>
            <el-table-column  label="操作" min-width="300">
                <template v-if="group.status" scope="scope">
                    <el-button v-if="scope.row.reply" disabled size="small">已回复</el-button>
                    <el-button v-else  type="danger" size="small"  @click="handleEdit(scope.$index, scope.row)">回复</el-button>

                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button v-if="!scope.row.reply" disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                    <el-button v-else type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>

                    <el-button v-if="!scope.row.reply" disabled type="danger" size="small"  @click="showStatus(scope.$index, scope.row)" >显示至前台</el-button>
                    <el-button v-else-if="scope.row.show" type="info" size="small"  @click="showStatus(scope.$index, scope.row)" >已显示至前台</el-button>
                    <el-button v-else type="danger" size="small"  @click="showStatus(scope.$index, scope.row)" >显示至前台</el-button>
                </template>
                <template v-else scope="scope">
                    <el-button v-if="scope.row.reply" disabled size="small">已回复</el-button>
                    <el-button v-else  type="danger" disabled size="small"  @click="handleEdit(scope.$index, scope.row)">回复</el-button>

                    <el-button size="small" disabled @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button v-if="!scope.row.reply" disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                    <el-button v-else type="danger" disabled size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>

                    <el-button v-if="!scope.row.reply" disabled type="danger" size="small"  @click="showStatus(scope.$index, scope.row)" >显示至前台</el-button>
                    <el-button v-else-if="scope.row.show" disabled type="info" size="small"  @click="showStatus(scope.$index, scope.row)" >已显示至前台</el-button>
                    <el-button v-else type="danger" disabled size="small"  @click="showStatus(scope.$index, scope.row)" >显示至前台</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
    </el-tab-pane>
  </el-tabs>
  <!--编辑界面-->
  <el-dialog  :title='dialogTitle'  :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :label-position='labelPosition'  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
            <div class="head">
             <div>{{editForm.account}}</div>
             <div style="color:#999999">{{editForm.askTime}}</div>
             <div><el-tag style="border-radius:64px" type="info">{{editForm.stockCode}}</el-tag></div>
            </div>
            <div>{{editForm.askContent}}</div>
            <el-form-item style="margin-top: 20px;"  label="回复内容" prop="replyContent">
                <el-input  type="textarea" :rows="4"  v-model="editForm.replyContent" placeholder="请输入回复内容，最多不超过150个汉字">
                </el-input>
                <!--<quill-editor class="ql-img-hidden" v-model="editForm.content" 
                            :options="editorOption">-->
              </quill-editor>
            </el-form-item>
            <el-form-item  label="添加图片：" prop="replyImage" >
              <el-upload
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
              </el-upload>                    
            </el-form-item>
            <el-form-item>
              <el-checkbox  v-model="editForm.show">显示至前台</el-checkbox>
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
import {imageDefault} from "../../common/js/urls";
export default {
    data() {
        return {
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
                account:'',
                isReply:'',
            },
            dialogVisible: false,//编辑界面是否显示                    
            dialogTitle:'回复',
            editForm:{

            },
            rules: {
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
          this.editForm.replyImage =imageDefault + res.message;
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
                if(row.show){
                    this.$message({message: '请先取消在前台展示，再删除回复内容',
                                   type: 'warning'});
                    return;                    
                }
                this.editForm = Object.assign({}, row);
                    this.$confirm('若确认删除该回复内容则前端将不再展示，确定要删除该回复信息吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.deleteReplyExpertServiceById(this.editForm.id)
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
                            let params={
                                id:this.editForm.id,
                                operator:this.userName,                                
                                replyContent:this.editForm.replyContent,
                                replyImage:this.editForm.replyImage,
                                show:this.editForm.show
                            }
                            let resp=await api.replyExpertService(params)
                               if(!resp||!resp.state){
                                this.$message({
                                        message: '回复失败: '+((resp?resp.data:'')),
                                        type: 'error'
                                    });
                               }else if(resp.state){
                                     this.$message({
                                        message: '回复成功',
                                        type: 'success'
                                    });
                                    this.getList()
                               }
                                this.dialogVisible = false;                               
                    });
                }
            });
        },        
      
        resetForm(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },        
        handleEdit(index,row){
            this.dialogVisible = true;
            this.editForm={
                id:row.id,
                account:row.account,
                askContent:row.askContent,
                askTime: new Date(row.askTime).format('yyyy-MM-dd hh:mm'),
                stockCode:row.stockCode,
                replyContent:row.replyContent,
                replyImage:row.replyImage,
                show:row.show
            }
            this.fileList=[]
            if(this.editForm.replyImage){
                this.fileList=[{name:this.editForm.replyImage,url:this.editForm.replyImage}]
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
                    group: this.activeName
                } 
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.account&&(params.account=this.filters.account)
                if(this.filters.isReply==='true'){
                    params.reply=true;
                }else if(this.filters.isReply==='false'){
                    params.reply=false;
                }
                let resp=await api.findExpertServiceByPage(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                data.list.forEach(d=>{
                    d.askContentShow=new Date(d.askTime).format('yyyy-MM-dd hh:mm')+"<p>"+d.askContent
                    if(d.stockCode){
                        d.askContentShow+='<div><el-tag class="el-tag el-tag--info" style="border-radius:64px" type="info">'+d.stockCode+'</el-tag>'
                    }

                    let replyContentShow='';
                    if(d.replyContent){
                        replyContentShow+=new Date(d.replyTime).format('yyyy-MM-dd hh:mm')+"<p>"+d.replyContent
                    }
                    if(d.replyImage){
                        replyContentShow+="<div>"+"<img style='width: 100%' src="+d.replyImage+"></img>"
                    }
                    d.replyContentShow=replyContentShow
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
       await this.getGroups()
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
