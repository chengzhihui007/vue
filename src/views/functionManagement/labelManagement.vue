<template>
	<section class="mtop">

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="name" placeholder="请输入标题关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="type" style="width:193px;"  clearable  placeholder="请选择类型">
						<el-option label="营销性标签" value="1"></el-option>
						<el-option label="非营销性标签" value="2"></el-option>

					</el-select>
				</el-form-item>
					<el-form-item>
						<el-select v-model="isFlag" style="width:193px;"  clearable  placeholder="请选择状态">
							<el-option label="启用" value="0"></el-option>
							<el-option label="停用" value="1"></el-option>
						</el-select>
					</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
                    <el-button type="primary"    @click="handleAdd">添加</el-button>
				</el-form-item>
				<!-- <div>
					<el-form-item >
						<el-button type="primary"    @click="handleAdd">添加</el-button>
					</el-form-item>
				</div> -->
			</el-form>
		</el-col>
		    <el-table :data="columnTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
					
				      <el-table-column prop="" label="序号" width="60" align="center">
                            <template scope="num">
                                {{columnTables.length - num.$index}}
                            </template>
                        </el-table-column> 
						<el-table-column prop="name"  label="标签名称"  width="200" align="center">
						</el-table-column>
						<el-table-column prop="typeName"  label="标签类型"  width="200" align="center">
						</el-table-column>
						<el-table-column prop="isFlag"  label="状态"  width="200" align="center">
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template slot-scope="scope">
								<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row,'1','停用')"  v-if="scope.row.isFlag !='停用' " >停用</el-button>
								<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row,'0','启用')" v-if="scope.row.isFlag !='启用'">启用</el-button>
							</template>
						</el-table-column>
					</el-table>
				<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
		</el-col>

			<!--弹窗数据-->
			<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false"  center>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="150px" >
					<el-input v-if="false" v-model="editruleForm.label_id"  style="width:120px;"   ></el-input>
					<el-form-item label="标签类型" prop="type">
						<el-select v-model="editruleForm.type" style="width:193px;"  clearable  placeholder="请选择标签类型">
							<el-option label="营销性标签" value=1></el-option>
							<el-option label="非营销性标签" value=2></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="标签名称" prop="name">
						<el-input v-model="editruleForm.name"  style="width:400px;" auto-complete="off"  ></el-input>
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
                currentPage: 1,
                pageSize: 15,
                isFlag:"",
                type:"",
                name:"",
                editLoading: false,
                editOrAdd: false,
                editruleForm: {
                    name: "",
                    type:""
                },
                listLoading: false,
                total: 0,
				loading: false,
                columnTables: [],
                scorelist: [],
				editclass: false,
				editrules: {
                    type: [
                        { required: true, message: '请选择标签类型', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: "请输入标签名称", trigger: "blur" },
                        { min: 1, max: 8, message: "标题名称在8个汉字以内", trigger: "change" },
						{pattern: /[^\s]/, message: '标签类型不能输入空格!', trigger: 'change'}
                    ]
                }
            };
        },

        methods: {

            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

               /* if(this.editruleForm.name.match(/^[ ]*$/)){
                    this.$message({
                        message:"标签类型不能输入空格!",
                        type: "error"
                    });
                    return false;
                }*/
                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;
                            let resultVo ;
                            if (this.editOrAdd) {
                                let    para = Object.assign({}, this.editruleForm);
                                para.flag = 1;
                                resultVo =   await api.addLabelManage(para);
                            } else {
                                let   para = Object.assign({}, this.editruleForm);
                                para.flag = 0;
                                resultVo =   await api.editLabelManage(para);
                            }
                            this.editclass = false;
                            if(resultVo.state){
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




								this.name = null;
								this.type = null;
								this.isFlag = null;

                            var para = {
                                page:this.page,
                                pageSize:this.pageSize,
                            };
                            this.columnPage(para);
                        });
                    }
                });
			},
            handleDel: function(index, row,flag,name) {
                this.$confirm("   您确定"+name+"该标签吗？", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        let paras={
                            label_id:row.label_id,
                            isFlag:flag
                        }
                        await api.labelMagageIsFlag(paras);
                        this.listLoading = false;
                        this.$message({
                            message: "操作成功",
                            type: "success"
                        });
                        var para = {
                            page:this.page,
                            pageSize:this.pageSize,
                        };
                        this.columnPage(para);
                    })
                    .catch(() => {});
            },
            handleCurrentChange(val) {
                this.page = val;

				var para = {
					page:this.page,
					pageSize:this.pageSize/*,
					name:this.name,
					type: this.type,
					isFlag:this.isFlag*/
				};
                this.columnPage(
                    para
                );
            },
            async columnPage(keyword) {
                let result =  await api.getLableManageList(keyword);
                this.columnTables =  result.data.result;
                this.total = result.data.total;
            },
            handleAdd(){
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    label_id:"",
                    name:"",
					type:""
                }
                this.editruleForm = result;
			},
            handleEdit(index, row) {

                this.editclass = true;
                this.editOrAdd = false;

                var result = {
                    label_id:row.label_id,
                    name:row.name,
                    type:row.type
                }
                this.editruleForm = result;
            },
            getlist() {
                var para = {
                    page:1,
                    pageSize:this.pageSize,
                    name:this.name,
                    type: this.type,
                    isFlag:this.isFlag
                };
                this.columnPage(
                    para
                );
            },
        },
        mounted() {
            var para = {
                page:this.page,
                pageSize:this.pageSize
            };
            this.columnPage(para);
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




