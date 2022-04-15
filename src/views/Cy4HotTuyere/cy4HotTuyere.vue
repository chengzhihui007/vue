<template>
<div>
    <section>
           <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.plate_name" placeholder="请输入板块名称或代码搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="filters.create_time"
                        type="date"
                        placeholder="发布时间查询">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                <el-button type="primary"@click="page=1;getList()">查询</el-button>
                <el-button type="primary"@click="addList()">策略介绍</el-button>
                </el-form-item>
                <!-- <el-button  type="primary"@click="add()">添加热点</el-button> -->
                <el-button type="primary"@click="add()">添加热点</el-button>
                </div>
            </el-form>
        </el-col>
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>

             <el-table-column prop="" label="序号" min-width="60" >
                 <template scope="num">
                    <!-- {{num.$index+1}} -->
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>

            <el-table-column prop="plate_name" label="板块名称(代码)" min-width="100">
                 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.plate_name }}</div>
                    <div v-else>{{ scope.row.plate_name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="发布时间" min-width="100" >
                 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.create_time.substring(0,16) }}</div>
                    <div v-else>{{ scope.row.create_time.substring(0,16) }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_user" label="最近操作账号" min-width="100">
                 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.type == 1">{{ scope.row.operation_user }}</div>
                    <div v-else>{{ scope.row.operation_user }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <div v-if="scope.row.type ==1">
                        <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button disabled type="danger" size="small"  @click="delHotTuyere(scope.$index, scope.row)" >已删除</el-button>
                    </div>
                    <div v-else>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="danger" size="small"  @click="delHotTuyere(scope.$index, scope.row)">删除</el-button>
                    </div>
                    <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination  v-if="this.total>this.size" @current-change="handleCurrentChange" :current-page="page" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--编辑/添加界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <el-form-item label="热点搜索"  >
                        <el-select v-model="editForm.sec_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                            @change="selectchange" :loading="select_loading" auto-complete="off" style="width:180px;" required: true>
                            <el-option v-for="item in select_options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="已选板块" prop="plate_name" >
                    <!-- <el-input  v-model="selectedList[i].label" style="border:0"></el-input> -->
                    <!-- <div></div> -->
                    <div prop="selectedList"  v-for="(v, i) in selectedList">{{v}}
                        <el-button  @click="$delete(selectedList,i)">删除</el-button>
                    </div>
                    
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="dialogVisible = false; $refs['editForm'].clearValidate();">取消</el-button>
                    <el-button type="primary"@click.native="editSubmit" :loading="editLoading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
    </div>
</template>
<script>
    import '../../common/js/DateFormat';
    import keyboardWizard from "../../common/js/KeyboardWizard.js";
    import util from '../../common/js/util';
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';
    import http from 'axios'
    import jquery from 'jquery'
    import {ArticleList,Articlesave,Articleupdate,Articledelect,Articleupdateview} from "../../api/ydApi.js";
    // import api from '../../api/api.js';
    export default {
        components: {UeEdit},
        data() {
            return {
                labels:[

                ],
                desin:false,
                biaoqianForm:[],
                options:[],
                checkList: [],
                zhushuiid:'',
                flag:'0',
                multipleSelection:[],
                likeFrom:{},
                iden:'',
                textarea: "",
                // dialogTitle1: "",
                // isDisable:"",
                activeName: "",
                title:'',
                dialogTitle: "",
                radio: '1',
                editOrAdd:false,
                filters: {
                    plate_name:'',
                    create_time:''
                },
                datas: [],
                sels: [],
                total: 0,
                page: 1,
                size: 10,
                id:'',
                arr:[],
                plateList:[],
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                select_options: [],
                select_loading:false,
                // editFormRules: {
                //     content: [
                //         { required: true, message: '请输入正文内容', trigger: 'change' },
                //     ],
                //     name: [
                //         { required: true, message: '请选择标签', trigger: 'change' }
                //     ],
                //     title:[
                //         { required: true, message: '请输入标题', trigger: 'blur' }
                //     ]
                // },
                rules:{
                    sec_name:[
                        { required: true, message: '请选择板块', trigger: 'change' }
                    ],
                    // plate_name:[
                    //     { required: true, message: '请选择想要添加的热点', trigger: 'change' }
                    // ],
                    // selectedList:[
                    //     { required: true, message: '请选择想要添加的热点', trigger: 'change' },
                    //      {length: 5, message: '添加的热点不能超过5个', trigger: 'blur'}
                    // ]
                },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                },
                selectedList: []
            }
        },
        methods: {
            add_select_clear() {
                this.editForm.sec_code = "";
            },
            select_remoteMethod(name) {
            
            if (name !== "") {
                this.select_loading = true;
                setTimeout(async () => {
                this.select_loading = false;
                var result = await keyboardWizard.getBanKuai(name);
                console.log(JSON.stringify(result))
                this.select_options = result;
                //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                }, 200);
                console.log(JSON.stringify(this.select_options));
            } else {
                this.select_options = [];
            }
            },
            selectchange(val) {
                Array.prototype.in_array = function(element) {
                    for(var i = 0; i < this.length; i++) {
                        if(this[i] == element) {
                            return true;
                        }
                    }
                    return false;
                }
                console.log(val)
                // var r = this.editForm.sec_name;
                if(this.selectedList.length==5){
                    this.$message.error("热点板块最多添加5个")
                    this.editLoading = false;
                    return;
                }
                
                if (this.selectedList[val]) return;
                for (var i = 0; i < this.select_options.length; i++) {
                    var s = this.select_options[i];
                    if (s.value == val) {
                        if(this.plateList.in_array(val) == true){
                            this.$message.error("该板块已添加")
                            this.editLoading = false;
                            return;
                        }else{
                            this.arr.push(s.label+'('+ val+')')
                        }
                    }
                }
                this.plateList.push(val)
                this.selectedList = this.arr
            },
            selsChange: function(sels) {
			    this.sels = sels;
		    },
            handleCurrentChange(val) {
                this.page = val;
            },
            // getList(){},
            addList(){
                this.$router.push({path:'/cljs$HotTuyere'})
            },
            add:function(){
                this.arr=[]
                this.plateList=[]
                this.selectedList=[]
                this.select_options=[]
                this.editOrAdd = true;
                this.dialogTitle = "热点管理";
                this.dialogVisible = true;
                this.editForm = {
                    plate_name: '',
                    // title: '',
                    // audioAddress:''
                };
                
            },
            editSubmit:function(){
                 var _this = this
                 if(this.arr.length==0){
                     this.$message.error('请选择要添加的热点');
                     return
                 }
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        let result={};
                        let para = Object.assign({}, this.editForm);
                        para = Object.assign(para, {plate_name: this.arr.join('、')});
                        para.create_time=new Date().format('yyyy-MM-dd hh:mm:ss');
                        let user = JSON.parse(sessionStorage.getItem('user'));
                        para.operation_user = user.user_name
                        para.type=0
                        if(this.editOrAdd){
                            result= await api.addHotTuyere(para);
                            console.log(JSON.stringify(result));
                            
                            this.id = result.data
                            this.dialogVisible = false;
                            this.editLoading = false;
                            if(result.state){
                                this.$message({message: '提交成功',type: 'success'});
                            }else{
                                this.$message.error('提交失败');
                            }
                        }else{
                            
                            this.editForm = Object.assign(this.editForm, {plate_name: this.arr.join('、')});
                            this.editForm.update_time=new Date().format('yyyy-MM-dd hh:mm:ss');
                            console.log(JSON.stringify(this.editForm))
                            result= await api.updateCy4HotTuyere(para);
                            if(result.state){
                                this.$message({message: '提交成功',type: 'success'});
                            }else{
                                this.$message.error('提交失败');
                            }

                        }
                        this.clearEdit();
                        this.dialogVisible = false;
                        this.editLoading = false;
                        this.getList()
                    });
                    }
                })
            },
            //获取列表
            async getList(para){
                para = {
                    page : this.page,
                    size : this.size,
                    plate_name : this.filters.plate_name,
                    pub_time : this.filters.create_time&&new Date(this.filters.create_time).format('yyyy-MM-dd')
                };
                
                await api.selectCy4HotTuyereByPage(para).then(res => {
                    console.log(JSON.stringify(res));
                    let result=res.data.result;
                    this.total = res.data.total;
                    var array = [];
                    var times = "";
                    for(var i=0;i<result.length;i++){
                        var date = new Date(result[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                        var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                        result[i].pub_date=Y+M+D+h+m;
                        times = Y+M+D
                        if(result[i].type=='0'){
                            array.push(times)
                        }
                        
                    }
                        this.datas = result
                });
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleCurrentChange(val) {
                 this.page = val;
                var para = {
                    page:this.page,
                    size:this.size
                };
                this.getList(para)
            },
            //显示编辑界面
            async handleEdit (index, row) {
                console.log(JSON.stringify(row.plate_name))

                var sel = row.plate_name
                var temp= new Array();
                var temp = sel.split('、')
                this.selectedList = temp;
                this.arr = temp;
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.showUeEdit = true;
            },
        
            //删除
            async delHotTuyere(index, row) {
                var confirmText=''
                confirmText = '若确认删除则不可恢复，确定要删除该内容吗?'
                const newDatas = [] 
                const h = this.$createElement 
                newDatas.push(h('p', null, confirmText)) 
                        this.$confirm( '提示', 
                        { title: '删除提示',
                        message: h('div', null, newDatas), 
                        showCancelButton: true, 
                        confirmButtonText: '确定', 
                        cancelButtonText: '取消' } ).then(async () => {
                  this.listLoading = true;
                  await  api.delectCy4HotTuyere(row.id).then(res=>{
                    var result=res.data;
                    if (res.state) {
                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.iden='0'
                    } else {
                        this.listLoading = false;
                        this.$message({
                            message: "删除失败",
                            type: "error"
                        });
                        
                    }
                    this.getList();
				});

            })
            .catch(() => {
               });
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
        },
        
       async mounted() {
            this.getList()
        }
    }
</script>
<style slot-scope>
    .deleted-text{
        color: #999999;
    }
    .el-dialog.el-dialog--small{
        overflow-x: hidden;
    }
    .el-dialog__body{
        max-height: 800px;
        overflow-y: auto;
/*        margin-right: -14px;
        padding-right: 34px;*/
    }
    .ql-container.ql-snow{
        max-height: 200px;
        overflow-y: auto;
    }
    .el-pagination{
        text-align: center;
    }
    .el-message-box__message p:first-child{
    text-align: center;
    }
</style>
