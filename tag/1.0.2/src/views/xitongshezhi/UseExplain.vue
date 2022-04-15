<template>
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <!--列表-->
		<el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
           <el-table-column prop="title"  width="100" label="账号类型">
            </el-table-column>
            <el-table-column prop="useExplainPath"  width="100" label="使用说明书">
            </el-table-column>
             <el-table-column prop="videoExplainPath"  width="100" label="视频说明书">
            </el-table-column>
            <el-table-column prop="update_time"  width="200" :formatter="formatfoatUpdatetime" label="发布时间">
			</el-table-column>
		  <el-table-column label="操作" width="250">
		     <template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"   @click="handleDel(scope.row)">删除</el-button>
                
			</template>
			</el-table-column>
		</el-table>
      <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="产品名称" >
                   <el-select v-model="editForm.title" style="width:193px;"  clearable  placeholder="请选择类型">
						<!--<el-option label="请选择" value="0"></el-option>-->
						<el-option label="财源三星用户" value="财源三星用户"></el-option>
						<el-option label="财源四星用户" value="财源四星用户"></el-option>
	                    <el-option label="财源五星用户" value="财源五星用户"></el-option>
					</el-select>
                 </el-form-item>
                   <el-form-item label="使用说明书："  prop="useExplainPath" >
                    <el-upload
                            class="upload-demo"
                            action="/api/UploadWordController/WordUpload/"
                            accept=".docx"
                            :limit="1"
                            :on-success="handleAvatarSuccess"
                            :on-error="fileError"
                            :file-list="wordAddressFileList"
                            >
                    
                        <el-button size="small" type="primary">点击上传Word文件</el-button>
                        <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传.docx文件</div>
                    </el-upload>
                </el-form-item>
                 <el-form-item label="视频说明书：" prop="videoExplainPath">
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp3,.mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF"  :on-exceed="handleExceed" :file-list="playAddressFileList">
							<el-button size="small" type="primary">点击上传视频</el-button>
							<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
						</el-upload>
                        	<el-input   v-model="editForm.videoExplainPath" auto-complete="off" :disabled="true"></el-input>
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
import {useexplainList,saveuseexplain,deleteuseexplain} from "../../api/cyApi.js";
export default {
    data() {
        return {
                id:'',
                page: 1,
                pageSize: 10,
                UseExplainPath:'',
                VideoExplainPath:'',
                dialogTitle: "新增",
                editOrAdd:false,
                datas: [],
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    
                },
                playAddressFileList: [],
                wordAddressFileList:[],
                users:{},
                editFormRules: {}
         }
    },
    methods: {
         //显示新增界面
            handleAdd: function () {
               this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                 this.playAddressFileList = [];
                   this.wordAddressFileList = [];
                this.clearEdit()
         },
         //删除
         handleDel: function(row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                    let strkey=row.id+','+row.title;
              deleteuseexplain(strkey).then(res=>{
             let result =res.data;
                if (result == 1) {
                    this.listLoading = false;
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                  
                } else {
                   // this.listLoading = false;
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                }
                  this.getuseexplain();
                })
            })
            .catch(() => {

            });
            },
        //显示编辑界面
            async handleEdit (index, row) {
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
               
                 if(this.editForm.videoExplainPath=="" || this.editForm.videoExplainPath==null){
                    this.playAddressFileList =[];
                    this.videoExplainPath="";
                }else{
                    this.playAddressFileList = [{name:this.editForm.videoExplainPath,url:this.editForm.videoExplainPath}];
                    this.playadddress=this.editForm.videoExplainPath;
                }

                if(this.editForm.useExplainPath=="" || this.editForm.useExplainPath==null){
                    this.wordAddressFileList =[];
                    this.useExplainPath="";
                }else{
                    this.wordAddressFileList = [{name:this.editForm.useExplainPath,url:this.editForm.useExplainPath}];
                  
                }

                
               // this.playAddressFileList = [{ name: VideoExplainPath, url: VideoExplainPath }];
            },
            
        async addSubmit() {
               this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        if(this.editOrAdd){
                          let para = this.editForm;
                          console.log(para);
                          //return false;
                          this.editForm.id=0;
                            // this.editForm.VideoExplainPath= this.VideoExplainPath;
                            // this.editForm.UseExplainPath=this.UseExplainPath;
                         // this.editForm.title=;
                          console.log(para);
                        //添加
                       saveuseexplain(para).then(res => {
                                    this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                    this.dialogVisible = false;
                                    this.editLoading = false;
                                    this.getuseexplain();
                                });
                     }else{
                          let para = this.editForm;
                         saveuseexplain(para).then(res => {
                                   this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                     this.dialogVisible = false;
                                    this.editLoading = false;
                                    this.getuseexplain();
                               });
                    }
                });
              }
           });
         },
        async getuseexplain(para) {
                para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                };
              useexplainList(para).then(res => {
                  let arr = [];
                    let lists=res.data;
                    for(let i=0;i<lists.length;i++){
                        arr.push(lists[i]);
                        lists[i].num=i+1;
                    }
                  this.datas = lists;
             });
           
         },
        //恢复编辑页面为默认
        clearEdit(){
            let tmpObj={
                useExplainPath:"",
                videoExplainPath:"",
            }
             this.editForm = Object.assign({}, tmpObj);
            },
            handleAvatarSuccess(res, file) {
                 let _this = this;
               let u='http://192.168.11.103:10001/word/' + res.message;
               console.log(u);
               this.editForm.useExplainPath ='http://192.168.11.103:10001/word/' + res.message;
                 console.log( this.editForm);
                _this.useExplainPath ='http://192.168.11.103:10001/word/' + res.message;
              //  this.editForm.cover ='http://app2.zslxt.com/image/' + res.message;
               // this.editForm.UseExplainPath ='http://ydgp.zslxt.com/image/' + res.message;
            },
             handleChangeAddAF(response, file, fileList) {
                this.editLoading = true;
                let _this = this;
                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function() {
                    console.log('已连接')
                ws.send(JSON.stringify(response))
                 };
                ws.onmessage  = function (evt){
                   console.log('已发送')
                    let res = JSON.parse(evt.data);
                     _this.editForm.videoExplainPath = res.origUrl;
                     let url=res.origUrl;
                    _this.videoExplainPath = res.origUrl;
                    // _this.playAddressFileList = [{ name: _this.VideoExplainPath, url: _this.VideoExplainPath }];
                    _this.editLoading = false;
                     ws.close(); 
                };
                 ws.onclose = function () {
                    console.log("连接已关闭...");
                }
             },
             handleRemoveAddAF(response, fileList) {
                this.videoExplainPath = "";
                this.editForm.videoExplainPath = "";
             
            },
           
             fileError(err, file, fileList){
                console.log(JSON.stringify(err));
               this.$message.error("上传文件失败");
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
         
            beforeAvatarUpload(file) {
                return true;
            },
            VideobeforeAvatarUpload(file) {
                return true;
            },
            formatfoatUpdatetime:function(row){
                var timestamp = new Date(row.update_time);
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            }
          },
    mounted() {
         var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
        this.getuseexplain(para);
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