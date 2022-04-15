<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="基础课列表" name="first">
			
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
					</el-form-item>

					<el-form-item>
							<el-date-picker v-model="createDateS" type="date" placeholder="发布日期">
						</el-date-picker>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>

					<el-form-item>
						<el-button type="primary"  @click="handleAdd" >添加课程</el-button>
					</el-form-item>
					<br>
					<el-form-item>
					<el-button type="primary"     @click="batchLike" :disabled="false">批量点赞</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchView" :disabled="false">批量增加浏览量</el-button>
				</el-form-item>
					
				</el-form>
			</el-col>
			
			<el-table :data="jichukeList" highlight-current-row  @selection-change="selsChange"  style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="titlename" width="150" label="所属类型">
				</el-table-column>
				<el-table-column prop="period" label="期数"  width="150">
				</el-table-column>
				<el-table-column prop="title" label="课程名称" width="120">
				</el-table-column>
				<el-table-column prop="recommendS" label="是否推荐" width="120">
				</el-table-column>
				<el-table-column prop="createDateS" label="发布时间" width="160">
				</el-table-column>
				
				<el-table-column label="播放实数|总数" width="160">
					<template scope="scope">
						<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
						|
						<span>{{ scope.row.view }}</span>

					</template>
				</el-table-column>

				<el-table-column label="点赞实数|总数" width="160">
					<template scope="scope">
						<span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
						|
						<span>{{ scope.row.like }}</span>

					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
		</el-col>

						
		<el-dialog :title=dialogTitle   :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form :model="addForm"  ref="addForm" :rules="addFormRules" label-width="100px" >
				<el-input v-if="false" v-model="addForm.id"  style="width:120px;"   ></el-input>
				<el-form-item label="选择类型" prop="categoryId" >
					<el-select v-model="addForm.categoryId" placeholder="--请选择类型--"  v-if="this.editOrAdd==true">
						<el-option 
							v-for="item in aricleForm"
							:key="item.id"
							:label="item.title"
							:value="item.id">
						</el-option>
					</el-select>
					<el-select v-model="addForm.categoryId" placeholder="--请选择类型--"  v-else="" :disabled="true">
						<el-option 
							v-for="item in aricleForm"
							:key="item.id"
							:label="item.title"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				

				
				<el-form-item label="期数" prop="period">
				
					<el-input-number  controls-position="right"v-model="addForm.period"    :min="1" ></el-input-number>
				</el-form-item>
				<el-form-item label="课程标题" prop="title">
					<el-input  style="width:400px;" v-model="addForm.title" auto-complete="off" placeholder="（限20个字以内）"></el-input>
				</el-form-item>

				<el-form-item label="视频链接" prop="content">
					<el-input  style="width:400px;" v-model="addForm.content" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item prop="thumbnail">
					<el-upload  class="upload-demo" action="/api/file/imageUpload/" accept=".jpg,.png"   :on-success="handleChangeAddTP" :on-remove="handleRemoveAddTP"  >
						<el-button size="small" type="primary">点击上传图片</el-button>
						<div style="float: right;margin-left: 15px;" class="el-upload__tip">上传jpg/png图片文件</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="图片" prop="thumbnail" style="display:none;">
					<el-input   v-model="addForm.thumbnail"></el-input>
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<el-input type="textarea" placeholder="请输入内容" v-model="addForm.description"></el-input>
				</el-form-item>
				<el-form-item label="是否推荐" prop="recommend">
					<el-radio v-model="radio" label="0">是</el-radio>
					<el-radio v-model="radio" label="1">否</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmit()" :loading="editLoading">发布</el-button>
			</div>
		</el-dialog>
		<!--批量点赞界面-->
		<el-dialog title="批量点赞" :visible.sync="BatchlikeDialogVisible"  center>
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

		<!--批量浏览界面-->
		<el-dialog title="批量浏览" :visible.sync="BatchViewDialogVisible"  center>
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
			
		</el-tab-pane>
		<el-tab-pane label="课堂类型" name="second">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true">
						<el-form-item>
							<el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
						</el-form-item>

						<el-form-item>
								<el-date-picker v-model="createDateS" type="date" placeholder="发布日期">
							</el-date-picker>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="onSubmit1">查询</el-button>
						</el-form-item>

						<el-form-item>
							<el-button type="primary"  @click="leixingAdd" >添加类型</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<el-table :data="leixingList" highlight-current-row  @selection-change="selsChange"  style="width: 100%;">
					<el-table-column prop="id" width="150" label="序号">
					</el-table-column>
					<el-table-column prop="title" label="类型名称"  width="150">
					</el-table-column>
					<el-table-column prop="total" label="课程总数" width="120">
					</el-table-column>
					<el-table-column prop="statusA" label="状态" width="120">
					</el-table-column>
					<el-table-column prop="createDateS" label="添加时间" width="160">
					</el-table-column>
					
					<el-table-column label="操作" width="200">
						<template slot-scope="scope">
							<el-button size="small" @click="LeixingEdit(scope.$index, scope.row)">修改</el-button>
							<el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.status">启用</el-button>
                    		<el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">停用</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination @current-change="handleCurrentChange1" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total1></el-pagination>
				</el-col>

				<el-dialog :title=dialogTitle1   :visible.sync="dialogVisible1" :close-on-click-modal="false">
					<el-form :model="leixingForm"  ref="leixingForm" :rules="leixingFormRules" label-width="100px" >
						<el-input v-if="false" v-model="leixingForm.id"  style="width:120px;"   ></el-input>
						
						<el-input v-if="false" v-model="leixingForm.keyword"  style="width:120px;"   ></el-input>
						<el-form-item label="类型名称" prop="title">
							<el-input  style="width:400px;" v-model="leixingForm.title" auto-complete="off" v-if="this.editOrAdd==true" ></el-input>
							<el-input v-model="leixingForm.title" auto-complete="off" v-else="" :disabled="true"></el-input>
						</el-form-item>

						<el-form-item label="课程总量" prop="total">
							<el-input  style="width:400px;" v-model="leixingForm.total" auto-complete="off"></el-input>
						</el-form-item>

					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="dialogVisible1 = false">取 消</el-button>
						<el-button type="primary" @click="editSubmit1()" :loading="submitLoading">保存</el-button>
					</div>
				</el-dialog>
			
			

		</el-tab-pane>


	</el-tabs>
