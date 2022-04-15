<template>
    <section>
        <!--工具条-->
         <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" >
                <div>
                    <el-form-item >
                     <el-input v-model="queryform" placeholder="请输入标题关键字"></el-input>
                    </el-form-item>
                     <el-form-item >
                        <el-button type="primary"  @click="handleSelect" >查询</el-button>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary"  @click="handleAdd" >添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table
            :row-class-name="tableRowClassName"
            ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" @sort-change="sortChang" style="width: 100%;">

             <el-table-column prop="" label="序号" min-width="60" align="center">
                <template scope="num">
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="套系标题"  min-width="100" align="center"></el-table-column>
            <el-table-column prop="introduce"  label="套系介绍"  min-width="100" align="center"></el-table-column>



            <el-table-column prop="jurisdictionValue" label="权限" min-width="100" align="center">
                <template scope="scope">
                    <p>  {{scope.row.jurisdictionValue== 0?'免费':scope.row.jurisdictionValue==-2?'多头启动用户及以上':scope.row.jurisdictionValue==3?'多空决策及以上':scope.row.jurisdictionValue==4?'风口决策及以上':scope.row.jurisdictionValue==5?'主力决策':''}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="account" label="操作账号" min-width="100" align="center"></el-table-column>
            <el-table-column label="操作" min-width="100" align="center">
            <template scope="scope">
                <el-button size="small"   @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.delete==0">修改</el-button>
                <el-button size="small"   @click="handleEdit(scope.$index, scope.row)" v-else disabled>修改</el-button>
                <!-- <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.delete==0">禁用</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
            </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false" @close="handleClose">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="套系名称：" prop="title" >
                    <el-input v-model="editForm.title"  auto-complete="off"  placeholder="套系名称不超过10个汉字" style="width:500px;"></el-input>
                </el-form-item>
                  <el-form-item label="套系介绍：" prop="introduce" >
                    <el-input v-model="editForm.introduce"  auto-complete="off"  placeholder="套系介绍不超过200个汉字" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="套系权限：" prop="jurisdictionValue" >
                    <el-select v-model="editForm.jurisdictionValue" @change="selectjurisdiction" clearable placeholder="请选择">
                        <el-option v-for="items in optionsDJ" :key="items.id" :label="items.jurisdiction" :value="items.jurisdictionValue"></el-option>
                    </el-select>
                </el-form-item>
              <span style="color: red;">{{ msg }}</span>
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
                msg:'',
                // optionsDJ:[{jurisdiction:'免费',id:1},{jurisdiction:'热点决策及以上',id:2},{jurisdiction:'价值决策及以上',id:3},{jurisdiction:'主力决策',id:4}],
                optionsDJ:[
                    {jurisdictionValue: 0, jurisdiction:'免费', id: 0},
                    {jurisdictionValue: -2, jurisdiction:'多头启动用户及以上',id: -2},
                    {jurisdictionValue: 3, jurisdiction:'多空决策及以上',id:3},
                    {jurisdictionValue: 4, jurisdiction:'风口决策及以上',id:4},
                    {jurisdictionValue: 5, jurisdiction:'主力决策',id:5}],
                value: '',
                setVisible:false,
                dialogTitle: "新增",
                isClose:'0',
                editOrAdd:false,
                queryKeywords:'',
                queryform:'',
                datas: [],
                total: 0,
                page: 1,
                pageSize:15,
                listLoading: false,
                chakanFormVisible:false,
                sels: [],//列表选中列
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                ZsFormVisible:false,
                editLoading: true,
                ZsLoading:false,
                editFormRules: {
                    title: [
                        { required: true, message: "请填写套系名称", trigger: "blur" },
                        { min: 1, max: 10, message: "名称字数不能超过10个汉字", trigger: "blur" }
                    ],
                    introduce:[
                        { required: true, message: "请填套系介绍", trigger: "blur" },
                        { min: 1, max: 200, message: "套系介绍不超过200个汉字", trigger: "blur" }
                    ],
                     jurisdictionValue: [
                        { required: true, message: '请选择套系可查看权限', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                oldJurisdiction: '',
                editForm: {
                    title:"",
                    introduce:"",
                    delete:1,
                    jurisdiction:'免费',
                    jurisdictionValue: 0
                },
                defaultModules: {
                    toolbar: ['image']
                },
                currentSetName: ''
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                return row.delete == 1 ? 'disable' : 'enable';
            },
            handleClose() {
                 this.$refs.editForm.clearValidate()
            },
            //获取列表
            async getList(){
                let result=await api.findShiZhanManageList(this.page,this.pageSize,this.queryKeywords);
                this.datas=result.data.result;
                this.total = result.data.total
            },
               async getListFind(){
                this.page = 1;
                let result=await api.findShiZhanManageList(this.page,this.pageSize,this.queryKeywords);
                this.datas=result.data.result;
                this.total = result.data.total
            },
            handleSelect(){
                this.queryKeywords = this.queryform;
                this.getListFind();
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
                this.getPanListShow(this.page,this.pageSize,"ID desc")
            },
              //控制停用启用
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);
                if(row.delete==0){
                  this.$confirm('若禁用该内容，则该套系不可添加课程，但不影响已添加内容展示，确定要禁用该分类吗？', '提示', {
                        type: 'warning'
                    }).then(async () =>  {
                                 this.editForm.delete=1;
                            let jinyong = 1;
						  let result=await api.deleteShiZhanManage(this.editForm.id,jinyong);//禁用
						  this.$message({
                                message: '已禁用',
                                type: 'success'
                                });
                        //this.listLoading = false;
                        this.getList()
                    }).catch(() => {

                    });
                }else if(row.delete==1){
                    this.$confirm('若启用该内容，则该套系可继续添加该分类课程，是否确认启用？', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.delete=0;
                         let jinyong = 0;
						let result=await api.deleteShiZhanManage(this.editForm.id,jinyong);
                        //this.listLoading = false;
						this.getList();
						 this.$message({
                            message: '已启用',
                            type: 'success'
                            });
                    }).catch(() => {

                    });
                }
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.msg ='';
                this.editOrAdd = false;
                this.isClose ='1'
                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                let para = Object.assign({}, this.editForm);
                this.oldJurisdiction = this.editForm.jurisdiction;
                this.currentSetName = this.editForm.title;
            },
            //显示新增界面
            handleAdd: function () {
                this.msg ='';
                this.dialogTitle = "新增";
                this.isClose ='0'
                this.editOrAdd = true;
                this.dialogVisible = true;
                 this.editForm = {
                    delete: 1,
                };
                this.clearEdit()
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                     title:"",
                      introduce:"",
                     delete: 1,
                     jurisdiction:'免费'
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
            selectjurisdiction(id) {
                let item = this.optionsDJ.find(item => {
                    return item.id === id;
                });

                this.editForm.jurisdiction = item.jurisdiction;
            },
          async  editSubmit() {
                    debugger
                    if(this.editForm.title.match(/^[ ]*$/)){
                    this.$message({
                        message:"套系名称不能输入空格!",
                        type: "error"
                    });
                    return false;
                }
                 if(this.editForm.introduce.match(/^[ ]*$/)){
                    this.$message({
                        message:"套系介绍不能输入空格!",
                        type: "error"
                    });
                    return false;
                }
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        if(this.editOrAdd==true){
                            this.msg ='';
                            let para = Object.assign({}, this.editForm);
                            let results= api.findShiZhanByTitle(para).then( async (data) => {
                                 if(data.data !=null){
                                    this.msg = '该名称已存在';
                                     this.$message({
                                            message: '该名称已存在，请勿重复添加',
                                            type: 'error'
                                        });
                                }else{
                                para.account = JSON.parse(sessionStorage.getItem('user')).name
                                      this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                                        this.editLoading = true;
                                       let result=await api.addShiZhanManage(para);///groups/addGroupsAndMenu
                                        if(result.data){
                                            this.$message({
                                            message: '添加成功',
                                            type: 'success'
                                        });
                                        }else{
                                             this.$message({
                                            message: '添加失败',
                                            type: 'success'
                                             });
                                        }

                                        this.$refs['editForm'].resetFields();
                                        this.dialogVisible = false;
                                        this.getList();
                                    });

                                }
                            });
                        }else{

                            let jur = this.editForm.jurisdiction;

                            this.msg ='';
                            let para = Object.assign({}, this.editForm);
                            let results= api.findShiZhanByTitle(para).then( async (data) => {
                                if(data.data !=null && data.data.title != this.currentSetName){
                                    this.msg = '该名称已存在';
                                    this.$message({
                                        message: '该名称已存在，请勿重复添加',
                                        type: 'error'
                                    });
                                }else{
                                    api.sexistShiZhanManage(para.id).then(async (data) => {
                                        if (this.oldJurisdiction != para.jurisdiction && !data.state) {
                                            this.$message({
                                                message: '请先移除该套系下已同步策略板块课程',
                                                type: 'error'
                                            });
                                        } else {
                                            this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                                                this.editLoading = true;
                                                let para = Object.assign({}, this.editForm);
                                                let result=await api.eidtShiZhanManage(para);///groups/updateGroupsAndMenu
                                                this.editLoading = false;
                                                if(result.data){
                                                    this.$message({
                                                        message: '修改成功',
                                                        type: 'success'
                                                    });
                                                }else{
                                                    this.$message({
                                                        message: '修改失败',
                                                        type: 'success'
                                                    });
                                                }
                                                this.$refs['editForm'].resetFields();
                                                this.dialogVisible = false;
                                                this.getList();
                                            });
                                        }
                                    });

                                }
                            });
                        }
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
    .el-table__row.disable {
        color: #b7b2b2;
    }
</style>
<style>
.el-message-box__message p:first-child{
    text-align: center;
}
</style>
