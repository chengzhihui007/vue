<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

            <el-form :inline="true">
            <el-form-item > 
              <el-button type="primary" @click="$router.back()">&lt;返回</el-button>
              </el-form-item > 
                  <el-form-item > 
                    <el-input v-model="filters.name" placeholder="请输入标签关键字"></el-input>
                    </el-form-item>
                     <el-form-item > 
                    <el-button type="primary" @click="getList()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button   type="primary"  @click="handleAdd">添加</el-button>
                    </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="id" label="序号"  width="200" >
                            <template scope="scope">
                       {{datas.length - scope.$index}} 
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加日期" width="300" >
            </el-table-column>
            <el-table-column prop="name" label="标签" width="300" >
            </el-table-column>
            <el-table-column label="操作" min-width="200">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="page" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="editForm.name" placeholder="标签最多可填写6个汉字"></el-input>
                    <span>限6个汉字</span>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('editForm')">取消</el-button>
                    <el-button type="primary" @click="editSubmit('editForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
 
</template>
  
<script>
    import {listPracticalLiveLabel,isExistPracticalLiveLabel,insertPracticalLiveLabel,updatePracticalLiveLabel,deletePracticalLiveLabel} from "../../api/cyApi.js";
    export default {
        data() {
            return {ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
                filters: {
                    name: ''
                },
                datas: [],
                total: 0,
                page: 1,
                dialogTitle: "添加",
                editOrAdd:false,
                total: 0,
                page: 1,
                team_id:"",
                pageSize: 10,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    id: '',
                    name: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入标签名称', trigger: 'blur'},
                        {max: 6, message: '长度在6个字符', trigger: 'blur'},
                        {validator:(rule, value, callback)=>{
                            let params={
                                name:value
                            }
                            isExistPracticalLiveLabel(params).then(res=>{
                                let resp= res.data;
                                    if(!resp||!resp.state){
                                     callback(new Error("验证失败: "+(resp?resp.data:'')))
                                   }else if(resp.state){
                                         if(resp.data){
                                             callback(new Error("标签已存在"))
                                         }
                                   }
                                   callback()
                            })
                        },trigger: 'blur'}
                    ]
                },
            }
        },
        methods: { 
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            resetForm(formName){
            this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            //获取列表数据 
            getList() {
                this.listLoading = true;
                let params={
                    name:this.filters.name,
                    page:this.page,
                    size:this.pageSize
                } 
                listPracticalLiveLabel(params).then(res => {
                    let resp=res.data;
                    if(!resp){
                        return;
                    }
                    let data=resp.data;
                    this.datas=data.result
                    this.total = data.total;
                    this.listLoading = false;
                });
            },
            handleDel: function (index, row) {
                this.editForm = Object.assign({}, row);
                
                    this.$confirm('若删除该标签则不可恢复，确定要要删除该标签吗？', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let params={
                            id: this.editForm.id
                            }
                        deletePracticalLiveLabel(params).then(res => {
                              let resp= res.data;
                                     if(!resp||!resp.state){
                                    this.$message({
                                            message: '删除失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        this.page=1;
                                        this.getList()
                                   }
                        });
                    }).catch(() => {
                    });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "标签修改";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.editOrAdd = true;
                this.dialogTitle = "标签添加";
                this.dialogVisible = true;
                this.editForm = {
                    name: ''
                };
            },
            //编辑
            editSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            if(this.editOrAdd ==false){
                                let params={
                                    id:this.editForm.id,
                                    name:this.editForm.name
                                }
                                  updatePracticalLiveLabel(params).then(res=>{
                                    this.dialogVisible = false;
                                   let resp= res.data;
                                   if(!resp||!resp.state){
                                    this.$message({
                                            message: '修改失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.getList()
                                   }
                                }) 
                            }if(this.editOrAdd==true){
                                let params={
                                    name: this.editForm.name
                                }
                                insertPracticalLiveLabel(params).then(res=>{
                                    this.dialogVisible = false;
                                   let resp= res.data;
                                     if(!resp||!resp.state){
                                    this.$message({
                                            message: '添加失败: '+(resp?resp.data:''),
                                            type: 'error'
                                        });
                                   }else if(resp.state){
                                         this.$message({
                                            message: '添加成功',
                                            type: 'success'
                                        });
                                        this.page=1;
                                        this.getList()
                                   }
                                }) 
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
            this.getList();
        }
    }

</script>

<style scoped>

</style>