<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="num" label="序号" width="120" >
            </el-table-column>
            <el-table-column prop="name" label="标签名称" width="130" >
            </el-table-column>
            <el-table-column prop="pay" label="是否付费" width="180" >
            </el-table-column>
            <el-table-column prop="state" label="状态" width="120" >
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.del_flag==1">停用</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
                    <el-button type="info" disabled size="small"  v-if="scope.row.is_top==1">置顶</el-button>
                    <el-button type="danger" size="small"  @click="puttop(scope.$index, scope.row)" v-else="">置顶</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>30" @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules" >
                <el-form-item label="标签名称">
                    <el-input v-model="editForm.name" :onkeyup="checkContent(editForm.name)" auto-complete="off" size="2"></el-input>
                    <span>限6个汉字</span>
                </el-form-item>

                <el-form-item  label="类型：" prop="radio" >
                    <el-radio-group v-model="editForm.radio">
                        <el-radio :label="3" >付费</el-radio>
                        <el-radio :label="6" >免费</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="resetForm('editForm')">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>



    </section>
</template>

<script>
    import {viewlableList,viewlablesave,viewlableupdate,viewlabledelect,viewlabletop} from "../../../api/ydApi.js";
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                datas: [],
                total: 0,
                page: 1,
                dialogTitle: "添加",
                editOrAdd:false,
                currentPage: 1,
                total: 0,
                page: 1,
                team_id:"",
                pageSize: 30,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    name: '',
                    is_pay: '',
                    del_flag:1,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入标签名称', trigger: 'blur'},
                        {max: 6, message: '长度在6个字符', trigger: 'blur'}
                    ],
                    radio: [
                        {required: true, message: '请选择付费情况', trigger: 'change'}
                    ],
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
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            resetForm(formName){
            this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            //获取列表数据
            async getList() {
                let para = {
                    team_id:this.team_id,
                    pageNo: this.page,
                    pageSize: 30
                };
                this.listLoading = true;
                viewlableList(para).then(res => {
                    let list=res.data.list;
                    for(var i=0;i<list.length;i++){
                        list[i].num=i+1;
                        if(list[i].is_pay==1){
                            list[i].pay="付费"
                            list[i].radio=3
                        }else{
                            list[i].pay="免费"
                            list[i].radio=6
                        }
                        if(list[i].del_flag==0){
                            list[i].state="停用"
                        }else{
                            list[i].state="启用"
                        }
                    }
                    this.total = res.data.total;
                    this.datas=list;
                    this.listLoading = false;
                });
            },
            //控制停用启用
            handleDel: function (index, row) {

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.editForm = Object.assign({}, row);
                if(row.del_flag==1){
                    this.$confirm('确认停用该标签吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.del_flag=0;
                        var para=this.editForm;
                        viewlabledelect(para).then(res => {
                            this.listLoading = true;
                            this.getList();
                        });
                    }).catch(() => {
                    });
                } if(row.del_flag==0){
                    this.$confirm('确认启用该标签吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        this.editForm.del_flag=1;
                        var para=this.editForm;
                        viewlabledelect(para).then(res => {
                            this.listLoading = true;
                            this.getList();
                        });
                    }).catch(() => {

                    });
                }

            },
            //置顶
            puttop: function (index, row){

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.$confirm('确认置顶该标签吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.editForm = Object.assign({}, row);
                    this.editForm.is_top=1;
                    this.editForm.create_time=String(new Date().getTime());
                    var para=this.editForm;
                    viewlabletop(para).then(res => {
                        this.listLoading = true;
                        this.getList();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {

                if(this.team_id == "0"){
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;

                }

                this.editOrAdd = false;
                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
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

                this.editOrAdd = true;
                this.dialogTitle = "添加";
                this.dialogVisible = true;
                this.editForm = {
                    name: '',
                    del_flag: 1,
                    is_pay: 0,
                };
            },
            //编辑
            editSubmit: function () {
                let  len  =    this.getStrLenght(this.editForm.name);
                if(len > 6 ){
                    this.$message({
                        message: "（限6个汉字）！",
                        type: "error"
                    });
                    return  false;
                }
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if(this.editForm.radio==3){
                            this.editForm.is_pay=1
                        }if(this.editForm.radio==6){
                            this.editForm.is_pay=0
                        }
                        let paras = {
                            pageNo: this.page,
                            pageSize: 200
                        };
                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            this.editLoading = true;
                               console.log(this.editForm)
                            let para = Object.assign({}, this.editForm);
                            if(this.editOrAdd ==false){
                                para.create_time=String(new Date().getTime());
                                viewlableupdate(para).then(res => {
                                    this.dialogVisible = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.editLoading = false;
                                    this.$refs['editForm'].resetFields();
                                    this.dialogVisible = false;
                                    var para1 = {
                                        team_id:this.team_id,
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.getList(para1);
                                });
                            }if(this.editOrAdd==true){
                                para.label_id=new Date().getTime().toString();
                                para.create_time=String(new Date().getTime());
                                para.del_flag=1;
                                //这里增加team_id的参数
                                para.team_id=this.team_id;
                                this.listLoading = true;
                                viewlableList(paras).then(res => {
                                    let list=res.data.list;
                                    console.log(list)
                                    var all='';
                                    for(var i=0;i<list.length;i++){
                                        all+=list[i].name;
                                    }
                                    if(all.indexOf(para.name)!=-1){
                                        this.editLoading = false;
                                        this.$message({
                                            message: '提交失败，该标签已存在',
                                            type: 'success'
                                        });
                                    }else{
                                        viewlablesave(para).then(res => {
                                            this.dialogVisible = false;
                                            this.$message({
                                                message: '提交成功',
                                                type: 'success'
                                            });
                                            this.editLoading = false;
                                            this.$refs['editForm'].resetFields();
                                            this.dialogVisible = false;
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
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
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
        }
    }

</script>

<style scoped>

</style>