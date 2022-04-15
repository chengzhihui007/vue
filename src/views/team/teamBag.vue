<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			  <el-form-item>
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"     @click="handleAdd">添加</el-button>
				</el-form-item>


               
			 
				<el-form-item style="float:right;"> 
					<el-button type="primary"     @click="batchView('0')" :disabled="false">播放量注水-源达</el-button>
				</el-form-item>
			 
			</el-form>
		</el-col>

 

					<el-table :data="starComeTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
						<el-table-column
								type="selection"
								width="55">
						</el-table-column>
						<!--<el-table-column type="index" width="60">
						</el-table-column>
						-->
						 
						<el-table-column prop="name" label="锦囊名称"  width="200">
						</el-table-column>


                        <el-table-column prop="content" label="简介"  width="300">
						</el-table-column>
						 

						<el-table-column label="播放量-实数|总数" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
								|
								<span>{{ scope.row.view }}</span>

							</template>
						</el-table-column>

						<el-table-column prop="delMsg" label="状态"  width="60">
						</el-table-column>


					 
						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="small"      @click="handleEdit(scope.$index, scope.row)"  >编辑</el-button>

                                <el-button type="danger"  v-if="scope.row.delMsg == '启用'"  size="small" @click="handleDel(scope.$index, scope.row,'停用')">停用</el-button>
                                <el-button type="danger"  v-if="scope.row.delMsg == '停用'"  size="small" @click="handleDel(scope.$index, scope.row,'启用')">启用</el-button>
							 
							 
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
					</el-col>


		<!--批量点赞界面-->
		<el-dialog title="批量点赞" :visible.sync="BatchlikeDialogVisible"  center>


			<el-form  :model="likeFrom"  label-width="80px"    ref="likeFrom">


				<el-form-item>
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput,likeFrom.channel)"  :max="2000" style="width:220px;"></el-input-number>


				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput,0,likeFrom.channel)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>

		<!--批量浏览界面-->
		<el-dialog title="批量浏览" :visible.sync="BatchViewDialogVisible"  center>


			<el-form  :model="viewFrom"  label-width="80px"    ref="viewFrom">


				<el-form-item>

					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput,viewFrom.channel)"      style="width:220px;" ></el-input-number>
                      
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{viewFrom.view}}</font>   个浏览吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit(viewFrom.batchViewInput,1,viewFrom.channel)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>


			<!--弹窗数据-->
			<el-dialog title="添加" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >
					<el-input v-if="false" v-model="editruleForm.bag_id"  style="width:120px;"   ></el-input>
                    <el-input v-if="false" v-model="editruleForm.team_id"  style="width:120px;"   ></el-input>
			 
				 
					<el-form-item label="锦囊名称" prop="name">
                        <el-input v-model="editruleForm.name"  placeholder="（限6个汉字）" auto-complete="off" v-if="this.editOrAdd==true"></el-input>
                        <el-input v-model="editruleForm.name" auto-complete="off" v-else="" :disabled="true"></el-input>

						<!-- <el-input v-model="editruleForm.name"  style="width:400px;" auto-complete="off" v-if="this.editOrAdd==true"  placeholder="请填写名称"></el-input>
                        <el-input v-model="editruleForm.name"  style="width:400px;" auto-complete="off" v-else=""   placeholder="请填写名称"></el-input> -->
                    </el-form-item>
 
 
					<el-form-item label="锦囊简介" prop="content">
						<el-input type="textarea" :rows="5"   v-model="editruleForm.content"   :onkeyup="checkContent(editruleForm.content)"  placeholder="请填写简介" ></el-input>
                        {{this.checkMsg}}
					</el-form-item>


				  

					 
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editclass = false">取 消</el-button>
					<el-button type="primary" @click="submiteditForm()" :loading="editLoading">确 定</el-button>
				</div>
			</el-dialog>

	</section>
</template>

