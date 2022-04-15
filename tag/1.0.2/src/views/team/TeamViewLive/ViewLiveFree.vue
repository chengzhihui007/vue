<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                <el-input v-model="filters.content" placeholder="请输入内容关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select  v-model="filters.name" clearable placeholder="请选择标签">
                        <el-option
                                v-for="item in biaoqianForm"
                                :key="item.label_id"
                                :label="item.name"
                                :value="item.label_id">
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
                <div>
                <el-form-item>
                    <el-select v-model="filters.region" style="width:193px;"  clearable  placeholder="请选择指标">
                        <!--<el-option label="浏览量" value="1"></el-option>-->
                        <el-option label="点赞量" value="2"></el-option>
                        <!--<el-option label="评论量" value="3"></el-option>-->

                    </el-select>

                </el-form-item>
                <el-form-item  >
                    <el-col :span="11">
                        <el-input v-model="filters.selectMin" placeholder="请输入指标最低值"></el-input>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="11">
                        <el-input v-model="filters.selectMax" placeholder="请输入指标最高值"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>
                </div>
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">添加</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"   @click="batchlike()">批量点赞</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55" :selectable='checkboxInit'></el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="title" label="内容" min-width="200" key="title">
                <template scope="scope">
                    <span  v-if="scope.row.content!=''">{{ scope.row.title}}</span>
                    <br>
                    <audio v-if="scope.row.play_address!='' && scope.row.content==''" :src="scope.row.play_address" controls="controls"></audio>
                </template>
            </el-table-column>

            <el-table-column prop="name" label="标签" min-width="50"></el-table-column>
            <el-table-column prop="pay" label="是否收费" min-width="50"></el-table-column>
            <el-table-column prop="zan" label="点赞实数/总数" min-width="100"></el-table-column>
            <el-table-column prop="datetime" label="发布时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">

                <el-button size="small" disabled @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.is_free!=0">编辑</el-button>
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-else="">编辑</el-button>
                <el-button type="danger" size="small" disabled @click="handleDel(scope.$index, scope.row)" v-if="scope.row.is_free!=0">删除</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

        <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="标签：" prop="name">
                <el-select  v-model="editForm.name"  placeholder="请选择标签"  @change="changedata(editForm.name)">
                    <el-option
                            v-for="(item,index) in biaoqianForm"
                            :key="index"
                            :label="item.name"
                            :value="index">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="观点内容："  prop="content">
                    <UeEdit v-if=showUeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=2000 :defaultMsg=editForm.content ref='content'></UeEdit>
                </el-form-item>
                <el-form-item label="语音观点：">
                    <el-upload class="upload-demo"
                               action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
                               :on-success="handleChange"
                               accept=".mp4"
                               :on-remove="handleRemove"
                               :on-exceed="handleExceed"
                               multiple
                               :file-list="playAddressFileList">
                        <el-button size="small" type="primary">点击上传音频文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传mp4文件,下方音频地址回显后再提交</div>
                    </el-upload>
                    <el-input v-model="playadddress" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="结束设置：">
                    <el-radio-group v-model="radeo">
                        <el-radio :label="0" >无标记</el-radio>
                        <el-radio :label="1" >标记为结束观点</el-radio>
                    </el-radio-group>
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
                    <el-form-item label="注水数" prop="Infuse" >
                        <el-input-number v-model="zhushuiObj.Infuse" @change="handleChanged" :min="1" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input-number>
                    </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个赞吗？</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="zhushuiVisible = false,zhushuiLoading=false">取消</el-button>
                <el-button type="primary" @click.native="zhushuiSubmit()" :loading="zhushuiLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../common/js/util';
    import UeEdit from '../../UeEdit.vue';
    import {viewlivefreeList,viewlivefreesave,viewlivefreeupdate,viewlivefreedelect,viewlivefreeupdateview,getQiyonglist} from "../../../api/ydApi.js";
    import api from "../../../api/api.js";
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
                teacherFrom:[],
                biaoqianForm:[],
                options:[],
                checkList: [],
                multipleSelection:[],
                likeFrom:{},
                playAddressFileList:[],
                biaoqianname:'',
                biaoqianid:'',
                radeo:0,
                title:'',
                playadddress:'',
                videoadddress:'',
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
                    teacherName:'',
                    datetime:''
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize: 30,
                currentPage: 1,
                team_id:"",
                team_name:"",
                listLoading: false,
                chakanFormVisible:false,
                zhushuiLoading:false,
                sels: [],//列表选中列
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                likeVisible:false,
                ZsFormVisible:false,
                editLoading: false,
                ZsLoading:false,
                zhushuiVisible: false,
                zhushuiObj: { Infuse: null },
                editFormRules: {
                    name: [
                        { required: true, message: '请选择标签', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请输入观点内容', trigger: 'change' }
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
            handleChanged(value) {
                console.log(value);
            },
            checkboxInit(row,index){
                if (row.is_free!=0)
                    return 0;//不可勾选
                else
                    return 1;//可勾选
            },
            likeEvent(a){

                this.zhushuiObj ={
                    Infuse:a,

                };

            },
//            changeFun(val) {
//                this.checkList = val;
//                console.log(this.checkList)
//            },
            changedata: function(index){
                this.biaoqianmake=true;
                this.biaoqianid=this.biaoqianForm[index].label_id;
                this.biaoqianname=this.biaoqianForm[index].name;
            },

            beforeAvatarUpload(file) {
                return  true;
            },
            handleChange(response, file){
                this.editLoading = true;
                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {
                    var data = JSON.parse(evt.data)
                    _this.playadddress=data.origUrl;
                    _this.editForm.audio_length=data.durationMsec;
                    _this.editLoading = false;
                    ws.close()
                };
                ws.onclose = function () {
                }

            },

            handleRemove(file, fileList) {
                this.editForm.play_address = "";
                this.editForm.audio_length = "";
                this.playadddress=this.editForm.play_address;
            },

            handleExceed(files, fileList){
                this.$message.warning(`当前限制选择 1 个文件~`);
            },

            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.page = val;
            },
            //获取列表
            async getList(para){
//                var datetime=this.filters.datetime.getFullYear() + '-' + (this.filters.datetime.getMonth() + 1) + '-' + this.filters.datetime.getDate() + ' ' + this.filters.datetime.getHours() + ':' + this.filters.datetime.getMinutes() + ':' + this.filters.datetime.getSeconds()
                para = {
                    team_id:this.team_id,
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    content:this.filters.content,
                    label_id:this.filters.name,
                    create_time:this.filters.datetime,
                    region: this.filters.region,
                    selectMin:this.filters.selectMin,
                    selectMax:this.filters.selectMax
                };
                viewlivefreeList(para).then(res => {
                    let result=res.data;
                    for(var i=0;i<result.list.length;i++){

                       this.title=result.list[i].content;
                        result.list[i].title=result.list[i].title.substring(0,200).replace(/&nbsp;/gi,'');
                        console.log(this.title)
                        result.list[i].zan=result.list[i].likeR+"  /  "+result.list[i].like;
                        var date = new Date(result.list[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = date.getDate() + ' ';
                        var  h = date.getHours() + ':';
                        var  m = date.getMinutes() + ':';
                        var  s = date.getSeconds();
                        result.list[i].datetime=Y+M+D+h+m+s;
                        if(result.list[i].is_free==0){
                            result.list[i].pay="免费"
                        }else if(result.list[i].is_free==1){
                            result.list[i].pay="付费"
                        }else{
                            result.list[i].pay="需订阅"
                        }
                    }
                    this.total = result.total;
                    this.datas=result.list;
                    console.log(this.datas)
                });
            },
            //标签列表免费
            async biaoqianList() {
                let paras = {
                    del_flag:1,
                    is_pay:0,
                    team_id:this.team_id
                };
                getQiyonglist(paras).then(res => {
                    console.log(res)
                  let lists=res.data
                    let arr = [];
                    for(let i=0;i<lists.length;i++){
                        arr.push(lists[i]);
                    }
                    this.biaoqianForm=arr;
                    console.log(this.biaoqianForm)
                    this.listLoading = false;
                });

            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    team_id:this.team_id,
                    pageNo:this.page,
                    pageSize:this.pageSize,
                };
                this.getList(para)
            },


            //批量点赞页面
            selsChange: function (sels) {
                this.sels = sels;
            },
            async batchlike () {

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = 1;
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

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.$confirm('您确定删除该记录吗？删除后前台将不再显示，该记录所有的关联数据将同时被删除。', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var paradel = {
                        viewlive_id:row.viewlive_id
                    };
                    viewlivefreedelect(paradel).then(res => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.listLoading = false;
                        var para = {
                            team_id:this.team_id,
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

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;

                this.editForm = Object.assign({}, row);
                console.log(this.editForm)
                if(this.editForm.play_address=="" || this.editForm.play_address==null){
                    this.playAddressFileList =[];
                    this.playadddress="";
                }else{
                    this.playAddressFileList = [{name:this.editForm.play_address,url:this.editForm.play_address}];
                    this.playadddress=this.editForm.play_address;
                }
                this.showUeEdit = true;
            },
            //显示新增界面
            handleAdd: function (){

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.playAddressFileList= [];
                this.playadddress="";
                this.showUeEdit = true;
            },
            //提交
            async editSubmit() {
                this.$refs.editForm.validate(async (valid) => {
                    this.editForm.play_address=this.playadddress;
                    this.editForm.is_pay=0;
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            if(this.editOrAdd){
                                this.editForm.label_id=this.biaoqianid;
                                this.editForm.name=this.biaoqianname;
                                this.editForm.shijianchuo=new Date().getTime();
                                this.editForm.create_time=String( new Date().getTime());
                                this.editForm.update_time=String( new Date().getTime());
                                this.editForm.viewlive_id=String( new Date().getTime());
                                this.editForm.is_end=this.radeo;
                                this.editForm.team_id=this.team_id;
                                this.editForm.team_name=this.team_name;
                                this.editForm.is_free=0;
                                let para = Object.assign({}, this.editForm);
                                viewlivefreesave(para).then(res => {
                                    this.dialogVisible = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.editLoading = false;
                                    var para1 = {
                                        team_id:this.team_id,
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.getList(para1);
                                });
                            }else{
                                if(this.biaoqianmake){
                                    this.editForm.label_id=this.biaoqianid;
                                    this.editForm.name=this.biaoqianname;
                                }
                                this.editForm.is_end=this.radeo;
                                this.editForm.update_time=String( new Date().getTime());
                                let para = Object.assign({}, this.editForm);
                                viewlivefreeupdate(para).then(res => {
                                    this.dialogVisible = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.editLoading = false;
                                    var para1 = {
                                        team_id:this.team_id,
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
            //注水提交
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.zhushuiVisible=false;
                    this.setInfuse(this.InfuseType)
                    if (valid) {
                        viewlivefreeupdateview(this.sels).then(res => {
                            this.$message({
                                message: "注水成功",
                                type: "success"
                            });
                            this.zhushuiLoading=false;
                            this.zhushuiObj.Infuse = 0;
                            var para = {
                                team_id:this.team_id,
                                pageNo:this.page,
                                pageSize:this.pageSize,
                            };
                            this.getList(para);
                        });
                    }
                });
            },
            setInfuse() {
                this.sels.forEach(a => {
                    a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                    a.zhushuishu = this.zhushuiObj.Infuse;
                });
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;
            var para = {
                team_id:this.team_id,
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
            this.biaoqianList()
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
    .el-row {
        margin-bottom: 20px;
    }
    .edui-default .edui-editor {
        width: 100% !important;
    }
</style>