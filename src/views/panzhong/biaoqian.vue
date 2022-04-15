<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
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
                </template>
            </el-table-column>
        </el-table>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules" >
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item  label="类型：" prop="radio" >
                    <el-radio-group v-model="editForm.radio">
                        <el-radio :label="3" >付费</el-radio>
                        <el-radio :label="6" >免费</el-radio>
                        <el-radio :label="9" >部分付费部分免费</el-radio>
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
    import api from '../../api/api.js';
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
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    radio: [
                        {required: true, message: '请选择付费情况', trigger: 'change'}
                    ],
                },
            }
        },
        methods: {
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
                    pageNo: this.page,
                    pageSize: 20
                };
                this.listLoading = true;
                let list=await api.getBiaoqianInfo(para);
                console.log("list:::"+JSON.stringify(list));

                for(var i=0;i<list.length;i++){
                    list[i].num=i+1;
                    if(list[i].is_pay==1){
                        list[i].pay="付费"
                        list[i].radio=3
                    }else if(list[i].is_pay==0){
                        list[i].pay="免费"
                        list[i].radio=6
                    }else{
                        list[i].pay="部分付费部分免费"
                        list[i].radio=9
                    }
                 if(list[i].del_flag==0){
                       list[i].state="停用"
                 }else{
                     list[i].state="启用"
                 }
                }
                this.datas=list;
                this.listLoading = false;

            },
            //控制停用启用
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);
                if(row.del_flag==1){
                    this.$confirm('确认停用该标签吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.del_flag=0;
                        let result=await api.deletbiaoqian(this.editForm);
                        this.listLoading = true;
                        this.getList();
                    }).catch(() => {

                    });
                } if(row.del_flag==0){
                    this.$confirm('确认启用该标签吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.del_flag=1;
                        let result=await api.deletbiaoqian(this.editForm);
                        this.listLoading = true;
                        this.getList();
                    }).catch(() => {

                    });
                }

            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
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
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if(this.editForm.radio==3){
                            this.editForm.is_pay=1
                        }if(this.editForm.radio==6){
                            this.editForm.is_pay=0
                        }if(this.editForm.radio==9){
                            this.editForm.is_pay=2
                        }

                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            if(this.editOrAdd ==false){
                                let result=await api.editbiaoqian(para);
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                            }if(this.editOrAdd==true){
                                let paralist = {
                                    pageNo: this.page,
                                    pageSize: 20
                                };
                                this.listLoading = true;
                                let list=await api.getBiaoqianInfo(paralist);
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
                                    let result=await api.addbiaoqian(para);
                                    this.editLoading = false;
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                }

                            }
                            this.$refs['editForm'].resetFields();
                            this.dialogVisible = false;
                            this.getList();
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
        },
        mounted() {
            this.getList();
        }
    }

</script>

<style scoped>

</style>