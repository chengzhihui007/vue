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
                <el-input v-model="filters.title" placeholder="请输入标题关键字"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click.native="findAll()">查询</el-button>
            </el-form-item>

            <div>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" >新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"    @click.native="batchlike()">批量浏览</el-button>
                </el-form-item>
            </div>
        </el-form>
    </el-col>
    
   
   
<el-table :data="tableData" @selection-change="selsChange" highlight-current-row v-loading="listLoading" style="width: 100%;">
  <el-table-column type="selection" width="55"></el-table-column>
  <el-table-column prop="title" label="名称" min-width="120">
  </el-table-column>
  <el-table-column prop="liulan" label="浏览实数 | 总数" min-width="80">
  </el-table-column>
  <el-table-column prop="state" label="状态" min-width="80">
  </el-table-column>
    <el-table-column prop="create_time" label="添加时间" min-width="120">
  </el-table-column>
  <el-table-column prop="update_time" label="发布时间" min-width="120">
  </el-table-column>
<el-table-column label="操作" min-width="150">
 <template scope="scope">
    <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
  </template>
</el-table-column>
</el-table>
<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
<!--批量增加浏览-->
<el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
    <el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
        <el-form-item label="注水数" prop="Infuse" :rules="[
           { required: true, message: '不能为空'},
           { type: 'number', message: '必须为数字值'}
           ]">
            <el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input>
        </el-form-item>
        <el-form-item>
            <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个浏览数吗？</p>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="zhushuiVisible = false,zhushuiLoading=false">取消</el-button>
        <el-button type="primary" @click.native="zhushuiSubmit()" :loading="zhushuiLoading">提交</el-button>
    </div>
</el-dialog>

<!--编辑界面-->
<el-dialog v-if="editFormVisible" :title=dialogTitle :visible.sync="editFormVisible" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
    <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）"></el-input>
        </el-form-item>
        <span style="display: block;width: 100%;border-top: 1px dashed  #666;padding-bottom: 20px;margin-top:20px;"></span>
        <template v-for='(data,index) in editForm.banKuai'>
            <Smallspot :editForm=data :index=index :ref=spotRef @remove="remSpot"></Smallspot>
        </template>
        <el-button type="primary" @click="addSpot">+ 添加一组板块</el-button>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit(1)" :loading="editLoading">发 布</el-button>
        <el-button type="primary" @click.native="editSubmit(0)" v-if="editOrAdd==true||status=='保存未发布'" :loading="editLoading">保 存</el-button>
    </div>
