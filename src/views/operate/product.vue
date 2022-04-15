<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                    <el-form-item style="float:right;">
                        <el-button type="primary"  @click="handleAdd" >添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" @sort-change="sortChang" style="width: 100%;">

            <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="menu_name" label="版块名称" min-width="150"></el-table-column>
            <el-table-column prop="product" label="所属产品" min-width="100"></el-table-column>
            <el-table-column prop="name" label="产品权限" min-width="60"></el-table-column>
            <el-table-column label="操作" min-width="100">
            <template scope="scope">
                <el-button size="small"   @click="handleEdit(scope.$index, scope.row)">编辑分组</el-button>
                   <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.del_flag==1">禁用</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
            </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total style="float:right;"></el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false" @close="handleClose">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="板块名称：" prop="menu_name" >
                    <el-select  v-model="editForm.menu_name" clearable placeholder="--请选择板块名称--" :disabled="isClose==='1'">
                        <el-option v-for="item in optionsTX" :key="item.menuId" :label="item.name" :value="item.menuId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组名称：" prop="id">
                    <el-select v-model="editForm.id" clearable placeholder="--请选择分组名称--">
                        <el-option v-for="items in optionsDJ" :key="items.id" :label="items.name" :value="items.id"></el-option>
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
                optionsDJ:[{name:'A',id:1},{name:'B',id:2},{name:'C',id:3},{name:'D',id:4},{name:'E',id:5},{name:'F',id:6},{name:'J',id:7}],
                optionsTX:[{name:'收盘点评',menuId:1},{name:'龙虎实战精选',menuId:2},{name:'专家服务',menuId:3}],
                username:'',
                value: '',
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                isClose:'0',
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
                pageSize:5,
                listLoading: false,
                chakanFormVisible:false,
                sels: [],//列表选中列

                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                ZsFormVisible:false,
                editLoading: true,
                ZsLoading:false,
                editFormRules: {
                    menu_name: [
                        { required: true, message: '请选择板块名称', trigger: 'change' }
                    ],
                     id: [
                        { required: true, message: '请选择对应分组', trigger: 'change' }
                    ]
                },
                //编辑界面数据
                editForm: {
                  del_flag:1,
                },
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        methods: {
            handleClose() {
                 this.$refs.editForm.clearValidate()
            },
            //获取列表
            async getList(){
                let result=await api.findProductPowersList(this.page,this.pageSize);///groups/getAllGroups 不需要参数
                this.datas=result.data.result;
                this.total = result.data.total
                
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
              
                if(row.del_flag==1){// 1是启用  0 是禁用 
                    api.findGroupsFlag(this.editForm.zhongId).then((data)=>{
                        if(data.data == 0){
                             this.$message({
                                message: '该分组正在被使用，不能被禁用',
                                type: 'success'
                                });
                        }else{
                            const confirmText = [this.editForm.menu_name +"("+this.editForm.name+")", '当前小组被禁用后，该产品下将不能发布任何信息，是否确认禁用?'] 
                            const newDatas = [] 
                            const h = this.$createElement 
                            for (const i in confirmText) { 
                                newDatas.push(h('p', null, confirmText[i])) }
                                 this.$confirm( '提示', 
                                 { title: '禁用提示',
                                  message: h('div', null, newDatas), 
                                 showCancelButton: true, 
                                 confirmButtonText: '确定', 
                                 cancelButtonText: '取消' } ).then(async () => {
                        this.editForm.del_flag=0;
                        let result=await api.deletGroups(this.editForm.zhongId,this.editForm.del_flag);
                        	  this.$message({
                                message: '已禁用',
                                type: 'success'
                                });
                        this.listLoading = false;
                        this.getList();
                    }).catch(() => {
                    })
                        }
                    })
            
                } if(row.del_flag==0){
                    this.$confirm('确认启用该产品吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.del_flag=1;
                        let result=await api.deletGroups(this.editForm.zhongId,this.editForm.del_flag);
                        this.listLoading = false;
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
                //alert(JSON.stringify(para))
                let results=await api.findIdByStar(para.name,para.menu_name,para.product).then((data) => {
                          this.starId =  data.data.id;
                    })
               // this.starId = 
            },
            //显示新增界面
            handleAdd: function () {
                this.msg ='';
                this.dialogTitle = "新增";
                this.isClose ='0'
                this.editOrAdd = true;
                this.dialogVisible = true;
                 this.editForm = {
                    del_flag: 1,
                };
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
          async  editSubmit() {
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        if(this.editOrAdd==true){
                            this.msg ='';
                            let para = Object.assign({}, this.editForm);
                            let results= api.findGroupsAndMenu(para.id,para.menu_name).then( async (data) => {
                                if(data.data !=null){
                                    this.msg = '该分组已存在';
                                     this.$message({
                                            message: '该分组已存在，请勿重复添加',
                                            type: 'success'
                                        });
                                }else{
                                      this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                                        this.editLoading = true;
                                            let name = JSON.parse(sessionStorage.getItem('user')).name
                                            let result=await api.addGroupsAndMenu(para.id,para.menu_name,name);
                                        this.editLoading = false;
                                        this.$message({
                                            message: '添加成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.dialogVisible = false;
                                        this.getList();
                                    });

                                }
                            });
                        }else{
                            //编辑的时候先通过 四星 ，龙虎榜 A 去查start表 将唯一id拿到
                            //{"id":3,"name":"C","menu_id":85,"menu_name":"龙虎实战精选","product":"四星","zhongId":14}
                             this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                                        this.editLoading = true;
                                       let para = Object.assign({}, this.editForm);
                                           //{"id":3,"name":"C","menu_id":85,"menu_name":"龙虎实战精选","product":"四星","zhongId":14}
                                            let result=await api.updateGroupsAndMenu(this.starId,para.id,para.zhongId,para.menu_name);///groups/updateGroupsAndMenu
                                        this.editLoading = false;
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.dialogVisible = false;
                                        this.getList();
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
</style>
<style>
.el-message-box__message p:first-child{
    text-align: center;
}
</style>