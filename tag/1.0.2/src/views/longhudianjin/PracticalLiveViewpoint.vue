<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          
            <el-form :inline="true">
               <el-form-item>
                    <el-date-picker v-model="filters.date" type="date" placeholder="时间查询">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                <el-select v-model="filters.labelId"  clearable  placeholder="请选择标签">
						<el-option
								v-for="label in labels"
								:key="label.id"
								:label="label.name"
								:value="label.id">
						</el-option>
					</el-select>
                     </el-form-item>
                     <el-form-item > 
                    <el-button type="primary" @click="getList()">查询</el-button>
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
            <el-table-column prop="createTime" label="发布时间" width="300" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.createTime }}</div>
                    <div v-else>{{ scope.row.createTime }}</div>
                </template>            
            </el-table-column>
             <el-table-column prop="label.id"  v-if="false" >
            </el-table-column>
            <el-table-column prop="lastLabel" label="标签" width="300" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">{{ scope.row.lastLabel }}</div>
                    <div v-else>{{ scope.row.lastLabel }}</div>
                </template>            
            </el-table-column>        
            <el-table-column prop="content" label="内容" width="300" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted" v-html="scope.row.content"></div>
                    <div v-else v-html="scope.row.content" ></div>
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
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="page" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <el-form-item label="选择标签" prop="labelId">
                    <el-select  v-model="editForm.labelId"   clearable  placeholder="请选择标签">
						<el-option
								v-for="label in labels"
								:key="label.id"
								:label="label.name"
								:value="label.id">
						</el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="直播内容" prop="content">
                    <!--<el-input  type="textarea" :rows="4"  v-model="editForm.content"></el-input>-->
                                     <!-- bidirectional data binding（双向数据绑定） -->
                     <quill-editor class="ql-img-hidden" v-model="editForm.content" 
                                  :options="editorOption">
                    </quill-editor>
                </el-form-item>
 
                <el-form-item  label="内容图片：" prop="contentImg" >
              <!--      <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleImageSuccess" :before-upload="beforeImageUpload">
                        <img v-if="editForm.contentImg" :src="editForm.contentImg" class="avatar"></img>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    -->
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
                    <el-button @click="resetForm('editForm')">取消</el-button>
                    <el-button type="primary" @click="editSubmit('editForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
 
</template>
  