</el-dialog>

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
    import {hotSniperList,hotsave,hotupdate,hotdelect,updateview} from "../../api/cyApi.js";
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
                //列表数据集合
                tableData: [],
                //编辑页面是否显示
                editLoading: false,
                //编辑添加页面显示title
                dialogTitle: '添加',
                //状态目前是添加和编辑
                editOrAdd: "",
                //分页默认个数
                total: 0,
                listLoading: false,
                sels: [],
                //当前数据页码
                page: 1,
                pageSize: 10,
                currentPage: 1,
                spotRef: 'spotModular',
                //注水id
                zhushuiid: '',
                status: '',
                //热点狙击类别
                categoryId: 16902,
                showUeEdit: false,
                zhushuiObj: { Infuse: null },
                zhushuiVisible: false,
                zhushuiLoading:false,
                filters: {
                    code: '',
                    name: '',
                    title: '',
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
                //编辑添加页面字段校验规则
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
                        bankuaifenxi: '',
                        bankuaizhangfu: '',
                        redianfangxiang: '',
                        redianduanping: '',
                        geguzhangdiebi: '',
                        zijinduibi: '',
                        zhangtingjiashu: '',
                        redianfenxi: '',
                        jingxuangegu: [{
                            name: '',
                            code: '',
                            reason: '',
                            analysis: ''
                        }]
                    }]
                }
            }
        },
        methods: {
            likeEvent(a){
                this.zhushuiObj ={
                    Infuse:a,
                };
            },
            async findAll(para) {
                para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    title: this.filters.title,
                    create_time:this.filters.datetime,
                };
                hotSniperList(para).then(res => {
                    this.tableData = res.data.list;
                    for(var i=0;i<this.tableData.length;i++){
                        var timesnip1=this.tableData[i].create_time;
                        var timestamp1 = new Date(timesnip1);//直接用 new Date(时间戳) 格式转化获得当前时间
                        this.tableData[i].create_time=timestamp1.toLocaleDateString().replace(/\//g, "-") + " " + timestamp1.toTimeString().substr(0, 8);
                        var timesnip2=this.tableData[i].update_time;
                        var timestamp2 = new Date(timesnip2);//直接用 new Date(时间戳) 格式转化获得当前时间
                        this.tableData[i].update_time=timestamp2.toLocaleDateString().replace(/\//g, "-") + " " + timestamp2.toTimeString().substr(0, 8);

                        if(this.tableData[i].is_deploy){
                            this.tableData[i].state="已发布"
                        }else{
                            this.tableData[i].state="未发布"
                        }

                        this.tableData[i].liulan=this.tableData[i].viewR+"  /  "+this.tableData[i].view;
                    }
                    this.total = res.data.total;
                });
            },
            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.hotSniper_id DESC "
                };
                this.findAll(para);
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
                    jingxuangegu: [{
                        name: '',
                        code: '',
                        reason: '',
                        analysis: ''
                    }]
                })
            },
            async batchlike () {
                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = 1;
                } else {
                    this.$message({
                        message: " 选择一条数据",
                        type: "warning"
                    });
                }
            },
            //显示编辑界面
            handleEdit: function(index, row) {
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.status = row.statusDesc;
                this.editFormVisible = true;
                row.banKuai= JSON.parse(row.hot_analsys)
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
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.zhushuiLoading=true;
                    this.setInfuse(this.InfuseType)
                    for(var i=0;i<this.sels.length;i++){
                        delete this.sels[i].create_time;
                        delete this.sels[i].update_time;
                    }
                    if (valid) {
                        updateview(this.sels).then(res => {
                            this.$message({
                                message: "注水成功",
                                type: "success"
                            });
                            this.zhushuiVisible = false;
                            this.zhushuiLoading=false;
                            this.zhushuiObj.Infuse = 0;
                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                                orderBy:"a.hotSniper_id DESC "
                            };
                            this.findAll(para);
                        });
                    }

                });

            },
            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    console.log(row)
                    var paradel = {
                        hotSniper_id:row.hotSniper_id
                    };

                    hotdelect(paradel).then(res => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                            orderBy:"a.hotSniper_id DESC "
                        };
                        this.findAll(para);
                    });


                }).catch(() => {
                });
            },
            //提交
            async editSubmit(s) {
                this.$refs.editForm.validate(async(valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async() => {
                            let ref = this.spotRef;
                            this.editForm.is_deploy=s;
                            let para = this.editForm;
                            let desc = para.banKuai;
                            for (var i = 0; i < desc.length; i++) {

                                let redianfenxiText = desc[i].redianfenxi;
                                let bankuaifenxiText = desc[i].bankuaifenxi;
                                if (redianfenxiText.indexOf("h1") == -1 || redianfenxiText.indexOf("h2") == -1 || redianfenxiText.indexOf("h3") == -1) {
                                    this.$confirm('热点分析必须含有1级2级3级标题')
                                    return;
                                }
                                if (bankuaifenxiText.indexOf("h1") == -1 || bankuaifenxiText.indexOf("h2") == -1 || bankuaifenxiText.indexOf("h3") == -1) {
                                    this.$confirm('板块走势分析必须含有1级2级3级标题')
                                    return;
                                }
                            }
                            this.editFormVisible = false;
                            this.editLoading = true;
                            let result, strresult;
                            para.banKuai = JSON.stringify(para.banKuai)
                            console.log(para)
                            if (this.editOrAdd) {
                                //添加
                                para.hotSniper_id=String( new Date().getTime())
                                para.create_time=String( new Date().getTime());
                                para.update_time=String( new Date().getTime());
                                result =hotsave(para).then(res => {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                        orderBy:"a.hotSniper_id DESC "
                                    };
                                    this.findAll(para);
                                });
                            } else {
                                //更新
                                delete para.create_time;
                                para.update_time=String( new Date().getTime());
                                result =hotupdate(para).then(res => {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                        orderBy:"a.hotSniper_id DESC "
                                    };
                                    this.findAll(para);
                                });
                            }


                        });
                    }
                });
            },
            checkHasHTag(textValue) {
                console.log(this.textValue)
                if (this.textValue.indexOf("h1") != -1 && this.textValue.indexOf("h2") != -1 && this.textValue.indexOf("h3") != -1) {
                    return true;
                }
                return false;

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
        },

        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.hotSniper_id DESC "
            };
            this.findAll(para);
        }
    };
</script>