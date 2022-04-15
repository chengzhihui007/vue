<template>
	<section class="mtop">

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<div>
					<el-form-item>
						<el-button type="primary"    @click="handleAdd">添加</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-col>


		    <el-table :data="columnTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
						<el-table-column
								type="selection"
								width="55">
						</el-table-column>
				        <el-table-column type="index" width="60">
						</el-table-column>

						<el-table-column prop="name"  label="栏目名称"  width="180">
						</el-table-column>
						<el-table-column prop="isPayName" label="是否付费"  width="100">
						</el-table-column>
						<el-table-column prop="content" label="课程简介" width="900">
						</el-table-column>
						<el-table-column prop="webcastId" label="展示平台房价ID" width="120">
						</el-table-column>

						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>


				<!--工具条
				<el-col :span="24" class="toolbar">
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
                 -->




			<!--弹窗数据-->
			<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false"  center>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="150px" >
					<el-input v-if="false" v-model="editruleForm.column_id"  style="width:120px;"   ></el-input>

					<el-form-item label="栏目名称" prop="name">
						<el-input v-model="editruleForm.name"  style="width:400px;" auto-complete="off"  ></el-input>
                    </el-form-item>

					<el-form-item label="类      型" >

						<el-radio v-model="editruleForm.is_pay" label="1">付费</el-radio>
						<el-radio v-model="editruleForm.is_pay" label="0">免费</el-radio>

					</el-form-item>


					<el-form-item label="栏目简介" prop="content">
						<el-input type="textarea" :rows="5"   v-model="editruleForm.content"></el-input>
					</el-form-item>


					<el-form-item  label="设置封面"   prop="cover" >
						<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editruleForm.cover" :src="editruleForm.cover" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
                   </el-form-item>



					<el-form-item label="展示平台房间ID"   prop="webcastId" >
						<el-input v-model="editruleForm.webcastId"  style="width:400px;" auto-complete="off" ></el-input>
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
    import {imageDefault} from "../../common/js/urls";
	import util from "../../common/js/util";
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
                sels: [], //列表选中列
                page: 1,
                editLoading: false,
                editOrAdd: false,
                editruleForm: {
                    name: "",
                    is_pay:'1',
                    webcastId: "",

                    content:"",
                    cover:"",
                    star_come_id:""

                },
                listLoading: false,


                total: 0,


				loading: false,
                columnTables: [],
                scorelist: [],
				editclass: false,
				editrules: {
                    cover: [
                        { required: true, message: "请选择封面", trigger: "change" }
                    ],

                    webcastId: [
                        {
                            pattern: /^[0-9a-zA-Z]+$/,
                            message: '输入内容的仅输入数字或者字母!'
                        }
                    ],
                    content: [
                        { required: true, message: "请输入栏目简介", trigger: "blur" }
                    ],
                    name: [
                        { required: true, message: "请输入栏目名称", trigger: "blur" }/*,
                        { validator: numbers, message: "内容超出限制", trigger: "blur", num: 40 }*/
                    ]
                }



            };
        },

        methods: {

            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;
                            let resultVo ;
                            if (this.editOrAdd) {


                                let    para = Object.assign({}, this.editruleForm);

                                para.flag = 1;

                                resultVo =   await api.columnSave(para);
                            } else {

                                let   para = Object.assign({}, this.editruleForm);

                                para.flag = 0;

                                resultVo =   await api.columnSave(para);
                                console.log(para);
                            }
                            this.editclass = false;

                            console.log(resultVo);
                            if(resultVo.success){
                                this.$message({
                                    message: "提交成功",
                                    type: "success"
                                });
							}else{
                                this.$message({
                                    message: resultVo.message,
                                    type: "error"
                                });
							}

                            this.editLoading = false;



                            this.columnPage();

                        });
                    }
                });
			},
            handleDel: function(index, row) {
                this.$confirm("   您确定删除该栏目吗？停用后前台将不再显示", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        //NProgress.start();
                        console.log(row);
                        await api.deleteColumn(row.column_id);

                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });

                        this.columnPage();


                    })
                    .catch(() => {});
            },

            handleAvatarSuccess(res, file) {
                this.editruleForm.cover =imageDefault + res.message;
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


            handleCurrentChange(val) {
                this.page = val;
                this.getUserGs();

            },
            async columnPage() {
                let para = {
                    pageNo: this.page,
                    pageSize: 10
                };
                this.listLoading = true;



                let column=await api.getColumnPage();

                console.log(column);
                //let columnPage=await pageTool(column,para);

                //this.total = column.length;
                this.columnTables = column;
                this.listLoading = false;
            },
            handleAdd(){
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    column_id:"",
                    name:"",
                    content:"",
                    webcastId:"",
                    is_pay:"1",
                    cover:"",
                }
                this.editruleForm = result;
			},
            handleEdit(index, row) {

                this.editclass = true;
                this.editOrAdd = false;

                var result = {
                    column_id:row.column_id,
                    name:row.name,
					content:row.content,
                    webcastId:row.webcastId,
                    is_pay:row.is_pay+"",
                    cover:row.cover

                }


                this.editruleForm = result;

            },


            //-------------------------


        },
        mounted() {

            this.columnPage();

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

</style>




