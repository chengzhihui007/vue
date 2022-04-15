<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker
							v-model="filters.datetime"
							type="date"
							placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary"  @click="handleAdd">新增</el-button>
					</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="title" label="主题" min-width="200" ></el-table-column>
			<el-table-column prop="zhiboshijian" label="直播时间" min-width="100" ></el-table-column>
			<el-table-column prop="datetime" label="发布时间" min-width="100" ></el-table-column>
			<el-table-column prop="zhuangtai" label="发布状态" min-width="100" ></el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.state==0 && scope.row.del==0">编辑</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-else=""  disabled="disabled">编辑</el-button>
					<el-button type="danger" size="small" v-if="scope.row.state==0 &&scope.row.del==0"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="danger" size="small" v-else-if="scope.row.state==1 &&scope.row.del==0"  @click="handleDel(scope.$index, scope.row)" disabled="disabled">删除</el-button>
					<el-button type="danger" size="small" v-else=""  @click="handleDel(scope.$index, scope.row)"  disabled="disabled">已删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

		<!--新增/编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
				<el-form-item label="课程主题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）" style="width: 320px;"></el-input>
				</el-form-item>
				<el-form-item label="直播时间" required>
					<el-col :span="11">
						<el-form-item prop="date1">
							<el-date-picker type="date" placeholder="发布时间" v-model="editForm.date1" style="width: 80%;" :picker-options="pickerOptions0"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="11" >
						<el-form-item prop="num">
							<el-input v-model="value2" style="width:50px;" placeholder="16" pattern="\d{2}"></el-input>:<el-input v-model="value3" style="width:50px;" placeholder="00" pattern="\d{2}"></el-input>
							-
							<el-input v-model="value4"  style="width:50px;" placeholder="17" pattern="\d{2}"></el-input>:<el-input v-model="value5"  style="width:50px;" placeholder="00" pattern="\d{2}"></el-input>小于10的加0 如:01
						</el-form-item>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import {openclassList,openclasssave,openclassupdate,openclassdelect} from "../../api/cyApi.js";
    import axios from 'axios'
    export default {
        data() {
            return {
                valueday:"",
                value2: "16",
                value3: "00",
                value4:"17",
                value5:'00',
                multipleSelection:[],
                title:'',
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                radio: '1',
                editOrAdd:false,
                filters: {
                    datetime:''
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                sels: [],//列表选中列
                Loading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    title: [
                        { required: true, message: '请输入课程主题', trigger: 'blur' },
                        { max: 20, message: '长度不超过20个字符', trigger: 'blur' }
                    ],
                    date1: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
					num:[
						{ type: 'number', message: '必须为数字值'}
					]
                },
                //编辑界面数据
                editForm: {
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },

            }
        },
        methods: {
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleSizeChange(val) {
            },
            //获取列表
            async getList(para){
//                var datetime=this.filters.datetime.getFullYear() + '-' + (this.filters.datetime.getMonth() + 1) + '-' + this.filters.datetime.getDate() + ' ' + this.filters.datetime.getHours() + ':' + this.filters.datetime.getMinutes() + ':' + this.filters.datetime.getSeconds()
                para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    create_time:this.filters.datetime,
                };
                console.log(para)
                openclassList(para).then(res => {
                    let result=res.data;
                    for(var i=0;i<result.list.length;i++){
                        var date = new Date(result.list[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = date.getDate() + ' ';
                        var  h = date.getHours() + ':';
                        var  m = date.getMinutes() + ':';
                        var  s = date.getSeconds();
                        result.list[i].datetime=Y+M+D+h+m+s;
                        result.list[i].state==1?result.list[i].zhuangtai="已发送": result.list[i].zhuangtai="未发送";
                        result.list[i].date1=result.list[i].live_day;
                    }
                    console.log(result.list)
                    this.total = result.total;

                    this.datas=result.list;
                });

            },

            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                };
                this.getList(para)
            },

            change(row, event, column) {
                this.$refs.multipleTable.toggleRowSelection(row)
            },
            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var paradel = {
                        open_classtx_id:row.open_classtx_id
                    };
                    openclassdelect(paradel).then(res => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.listLoading = false;
                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                        };
                        this.getList(para);
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            async handleEdit (index, row) {
                console.log(row)
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.playAddressFileList= []
                this.showUeEdit = true;
            },
            //提交
            async editSubmit() {
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        if(typeof this.editForm.date1=="number"){
                            this.editForm.date1=new Date(this.editForm.date1)
                        }
                        console.log(this.editForm.date1)
                        var year = this.editForm.date1.getFullYear();
                        var month = this.editForm.date1.getMonth()+1;
                        var date = this.editForm.date1.getDate();
                        //月，日，时，分，秒 小于10时，补0
                        if(month<10){
                            month = "0" + month;
                        }
                        if(date<10){
                            date = "0" + date;
                        }
                        var livestart=year + '-' + month + '-' + date+ ' ' + this.value2 + ':' + this.value3;
                        console.log(livestart)
                        var livetime = new Date(livestart.replace(/-/g, "/"));
                        var nowtime = new Date();
                        var dateDiff =livetime.getTime()  -  nowtime.getTime();//时间差的毫秒数
                        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
                        console.log(dayDiff)
                        var reg = /.*\..*/;
                         if(this.value2>this.value4 || dayDiff<0){
                             this.$message('请填写正确的时间范围!')
						 }else if(this.value2==this.value4 && this.value3>this.value5){
                             this.$message('请填写正确的时间范围!')
						 }else if(this.value2>24 || this.value4>24 || this.value3>60 || this.value5>60){
                             this.$message('请填写正确的时间格式!')
						 }else if(this.value2.length!=2 ||this.value3.length!=2 || this.value4.length!=2 || this.value5.length!=2){
                             this.$message('请填写正确的时间格式!')
						 }else if(reg.test(this.value2) || reg.test(this.value3)  || reg.test(this.value4)  || reg.test(this.value5) ){
                             this.$message('不能输入小数点哦!')
						 }else{
                             this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                 this.editLoading = true;
                                 if(this.editOrAdd){
                                     //直播时间与当前时间相差1天以上
                                     if(dayDiff>=1){
                                         this.editForm.state=0;
                                     }else{
                                         this.editForm.state=1;
                                     }
                                     this.editForm.live_time=livetime.getTime();
                                     this.editForm.create_time=nowtime.getTime();
                                     this.editForm.open_classtx_id=nowtime.getTime().toString();
                                     this.editForm.zhiboshijian=livestart+"-"+this.value4+":"+this.value5;
                                     this.editForm.live_day=this.editForm.date1.getTime();
                                     let para = Object.assign({}, this.editForm);
                                     openclasssave(para).then(res => {
                                         this.dialogVisible = false;
                                         this.$message({
                                             message: '提交成功',
                                             type: 'success'
                                         });
                                         this.editLoading = false;
                                         var para1 = {
                                             pageNo:this.page,
                                             pageSize:this.pageSize,
                                         };
                                         this.getList(para1);
                                     });
                                 }else{
                                     if(dayDiff>=1){
                                         this.editForm.state=0;
                                     }else{
                                         this.editForm.state=1;
                                     }
                                     this.editForm.live_day=this.editForm.date1.getTime();
                                     this.editForm.live_time=livetime.getTime();
                                     this.editForm.zhiboshijian=livestart+"-"+this.value4+":"+this.value5;
                                     let para = Object.assign({}, this.editForm);
                                     openclassupdate(para).then(res => {
                                         this.dialogVisible = false;
                                         this.$message({
                                             message: '提交成功',
                                             type: 'success'
                                         });
                                         this.editLoading = false;
                                         var para1 = {
                                             pageNo:this.page,
                                             pageSize:this.pageSize,
                                         };
                                         this.getList(para1);
                                     });
                                 }
                             });
						 }


                    }
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            }
        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
        }
    }
</script>

<style>
	.el-dialog.el-dialog--small{
		overflow-x: hidden;
	}
	.el-dialog__body{
		max-height: 800px;
		overflow-y: auto;
		/*        margin-right: -14px;
                padding-right: 34px;*/
	}
	.ql-container.ql-snow{
		max-height: 200px;
		overflow-y: auto;
	}
	.el-pagination{
		text-align: center;
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