<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增成功案例</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   style="width: 100%;">
            <el-table-column prop="stock_name" label="股票名称/代码" :formatter="formattgeGuDaiMa" min-width="60"></el-table-column>
            <el-table-column prop="foat" label="涨幅" :formatter="formatfoat" min-width="50"></el-table-column>
            <el-table-column prop="count" label="跟踪次数" min-width="40"></el-table-column>
            <el-table-column prop="update_time" label="更新时间" :formatter="formatfoatUpdatetime" min-width="60"></el-table-column>
            <el-table-column prop="priority" label="排序" min-width="50"></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"   @click="handleDel(scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>


        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  　:visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules"  ref="editForm">
                <el-form-item label="股票名称" prop="stock_name">
                    <el-select v-model="editForm.stock_name" filterable remote clearable placeholder="选择股票名称" v-on:clear="edit_select_clear" :remote-method="select_remoteMethod" :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:200px;">
                        <el-option v-for="item in select_options" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                    <el-input v-model="editForm.stock_code" auto-complete="off" style="width:132px;margin-left:10px;" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="涨幅：" prop="foat">
                    <el-input v-model="editForm.foat" auto-complete="off"></el-input>%
                </el-form-item>
                <el-form-item label="跟踪次数："  prop="count">
                    <el-input id="chishu" v-model="editForm.count" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="priority">
                    <el-input v-model="editForm.priority" auto-complete="off"></el-input>
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
    import api from '../../api/api.js';
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    export default {
        data() {
            return {
                dialogTitle: "新增成功案例",
                editOrAdd:false,
                datas: [],
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                //编辑界面数据
                editForm: { },
                select_loading: false,
                select_options: [],
                editFormRules: {
                    priority: [
                        { required: true, message: "请输入排序字段", trigger: "blur" },
                        {
                            pattern: /^\+?[1-9][0-9]*$/,
                            message: '请输入正整数'
                        }],
                    stock_name:[{required: true, message: "请选择股票名称", trigger: "blur" } ],
                    foat:[{required:true,message:"请输入涨幅",trigger:"blur"}],
                    count:[{required:true,message:"请从股票池中选择股票",trigger:"blur"}]
               }
            }
        },
        methods: {
            //获取列表
            async getList(){
                let para = {};
                let result=await api.getChengGongAnli(para);
                this.datas=result;
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "编辑成功案例";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.$refs["editForm"].resetFields();//去除验证
            },
            //显示新增界面
            handleAdd: function () {
                if(this.datas.length>=5){
                    this.$message({
                        message: "最多只能添加5个案例",
                        type: "warning"
                    });
                    return;
                }
                this.dialogTitle = "新增成功案例";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.clearEdit()
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {};
                this.editForm = Object.assign({}, tmpObj);
                this.$refs["editForm"].resetFields();  //去除验证
                this.editForm.priority=1;
            },
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                    let para = Object.assign({}, this.editForm);
                    if(this.editOrAdd ==false){
                        let result=await api.updateChengGongAnli(para);
                    }if(this.editOrAdd==true){
                        let result=await api.addChengGongAnli(para);
                    }
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.$refs['editForm'].resetFields();////去除验证
                    this.dialogVisible = false;
                    this.getList();
                });
                }
              });
            },    //删除
            handleDel: function(row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                this.listLoading = true;
                let result = await api.deleteChengGongAnli(row.success_case_id);
                if (result == 1) {
                    this.listLoading = false;
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.getList();
                } else {
                    this.listLoading = false;
                    this.$message({
                        message: "删除失败",
                        type: "error"
                    });
                }
            })
            .catch(() => {

            });
            },
            select_remoteMethod(query) {
                    if (query !== "") {
                        this.select_loading = true;
                        setTimeout(async () => {
                            this.select_loading = false;
                        this.select_options = await kbspiritDataStore.query(query);
                        this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                    }, 200);
                } else {
                    this.select_options = [];
                }
            },
           async selectchange(){
                var r= this.editForm.stock_name;
                for( var i in this.select_options )
                {
                    if(this.select_options[i].label==r)
                    {
                        this.editForm.stock_name=this.select_options[i].label;
                        this.editForm.stock_code=this.select_options[i].value;
                        var  genzongxiaoxi=await api.getgenzongCount(this.editForm.stock_code);
                        if (genzongxiaoxi.count)
                        { //document.getElementById("chishu").value=genzongxiaoxi.count?genzongxiaoxi.count:0;
                          document.getElementById("chishu").value=genzongxiaoxi.count?genzongxiaoxi.count:'';
                          this.editForm.count=genzongxiaoxi.count;
                        }
                    }
                }
                this.$emit('stock-say',this.stockObj)
            },
           edit_select_clear() {
                this.editForm.stock_code = "";
            },
            //股票名称和代码合并
            formattgeGuDaiMa: function(row) {
                return row.stock_name + " " + row.stock_code;
            },
            formatfoat:function(row){
                return row.foat+"%";
            },
            formatfoatUpdatetime:function(row){
                var timestamp = new Date(row.update_time);//直接用 new Date(时间戳) 格式转化获得当前时间
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            }
        },
        mounted() {
            this.getList()
        }
    }
</script>
<style>
    .el-dialog{
        width: 30%;
    }
    .el-input{
        width: 80%;
    }
</style>