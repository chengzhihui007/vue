<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
			
				<el-form-item>
					<el-date-picker
							v-model="update_time"
							type="date"
							placeholder="添加时间查询">
					</el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>

            <el-form-item style="margin:0 10px 0 650px ;">        <!--  style="float:center;" -->
                <el-button type="primary" v-on:click="handleAdd">添加</el-button>
            </el-form-item>

				<br>

				<el-form-item>
					<el-button type="primary"     @click="batchLike" :disabled="false">点赞量注水</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchView" :disabled="false">播放量注水</el-button>
				</el-form-item>
			</el-form>
		</el-col>






					<el-table :data="panQianJieDuTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">


						<el-table-column
								type="selection"
								width="55">
						</el-table-column>

                        <el-table-column type="index" width="55" label="序号" align=center>
                        </el-table-column>
						<el-table-column prop="todate" label="标题"  width="300" align=center>
						</el-table-column>
						

						<el-table-column label="播放量实数|总数" width="160" align=center>
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
								|
								<span>{{ scope.row.view }}</span>

							</template>
						</el-table-column>

						<el-table-column label="点赞实数|总数" width="160" align=center>
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
								|
								<span>{{ scope.row.like }}</span>

							</template>
						</el-table-column>

						<el-table-column prop="createtime" label="添加时间" width="220"  align=center>
						</el-table-column>
						
						<el-table-column label="操作" width="150" align=center>
							<template slot-scope="scope">
							
								<el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">修改
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
					</el-col>




            <!--批量点赞界面-->
		<el-dialog title="点赞量注水" :visible.sync="BatchlikeDialogVisible"  center>
			<el-form  :model="likeFrom"  label-width="80px"    ref="likeFrom">
				<el-form-item>
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput)"  :min="1" style="width:220px;"></el-input-number>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput,0)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>



            <!--批量播放量界面-->
		<el-dialog title="播放量注水" :visible.sync="BatchViewDialogVisible"  center>
			<el-form  :model="viewFrom"  label-width="80px"    ref="viewFrom">

				<el-form-item>

					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput)"  :min="1"  style="width:220px;" ></el-input-number>

				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{viewFrom.view}}</font>   个浏览吗？</p>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit(viewFrom.batchViewInput,1)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>



            <!--增加按钮    弹窗数据-->
			<el-dialog title="添加/编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="40%" left>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >

					

             

              

                    <el-form-item label="id"  prop="id"  style="display: none">
                        <el-input  v-model="editruleForm.id"  style="width:120px;"  ></el-input>
                        
                    </el-form-item>
                    
					<el-form-item label="音频" prop="path">
                            <el-upload  class="upload-demo" 
                                        action="https://wangyi.zslxt.com/cloud/ondemand/upload"
                                        accept=".mp3" 
                                        :on-success="handleChangeAddAF" 
                                        :on-remove="handleRemoveAddAF" 
                                        :limit="1" 
                                        :on-exceed="handleExceed" 
                                        :file-list="playAddressFileList">
                            <el-input  type="text" v-model="editruleForm.path" auto-complete="off"    :disabled="true" style="width:250px;"   ></el-input>
                           <!--  <el-input type="file"  style="width:250px; opacity: 0; display: none;"  v-model="editruleForm.filename" ></el-input> -->
							<el-input  auto-complete="off" :disabled="false" type="submit" value="上传音频" style="width:120px;"  ></el-input>
						</el-upload>
					</el-form-item>
      
                 
              

              

			
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editclass = false">取 消</el-button>
					<el-button type="primary" @click="submiteditForm()" :loading="editLoading">发 布</el-button>
				</div>
			</el-dialog>



	</section>
</template>

