<template>
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
               <el-form-item>	
                   <el-input id="title" v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getHqBytitle">查询</el-button>
				</el-form-item>
               <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        	<!--列表-->
		<el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
		    <el-table-column prop="title" label="指标名称"  sortable>
			</el-table-column>
            <el-table-column prop="port" label="设备端口" width="180" >
            </el-table-column>
            <el-table-column prop="pay" label="是否付费" width="120" >
            </el-table-column>
			<el-table-column prop="update_time" label="更新时间":formatter="formatfoatUpdatetime" min-width="60" sortable>
			</el-table-column>	
           <el-table-column label="操作" width="150">
		     <template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index,scope.row.market_id)">编辑</el-button>
            </template>
			</el-table-column>
		</el-table>
 <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"   :close-on-click-modal="false" >
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
             <el-form-item label="指标名称" prop="title">
                <el-input v-model="editForm.title"  placeholder="(限20个字以内)"></el-input>
             </el-form-item>
                <el-form-item  label="图片文件："   prop="cover" >
                    <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="editForm.cover" :src="editForm.cover" width="600px" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                 <el-form-item label="视频文件" prop="play_address">
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp3,.mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF"  :on-exceed="handleExceed" :file-list="playAddressFileList">
							<el-button size="small" type="primary">点击上传视频</el-button>
							
						</el-upload>
                        	<el-input   v-model="editForm.play_address" auto-complete="off" :disabled="true"></el-input>
					</el-form-item>
					
               <el-form-item label="设备端口" prop="app">
                    <el-radio-group v-model="editForm.app">
                        <el-radio :label="0" >app</el-radio>
                        <el-radio :label="1" >pc</el-radio>
                        <el-radio :label="2" >app和pc</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否收费" prop="cost">
                    <el-radio-group v-model="editForm.cost" >
                        <el-radio :label="0">免费</el-radio>
                        <el-radio :label="1">付费</el-radio>
                    </el-radio-group>
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
    import {imageDefault,pdfDefault} from "../../common/js/urls";
    import util from '../../common/js/util'
import api from '../../api/api.js';

export default {
    data() {
        return {
                dialogTitle: "新增",
                editOrAdd:false,
                datas: [],
                total: 0,
                page: 1,
                pageSize:15,
                currentPage: 1,
                listLoading: false,
                sels: [],//列表选中列
                  //编辑界面数据
                editForm: {
                  title:"",
                  cover:"",
                  play_address:"",
                  video_length:"",
                  app:'',
                 
                },
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                     title: [
                       { required: true, message: "请输入标题", trigger: "blur" },
                     ],
                     play_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],
                    cover: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ],
                    app:[{ required: true, message: "请选择设备", trigger: "blur" }],
                    cost:[{ required: true, message: "请选择是否收费", trigger: "blur" }],
                },
                filters: {
					title: ''
                },
                playAddressFileList: [],
                coverFileList: [],
                defaultModules: {
                    toolbar: ['image']
                }
         }
    },
    methods: {
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAF(response, fileList) {
                this.editForm.play_address = ""
                this.editForm.video_length = ""
            },
            handleChangeAddAF(response, file, fileList) {
              // this.editForm.play_address = response.origUrl;
               //this.editForm.video_length = response.durationMsec;
                //this.playAddressFileList = [{ name: this.editForm.play_address, url: this.editForm.play_address }];
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
                     _this.editForm.play_address = res.origUrl;
                    _this.play_address = res.origUrl;
                     _this.video_length = res.durationMsec;
                     _this.editForm.video_length = res.durationMsec;
                     _this.playAddressFileList = [{ name: _this.play_address, url: _this.play_address }];
                    _this.editLoading = false;
                     ws.close(); 
                };
                 ws.onclose = function(){
                    console.log("连接已关闭...");
                }
             },
             handleAvatarSuccess(res, file) {
                 this.editForm.cover =imageDefault + res.message;
                //this.editForm.cover ='http://app2.zslxt.com/image/' + res.message;
               this.coverFileList = [{ name: this.editForm.cover, url: this.editForm.cover}];
               console.log(this.editForm.cover);
            },
            handleChangeAddTP(response, file, fileList) {
               
                 this.editForm.cover = imageDefault+response.message;
                  //console.log(this.editForm.cover);
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
         //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.playAddressFileList = [];
                this.coverFileList = [];
                this.clearEdit()
                this.showUeEdit = true;
         },
        //显示编辑界面
            async handleEdit (index, id) {
            this.dialogTitle = "编辑";
               this.editOrAdd = false;
                this.dialogVisible = true;
                let res = await api.getZhiBiaoDetail(id);

                this.editForm = { ...res };
                this.editForm.title=res.title;
                this.coverFileList = [{ name: res.cover, url: res.cover }];
                this.playAddressFileList = [{ name: res.play_address, url: res.play_address }];
                this.showUeEdit = true;
             },
          async addSubmit() {
                this.$refs["editForm"].validate(async valid => {
                if (valid) {
               this.editLoading = true;
               if (this.editOrAdd == false) 
               {
                 let result = await api.updateZhiBiao(this.editForm);
                   if (result == "1") {
                   this.$message({
                       message: '提交成功',
                       type: 'success'
                   });
                   this.$refs["editForm"].resetFields();
                   this.dialogVisible = false;
                   this.getHq();
               }
                    else{
                          this.$message.error('错了哦，错误消息');
                    }
              }
            if (this.editOrAdd == true) {
           
               let result = await api.addZhiBiao(this.editForm);
               if (result == "1") {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                 this.$refs["editForm"].resetFields();
                 this.dialogVisible = false;
                 this.getHq();
                }
              else{
                  this.$message.error('错了哦，添加错误！');
             }
            }
             this.editLoading = false;
             }
          });
         },
         async getHqBytitle(){
				let lists=await api.getByZhiBiaoTitle(document.getElementById("title").value.trim());
				let arr = [];
				for(let i=0;i<lists.length;i++){
					arr.push(lists[i]);
				}
				this.datas=arr;
			},
        async getHq() {
              let paras = {
                    pageNo: this.page,
                    pageSize: 20,
                    title:this.title,
                    play_address:this.play_address,
                 };
                let list=await api.getZhiBiao(paras);
                for(var i=0;i<list.length;i++){
                   if(list[i].app==1){
                        list[i].port="pc"
                    }else if(list[i].app==0){
                        list[i].port="app"
                    }else{
                        list[i].port="app和pc"
                    }
                   if(list[i].cost==0){
                       list[i].pay="免费"
                    }else{
                       list[i].pay="收费"
                 }
                }
               this.datas=list;
         },
        //恢复编辑页面为默认
        clearEdit(){
                let tmpObj = {
                 cover:""   
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            selsChange: function(sels) {
              this.sels = sels;
             },
           handleChangeAddTP(response, file, fileList) {
           if(response.status=='1'){
               this.editForm.cover = response.message
              }
              },
             handleRemoveAddTP() {},
             exceed(){
                     this.$message({
                      message: "图片数量超出限制！",
                         type: "warning"
                  });
                },
            formatfoatUpdatetime:function(row){
                var timestamp = new Date(row.update_time);//直接用 new Date(时间戳) 格式转化获得当前时间
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            }
          },
    mounted() {
        this.getHq();
       
    }
}


</script>

<style lang="scss">
.toolbar .el-form-item {
    margin-bottom: 20px;
}
</style>

