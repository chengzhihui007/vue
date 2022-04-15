<template>
        <section>
 <!--工具条-->
 <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
                <el-form-item>
                        <el-date-picker
                                v-model="filters.datetime"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
            <el-form-item>
                <el-input v-model="filters.keyword" placeholder="请输入标题关键字"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click.native="findAll(1)">查询</el-button>
            </el-form-item>

            <div>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" >新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"    @click.native="batchLikeView('view','批量浏览')">批量浏览</el-button>
                </el-form-item>
            </div>
        </el-form>
    </el-col>
    
   
   
            <el-table :data="tableData" @selection-change="selsChange" highlight-current-row v-loading="listLoading" style="width: 100%;">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="title" label="名称" width="180">
              </el-table-column>
              <el-table-column prop="viewStr" label="浏览实数 | 总数" width="120">
              </el-table-column>
              <el-table-column prop="statusDesc" label="状态">
              </el-table-column>
                <el-table-column prop="createtime" label="添加时间">
              </el-table-column>
              <el-table-column prop="todate" label="发布时间">
              </el-table-column>
        <el-table-column label="操作" min-width="150">
            <template scope="scope">
            <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
         </template>
</el-table-column>
</el-table>
<!--注水-->
<el-dialog :title="BatchViewDialogTitle" :visible.sync="BatchViewDialogVisible">
    <el-form :model="viewlikeFrom" ref="viewlikeFrom" status-icon :rules="rule2" label-width="80px" class="demo-ruleForm">
        <el-form-item label="注水数" prop="count">
            <el-input type="number" v-model="viewlikeFrom.count" placeholder="请输入添加数量" auto-complete="off" v-on:input="viewEvent(viewlikeFrom.count)" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
            <p>您确定为这些标题手动增加
                <font size="5" color="red">{{viewlikeFrom.count}}</font> 个浏览吗？</p>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" center="true">
            <el-button @click="BatchViewDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="batchViewSubmit()">确 定</el-button>
        </span>
</el-dialog>

<!--编辑界面-->
<el-dialog v-if="editFormVisible" :title=dialogTitle :visible.sync="editFormVisible" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
    <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）"></el-input>
        </el-form-item>
        <span style="display: block;width: 100%;border-top: 1px dashed  #666;padding-bottom: 20px;margin-top:20px;"></span>
        <template v-for='(data,index)  in editForm.banKuai'  >
            <Smallspot  :key=data :editForm=data :index=index :ref=spotRef @remove="remSpot"></Smallspot>
        </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit(0)" :loading="editLoading">发 布</el-button>
        <el-button type="primary" @click.native="editSubmit(2)" v-if="editOrAdd==true||status=='保存未发布'" :loading="editLoading">保 存</el-button>
    </div>
</el-dialog>

<el-pagination background layout="prev, pager, next" :page-size="20" @current-change="handleCurrentChange" :total="count">
</el-pagination>

</section>
</template>

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    
    .el-aside {
        color: #333;
    }
</style>

