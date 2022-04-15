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
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" @sort-change="sortChang" style="width: 100%;">

            <el-table-column prop="clone_person_id" label="序号" min-width="60" >
            </el-table-column>
            <el-table-column prop="name" label="昵称" min-width="150"></el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="100"></el-table-column>
            <el-table-column prop="head" label="头像" min-width="60"></el-table-column>
            <el-table-column prop="level" label="等级" min-width="60"></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small"  v-if=" username!=='quanzi1'" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"  v-if=" username!=='quanzi1'" @click="handleDel(scope.$index, scope.row)">禁用</el-button>
            </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">

                <el-form-item label="用户名：" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="选择头像：" prop="head">
                    <el-select  v-model="editForm.head==1?'头像1':'头像2'" clearable placeholder="--请选择头像--" >
                        <el-option v-for="item in optionsTX" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户等级：" prop="level">
                    <el-select  v-model="editForm.level==1?'普通':'VIP'" clearable placeholder="--请选择用户等级--">
                        <el-option v-for="item in optionsDJ" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
                optionsDJ:[{label:'普通',value:0},{label:'VIP',value:1}],
                optionsTX:[{label:'头像1',value:1},{label:'头像2',value:2}],
                username:'',
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
                pageSize:15,
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                sels: [],//列表选中列

                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                ZsFormVisible:false,
                editLoading: true,
                ZsLoading:false,
                editFormRules: {
                    laoShi: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ]
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
                    pageSize: 20,
                    neirong:this.filters.content,
                    biaoqian:this.filters.name,
                    laoshi:this.filters.teacher,
                    shijian:this.filters.datetime
                };
                var admin = sessionStorage.getItem("user");
                var a = JSON.parse(admin);
                this.username=a.user_name;
                alert(1111)
                let result=await api.getZhushuiyonghu(para);
                this.datas=result;
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getPanListShow(this.page,this.pageSize,"ID desc")
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.clearEdit()
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            sortChang(a,b){
                if(a.order == "descending"){
                    this.getPanListShow(this.page,this.pageSize,a.prop + ' desc')
                }else{
                    this.getPanListShow(this.page,this.pageSize,a.prop)
                }
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                    console.log(this.editForm);

                    this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                        this.editLoading = true;
                    let para = Object.assign({}, this.editForm);
                    if(this.editOrAdd ==false){
                        let result=await api.updateZhushuiyonghu(para);
                    }if(this.editOrAdd==true){
                        let result=await api.addZhushuiyonghu(para);
                    }
                    this.editLoading = false;
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.$refs['editForm'].resetFields();
                    this.dialogVisible = false;
                    this.getList();
                });
            }
        });
    }

        },
        mounted() {
            this.getList()
        }
    }
</script>

<style>
    .el-dialog.el-dialog--small{
        overflow-x: hidden;
    }
    .el-dialog__body{
        max-height: 600px;
        overflow-y: auto;
        margin-right: -14px;
        padding-right: 34px;
    }
    .ql-container.ql-snow{
        max-height: 200px;
        overflow-y: auto;
    }
    .el-pagination{
        text-align: center;
    }
</style>