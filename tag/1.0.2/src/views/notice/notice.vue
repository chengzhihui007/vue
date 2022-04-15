<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
				<el-input id="title" v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getNoticesBytitle">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		 <el-col :span="24" class="toolbar" >
          <el-button type="primary" @click="handleAdd">新增公告</el-button>
			 </el-col>
		<!--列表-->
		<el-table :data="Notice" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="50"></el-table-column>
		   <el-table-column prop="title" label="公告标题">
			</el-table-column>
			<el-table-column prop="user_name" label="发布人">
			</el-table-column>
			<el-table-column prop="update_time" label="发布时间" :formatter="formatfoatUpdatetime" min-width="100">
			</el-table-column>
			<el-table-column prop="source" label="来源" min-width="100"  :formatter="formatsource"></el-table-column>
			
		
		  <el-table-column label="操作" width="150">
		     <template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				<el-button type="danger" size="small"   @click="handleDel(scope.row)">删除</el-button>
			</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

	<!--编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync="dialogVisible"  :close-on-click-modal="false">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
				 <el-form-item label="选择来源：" prop="source" >
                    <el-radio-group id="selsource" ref="selsource" v-model="editForm.source">
                        <el-radio :label=0  >源达</el-radio>
                        <el-radio :label=1 >财源</el-radio>
                    </el-radio-group>
                </el-form-item>
				<el-form-item label="公告标题："  prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
					<span id="titlexz" style="display:none"  >限制10个字</span>
				</el-form-item>
				<el-form-item label="公告内容：" prop="content">
					<el-input type="textarea" :rows="5"   v-model="editForm.content"></el-input>
				</el-form-item>
				<el-form-item  label="公告图片："   prop="picture" >
					<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="editForm.picture" :src="editForm.picture" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
    import {getNoticeTableInfo,editNoticeInfo,addNoticeInfo,deleteNotice,getNoticeBytitle} from '../../api/cyApi.js';
     import {imageDefault} from "../../common/js/urls";
	import $ from 'jquery';
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
				source:0,
				dialogTitle: "新增",
				filters: {
					title: ''
				},
				picture:'',
				 // 赋值使用
                // globalHttpUrl: global.httpUrl,
				editOrAdd:false,
				notice_id:'',
				Notice: [],
				 total: 0,
                page: 1,
				pageSize: 10,
				currentPage: 1,
				listLoading: false,
				dialogVisible: false,//编辑界面是否显示
			    editLoading: false,
				users:{},
				editFormRules: {
					title: [
						{ required: true, message: '请输入公告标题!', trigger: 'blur' },
						{
                           validator: numbers,
                            message: "内容超出限制",
                            trigger: "blur",
                            num: 58
                        }
					],
					source: [
                        {required: true, message: '请选择来源', trigger: 'change'}
                    ],
					content:[{required: true, message: '请输入公告内容!', trigger: 'blur'}]
				},
				//编辑界面数据
				editForm: {
					picture:'',
				}
		  }
		},
		
		methods: {
		     handleCurrentChange(val) {
				this.page = val;
				this.getNotices();
			},
			async getNoticesBytitle(){
			  //let lists=await api.getNoticeBytitle(document.getElementById("title").value.trim());

                getNoticeBytitle(document.getElementById("title").value.trim()).then(res=>{
                    let lists=res.data;
                     this.Notice=lists;
				})
     },
			//获取公告列表   
			async getNotices() {
				var admin = sessionStorage.getItem("user");
				this.users= JSON.parse(admin);
		        let para = { 
					pageNo:this.page,
					pageSize:this.pageSize, 
					};
				//let lists=await api.getNoticeTableInfo(para);

                getNoticeTableInfo(para).then(res=>{
					 let result=res.data;
					// for(var i=0;i<result.list.length;i++){
					//	var timesnip1=result.list[i].create_time;
					   // var timestamp1 = new Date(timesnip1);//直接用 new Date(时间戳) 格式转化获得当前时间
                      //  result.list[i].create_time=timestamp1.toLocaleDateString().replace(/\//g, "-") + " " + timestamp1.toTimeString().substr(0, 8);
						
						//var timesnip2=result.list[i].update_time;
					  // var timestamp2 = new Date(timesnip2);//直接用 new Date(时间戳) 格式转化获得当前时间
                      //  result.list[i].update_time=timestamp2.toLocaleDateString().replace(/\//g, "-") + " " + timestamp2.toTimeString().substr(0, 8);
                  //  }
                    this.total = result.total;
                     this.Notice=result.list;
				})
                },
			//显示新增界面
			handleAdd: function () {
				this.dialogTitle = "新增";
				this.editOrAdd = true;
				this.dialogVisible = true;
				this.clearEdit();
				$("#titlexz").css("display", "none");
			},
				//显示编辑界面
			async handleEdit (index, row) {
				this.dialogTitle = "编辑";
				this.editOrAdd = false;
				this.dialogVisible = true;
				this.editForm = Object.assign({}, row);
				//var selsource=document.getElementById('selsource');
				//selsource.disabled=true;
				      const self = this;
				//self.$refs.selsource.readonly=true;
				//$("#selsource").disabled=true;
				//this.$refs["editForm"].resetFields();//去除验证
					$("#titlexz").css("display", "none");
			},
			//编辑
			editSubmit: function (){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						//源达验证标题限制10个字
						let source=this.editForm.source;
						if(parseInt(source)==0)
						{
							 let strcount=this.strlen(this.editForm.title);
							 if(parseInt(strcount)>21)
							 {
								  $("#titlexz").css("display", "block");
                                this.$message({
                                message: "标题限制10个字,请重新输入！",
                                type: "success"
								 });
								 return;
							 }
							 
						}
						 this.$confirm('确认提交吗？', '提示', {}).then(async () => {
						 this.editLoading = true;
						if(this.editOrAdd){
							this.editForm.user_name=this.users.user_name;
							this.editForm.user_id=this.users.user_id;
							let para = Object.assign({}, this.editForm);
							//await api.addNoticeInfo(para)
                            addNoticeInfo(para).then(res=>{

							})
						}else{
							

							let para = Object.assign({}, this.editForm);
							 editNoticeInfo(para).then(res=>{
                            })
						}
						this.dialogVisible = false;
						this.$message({
							message: '提交成功',
							type: 'success'
						});
						this.editLoading = false;
						this.getNotices();
					});
				 }
				});
			},
			//恢复编辑页面为默认
			clearEdit(){
				var result={
					picture:""
				}
				this.editForm = Object.assign({}, result);
			},
			//删除
			handleDel: function(row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                this.listLoading = true;
				//let result = await api.deleteNotice(row.notice_id);
				 let strkey=row.notice_id+','+row.source;
                    deleteNotice(strkey).then(res=>{
                        let result =res.data;
                        if (result == 1) {
                            this.listLoading = false;
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            this.getNotices();
                        } else {
                            this.listLoading = false;

                            this.$message({
                                message: "删除失败",
                                type: "error"
                            });
                        }
					})

            })
            .catch(() => {
               });
            },
			handleAvatarSuccess(res, file) {
				this.editForm.picture =imageDefault+ res.message;
				//this.editForm.picture ='http://app2.zslxt.com/image/' + res.message;
               //this.editForm.picture ='http://ydgp.zslxt.com/image/' + res.message;
			 // let strurl=this.globalHttpUrl;
			 // this.editForm.cover =strurl+ res.message;
			   
			},
			beforeAvatarUpload(file) {
				return true;
			},
		formatfoatUpdatetime:function(row){
                var timestamp = new Date(row.update_time);//直接用 new Date(时间戳) 格式转化获得当前时间
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
		 },
		 formatsource:function(row){
                return row.source==0?"源达":"财源";
            },
		   strlen(str) {
           var len = 0;
            for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
        //单字节加1
           if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
               len++;
               } else {
              len += 2;
              }
              }
                return len;
             },
		},
		mounted() {
			this.getNotices();
		}	
}

</script>

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
					

