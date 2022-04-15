<template>
    <section class="mtop">
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				
				<el-form-item>
					<el-date-picker
							v-model="createtimes"
							type="date"
							placeholder="添加时间查询">
					</el-date-picker>
				</el-form-item>

					<el-form-item>
					<el-select v-model="sztype"  clearable  placeholder="请选择所属产品">
						<el-option
								v-for="list in sztypeList"
								:key="list.id"
								:label="list.name"
								:value="list.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>

				<el-form-item style="float: right;">
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"    @click="handleAdd">添加</el-button>
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

        <el-table :data="wuJianFenXiTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <!--<el-table-column type="index" width="60">
            </el-table-column>
            -->
            <el-table-column prop="create_Time" width="200" label="标题">
            </el-table-column>
            <el-table-column prop="sztypename" label="所属产品"  width="300">
            </el-table-column>

            <el-table-column label="播放实数|总数" width="200">
                <template scope="scope">
                    <span >{{ scope.row.viewR }}</span>
                    |
                    <span v-bind:class="{active: (scope.row.view>=0)}">{{ scope.row.view }}</span>

                </template>
            </el-table-column>

            <el-table-column label="点赞实数|总数" width="200">
                <template scope="scope">
                    <span >{{ scope.row.likeR }}</span>
                    |
                    <span v-bind:class="{active: (scope.row.like>=0)}">{{ scope.row.like }}</span>

                </template>
            </el-table-column>

            <el-table-column prop="createtimes" label="添加时间" width="220">
            </el-table-column>
            
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
					</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        </el-col>

        
        <!--弹窗数据添加或修改-->
        <el-dialog title="添加/编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
            <el-form :model="editWuJianFenXiForm" :rules="editrules" ref="editWuJianFenXiForm" label-width="100px" >
                <el-input v-if="false" v-model="editWuJianFenXiForm.id"  style="width:120px;"   ></el-input>
                <el-input v-if="false" v-model="editWuJianFenXiForm.video_length"  style="width:120px;"   ></el-input>
                <el-input v-if="false" v-model="editWuJianFenXiForm.mp3_length"  style="width:120px;"   ></el-input>
                 <el-form-item  label="所属产品：" prop="sztype" >
                    <el-radio-group v-model="editWuJianFenXiForm.sztype">
                        <el-radio :label="2" >财源四星产品</el-radio>
                        <el-radio :label="3" >财源五星产品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="音频：" prop="path">
                    <!-- .mp4,.mp3 -->
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/upload" accept=".mp3" :on-progress="handelprogress" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="pathFileList">
							<el-button size="small" type="primary">点击上传音频</el-button>
							<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传音频</div>
						</el-upload>
                </el-form-item>
                <el-form-item label="音频：" prop="path" style="display: none" >
                    <el-input v-model="editWuJianFenXiForm.path"></el-input>
                </el-form-item>
                
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editclass = false">取 消</el-button>
                <el-button type="primary" @click="submiteditForm()" :loading="editLoading">确 定</el-button>
            </div>
        </el-dialog>

        <!--批量点赞量注水-->
		<el-dialog title="点赞量注水" :visible.sync="BatchlikeDialogVisible"  center>

			<el-form  :model="likeFrom"  label-width="90px"    ref="likeFrom">

				<el-form-item label="点赞量注水" prop="like">
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput)"  :min="1" style="width:220px;"></el-input-number>
				</el-form-item>

				<el-form-item style="display:none;">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput,0)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>

		<!--批量播放量注水-->
		<el-dialog title="播放量注水" :visible.sync="BatchViewDialogVisible"  center>

			<el-form  :model="viewFrom"  label-width="90px"    ref="viewFrom">

				<el-form-item label="播放量注水" prop="view">
					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput)"  :min="1"  style="width:220px;" ></el-input-number>
				</el-form-item>

				<el-form-item  style="display:none;">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{viewFrom.view}}</font>   个浏览吗？</p>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit(viewFrom.batchViewInput,1)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>

    </section>