<script>
    import api from '../../api/api.js'
    import util from '../../common/js/util'
    import UeEdit from './edit.vue';
    import Smallspot from "./Smallspot.vue";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {
            ElFormItem,
            Smallspot,
            UeEdit
        },
        data() {
            var validCount = (rule, value, callback) => {
                if (value == 0 || !value) {
                    callback(new Error('不能为空或0'));
                } else if (value < 0) {
                    callback(new Error('不能输入负数'));
                } else {
                    callback();
                }
            };

            var validUE = (rule, value, callback) => {
                if (!value) {
                    console.log(value)
                    callback(new Error('不可为空'));
                } else if (value.indexOf("h1") != -1 && value.indexOf("h2") != -1 && value.indexOf("h3") != -1) {
                    callback(new Error('文本域内必须有1级2级3级标题'));
                } else {
                    callback();
                }
            };
            var validText = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('不可为空'));
                } else {
                    callback();
                }
            };
            return {
                tableData: [],
                editLoading: false,
                dialogTitle: '添加',
                editOrAdd: "",
                count: 10,
                listLoading: false,
                sels: [],
                currentPage: 1,
                spotRef: 'spotModular',
                zhushuiid: '',
                status: '',
                categoryId: 16903,
                showUeEdit: false,
                zhushuiObj: {
                    Infuse: null
                },
                filters: {
                    code: '',
                    name: '',
                    keyword: '',
                    datetime: ""
                },
                viewlikeFrom: {
                    type: '1',
                    count: '',
                },
                BatchViewDialogTitle: '',
                BatchViewDialogVisible: false,
                editFormVisible: false, //编辑界面是否显示
                props: {
                    editForm: {
                        type: Object
                    },
                },
                editFormRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 20,
                        message: '限20个字以内',
                        trigger: 'blur'
                    }]
                },
                rule2: {
                    count: [{
                        validator: validCount,
                        trigger: 'blur'
                    }]
                },

                //编辑界面数据
                editForm: {
                    id: '',
                    title: '',
                    banKuai: [{
                        ruxuanjianjie: "",
                        jingxuangegu: [{
                            name: '',
                            code: '',
                            reason: '',
                            analysis: '',
                            introduction: ""
                        }]
                    }]
                }
            }
        },
        methods: {
            async findAll(page) {
                let response = await api.getHotsniperList(page, 20, this.categoryId, JSON.stringify(this.filters));
                if (response.code == "0") {
                    this.tableData = response.data;
                    this.count = response.count;
                    this.num = response.count / 20;

                } else {
                    this.tableData = []
                }
                this.alertMessage(response.message);
            },
            alertMessage(msg) {
                this.$message({
                    message: msg,
                    type: 'success'
                });
            },
            remSpot(index) {
                this.editForm.banKuai.splice(index, 1);
            },
            selsChange: function(sels) {
                this.sels = sels;
            },
            addSpot: function() {
                this.editForm.banKuai.push({
                    ruxuanjianjie: "",
                    jingxuangegu: [{
                        name: '',
                        code: '',
                        reason: '',
                        analysis: '',
                        introduction: ""
                    }]
                })
            },
            batchLikeView(type, title) {
                this.viewlikeFrom = {};
                this.viewlikeFrom.type = type;
                this.BatchViewDialogTitle = title;
                if (this.sels.length < 1) {
                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });
                    this.BatchViewDialogVisible = false;
                } else {
                    this.BatchViewDialogVisible = true;
                }
            },
            //显示编辑界面
            handleEdit: function(index, row) {
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.status = row.statusDesc;
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.showUeEdit = true;
            },
            //显示新增界面
            handleAdd: function() {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.editFormVisible = true;
                this.showUeEdit = true;
                this.clearEdit();
            },
            clearEdit() {
                let tmpObj = {
                    id: '',
                    title: '',
                    banKuai: [{
                        jingxuangegu: []
                    }]
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            viewEvent(a) {
                this.viewFrom = {
                    view: a,
                    batchViewInput: a
                };
            },
            //注水
            async batchViewSubmit() {
                this.$refs.viewlikeFrom.validate(async(valid) => {
                    if (valid) {
                        this.setInfuse();
                        var dataArray = [];
                        for (var i = 0; i < this.sels.length; i++) {
                            var para = {
                                type: this.sels[i].type,
                                zs_count: this.sels[i].zs_count,
                                zhushuiid: this.sels[i].id
                            }
                            dataArray.push(para);
                        }
                        var result = await api.hotsniperView(1, dataArray);
                        if (result.code == "1") {
                            this.$message({
                                message: '注水成功',
                                type: 'success'
                            });
                        } else {
                            this.$message.error('注水失败');
                        }
                        this.BatchViewDialogVisible = false;
                        this.findAll(this.currentPage);
                    }
                })
            },
            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async() => {
                    this.listLoading = true;
                    var result = await api.operation(1, row.id);
                    this.listLoading = false;
                    if (result.code == "1") {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('删除失败');
                    }
                    this.findAll(this.currentPage);
                }).catch(() => {});
            },
            //提交
            async editSubmit(s) {
                this.$refs.editForm.validate(async(valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async() => {
                            let ref = this.spotRef;
                            let para = Object.assign({}, this.editForm);
                            this.editFormVisible = false;
                            this.editLoading = true;
                            let result, strresult;
                            if (this.editOrAdd) {
                                result = await api.postdata(s, this.categoryId, para)
                            } else {
                                this.editForm.id = 0;
                                result = await api.postdata(s, this.categoryId, para)
                            }

                            if (result.code == 0) {
                                strresult = "success"
                                this.findAll(this.currentPage)
                            } else {
                                strresult = "error"
                            }
                            this.$message({
                                message: result.message,
                                type: strresult
                            });
                            this.editFormVisible = false;
                            this.editLoading = false;
                        });
                    }
                });
            },
            setInfuse(type) {
                this.sels.forEach(a => {
                    a.type = "1";
                    a.zs_count = this.viewlikeFrom.count;
                });
            },
            checkHasHTag(textValue) {
                console.log(this.textValue)
                if (this.textValue.indexOf("h1") != -1 && this.textValue.indexOf("h2") != -1 && this.textValue.indexOf("h3") != -1) {
                    return true;
                }
                return false;

            },
            handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                this.findAll(currentPage);
            },
        },

        mounted() {
            this.findAll(this.currentPage);
        }
    };
</script>