<script>
	import util from "../../common/js/util";
    import api from "../../api/api.js";

    export default {
        data() {
       
            return {
                page:1,
                id:"",
                update_time:"",
                szname:"",
               
                view:"",
                viewR:"",
                like:"",
                likeR:"",
                createtime:"",
                total: 0,
                pageSize: 10,
                panQianJieDuTables:[],
                 loading:"",
                likeFrom:{
                    batchLikeInput:"",
                    like:""
                },
                viewFrom:{
                    batchViewInput:"",
                    view:""
                },

                editruleForm: {
                    filename:"",
                    path:"",
                    id:"",
                    mp3_length:""
                },
                BatchlikeDialogVisible:false,
                BatchViewDialogVisible:false,
                sels: [], //列表选中列
                editLoading: false,
                editclass: false,
                editrules: {
                    path: [
                        { required: true, message: "请选择mp3音频文件", trigger: "change" }
                    ]
 
                },
                editOrAdd:false,
                currentPage:1,
                playAddressFileList:[]



            };
        },

        methods: {
        
      handleCurrentChange(val) {
                this.page = val;
               
            var time = "";
             if(this.update_time != "" && this.update_time != null){
                   var d = new Date(this.update_time);
                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
               }

              var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.id DESC ",
                updateTime: time
            };


                this.panQanJieDuPage(
                    para
                    );

            },

        batchLike(){
                console.log(this.sels);
                this.likeFrom= {
                    batchLikeInput:"",
                    like:""
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

             batchView(){
                console.log(this.sels);
                this.viewFrom= {
                    batchViewInput:"",
                    view:""
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
            likeEvent(a){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a
                };

                //alert("1");

            },

              viewEvent(a){

                this.viewFrom ={
                    view:a,
                    batchViewInput:a
                };

                //alert("1");

            },
     async   batchLikeSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    if(dataArray == ""){
                        dataArray += this.sels[i].id
                    }else{
                        dataArray += ","+this.sels[i].id
                    }

                }
                      
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:1,
                    model:"1",
					flag:b
                };

                console.log(para);
                let    resultVo =    await api.pqjdBatchLikeAdd(para);
                this.editLoading = false;

                this.BatchlikeDialogVisible = false


                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: resultVo.message,
                    duration: 0
                });


            /*    this.$message({
                    message: "批量点赞成功",
                    type: "success"
                });*/

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.id DESC "
                };
                this.panQanJieDuPage(para);

			},


             async   batchViewSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    if(dataArray == ""){
                        dataArray += this.sels[i].id
                    }else{
                        dataArray += ","+this.sels[i].id
                    }

                }
                      
                let formValue = Object.assign({}, this.viewFrom);

                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:1,
                    model:"1",
					flag:b
                };

                console.log(para);
                let    resultVo =    await api.pqjdBatchLikeAdd(para);

                this.editLoading = false;

                this.BatchViewDialogVisible = false;
                     
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
                    orderBy:"a.id DESC "
                };
                this.panQanJieDuPage(para);

			},


             handleAdd(){
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    id:"",
                    path:"",
                   mp3_length:""
                }
                this.playAddressFileList = [];
                this.editruleForm = result;


                //begin
              
                //end
			},
            handleEdit(index, row) {

                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    id:row.id,
                    path:row.path,
                    mp3_length:row.mp3_length

                }
                this.playAddressFileList = [
                    { name: row.path, url: row.path , mp3_length: row.mp3_length }
                ];
                this.editruleForm = result;

            },

          


        handleChangeAddAF(response, file, fileList) {
                //alert(file.name);
                this.editruleForm.filename = file.name ;
                this.editruleForm.path = response.origUrl ;
                this.editruleForm.mp3_length = response.durationMsec
         },
         handleRemoveAddAF(response,fileList){
                 this.editruleForm.path = "" ;
                this.editruleForm.mp3_length = ""
       },

        handleExceed(files, fileList){
        this.$message.warning(`当前限制选择 1 个文件~`);
    },

        //新增或者修改提交
            async submiteditForm() {
                this.$refs.editruleForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;

                            if(this.editOrAdd){
                         
                                await api.addpanqianjiedu(this.editruleForm);
                            }else{
                               await api.addpanqianjiedu(this.editruleForm);
                            }
                            this.editclass = false;
                            this.editLoading = false;
                            
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                           
                            var para1 = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                                orderBy:"a.id DESC "
                            };
                            
                            this.panQanJieDuPage(para1);
                        });

                    }
                });
            },

      async  getlist() {
                var  time = "";
               if(this.update_time != "" && this.update_time != null){

                   var d = new Date(this.update_time);
                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
               }
              var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.id DESC ",
                updateTime: time
            };

                this.panQanJieDuPage(
                    para
                );
            },


         selsChange: function(sels) {
                this.sels = sels;
            },  


        async panQanJieDuPage(keyword) {
               let result =  await api.panQianJieDuPage(keyword);
                for (let i = 0; i < result.list.length; i++) {
                    
                    var date = new Date(result.list[i].todate);
                    var createdate = new Date(result.list[i].createtime);
                    var todateN = date.getFullYear() + '-' +(date.getMonth()+1) + '-' + date.getDate()+' 期';

                    var hour = createdate.getHours();
                    var minute = createdate.getMinutes();
                    var second = createdate.getSeconds();

                    var createdateN = createdate.getFullYear() + '-' +(createdate.getMonth()+1) + '-' 
                                    + createdate.getDate()+" "
                                    +(hour>9?hour:"0"+hour)+":"
                                    +(minute>9?minute:"0"+minute)+":"
                                    +(second>9?second:"0"+second);

           
                    result.list[i].todate =todateN;
                    result.list[i].createtime =createdateN;
                    
                }
                this.panQianJieDuTables = result.list;

                this.total = result.total;
            },

            //-------------------------


        },
        mounted() {

            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.id DESC "
            };
            this.panQanJieDuPage(para);

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