<script>
    import '../../common/js/DateFormat';
    import {imageDefault} from "../../common/js/urls";
    import {listPracticalLive,insertPracticalLive,updatePracticalLive,deletePracticalLive,listPracticalLiveLabel} from "../../api/cyApi.js";
    export default {
        data() {
            return {
                fileList: []
            ,
        editorOption: {
            placeholder:'请输入内容',
          // some quill options
        },
                labels:[],
                filters: {
                    date: '',
                    labelId: ''
                },
                datas: [],
                total: 0,
                page: 1,
                dialogTitle: "添加",
                editOrAdd:false,
                total: 0,
                page: 1,
                team_id:"",
                pageSize: 10,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    labelId: '',
                    content: '',
                },
                rules: {
                    content: [
                        {required: true, message: '请填写直播内容', trigger: 'blur'},
                        // {max: 500, message: '长度在500个字符', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            let c=value||'';
                            let div=document.createElement("div");div.innerHTML=c;c=div.textContent||'';
                            if(c.length>500){
                                callback(new Error("长度在500个字符"))
                            }
                            callback()
                        },trigger: 'blur'}                        
                    ] 
                },
            }
        },
        methods: {
          handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleBeforeUpload(file){
                if("image/jpeg"!=file.type&&"image/jpg"!=file.type){
                    this.$message.warning(`仅支持jpg格式`);
                    return false;
                }    
            },            
            handleImageSuccess(res, file) {
              this.editForm.contentImg =imageDefault + res.message;
            },
            handleRemove(response, fileList) {
                this.editForm.contentImg = "";
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
            handleCurrentChange(val) {
                this.page = val;
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
            getList() {
                this.listLoading = true;
                let params={
                    page:this.page,
                    size:this.pageSize
                } 
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.labelId&&(params.labelId=this.filters.labelId)
                 
                listPracticalLive(params).then(res => {
                    let resp=res.data;
                    if(!resp){
                        return;
                    }
                    let data=resp.data;
                    //处理内容和内容图片
                    // data.result.forEach(rs=>{
                    //     let reg=rs.content.match(/<div><img src=.*><\/img><\/div>$/)
                    //     if(reg){
                    //        rs.content=rs.content.substring(0,reg.index)
                    //        let d=document.createElement("div")
                    //        d.innerHTML=reg[0]
                    //        rs.contentImg=d.querySelector("img").src
                    //     }
                    // })
                    this.datas=data.result
                    this.total = data.total;
                    this.listLoading = false;
                });
            },
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);
                
                    this.$confirm('确认删除该标签吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let params={
                            id: this.editForm.id
                            }
                        deletePracticalLive(params).then(res => {
                              let resp= res.data;
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
                        });
                    }).catch(() => {
                    });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "实战直播修改";
                this.dialogVisible = true;
                this.editForm= {
                    id: row.id,
                    labelId: row.label&&row.label.id,
                    content: row.content,
                    contentImg:row.contentImg,
                }
                this.fileList=[]
                // 处理内容和内容图片
                // let reg=this.editForm.content.match(/<div><img src=.*><\/img><\/div>$/)
                // if(reg){
                //    this.editForm.content=this.editForm.content.substring(0,reg.index)
                //    let d=document.createElement("div")
                //    d.innerHTML=reg[0]
                //    this.editForm.contentImg=d.querySelector("img").src
                //    this.fileList=[{name:this.editForm.contentImg,url:this.editForm.contentImg}]
                // }
                if(this.editForm.contentImg){
                    this.fileList=[{name:this.editForm.contentImg,url:this.editForm.contentImg}]
                }
            },
            //显示新增界面
            handleAdd: function () {
                this.editOrAdd = true;
                this.dialogTitle = "实战直播添加";
                this.dialogVisible = true;
                this.editForm = {
                    labelId: '',
                    content: '',
                    contentImg:''
                };
            },
            //编辑
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            if(this.editOrAdd ==false){
                                let params={
                                    id:this.editForm.id,
                                    labelId:this.editForm.labelId,
                                    content:this.editForm.content,
                                    contentImg:this.editForm.contentImg
                                }
                                // if(this.editForm.contentImg){
                                // let img=this.editForm.contentImg
                                // img=`<div><img src='${img}'></img></div>`
                                // params.content=params.content+img
                                // }
                                  updatePracticalLive(params).then(res=>{
                                    this.dialogVisible = false;
                                   let resp= res.data;
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
                                }) 
                            }if(this.editOrAdd==true){
                                let params={
                                    labelId:this.editForm.labelId,
                                    content:this.editForm.content,
                                    contentImg:this.editForm.contentImg
                                }
                                // if(this.editForm.contentImg){
                                // let img=this.editForm.contentImg
                                // img=`<div><img src='${img}'></img></div>`
                                // params.content=params.content+img
                                // }
                                insertPracticalLive(params).then(res=>{
                                    this.dialogVisible = false;
                                   let resp= res.data;
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
                                }) 
                            }
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            getLabels(){
                let params={
                    page:-1,
                    size:-1
                }
                listPracticalLiveLabel(params).then(res=>{
                    let resp= res.data;
                    if(!resp||!resp.state){
                        this.$message({
                        message: '查询所有标签失败: '+(resp?resp.data:''),
                        type: 'error'
                        });
                    }else if(resp.state){
                        this.labels=resp.data.result
                     }
                })
            }
        },
        mounted() {
            this.getLabels();
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;
            this.getList();
        }
    }

</script>

<style  >
/*.ql-toolbar.ql-snow button.ql-script
,.ql-toolbar.ql-snow button.ql-direction
,.ql-toolbar.ql-snow span.ql-picker
,.ql-toolbar.ql-snow button.ql-clean
,*/
 
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
<style >
.ql-container{
 height: 10em;
}
.ql-toolbar.ql-snow{
    line-height:initial;
}
 .ql-toolbar.ql-snow button.ql-link
, .ql-img-hidden .ql-toolbar.ql-snow button.ql-image
,.ql-toolbar.ql-snow button.ql-video
{
    display: none;
}
</style>