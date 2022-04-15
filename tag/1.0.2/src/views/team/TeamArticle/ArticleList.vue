<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.title" placeholder="请输入标题关键字"></el-input>
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
                </div>
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                        <el-button type="primary"  @click="toLable">标签管理</el-button>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button type="primary"  @click="handleInfuse(0)" >批量点赞</el-button>
                        <el-button type="primary"  @click="handleInfuse(1)" >批量浏览</el-button>
                        <!--<el-button type="primary"  @click="handleInfuse(2)" >批量分享</el-button>-->
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
            <el-table-column prop="name" label="标签" min-width="50"></el-table-column>
            <el-table-column prop="liulan" label="浏览实数/总数" min-width="100"></el-table-column>
            <el-table-column prop="zan" label="点赞实数/总数" min-width="100"></el-table-column>
            <!--<el-table-column prop="share" label="分享数" min-width="50"></el-table-column>-->
            <el-table-column prop="datetime" label="添加时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

        <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="editForm.title" auto-complete="off" :onkeyup="checkContent(editForm.title)" style="width: 320px;"></el-input> <span>限20个汉字</span>
                </el-form-item>
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
                <el-form-item label="正文内容：" prop="content">
                    <UeEdit v-if=showUeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=2000 :defaultMsg=editForm.content ref='content'></UeEdit>
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
                    <el-form-item label="注水数" prop="Infuse">
                        <el-input-number v-model="zhushuiObj.Infuse" @change="handleChange" :min="1" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input-number>
                    </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个吗？</p>
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
    import {ArticleList,Articlesave,Articleupdate,Articledelect,Articleupdateview,getArticleQiyonglist} from "../../../api/ydApi.js";
    import api from '../../../api/api.js';
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
                desin:false,
                biaoqianForm:[],
                options:[],
                checkList: [],
                zhushuiid:'',
                multipleSelection:[],
                likeFrom:{},
                biaoqianname:'',
                biaoqianid:'',
                team_id:"",
                team_name:"",
                zhifu:'',
                title:'',
                biaoqianmake:false,
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
                    content: [
                        { required: true, message: '请输入正文内容', trigger: 'change' },
                    ],
                    name: [
                        { required: true, message: '请选择标签', trigger: 'change' }
                    ],
                    title:[
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                },

            }
        },
        methods: {
            getStrLenght(content) {
                if(content){
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
                }

            },
            checkContent(content){
                let  len =    this.getStrLenght(content);
            },
            handleChange(value) {
                console.log(value);
            },
            toLable:function(){
                let routeUrl = this.$router.resolve({
                    path: "/TeamArticleLable"
                });
                window.open(routeUrl .href, '_blank');
            },
            changedata: function(index){
                this.biaoqianmake=true;
                this.biaoqianid=this.biaoqianForm[index].label_id;
                this.biaoqianname=this.biaoqianForm[index].name;
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
                    title:this.filters.title,
                    teacher:this.filters.teacher,
                    create_time:this.filters.datetime,
                    selectMin:this.filters.selectMin,
                    selectMax:this.filters.selectMax
                };
                ArticleList(para).then(res => {
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

            //标签列表
            async biaoqianList() {
                let paras = {
                    del_flag:1,
                    team_id:this.team_id
                };
                getArticleQiyonglist(paras).then(res => {
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
            //显示注水页面
            async handleInfuse(type) {

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

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
            likeEvent(a){

                this.zhushuiObj ={
                    Infuse:a,

                };

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
                } else if(type==1){
                    this.sels.forEach(a => {
                        this.zhushuiid='';
                        a.view = Number(a.view) + Number(this.zhushuiObj.Infuse);
                        a.zhushuishu=this.zhushuiObj.Infuse;
                        a.type=1;
                    });
                }else{
                    this.sels.forEach(a => {
                        this.zhushuiid='';
                        a.share = Number(a.share) + Number(this.zhushuiObj.Infuse);
                        a.zhushuishu=this.zhushuiObj.Infuse;
                        a.type=2;
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
                    var result={
                        teamArticle_id:row.teamArticle_id
                    }
                    Articledelect(result).then(res => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
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

                if(row.filelists!=null){
                    this.imgfile=JSON.parse(row.filelists);
                }
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                console.log(this.imgfile)
                this.showUeEdit = true;
            },
            //显示新增界面
            handleAdd: function () {

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.imgfile=[];
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.showUeEdit = true;
            },
            //提交
            async editSubmit() {
                let  len  =    this.getStrLenght(this.editForm.title);
                if(len > 20 ){
                    this.$message({
                        message: "（限20个汉字）！",
                        type: "error"
                    });
                    return  false;
                }

                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            if(this.editOrAdd){
                                this.editForm.label_id=this.biaoqianid;
                                this.editForm.name=this.biaoqianname;
                                this.editForm.shijianchuo=new Date().getTime();
                                this.editForm.create_time=String( new Date().getTime());
                                this.editForm.update_time=String( new Date().getTime());
                                this.editForm.teamArticle_id=String( new Date().getTime());
                                this.editForm.team_id=this.team_id;
                                this.editForm.team_name=this.team_name;
                                let para = Object.assign({}, this.editForm);
                                Articlesave(para).then(res => {
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
                                this.editForm.update_time=String( new Date().getTime());
                                let para = Object.assign({}, this.editForm);
                                Articleupdate(para).then(res => {
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
                    this.editLoading=true;
                    this.setInfuse(this.InfuseType);
                    if(this.InfuseType==0 && this.zhushuiid!=""){
                        this.$confirm('条数为'+this.zhushuiid+"的点赞量超过阅读数，是否取阅读数最低值？", '提示', {
                            type: 'warning'
                        }).then(async () => {
                            if (valid) {
                                Articleupdateview(this.sels).then(res => {
                                    this.$message({
                                        message: "注水成功",
                                        type: "success"
                                    });
                                    this.zhushuiVisible=false;
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
                        }).catch(() => {

                        });
                    }else{
                        if (valid) {
                            Articleupdateview(this.sels).then(res => {
                                this.$message({
                                    message: "注水成功",
                                    type: "success"
                                });
                                this.zhushuiVisible=false;
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
                    }


                });

            },
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

<style slot-scope>

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
</style>