</template>
<script>
	import util from "../../common/js/util";
    import api from "../../api/api.js";
    export default {
        data() {
            
            return {
                //列表相关
                sels: [], //列表选中列
                pathFileList:[],//上传文件列表
                flag:"",//1添加  0修改
                createtimes:"",
                sztype:"",
                sztypeList:[{id:2,name:'财源四星产品'},{id:3,name:'财源五星产品'}],
                page:1,
                total: 0,
                pageSize: 20,
                currentPage: 1,
                wuJianFenXiTables:[],
                // 弹窗相关修改新增
                editLoading: false,//当前操作正在进行，禁止其他操作
                editOrAdd: false,
                editclass: false,
                editWuJianFenXiForm: {
                    sztype: "",
                    path: "",
                },
                editrules: {
                    path: [
                        { required: true, message: "请选择音频", trigger: "change" }
                    ],
                    sztype: [
                        { required: true, message: "请选择所属产品", trigger: "change" }
                    ]
                },
                //弹窗相关注水
                BatchlikeDialogVisible:false,
                likeFrom:{

                    batchLikeInput:"",
                    like:""

                },
                BatchViewDialogVisible:false,
                viewFrom:{

                    batchViewInput:"",
                    view:""

                },
                listLoading: false,

            };
            
        },
        methods:{
            //批量选中
            selsChange: function(sels) {
                this.sels = sels;
            },
            //列表
            async wuJianFenXiPage(keyword) {
                let result =  await api.wuJianFenXiPage(keyword);
                this.wuJianFenXiTables = result.list;
                this.total = result.total;
            },

            //查询功能
            getlist() {
                var  time = "";
                if(this.createtimes != "" && this.createtimes != null){

                    var d = new Date(this.createtimes);

                        time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
                }
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    createtimes: time,
                    sztype:this.sztype,
                };
                this.wuJianFenXiPage(
                    para
                );
            },

            //页码跳转
            handleCurrentChange(val) {
                this.page = val;

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize
                };
                this.wuJianFenXiPage(
                    para
                );

            },
            //添加
            handleAdd(){
                this.flag=1;
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    id:"",
                    path:"",
                    sztype:"",
                    // flag:this.flag,
                    video_length:"",
                    mp3_length:""
                }
                this.pathFileList = [];
                this.editWuJianFenXiForm = result;

            },

            //修改
            handleEdit(index, row) {
                this.flag=0;
                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    id:row.id,
                    // flag:this.flag,
                    path:row.path,
                    sztype:row.sztype,
                    video_length:row.video_length,
                    mp3_length:row.mp3_length

                }
                if(row.path=="" || row.path==null){
                     this.pathFileList = [];
                }else{
                     this.pathFileList = [
                    { name: row.filename, path: row.path }
                ];
                }
               
                this.editWuJianFenXiForm = result;
            },
            //删除
            handleDel: function(index, row) {
                this.$confirm("   您确定删除该记录吗？删除后前台将不再显示，该记录所有的关联数据将同时被删除", "提示", {
                    type: "warning"
                }).then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        //NProgress.start();
                        console.log(row);
                        await api.starComewuJianFenXiDel(row.id);

                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });

                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize
                        };
                        this.wuJianFenXiPage(para);


                    }).catch(() => {});
            },

            //点赞注水
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

            //播放量注水
            batchView(){
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

            //保存添加修改
             submiteditForm(){

                this.$refs.editWuJianFenXiForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                            if (this.editOrAdd) {


                                let para = Object.assign({}, this.editWuJianFenXiForm);
                                para.flag = 1;
                                await api.wuJianFenXiSave(para);
                            } else {
                             
                                let para = Object.assign({}, this.editWuJianFenXiForm);
                                console.log(para);
                                para.flag = 0;
                                await api.wuJianFenXiSave(para);
                                console.log(para);
                            }
                            this.editclass = false;
                            this.$message({
                                message: "提交成功",
                                type: "success"
                            });
                            this.editLoading = false;

                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize
                            };
                            this.wuJianFenXiPage(para);

                        });
                    }
                });
            },
            //注水点击
            likeEvent(a){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a
                };
            },
            viewEvent(a){
                this.viewFrom ={
                    view:a,
                    batchViewInput:a
                };
            },
            //注水提交
            async   batchLikeSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++){
                    // alert(this.sels[i].id);
                    if(dataArray == ""){
                        dataArray += this.sels[i].id
                    }else{
                        dataArray += ","+this.sels[i].id
                    }

                }
                let formValue = Object.assign({}, this.likeFrom);
                // alert(formValue.batchLikeInput);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.batchLikeInput,
                    channel:1,//0源达   1财源
                    model:"1",
					flag:b
                };

                console.log(para)
                let    resultVo =    await api.batchLikeAndViewAddWuJianFenXi(para);
                this.editLoading = false;

                this.BatchlikeDialogVisible = false

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: resultVo.message
                });

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize
                };
                this.wuJianFenXiPage(para);
            },
            
            async   batchViewSubmit(a,b){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
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
                    count:formValue.batchViewInput,
                    channel:1,//0源达   1财源
                    model:"1",
                    flag:b
                };

                //console.log(para)
                   await  api.batchLikeAndViewAddWuJianFenXi(para);
                this.editLoading = false;

                this.BatchViewDialogVisible = false

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: "注水成功!"
                });

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize
                };
                this.wuJianFenXiPage(para);
            },
            
            //音频上传
             handleExceed(files, fileList) {
                 alert("a");
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAF(response, fileList) {
                this.editWuJianFenXiForm.path = ""
                this.editWuJianFenXiForm.mp3_length = ""
            },
            handelprogress(event, file, fileList){
                 this.editLoading = true
            },

            handleChangeAddAF(response, file, fileList) {
               
                this.editWuJianFenXiForm.path = response.origUrl
                this.editWuJianFenXiForm.mp3_length = response.durationMsec
                if(response.origUrl!=null && response.origUrl!=""){
                    this.editLoading = false;
                }
                
            },
        },

        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize
            };
            this.wuJianFenXiPage(para);

        }
    }
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
		/* color:blue; */
        color: #FF9900
	}
    .el-dialog__title{
        text-align: left;
        display: block;
    }
</style>


