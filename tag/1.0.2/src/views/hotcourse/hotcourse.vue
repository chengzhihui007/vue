<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="请输入标题关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select  v-model="filters.teacher" clearable placeholder="请选择老师">
						<el-option
								v-for="list in teacherFrom"
								:key="list.id"
								:label="list.name"
								:value="list.id">
						</el-option>
					</el-select>
				</el-form-item>
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
				<div>
					<el-form-item>
						<el-button type="primary"  @click="handleAdd">新增</el-button>
					</el-form-item>
					<el-button type="primary"  @click="handleInfuse(0)" >增加点赞</el-button>
					<el-button type="primary"  @click="handleInfuse(1)" >增加浏览量</el-button>
				</div>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55" :selectable='checkboxInit'></el-table-column>

			<el-table-column type="index" width="60">
			</el-table-column>

			<!--   <el-table-column   prop="centor_viewpoint_id" label="ID"  min-width="70"></el-table-column>-->
			<el-table-column prop="title" label="标题" min-width="200" ></el-table-column>
			<el-table-column prop="teachername" label="老师" min-width="50"></el-table-column>
			<el-table-column prop="zan" label="点赞实数/总数" min-width="100"></el-table-column>
			<el-table-column prop="liulan" label="浏览实数/总数" min-width="100"></el-table-column>
			<el-table-column prop="datetime" label="发布时间" min-width="100" ></el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.state==0">编辑</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-else=""  disabled="disabled">编辑</el-button>
					<el-button type="danger" size="small" v-if="scope.row.state==0"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="danger" size="small" v-else=""  @click="handleDel(scope.$index, scope.row)"  disabled="disabled">已删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

		<!--新增/编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）" style="width: 320px;"></el-input>
				</el-form-item>
				<el-form-item label="主讲老师" prop="teachername">
					<el-select  v-model="editForm.teachername"  placeholder="请选择老师"  @change="changelaoshi(editForm.teachername)">
						<el-option
								v-for="(list,index) in teacherFrom"
								:key="index"
								:label="list.name"
								:value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发布时间" >
					<div class="block" v-if="!editOrAdd">
						<el-date-picker
								v-model="editForm.create_time"
								type="date"
								placeholder="选择日期"
								 readonly>
						</el-date-picker>

					</div>
					<div class="block" v-else="">
						<el-date-picker
								v-model="editForm.create_time"
								type="date"
								placeholder="选择日期"
								:picker-options="pickerOptions0">
						</el-date-picker>
						<font color="#FF0000">不选择日期默认当前时间</font>
					</div>
				</el-form-item>
				<el-form-item  label="封面"   prop="image" >
					<el-upload class="avatar-uploader"
							   action="/api/file/imageUpload/"
							   :show-file-list="false"
							   :on-success="handleAvatarSuccess"
							   :before-upload="beforeAvatarUpload">
						<img v-if="xianshi" :src="editForm.image" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频文件：" prop="play_address">
					<el-upload class="upload-demo"
							   action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
							   :on-success="handleChange"
							   accept=".mp4"
							   :on-remove="handleRemove"
							   :on-exceed="handleExceed"
							   multiple
							   :file-list="playAddressFileList">
						<el-button size="small" type="primary">点击上传视频文件</el-button>
						<div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
					</el-upload>
					<el-input v-model="editForm.play_address" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--批量点赞-->
		<el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
			<el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
				<el-form-item label="注水数" prop="Infuse" :rules="[
                       { required: true, message: '不能为空'},
                       { type: 'number', message: '必须为数字值'}
                       ]">
					<el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input>
				</el-form-item>
				<el-form-item v-if="this.InfuseType==0">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个赞吗？</p>
				</el-form-item>
				<el-form-item v-else="">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个阅读数吗？</p>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="zhushuiVisible = false,editLoading=false">取消</el-button>
				<el-button type="primary" @click.native="zhushuiSubmit()" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {imageDefault} from "../../common/js/urls";
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import {hotcourseList,hotcoursesave,hotcourseupdate,hotcoursedelect,hotcourseupdateview} from "../../api/cyApi.js";
    import axios from 'axios'
    export default {
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
                    }
                },
                desin:false,
                teacherFrom:[],
                biaoqianForm:[],
                options:[],
                checkList: [],
                multipleSelection:[],
                likeFrom:{},
                playAddressFileList:[],
                teachername:'',
                teacherid:'',
                biaoqianname:'',
                biaoqianid:'',
                zhifu:'',
				xianshi:false,
                title:'',
                biaoqianmake:false,
                teachermake:false,
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                radio: '1',
                editOrAdd:false,
                filters: {
                    content: '',
                    name:'',
                    teachername:'',
                    datetime:''
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                zhushuiLoading:false,
                sels: [],//列表选中列
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                likeVisible:false,
                ZsFormVisible:false,
                zhushuiid:'',
                ZsTitle:"点赞量注水",
                editLoading: false,
                ZsLoading:false,
                zhushuiVisible: false,
                InfuseType:1,
                zhushuiObj: { Infuse: null },
                editFormRules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { max: 20, message: '长度不超过20个字符', trigger: 'blur' }
                    ],
                    teachername: [
                        { required: true, message: '请选择老师', trigger: 'change' }
                    ],
                    image: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ],
                    play_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],
                },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        methods: {
            checkboxInit(row,index){
                if (row.state==1)
                    return 0;//不可勾选
                else
                    return 1;//可勾选
            },
            likeEvent(a){
                this.zhushuiObj ={
                    Infuse:a,
                };
            },
            handleAvatarSuccess(res, file) {
                this.xianshi=true;
                this.editForm.image =imageDefault+ res.message;
            },
            beforeAvatarUpload(file) {
                this.xianshi=false;
                return true;
            },
            changelaoshi:function(index){
                this.teachermake=true;
                this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
            },
            handleChange(response, file){
                this.editLoading = true;
                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {

                    console.log("已发送");
                    var data = JSON.parse(evt.data)
                    _this.editForm.play_address=data.origUrl;
                    _this.editForm.video_length=data.durationMsec;
                    _this.editLoading = false;
                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

            },
            handleRemove(file, fileList) {
                this.editForm.play_address = "";
                this.editForm.video_length = "";
            },
            handleExceed(files, fileList){
                this.$message.warning(`当前限制选择 1 个文件~`);
            },

            handleSizeChange(val) {
            },
            //获取列表
            async getList(para){
//                var datetime=this.filters.datetime.getFullYear() + '-' + (this.filters.datetime.getMonth() + 1) + '-' + this.filters.datetime.getDate() + ' ' + this.filters.datetime.getHours() + ':' + this.filters.datetime.getMinutes() + ':' + this.filters.datetime.getSeconds()
                para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    title:this.filters.title,
                    teacher:this.filters.teacher,
                    create_time:this.filters.datetime,
                };
                hotcourseList(para).then(res => {
                    let result=res.data;
                    for(var i=0;i<result.list.length;i++){
                        result.list[i].zan=result.list[i].likeR+"  /  "+result.list[i].like;
                        result.list[i].liulan=result.list[i].viewR+"  /  "+result.list[i].view;
                        var date = new Date(result.list[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = date.getDate() + ' ';
                        var  h = date.getHours() + ':';
                        var  m = date.getMinutes() + ':';
                        var  s = date.getSeconds();
                        result.list[i].datetime=Y+M+D+h+m+s;

                    }
                    this.total = result.total;

                    this.datas=result.list;
                });

            },
            //老师列表
            async selectTeacherList() {
                let paras = {
                    flag:0
                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.teacherFrom=arr;
                this.listLoading = false;
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                };
                this.getList(para)
            },


            //批量点赞页面
            selsChange: function (sels) {
                this.sels = sels;
            },
            setInfuse(type) {
                if (type === 0) {
                    this.zhushuiid='';
                    for (var i=0;i<this.sels.length;i++)
                    {

                        var  a =   this.sels[i];

                        if (
                            Number(this.zhushuiObj.Infuse) + Number(a.like) >
                            Number(a.view)
                        ) {
                            a.like = a.view;
                            this.zhushuiid+=a.num +"    ";

                            a.zhushuishu=a.view-a.like;
                            a.type=0;
                        } else {
                            a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                            a.zhushuishu = this.zhushuiObj.Infuse;
                            a.type=0;
                        }

                    }

                } else {
                    this.sels.forEach(a => {
                        this.zhushuiid='';
                        a.view = Number(a.view) + Number(this.zhushuiObj.Infuse);
                        a.zhushuishu=this.zhushuiObj.Infuse;
                        a.type=1;
                    });
                }
            },

            async batch (type) {
                if(type==1)
                {
                    this.ZsTitle="点赞注水";
                }
                else
                {
                    this.ZsTitle="浏览量注水";
                }
                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = type;

                } else {
                    this.$message({
                        message: " 选择一条数据",
                        type: "warning"
                    });
                }
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
                        publish:row.publish
                    };
                    hotcoursedelect(paradel).then(res => {
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
				this.xianshi=true;
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.playAddressFileList = [{name:this.editForm.play_address,url:this.editForm.play_address}];
                this.showUeEdit = true;
            },
            //显示新增界面
            handleAdd: function () {
                this.xianshi=false;
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
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;

                            if(this.editOrAdd){
                                this.editForm.teacher=this.teacherid;
                                this.editForm.teachername=this.teachername;
								if(this.editForm.create_time){
                                    this.editForm.create_time=String((this.editForm.create_time).getTime());
                                    //this.editForm.publish=(this.editForm.create_time).getTime().toString();
								}else{
                                    let nowTimeDate = new Date();
                                    nowTimeDate.setHours(0, 0, 0, 0);//设为当天0点0分0秒0毫秒。
                                    this.editForm.create_time = nowTimeDate.getTime()//把nowTime的日期加到startTime上
								}
                                this.editForm.update_time=String( new Date().getTime());
                                let para = Object.assign({}, this.editForm);
                                hotcoursesave(para).then(res => {
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
                                if(this.teachermake){
                                    this.editForm.teacher=this.teacherid;
                                    this.editForm.teachername=this.teachername;
                                }
                                this.editForm.update_time=String( new Date().getTime());
                                let para = Object.assign({}, this.editForm);
                                hotcourseupdate(para).then(res => {
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
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            //显示注水页面
            async handleInfuse(type) {
                this.editLoading = false;
                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = type
                } else {
                    this.$message({
                        message: " 选择一条数据",
                        type: "warning"
                    });
                }
            },
            //注水提交
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.zhushuiVisible=true;
                    this.editLoading = true;
                    this.setInfuse(this.InfuseType);
                    if(this.InfuseType==0 && this.zhushuiid!=""){
                        this.$confirm('条数为'+this.zhushuiid+"的点赞量超过阅读数，是否取阅读数最低值？", '提示', {
                            type: 'warning'
                        }).then(async () => {
                            if (valid) {
                                for(var i=0;i<this.sels.length;i++){
                                    delete this.sels[i].quan;
                                }
                                hotcourseupdateview(this.sels).then(res => {
                                    this.$message({
                                        message: "注水成功",
                                        type: "success"
                                    });
                                    this.zhushuiVisible=false;
                                    this.zhushuiObj.Infuse = 0;
                                    var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.getList(para);
                                    this.editLoading = false;
                                });
                            }
                        }).catch(() => {
                            this.zhushuiVisible=false;
                        });
                    }else{
                        if (valid) {
                            for(var i=0;i<this.sels.length;i++){
                                delete this.sels[i].quan;
                            }
                            hotcourseupdateview(this.sels).then(res => {
                                this.$message({
                                    message: "注水成功",
                                    type: "success"
                                });
                                this.zhushuiVisible=false;
                                this.zhushuiObj.Infuse = 0;
                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                };
                                this.getList(para);
                            });

                        }
                    }
                });

            }
        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
            this.selectTeacherList();
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