</template>

<script>
import api from "../../api/api.js";
export default {
    data(){
        return{
			keyword:'',
			activeName:'first',
			jichukeList : [],
			leixingList:[],
			aricleForm:[],
			dialogTitle: "",
			createDateS:'',
			dialogTitle1: "",
			recommend:1,
			radio:'0',
			statusA:1,
			editOrAdd: false,
			dialogVisible: false,
			dialogVisible1: false,
			editLoading: false,
			submitLoading: false,
			zhushuiVisible: false,
			zhushuiObj: { Infuse: null },

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

			total : 0,
			total1:0,
            pageNo: 1,
			pageSize: 20,
			
			currentPage: 1,
			listLoading: false,
            sels: [], //列表选中列
            
			addForm:{
				categoryId:'',
				keyword:'',
				period:'',
				title:'',
				content:'',
				thumbnail:'',
				description:'',
				createDateS:'',
				recommendS:1
			},
			leixingForm:{
				id:'',
				title:'',
				total:'',
				keyword:'',
				statusA:1,
				createDateS:'',
				status:1
			},
			addFormRules:{
				categoryId:[{ required: true, message: "请选择套系", trigger: "change" }],
				period:[{ required: true, message: "请选择期数", trigger: "change" }],
				thumbnail: [{ required: true, message: "请选择图片文件", trigger: "change" }],
				title:[{ required: true, message: "请输入标题", trigger: "blur" },{max:20, trigger: "blur",message: "内容超出限制"}],
				content:[{ required: true, message: "请输入视频链接", trigger: "change" }],
			},
			leixingFormRules:{
				title:[{ required: true, message: "请输入类型名称", trigger: "change" }],
				total:[{ required: true, message: "请输入课程条数", trigger: "change" }]
			}
        }
    },
    methods :{
		handleClick(tab, event) {
			console.log(tab, event);
		},
		async onSubmit() {
			  var  time = "";
               if(this.createDateS != "" && this.createDateS != null){

                   var d = new Date(this.createDateS);

                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

               }
			let para={
				keyword:this.keyword,
				createDateS:time,
				pageNo:this.pageNo,
				pageSize:this.pageSize,
				
			}
			let res =await api.getJichukeList(para);
			//console.log(res.total);
			this.jichukeList = res.list;
			this.total = res.total
		},
		async onSubmit1() {
			var  time = "";
               if(this.createDateS != "" && this.createDateS != null){

                   var d = new Date(this.createDateS);

                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

               }
			let para={
				keyword:this.keyword,
				createDateS:time,
				pageNo:this.pageNo,
				pageSize:this.pageSize,
				
			}
			let res =await api.getLeixingList(para);
			this.leixingList = res.list;
			this.total1 = res.total;
		},
       async getList(){
            let para = {
				pageNo:this.pageNo,
				pageSize:this.pageSize,
				keyword:this.addForm.keyword,
				createDateS:this.addForm.createDateS,
			};

            let res = await api.getJichukeList(para);
			this.jichukeList = res.list;
			this.total = res.total;
	   },
	   
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
		batchLike(){
			//console.log(this.sels);
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
                //console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:0,
                    model:"1",
					flag:b
                };
                //console.log(para)
				let    resultVo =    await api.updateLikejichu(para);
				//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"+resultVo.message);
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
                    //orderBy:"a.star_come_id DESC "
                };
                this.getList(para);
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
               // console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:0,
                    model:"1",
                    flag:b
                };
                //console.log(para)
                   await  api.updateLikejichu(para);
                this.editLoading = false;
                this.BatchViewDialogVisible = false

          /*      this.$message({
                    message: "批量浏览成功",
                    type: "success"
                });*/

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: "注水成功!"
                });
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    //orderBy:"a.star_come_id DESC "
                };
                this.getList(para);
            },
	

	   async getLeixingList(){
		   let para = {
				pageNo:this.pageNo,
				pageSize:this.pageSize,
				keyword:this.leixingForm.keyword,
				createTime:this.leixingForm.createTime,
			};
			let res = await api.getLeixingList(para);
			this.leixingList = res.list;
			this.total1 = res.total;
	   },
	   //控制停用启用
		handleDel: function(index, row) {
			
		if (row.status == 0) {
			this.$confirm("确认停用吗?", "提示", {
			type: "warning"
			})
			.then(async () => {
				let result = await api.updateQiyong({status:1,id:row.id});
				this.listLoading = true;
				this.getLeixingList();
				this.selectaricleList();
			})
			.catch(() => {});
		}
		if (row.status == 1) {
			this.$confirm("确认启用吗?", "提示", {
			type: "warning"
			})
			.then(async () => {
				let result = await api.updateQiyong({status:0,id:row.id});
				this.listLoading = true;
				this.getLeixingList();
				this.selectaricleList();
			})
			.catch(() => {});
		}
		},
       handleCurrentChange(val){
            this.pageNo = val
            this.getList();
	   },

	    handleCurrentChange1(aaa){
            this.pageNo = aaa
            this.getLeixingList();
	   },
	   
	   async handleAdd() {
		   this.editOrAdd = true;
		   this.dialogTitle = "新增";
		   this.dialogVisible = true;

	  },

	  async leixingAdd(){
		   this.editOrAdd = true;
		   this.dialogTitle1 = "新增";
		   this.dialogVisible1 = true;
	  },

	  handleEdit: function (index, row) {
	  
        this.editOrAdd = false;
        this.dialogTitle = "编辑";
        this.dialogVisible = true;
		this.radio=row.recommend+'';
		var result = {
				id:row.id,
				period:row.period,
				title:row.title,
				content:row.content,
				thumbnail:row.thumbnail,
				//status:status,
				description:row.description,
				recommend:row.recommend,
				categoryId:row.categoryId
				
				
			}
			this.addForm = result;
	},
	LeixingEdit:function(index,row){
		this.editOrAdd = false;
		this.dialogTitle1 = "编辑";
		this.dialogVisible1 = true;
		//console.log("************************"+row.title);
		var result = {
			id:row.id,
			title:row.title,
			total:row.total,
		}
		this.leixingForm = result;
	},
	//编辑、发布
	editSubmit: function() {
            //console.log("asdfljasdlfkjslkfdjsklsdjlfkjdslfkjslk");
            this.$refs.addForm.validate(valid => {
                if (valid) {
                this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                    this.editLoading = true;
                    if (this.editOrAdd == false) {
						  this.addForm.recommend=this.radio;
                        let result = await api.updateAricle(this.addForm);
					}
					var result ="";
                    if (this.editOrAdd == true) {
                       result= await api.addAricle(this.addForm);
						
                    }
                    this.editLoading = false;
                    this.$message({
                    message: result,
                    type: "success"
                    });
                    this.$refs["addForm"].resetFields();
                    this.dialogVisible = false;
                    this.getList();
                });
                }
            });
		},

		editSubmit1: function() {
            this.$refs.leixingForm.validate(valid => {
                if (valid) {
                this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                    this.submitLoading = true;
                    if (this.editOrAdd == false) {
                        let result = await api.updateLeixing(this.leixingForm);
                    }
                    if (this.editOrAdd == true) {
                        let result = await api.addLeixing(this.leixingForm);
                    }
                    this.submitLoading = false;
                    this.$message({
                    message: "提交成功",
                    type: "success"
                    });
                    this.$refs["leixingForm"].resetFields();
                    this.dialogVisible1 = false;
                    this.getLeixingList();
                });
                }
            });
		},
		selsChange: function(sels) {
			this.sels = sels;
		},

		async handelete(index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(async () => {
				this.listLoading = true;

				var result= await api.deleteArice(row.id);
				//console.log("***********************"+result.success);
				this.listLoading = false;
				if(result==true){
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				}
				else{
					this.$message({
						message: '删除失败',
						type: 'error'
					});
				}

				this.getList();
			})
		},
	//获取类型列表
	async selectaricleList(){
	  let res = await api.getaricleInfo({parent_id:0});
	  console.log(res);
      this.aricleForm = res;
    }, 
	  handleChangeAddTP(response, file, fileList) {
		   this.addForm.thumbnail ='http://app2.zslxt.com/image/' + response.message;
	  },
      handleRemoveAddTP(response, file, fileList) {
		  this.addForm.thumbnail ="";
	  },
    },
    mounted(){
		this.getList();
		this.getLeixingList();
		this.selectaricleList();
    }
}
</script>

<style>
	.active {
		color:blue;
	}
</style>


