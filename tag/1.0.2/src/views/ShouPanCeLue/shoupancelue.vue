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
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="handleInfuse(0)" >增加点赞</el-button>
                        <el-button type="primary"  @click="handleInfuse(1)" >增加浏览量</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
            <el-table-column prop="teacherName" label="信息来源" min-width="50"></el-table-column>
            <el-table-column prop="controller" label="适用功能" min-width="50"></el-table-column>
            <el-table-column prop="liulan" label="浏览实数/总数" min-width="100"></el-table-column>
            <el-table-column prop="zan" label="点赞实数/总数" min-width="100"></el-table-column>
            <el-table-column prop="share" label="分享量" min-width="50"></el-table-column>
            <el-table-column prop="datetime" label="发布时间" min-width="100" ></el-table-column>
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
                    <el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）" style="width: 320px;"></el-input>
                </el-form-item>

                <el-form-item label="信息来源：" prop="teacherName">
                    <el-select  v-model="editForm.teacherName"  placeholder="请选择信息来源"  @change="changelaoshi(editForm.teacherName)">
                        <el-option
                                v-for="(list,index) in teacherFrom"
                                :key="index"
                                :label="list.name"
                                :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用功能：" prop="controller">
                    <el-select  v-model="editForm.controller"  placeholder="请选择适用功能"  @change="changedata(editForm.controller)">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="正文内容：" prop="content">
                    <UeEdit v-if=showUeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=2000 :defaultMsg=editForm.content ref='content'></UeEdit>
                </el-form-item>
                <!--<el-form-item label="正文：" prop="content">-->
                <!--<el-input type="textarea" :rows="4" placeholder="限2000字以内" v-model="editForm.content"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="图片：" prop="">-->
                    <!--<el-upload-->
                            <!--action="/api/file/imageUpload/"-->
                            <!--list-type="picture-card"-->
                            <!--:on-remove="handleRemove"-->
                            <!--:on-success="handleAvatarSuccess"-->
                             <!--multiple-->
                            <!--:limit="3"-->
                            <!--:on-exceed="handleExceed"-->
                            <!--:file-list="imgfile">-->
                            <!--<i class="el-icon-plus"></i>-->
                    <!--</el-upload>-->
                    <!--<div >点击上传图片，最多上传3张图片</div>-->
                <!--</el-form-item>-->
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
    import util from '../../common/js/util';
    import UeEdit from '../UeEdit.vue';
    import {shoupanList,shoupansave,shoupanupdate,shoupandelect,shoupanupdateview} from "../../api/ydApi.js";
    import api from '../../api/api.js';
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
                desin:false,
                teacherFrom:[],
                biaoqianForm:[],
                options:[],
                checkList: [],
                zhushuiid:'',
                multipleSelection:[],
                likeFrom:{},
                playAddressFileList:[],
                teachername:'',
                teacherid:'',
                biaoqianname:'',
                biaoqianid:'',
                zhifu:'',
                title:'',
                playadddress:'',
                biaoqianmake:false,
                teachermake:false,
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                fileList:[],
                imgfile:[],
                filelists:[],
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
                editLoading: false,
                ZsLoading:false,
                zhushuiVisible: false,
                zhushuiObj: { Infuse: null },
                editFormRules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        {max: 20, message: '最多输入20个字', trigger: 'blur' }
                    ],
                    controller: [
                        { required: true, message: '请选择适用功能', trigger: 'change' }
                    ],
                    teacherName: [
                        { required: true, message: '请选择信息来源', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请输入正文内容', trigger: 'change' },
                    ],
                },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                },
                options: [{
                    value: '图表分析',
                    label: '图表分析'
                }, {
                    value: '精彩文章',
                    label: '精彩文章'
                }],

            }
        },
        methods: {
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
            },
            changelaoshi:function(index){
                this.teachermake=true;
               this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
            },
            handleRemove(file, fileList) {
                this.imgfile=fileList;
                console.log(this.imgfile)
                var newlist=[];
                for(var i=0;i<this.fileList.length;i++){
                    if(this.fileList[i]!='http://192.168.11.103:10001/image/'+file.response.message){
                        newlist.push(this.fileList[i])
                    }
                }
                this.fileList=newlist;
            },
            handleAvatarSuccess(response, file, fileList){
                this.imgfile=fileList;
                console.log(this.imgfile)

                this.fileList.push('http://192.168.11.103:10001/image/'+response.message);
            },
            handleExceed(files, fileList) {
                console.log(fileList)
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    title:this.filters.title,
                    teacher:this.filters.teacher,
                    create_time:this.filters.datetime,
                    selectMin:this.filters.selectMin,
                    selectMax:this.filters.selectMax
                };
                console.log(para)
                let result=await api.shoupanList(para);
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
            //标签列表
            async biaoqianList() {
                let paras = {
                    flag:1
                };
                let lists=await api.selectBiaoqianList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.biaoqianForm=arr;
                this.listLoading = false;
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
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
            //显示注水页面
            async handleInfuse(type) {
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
                } else {
                    this.sels.forEach(a => {
                        this.zhushuiid='';
                        a.view = Number(a.view) + Number(this.zhushuiObj.Infuse);
                        a.zhushuishu=this.zhushuiObj.Infuse;
                        a.type=1;
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
                    var result={
                        afterTactics_id:row.afterTactics_id
                    }
                    await api.deleteshoupan(result);
                    this.listLoading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    var para = {
                        pageNo:this.page,
                        pageSize:this.pageSize,
                    };
                    this.getList(para);
                }).catch(() => {

                });
            },
            //显示编辑界面
            async handleEdit (index, row) {

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
                this.imgfile=[];
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.showUeEdit = true;
            },
            //提交
            async editSubmit() {
                var b=/<img.*?(?:>|\/>)/gi;
                var s=this.editForm.content.match(b);
                if(s!=null){
                    if(s.length>3){
                        this.$confirm('最多上传三张图片，请检查图片数量！', '提示', {})
                    }else{
                        this.$refs.editForm.validate(async (valid) => {
                            if (valid) {
                                this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                    this.editLoading = true;
                                    if(this.editOrAdd){
                                        this.editForm.filelists=JSON.stringify(this.imgfile);
                                        this.editForm.teacher=this.teacherid;
                                        this.editForm.teacherName=this.teachername;
                                        this.editForm.shijianchuo=new Date().getTime();
                                        this.editForm.create_time=String( new Date().getTime());
                                        this.editForm.update_time=String( new Date().getTime());
                                        this.editForm.afterTactics_id=String( new Date().getTime());
                                        this.editForm.images=this.fileList.join(",");
                                        let para = Object.assign({}, this.editForm);
                                        console.log(para)
                                        await api.saveshoupan(para)
                                    }else{
                                        if(this.teachermake){
                                            this.editForm.teacher=this.teacherid;
                                            this.editForm.teacherName=this.teachername;
                                        }
                                        this.editForm.update_time=String( new Date().getTime());
                                        this.editForm.images=this.fileList.join(",");
                                        let para = Object.assign({}, this.editForm);
                                        await api.updateshoupan(para)
                                    }
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
                }else{
                    this.$refs.editForm.validate(async (valid) => {
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                this.editLoading = true;
                                if(this.editOrAdd){
                                    this.editForm.filelists=JSON.stringify(this.imgfile);
                                    this.editForm.teacher=this.teacherid;
                                    this.editForm.teacherName=this.teachername;
                                    this.editForm.shijianchuo=new Date().getTime();
                                    this.editForm.create_time=String( new Date().getTime());
                                    this.editForm.update_time=String( new Date().getTime());
                                    this.editForm.afterTactics_id=String( new Date().getTime());
                                    this.editForm.images=this.fileList.join(",");
                                    let para = Object.assign({}, this.editForm);
                                    console.log(para)
                                    await api.saveshoupan(para)
                                }else{
                                    if(this.teachermake){
                                        this.editForm.teacher=this.teacherid;
                                        this.editForm.teacherName=this.teachername;
                                    }
                                    this.editForm.update_time=String( new Date().getTime());
                                    this.editForm.images=this.fileList.join(",");
                                    let para = Object.assign({}, this.editForm);
                                    await api.updateshoupan(para)
                                }
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
                                for(var i=0;i<this.sels.length;i++){
                                    delete this.sels[i].quan;
                                }
                                let res = await api.updatelikeshoupan(this.sels);
                                if (res.success) {
                                    this.$message({
                                        message: "注水成功",
                                        type: "success"
                                    });
                                    this.zhushuiVisible = false;
                                } else {
                                    this.$message({
                                        message: "注水失败",
                                        type: "error"
                                    });
                                }
                                this.editLoading=false;
                                this.zhushuiObj.Infuse = 0;
                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                };
                                this.getList(para);
                            }
                        }).catch(() => {
                            this.editLoading=false;
                        });
                    }else{
                        if (valid) {
                            for(var i=0;i<this.sels.length;i++){
                                delete this.sels[i].quan;
                            }
                            let res = await api.updatelikeshoupan(this.sels);
                            if (res.success) {
                                this.$message({
                                    message: "注水成功",
                                    type: "success"
                                });
                                this.zhushuiVisible = false;
                            } else {
                                this.$message({
                                    message: "注水失败",
                                    type: "error"
                                });
                            }
                            this.editLoading=false;
                            this.zhushuiObj.Infuse = 0;
                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                            };
                            this.getList(para);
                        }
                    }


                });

            },
        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
            this.selectTeacherList();
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