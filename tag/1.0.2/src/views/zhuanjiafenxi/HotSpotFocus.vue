<template>
<div>
    <section v-if="$route.path === '/hotSpotFocus'">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          
            <el-form :inline="true">
               <el-form-item>
                    <el-date-picker v-model="filtersform.date" type="date" placeholder="时间查询">
                    </el-date-picker>
                </el-form-item>
                         <el-form-item > 
                    <el-input v-model="filtersform.title" placeholder="请输入关键字搜索"></el-input>
                    </el-form-item>
                     <el-form-item > 
                    <el-button type="primary" @click="query()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button   type="primary"  @click="handleAdd">添加</el-button>
                    </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="id" label="序号"  width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">  {{datas.length - scope.$index}}</div>
                    <div v-else>  {{datas.length - scope.$index}}</div>
                </template>
            </el-table-column>
                         
            <el-table-column prop="title" label="标题" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.title }}</div>
                    <div v-else>{{ scope.row.title }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="title" label="相关个股" width="300" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.stockStr }}</div>
                    <div v-else>{{ scope.row.stockStr }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.createTime }}</div>
                    <div v-else>{{ scope.row.createTime }}</div>
                </template>            
            </el-table-column>

            <el-table-column prop="lastOperator" label="最近操作账号" width="200" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.operator }}</div>
                    <div v-else>{{ scope.row.operator }}</div>
                </template>            
            </el-table-column>
            <el-table-column label="操作" min-width="200">
                <template scope="scope">
                    <div v-if="scope.row.deleted">
                        <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >已删除</el-button>
                    </div>
                    <div v-else>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <el-form-item label="标题填写" prop="title">
                    <el-input  v-model="editForm.title" placeholder="不超过30个汉字"></el-input>
                </el-form-item>
                <el-form-item label="添加语音" prop="audioAddress" ref="upload">
                    <el-upload v-model="editForm.audioAddress" class="upload-demo" action="/api/file/fileUpload/" accept=".mp3" :on-success="handleAudioSuccess" :on-remove="handleRemove"
                        :limit="1"
                        :before-upload="handleAudioBeforeUpload"
                        :on-exceed="handleExceed"
                        :file-list="audioFileList">
                    <el-button size="small" type="primary">点击上传语音</el-button>
                    <div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传语音</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('editForm')">取消</el-button>
                    <el-button type="primary" @click="editSubmit('editForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
     <router-view v-else></router-view>
 </div>
</template>
  
<script>
    import '../../common/js/DateFormat';
    import {listPracticalSolution,insertPracticalSolution,updatePracticalSolution,deletePracticalSolution} from "../../api/cyApi.js";
    import api from "../../api/api.js"
    import {mp3Default} from "../../common/js/urls";
    export default {
        props:["vipNum","type"],
        data() {
            return { 
                audioFileList:[],
                 
                filters: {
                    date: '',
                    title: '',
                },
                filtersform: {
                    date: '',
                    title: '',
                },
                datas: [],
                pageNum: 1,
                pageSize: 15,
                total: 0,
                dialogTitle: "添加",
                editOrAdd:false,
                team_id:"",
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                   
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                        {max: 30, message: '长度在30个字符', trigger: 'blur'}
                    ],
                     category: [
                         { required: true, message: '请选择分类', trigger: 'blur' }
                    ],
                    audioAddress: [
                        { required: true, message: "请选择语音文件", trigger: "change" }
                    ]
                },
            }
        },
        watch: {
          '$route'() {
                if(this.$route.path=='/hotSpotFocus'){
                    this.getList();
                }
            }  
        },
        methods: {
            handleRemove(response, fileList) {
                this.editForm.audioAddress = "";
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleAudioBeforeUpload(file){
                if("audio/mp3"!=file.type){
                this.$message.warning(`仅支持mp3格式`);
                return false;
                }
            },
            handleAudioSuccess(res, file) {
              this.editForm.audioAddress=mp3Default + res.message;
              let audioAddress=mp3Default + res.message;
              if(audioAddress){
                let audio=new Audio(audioAddress);
                audio.addEventListener("loadedmetadata",()=>{
                    let duration=audio.duration;
                    if(duration){
                       this.editForm.audioDuration=duration*1000
                    }
                });
             }
             this.$refs['upload'].clearValidate()
            },
       handleCurrentChange(val) {
           this.pageNum = val;
           this.getList();
       }, 
            combineEditFormContentAndImg(){
            },
            splitEditFormContentAndImg(){
            },
            resetForm(formName){
            this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            //获取列表数据
            async query() {
                this.filters.title = this.filtersform.title;
                this.filters.date = this.filtersform.date;
                this.pageNum = 1;
                this.getList();
            },
           async getList() {
                this.listLoading = true;
                let params={
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                } 
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.title&&(params.title=this.filters.title)
                let resp=await api.findHotSpotFocusByPage(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                data.list.forEach(d=>{
                    let names=[];
                    d.stocks.forEach(d=>{
                        names.push(d.stockName)
                    })
                    d.stockStr=names.join("、")
                    d.createTime=new Date(d.createTime).format('yyyy-MM-dd hh:mm')
                })
                this.datas=data.list
                this.total = data.total;
                this.listLoading = false;
            },
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);
                
                    this.$confirm('若删除该内容则不可恢复，确定要删除该内容吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       let resp=await api.deleteHotSpotFocusById(this.editForm.id)
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
            //显示新增界面
            handleAdd: function () {
                this.$router.push({path:'/hotSpotFocusAdd',query:{}})
            },   
            //显示编辑界面
            handleEdit: function (index, row) {
                this.$router.push({path:'/hotSpotFocusEdit',query:{id:row.id}})
            },
            //编辑
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!this.editForm.audioDuration){
                            this.$message.warning(`正在获取音频时长，请稍等...`);
                            return;
                        }
                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            if(this.editOrAdd==true){
                                let params={
                                    title:this.editForm.title,
                                    audioAddress: this.editForm.audioAddress,
                                    audioDuration: this.editForm.audioDuration,
                                    vipNum:this.vipNum,
                                    type:this.type,
                                    lastOperator:this.userName
                                }
                                let resp=await api.insertSolutionVideo(params)
                                if(!resp||!resp.state){
                                 this.$message({
                                         message: '添加失败: '+(resp?resp.data:''),
                                         type: 'error'
                                     });
                                }else if(resp.state){
                                      this.$message({
                                         message: '添加成功',
                                         type: 'success'
                                     });
                                     this.page=1;
                                     this.getList()
                                }
                                this.dialogVisible = false;
                            }
                            if(this.editOrAdd ==false){
                                let params={
                                    id:this.editForm.id,
                                    title:this.editForm.title,
                                    audioAddress: this.editForm.audioAddress,
                                    audioDuration: this.editForm.audioDuration,                                    
                                    lastOperator:this.userName
                                }
                                let resp=await api.updateSolutionVideo(params)
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
            selsChange: function (sels) {
                this.sels = sels;
            },
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;
            this.userName=userArray.user_name
            this.getList();
        }
    }

</script>
<style  >
    .deleted-text{
        color: #999999;
    }
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