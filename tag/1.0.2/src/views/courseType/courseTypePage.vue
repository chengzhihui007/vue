<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.title" placeholder="请输入标签关键字"></el-input>-->
                <!--</el-form-item>-->

                <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="getList()">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary"  @click="handleAdd">添加</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="课程类型" min-width="200"></el-table-column>



            <el-table-column label="操作" min-width="150">

                <template scope="scope">
                    <template  v-if="scope.row.status == 1" >
                        <!--<el-button type="warning" size="small"   @click="handleEdit(scope.$index, scope.row)">修改</el-button>-->
                        <!--<el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                        <!--<el-button type="danger" size="small"   @click="handleEdit(scope.$index, scope.row,0)">停用</el-button> &lt;!&ndash; 2018-08-14 下线功能 &ndash;&gt;-->
                        <el-button type="danger" size="small"   @click="handleOff(scope.$index, scope.row)">停用</el-button>
                        <!--<span style="color: gray;">已停用</span>-->
                    </template>

                    <template  v-else-if="scope.row.status == 0" >
                        <!--<el-button type="info" disabled  size="" >该视频已下线</el-button> &lt;!&ndash; 2018-08-14 下线功能 &ndash;&gt;-->
                        <!--<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row,1)">启用</el-button>-->
                        <span style="color: gray;">已停用</span>
                        <!--<el-button type="primary" size="small"   @click="handleOn(scope.$index, scope.row)">启用</el-button>-->
                        <!--<el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                        <!--<el-button type="danger" disabled  size="small"   @click="handleOff(scope.$index, scope.row)">下线</el-button> &lt;!&ndash; 2018-08-14 下线功能 &ndash;&gt;-->
                    </template>
                </template>

            </el-table-column>

        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title=dialogTitle  :visible.sync="FormVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="addForm" label-width="110px"  :rules="editFormRules" ref="addForm">


                <el-form-item label="标题：" prop="name">
                    <el-input v-model="addForm.name"  auto-complete="off"  placeholder="不超过20个汉字" style="width:500px;"></el-input>
                </el-form-item>




            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false; clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>

    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import moment from 'moment';
    export default {
        data() {
            var checktitle = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };
            var checknumbers = (rule, value, callback) => {

                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error("请输入数字值"));
                    }
                    else
                    {
                        console.log("fds");
                    }
                }, 1000);
            };

            return {
                options: [],
                value: '',
                filters: {
                    name: '',
                    status:'',
                },
                BatchViewDialogTitle:'',
                BatchViewDialogVisible:false,
                viewlikeFrom:{
                    type:'',
                    count:'',
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize:20,
                currentPage: 1,
                listLoading: false,
                createtimes:"",
                sels:[],//列表选中列
                FormVisible:false,

                //编辑界面数据
                editForm: {},
                //新增界面数据
                addForm: {

                },
                type:'',
                fileList:[],
                username:'',
                setVisible:false,
                // dialogTitle: "新增",
                dialogTitle: "添加",
                setForm:{},
                radio: '1',
                editOrAdd:false,
               editLoading: false,
                teacherFrom:[],
                teachername:'',
                teacherName:'',
                teacherid:'',
                teacherId:'',
                createTime: new Date(), //2018-08-14新增字段：添加页面，可以选择发布时间。默认是当前时间。
                ZsLoading:false,
                editFormRules: {
                    name: [
                        { required: true, message: "请输入课程名称", trigger: "blur" },
                        { validator: checktitle, message: "限8个汉字以内", trigger: "blur", num: 16 }
                    ],
                    teacher_name:[
                        { required: true, message: "请选择老师", trigger: "blur" },
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
            //获取列表
            async getList(){
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    name:this.filters.name,
                    status:this.filters.status,
                };
                let result =  await api.cctvCourseTypePage(para);
                this.datas=result.list;
                this.total=result.total;
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },

            fileSuccess(response, file, fileList){
                console.log(JSON.stringify(file));
                if(response.status=="0")
                {
                    this.$message.error("上传失败");
                }
                else
                {
                    if(response.message.indexOf(".pdf")>-1)
                    {
                        this.addForm.pdf="http://app2.zslxt.com/pdf/"+ response.message;
                        this.fileList_pdf=[{name:this.addForm.pdf,url:this.addForm.pdf}];
                    }
                    else
                    {
                        this.addForm.cover="http://app2.zslxt.com/image/"+response.message;
                        this.fileList=[{name:this.addForm.cover,url:this.addForm.cover}];
                    }
                }
            },
            fileError(err, file, fileList){
                console.log(JSON.stringify(err));
               this.$message.error("上传文件失败");
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`).then(async () => {
                    if(file.name.indexOf(".pdf")>-1)
                    {
                        this.addForm.pdf="";
                        this.fileList_pdf=[];
                    }
                    else
                    {
                        this.addForm.cover="";
                        this.fileList=[];
                    }
                });
            },


            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;

                    var result = await api.cctvRecordDel(row.cctvId);
                    this.listLoading = false;
                    if(result.status=="1")
                    {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    else
                    {
                        this.$message.error('删除失败');
                    }

                    this.getList();
                }).catch(() => {
                });
            },
            //下线
            async handleOff(index, row) {
                this.$confirm('确认更改课程状态吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var result= await api.cctvCourseTypeOffline(row.id);
                    // var result = await api.cctvRecordOffline(row.cctvId);
                    this.listLoading = false;
                    if(result.status=="1")
                    {
                        this.$message({
                            message: '下线成功',
                            type: 'success'
                        });
                    }
                    else
                    {
                        this.$message.error('删除失败');
                    }

                    this.getList();
                }).catch(() => {
                });
            },

            //上线
            async handleOn(index, row) {
                this.$confirm('确认更改课程状态吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var result= await api.cctvCourseTypeOnline(row.id);
                    // var result = await api.cctvRecordOffline(row.cctvId);
                    this.listLoading = false;
                    if(result.status=="1")
                    {
                        this.$message({
                            message: '上线成功',
                            type: 'success'
                        });
                    }
                    else
                    {
                        this.$message.error('删除失败');
                    }

                    this.getList();
                }).catch(() => {
                });
            },




            //显示编辑界面
            handleEdit (index, row,statusCode) {
                // console.log("row:::" + JSON.stringify(row));
                this.editOrAdd = false;
                this.FormVisible = true;
                this.addForm = Object.assign({}, row);//await api.findRiJianSo(row);
            },
            //显示新增界面
            handleAdd: function () {
                // this.dialogTitle = "新增";
                this.dialogTitle = "添加";
                this.editOrAdd = true;
                this.FormVisible = true;
                this.type='';
                this.addForm={
                    name:"",
                };
                this.clearEdit();
               //this.$refs.editForm.resetFields();
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {};
                this.addForm = Object.assign({}, tmpObj);
                this.fileList=[];
                this.fileList_pdf=[];
            },

            //提交
            async editSubmit() {

                this.$refs.addForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            var result="";
                            if(this.editOrAdd){
                                let para = Object.assign({}, this.addForm);
                                console.log(para);
                                result= await api.cctvCourseTypeAdd(para);
                            }else{
                                let para = Object.assign({}, this.addForm);
                                console.log(para);
                                // result= await api.cctvCourseTypeUpdate(para);
                            }
                            this.FormVisible = false;
                            if (result.status == "1") {
                                this.$message({ message: '提交成功', type: 'success' });
                                this.getList();
                            }
                            else
                            {
                                this.$message.error('提交失败');
                            }
                            this.editLoading = false;
                            this.clearEdit();
                        });
                    }
                });
            },
            viewEvent(a){
                this.viewlikeFrom.count=a;
            },
            batchLikeView(type,title){

                this.viewlikeFrom={};
                this.viewlikeFrom.type=type;
                this.BatchViewDialogTitle=title;
                if (this.sels.length < 1) {
                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });
                    this.BatchViewDialogVisible = false;
                }
                else
                {
                    this.BatchViewDialogVisible = true;
                }
            },
            async batchViewSubmit(){
                this.$refs.viewlikeFrom.validate(async (valid) => {
                    if (valid) {
                        this.setInfuse(this.viewlikeFrom.type);
                        var dataArray = [];

                        for (var i = 0; i < this.sels.length; i++){

                            var para = {
                                actual_course_id: this.sels[i].actual_course_id,
                                like: this.sels[i].like,
                                view: this.sels[i].view,
                                t:this.sels[i].t,
                                zs_count:this.sels[i].zs_count,
                                play_address:this.sels[i].play_address
                            }
                            dataArray.push(para);
                        }

                        var result = await api.updateShiZhiKe_LikeViewCount(dataArray);

                        if (result.status == "1") {
                            this.$message({
                                message: '注水成功',
                                type: 'success'
                            });
                        }
                        else {
                            this.$message.error('注水失败');
                        }
                        this.BatchViewDialogVisible=false;
                        this.getList();
                    }
                })
            },

            selsChange: function (sels) {
                this.sels = sels;
            },
            setInfuse(type) {
                if (type =="like") {
                    this.sels.forEach(a => {
                        if (
                            Number(this.viewlikeFrom.count) + Number(a.like) >
                            Number(a.view)
                        ) {
                            a.like = a.view;
                            this.$message({
                                message: "超过阅读量已调整为阅读量最低！",
                                type: "warning"
                            });
                        } else {
                            a.like = Number(this.viewlikeFrom.count) + Number(a.like);
                        }

                        a.t="like";
                        a.zs_count=this.viewlikeFrom.count;

                    });
                } else {
                    this.sels.forEach(a => {
                        //console.log(a.view);
                        a.view = Number(a.view) + Number(this.viewlikeFrom.count);

                        a.t="view";
                        a.zs_count=this.viewlikeFrom.count;
                    });
                }
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
                //console.log(JSON.stringify(this.teacherFrom));
            },
            changelaoshi:function(index){

                this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
                //console.log("index::::"+index +"teachername:::"+this.teachername+"name::::"+ this.teacherid);
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
            //时间格式化
            dateFormat:function(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD");
            },
        },
        mounted() {
            // this.selectTeacherList();
           this.getList();
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
        /*         margin-right: -14px;
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