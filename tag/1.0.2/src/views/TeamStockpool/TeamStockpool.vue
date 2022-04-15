<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<test dialogTitle2="fdsfdsfdsf" dialogVisible="true"></test>-->
                <el-form-item>
                    <el-input id="stock_name" placeholder="股票名称" v-model="filters.stock_name"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker v-model="filters.create_time" type="date" placeholder="创建时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" v-on:click="getTeamStockpoolByCondition">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar">
            <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-col>
        <!--列表-->
        <el-table ref="multipleTable" :data="DataList" highlight-current-row v-loading="listLoading" :fit="true" style="width: 100%;">
            <el-table-column prop="num" label="序号" width="120">
            </el-table-column>
            <el-table-column prop="stock_name" label="股票名称">
            </el-table-column>
            <el-table-column prop="stock_code" label="股票代码">
            </el-table-column>
            <el-table-column prop="txtcontent" label="关注理由">
            </el-table-column>
            <el-table-column prop="stop_loss_position" label="止损位">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" :formatter="formatfoatcreateTime">
            </el-table-column>
            <el-table-column prop="bag_name" label="锦囊">
            </el-table-column>

            <el-table-column label="操作" width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                    <el-button type="danger" size="small" @click="historyAdd(scope.$index,scope.row)">跟踪</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper"
                :total=this.total>
            </el-pagination>
        </el-col>

        <!--股票池编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync=dialogVisible width="50%" :close-on-click-modal="false" v-on:close="clearEdit" >
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForms">

                <el-form-item label="选择锦囊" prop="bag_id">
                    <el-select v-model="editForm.bag_id" clearable placeholder="--请选择锦囊--">
                        <el-option v-for="list in bagFrom" :key="list.bag_id" :label="list.name" :value="list.bag_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="股票名称：" prop="stock_name">
                    <el-select v-model="editForm.stock_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                        :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:180px;">
                        <el-option v-for="item in select_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="editForm.stock_code" auto-complete="off"   style="width:150px;margin-left:10px;"></el-input>
                </el-form-item>


                <el-form-item label="止损位" prop="stop_loss_position" >
                    <el-input type="number"  style="width:180px;" v-model.number="editForm.stop_loss_position" auto-complete="off"></el-input>元
                </el-form-item>

                <el-form-item label="关注理由" prop="reasont">
                   <UeEdit v-if=showUeEdit :thisData="'reasont'"   v-on:ueIpt-say="listenThisUeEdit" :maxWords=20 :defaultMsg=editForm.reasont ref='reasont'></UeEdit>
                   <!-- <el-input v-model="editForm.reasont" auto-complete="off"></el-input> -->
                </el-form-item>
            </el-form>
            <div slot="footer"   class="dialog-footer">
                <el-button @click.native="dialogVisible = false;showUeEdit=false;">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
 

        <!--<editOrAdds :dialogTitle=dialogTitle  :dialogVisible=dialogVisible  :editForm=editForm  @func="b"></editOrAdds>-->
        <history :history_dialogVisible=history_dialogVisible :history_editForm=history_editForm :history_showUeEdit=history_showUeEdit
            @func_history="b2" @func_UeEdit="b3" @func_b4="b4"></history>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import { addTeamStockpool, updateTeamStockpool, deleteTeamStockpool, getTeamStockpoolList, teamBagList } from '../../api/ydApi.js';
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    import UeEdit from '../UeEdit.vue';
    //    import editOrAdds from "./EditeAdd.vue";
    import history from "./history.vue";

    export default {
        components: { history,UeEdit },
        data() {
            return {
                //////////////////////////////
                dialogTitle: '',
                dialogVisible: false,

                editForm: {},
                select_loading: false,
                listLoading: false,
                editLoading: false,
                select_options: [],//键盘宝
                bagFrom: {},
                alertmsg: "操作成功",
                alerttype: "success",

                editFormRules: {
                    stock_name: [{ required: true, message: '请输入股票名称!', trigger: 'blur' }],
                    stock_code: [{ required: true, message: '请输入股票代码!', trigger: 'blur' }],
                    reasont: [
                        { required: true, message: '请输入关注理由!', trigger: 'change' },
                    ],
                    stop_loss_position: [
                        { required: true, message: '止损位不能为空' },
                        { type: 'number', message: '止损位必须为数字值' }
                    ],
                    bag_id: [{ required: true, message: '请选择锦囊!', trigger: 'blur' }],
                },
                ///////////////////////////////////////

                history_dialogTitle: "",
                history_dialogVisible: false,//新增编辑界面是否显示
                history_showUeEdit: false,
                showUeEdit:false,
                editOrAdd: false,
                DataList: [],


                DataObj: {},
                filters: {
                    id: '',
                    stockName: '',
                    stockCode: '',
                    reasont: '',
                    stopLossPosition: '',
                    createTime: '',
                    updateTime: '',
                    status: '',
                    bagId: '',
                    delFlag: '',
                    teamId: '',
                },
                total: 0,
                page: 1,
                pageSize: 20,
                currentPage: 1,
                //编辑界面数据
                history_editForm: {},
                team_id: '',
                team_name: ''
            }
        },
        methods: {
            b2(val) {
                this.history_dialogVisible = val;
            },
            b3(val) {
                this.history_showUeEdit = val;
            },
            b4()
            {
                this.list();
            },
            add_select_clear() {
                this.editForm.stock_code = "";
            },
            select_remoteMethod(query) {

                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        var result = await kbspiritDataStore.query(query);
                        this.select_options = result;
                        //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                        //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                    }, 200);
                    // console.log(JSON.stringify(this.select_options));
                } else {
                    this.select_options = [];
                }
            },
            listenThisUeEdit(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
               return thisUe;
            },
            selectchange() {
                var r = this.editForm.stock_name;

                for (var i in this.select_options) {
                    if (this.select_options[i].value == r) {
                        this.editForm.stock_name = this.select_options[i].label;
                        this.editForm.stock_code = r;
                    }
                }
                //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
            },

            async selectTeamBagList(para) {
                teamBagList(para).then(res => {
                    let arr = [];
                    for (let i = 0; i < res.data.length; i++) {
                        //console.log(res.data[i]);
                        res.data[i].bag_id = res.data[i].bag_id + "";
                        arr.push(res.data[i]);
                    }
                    this.bagFrom = arr;
                });
            },

            //股票池新增/修改
            editSubmit: function () {
                console.log("55555555");
                var b=/<img.*?(?:>|\/>)/gi;
                var s=this.editForm.reasont.match(b);
                if(s!=null&&s.length>3){
                    this.$confirm('最多上传三张图片，请检查图片数量！', '提示', {})
                }else{
                    this.$refs.editForms.validate((valid) => {                     
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                this.editLoading = true;
                                let objdata = Object.assign({}, this.editForm);

                                this.bagFrom.forEach(function (v) {
                                    if (v.bag_id == objdata.bag_id) {
                                        objdata.bag_name = v.name;
                                    }
                                })

                                if (objdata.editOrAdd) {
                                    //获取登陆用户的站点id
                                    objdata.team_id = this.team_id;// "1547630581948";
                                    addTeamStockpool(objdata).then(res => {
                                          if(res.data.status == 3)
                                    {
                                       this.$message({
                                            message: "添加失败,股票池里已经超过了8只股票！",
                                            type: "error"
                                           });
                                    }
                                  else if (res.data.status == 2) {
                                        this.alertmsg = "添加失败";
                                        this.alerttype = "error"
                                    }
                                    else if (res.data.status ==1) {
                                          this.$message({
                                            message: "操作成功！",
                                            type: "success"
                                           });
                                    }
                                        this.list();
                                    })
                                } else {
                                    updateTeamStockpool(objdata).then(res => {
                                        if (res.data.status == 2) {
                                            this.alertmsg = "修改失败";
                                            this.alerttype = "error"
                                        }
                                        else
                                        {
                                            this.$message({
                                             message: "操作成功！",
                                             type: "success"
                                           });
                                        }
                                        this.list();
                                    })
                                }
                                this.dialogVisible = false;
                            
                                this.editLoading = false;

                            });
                        }
                    });
                }
            },
            /////////////////////////////////////////////////



            add_select_clear() {
                this.editForm.stockCode = "";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.list();
            },
            //根据查询条件查询
            async getTeamStockpoolByCondition() {

                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    team_id:this.team_id,
                    stock_name: this.filters.stock_name,
                    create_time: this.filters.create_time,
                };
                getTeamStockpoolList(para).then(res => {
                    let result = res.data;
                    let arr = [];
                    let lists = result.list;
                    for (let i = 0; i < lists.length; i++) {
                        arr.push(lists[i]);
                        lists[i].num = i + 1;
                        lists[i].txtcontent=this.formathtml(lists[i].reasont);
                    }
                    this.DataList = lists;
                    this.total = result.total;
                });
            },
            //获取列表
            async list() {
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    team_id: this.team_id,//战队id
                    stock_name: this.filters.stock_name,
                    create_time: this.filters.create_time,
                };
                getTeamStockpoolList(para).then(res => {
                    let result = res.data;

                    let arr = [];
                    let lists = result.list;
                    for (let i = 0; i < lists.length; i++) {
                        arr.push(lists[i]);
                        lists[i].num = i + 1;
                        lists[i].txtcontent=this.formathtml(lists[i].reasont);
                    }
                    this.DataList = lists;
                    this.total = result.total;
                   // console.log("fds::::"+JSON.stringify(this.DataList));
                })
            },
            //显示股票池新增界面
            async handleAdd() {
                var isgo = this.chkteam();
                if (!isgo) {
                    return;
                }

                this.dialogTitle = "新增";
                this.dialogVisible = true;
                this.showUeEdit=true;

                var result = {
                    editOrAdd: true,
                }
                this.editForm = Object.assign({}, result);
            },
            //显示股票池编辑界面
            async handleEdit(index, row) {
                var isgo = this.chkteam();
                if (!isgo) {
                    return;
                }
                this.showUeEdit=true;

                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                var result = {
                    editOrAdd: false,
                }
                this.editForm = Object.assign({}, row, result);
            },
            //显示跟踪
            async historyAdd(index, row) {                
                var isgo = this.chkteam();
                if (!isgo) {
                    return;
                }
                this.history_dialogVisible = true;
                this.history_showUeEdit = true;
                var result = {
                    editOrAdd: true,
                }
                this.history_editForm = Object.assign({}, row, result);
            },

            //删除
            handleDel: function (row) {
                var isgo = this.chkteam();
                if (!isgo) {
                    return;
                }

                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        deleteTeamStockpool(row.id).then(res => {
                            var result = res.data;
                            if (result.status == 1) {
                                this.listLoading = false;
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.list();
                            } else {
                                this.listLoading = false;

                                this.$message({
                                    message: "删除失败",
                                    type: "error"
                                });
                                
                            }
                        });

                    })
                    .catch(() => {
                    });
            },
            chkteam() {
                if (this.team_id == "0") {
                    this.$message({
                        message: "该登录帐号没有战队组权限，不能操作！",
                        type: "error"
                    });
                    return false;
                }
                else {
                    return true;
                }
            },
            formatfoatcreateTime: function (row) {
                var timestamp = new Date(row.create_time);
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            },
 

           formathtml:function (str) {
             return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
          },

        //关闭时恢复编辑页面为默认
        clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
        },
            
            
        },

        mounted() {
            var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;

            this.selectTeamBagList({team_id:this.team_id});
            this.list();


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
       padding: 0px 20px;
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