<script>
    import {teamBagPageList,teamBagSave,teamBagDel,batchViewAdd} from "../../api/ydApi.js";
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
                page:1,
                playAddressFileList: [],
                sels: [], //列表选中列
                BatchlikeDialogVisible:false,
                likeFrom:{

                    batchLikeInput:"",
                    like:"",
                    channel:""

                },
                BatchViewDialogVisible:false,
                viewFrom:{

                    batchViewInput:"",
                    view:""

                },
                editLoading: false,
                editOrAdd: false,
                editruleForm: {
                   
                    title: "",

                   
                    content:"",
                   
                    bag_id:""
                   

                },
                listLoading: false,
                compereFrom:{},
                teacherFrom:{},
                compere:"",
                teacher:"",
                title:"",
                update_time:"",
                region:"",
                selectMin:"",
                selectMax:"",
                total: 0,
                pageSize: 30,
                currentPage: 1,
				loading: false,
                starComeTables: [],
                scorelist: [],
				editclass: false,
				editrules: {
                   
                    content: [
                        { required: true, message: "请输入简介", trigger: "blur" } 
                    ],
                    name:[
                        { required: true, message: "请输入名称", trigger: "blur" },
                            {
                                max:6,
                                trigger: "blur",
                                message: "（限6个汉字）"
                                /*validator: numbers,
                                message: "内容超出限制",
                                trigger: "blur",
                                num: 40*/
                            }
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
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAF(response, fileList) {
                this.editruleForm.play_address = ""
                this.editruleForm.video_length = ""
            },
            handleChangeAddAF(response, file, fileList) {
                this.editLoading = true;

                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {
                    _this.editLoading = false;
                    console.log("已发送");
                    var data = JSON.parse(evt.data)
                    console.log(data);
                    _this.editruleForm.play_address = data.origUrl
                    _this.editruleForm.video_length = data.durationMsec

                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }
              /*  console.log(response);
				this.editruleForm.play_address = response.origUrl
                this.editruleForm.video_length = response.durationMsec
				console.log(response.origUrl);
                console.log(response.duration);*/
            },
            likeEvent(a,b){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a,
                    channel:b

                };

                //alert("1");

            },
            viewEvent(a,b){
                this.viewFrom ={
                    view:a,
                    batchViewInput:a,
                    channel:b

                };



                //alert("1");

            },
            batchLike(a){
                console.log(this.sels);
                this.likeFrom= {

                    batchLikeInput:"",
                    like:"",
                    channel:a

                }

                if(this.sels.length < 1){

                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });

                    this.BatchlikeDialogVisible = false;
                }else{
                    this.BatchlikeDialogVisible = true;
                }


            },
            batchView(a){
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                
                this.viewFrom= {

                    batchViewInput:"",
                    view:"",
                    channel:a

                }

                if(this.sels.length < 1){

                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });

                    this.BatchViewDialogVisible = false;
                }else{
                    this.BatchViewDialogVisible = true;
                }


            },

            async   batchLikeSubmit(a,b,c){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].bag_id
                    }else{
                        dataArray += ","+this.sels[i].bag_id
                    }


                }
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:c,
                    model:"1",
					flag:b
                };

                console.log(para)
                let    resultVo =    await api.batchLikeAndViewAdd(para);
                this.editLoading = false;

                this.BatchlikeDialogVisible = false


                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: resultVo.message
                });


            /*    this.$message({
                    message: "批量点赞成功",
                    type: "success"
                });*/

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.bag_id DESC ",
                      team_id:this.team_id
                };

              
                this.starComePage(para);

			},
            async   batchViewSubmit(a,b,c){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].bag_id
                    }else{
                        dataArray += ","+this.sels[i].bag_id
                    }


                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:c,
                    model:"1",
                    flag:b,
                    team_id:this.team_id
                };

                console.log(para)
                   //await  api.batchLikeAndViewAdd(para);


                   
                     batchViewAdd(para).then((res) => {
                                
                                this.editLoading = false;

                                this.BatchViewDialogVisible = false

                    

                                this.$notify({
                                    title: '提示',
                                    dangerouslyUseHTMLString: true,
                                    message: "注水成功!"
                                });

                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                    orderBy:"a.bag_id DESC ",
                                    team_id:this.team_id
                                };
                                this.starComePage(para);

                            });

                

            },
            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

                  let  len  =    this.getStrLenght(this.editruleForm.content);
               if(30 > len || len> 50 ){

                    this.$message({
                        message: "简介（限30-50个汉字）！",
                        type: "error"
                    });
                     return  false;
               }
                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                            if (this.editOrAdd) {


                                let para = Object.assign({}, this.editruleForm);
                             
                                para.flag = 1;
                                para.channel = 2;

                                   teamBagSave(para).then((res) => {
                                    this.editclass = false;

                                      if(res.data.success){
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
                                   
                                    this.editLoading = false;

                                   var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                        orderBy:"a.bag_id DESC ",
                                       team_id:this.team_id
                                    };
                                    this.starComePage(para);
                                });
                               
                            } else {
                             
                                let para = Object.assign({}, this.editruleForm);
                                console.log(para);
                               
                                para.flag = 0;
                                para.channel = 2;
                                   teamBagSave(para).then((res) => {
                                    this.editclass = false;
                                    if(res.data.success){
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
                                    this.editLoading = false;

                                   var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                        orderBy:"a.bag_id DESC ",
                                        team_id:this.team_id
                                    };
                                    this.starComePage(para);
                                });
                            }
                            

                        });
                    }
                });
			},
            handleDel: function(index, row,msg) {
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                this.$confirm("   您确定"+msg+"该记录吗？", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        //NProgress.start();
                        console.log(row);
                      

                        teamBagDel(row.bag_id).then((res) => {

                            this.listLoading = false;
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });

                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                            orderBy:"a.bag_id DESC ",
                            team_id:this.team_id
                        };
                        this.starComePage(para);

                        });

                        


                    })
                    .catch(() => {});
            },

            handleAvatarSuccess(res, file) {

                this.editruleForm.cover =imageDefault+ res.message;
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
           
            async selectTeacherList(flag) {
                let paras = {
                    //pageNo: this.page,
                    //pageSize: 10,
					flag:flag
                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.teacherFrom=arr;
                this.listLoading = false;
            },
            async selectCompereList(flag) {
                let paras = {
                    //pageNo: this.page,
                    //pageSize: 10,
                    flag:flag

                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.compereFrom=arr;
                this.listLoading = false;
            },
            handleCurrentChange(val) {
                this.page = val;

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.bag_id DESC ",
                      team_id:this.team_id
                };
                this.starComePage(
                    para
                );

            },
            async starComePage(keyword) {

                teamBagPageList(keyword).then(res => {
                    
                    this.starComeTables = res.data.list;

                    this.total = res.data.total;


                });
          
            },
            handleAdd(){
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }
                var periodAdd = 1;


         

                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    bag_id:"",
                  
                    name:"",
                   team_id:this.team_id,
                    content:""
                    
                }
                this.playAddressFileList = [];
                this.editruleForm = result;
 
               
			},
            handleEdit(index, row) {
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    bag_id:row.bag_id,
                    team_id:this.team_id,
                    name:row.name,
                 
                    content:row.content
                

                }
                this.playAddressFileList = [
                    { name: row.play_address, url: row.play_address }
                ];

                this.editruleForm = result;

            }
            //-------------------------


        },
        mounted() {
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;
            
            console.log(userArray);
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.bag_id DESC ",
                team_id:this.team_id
            };
            this.starComePage(para);

            
            //this.selectTeacherList(0);
            //this.selectCompereList(1);
          

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
	.active {
		color:blue;
	}
</style>




