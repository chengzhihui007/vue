<template>
<div>
    <section v-if="$route.path === '/dragonTiger1'">
           <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.sec_name" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="filters.pub_date"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                <el-button type="primary"@click="getList()">查询</el-button>
                <el-button :disabled="iden==='1'" type="primary"@click="addList()">添加</el-button>
                </el-form-item>
                </div>
            </el-form>
        </el-col>
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- <el-table-column prop="id" label="序号" min-width="50">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.id }}</div>
                    <div v-else>{{ scope.row.id }}</div>
                </template>
            </el-table-column> -->

             <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>

            <el-table-column prop="sec_name" label="股票名称" min-width="100">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">
                        <div v-if="scope.row.sec_name=='今日不推荐' ">{{scope.row.sec_name}}</div> 
                        <div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div>
                    </div>
                    <div  v-else>
                        <div v-if="scope.row.sec_name=='今日不推荐' ">{{scope.row.sec_name}}</div> 
                        <div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column prop="investors" label="适用者投资" min-width="100">
                <template scope="scope">
                  
                    <!-- <div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div> -->
                    <div class="deleted-text" v-if="scope.row.is_delete ==1">
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ scope.row.investors }}</div>
                    </div>
                    <div v-else >
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ scope.row.investors }}</div>
                    </div>
                  
                </template>
            </el-table-column>
            <el-table-column prop="sec_lable" label="股票类型" min-width="100">
                <template scope="scope">
                    <!-- <div class="deleted-text" v-if="scope.row.is_delete ==1">{{ scope.row.sec_nature1+scope.row.sec_nature2+scope.row.sec_nature3}}</div>
                    <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                    <div v-else>{{ scope.row.sec_nature1+scope.row.sec_nature2+scope.row.sec_nature3}}</div> -->


                    <div class="deleted-text" v-if="scope.row.is_delete ==1">
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ (scope.row.sec_nature1+scope.row.sec_nature2+scope.row.sec_nature3).replace(/[股无]/g,'').concat("股")}}</div>
                    </div>
                    <div v-else >
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ (scope.row.sec_nature1+scope.row.sec_nature2+scope.row.sec_nature3).replace(/[股无]/g,'').concat("股")}}</div>
                    </div>


                </template>
            </el-table-column>
            <el-table-column prop="total_score" label="综合评分" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete ==1">
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ scope.row.total_score }}</div>
                    </div>
                    <div v-else >
                     <div v-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                     <div v-else>{{ scope.row.total_score }}</div>
                    </div>
                  
                </template>
            </el-table-column>
            <el-table-column prop="reason" label="推荐原因" min-width="100" >
                <template scope="scope">
                    <!-- <div class="deleted-text" v-if="scope.row.is_delete ==1">{{ scope.row.reason }}</div>
                    <div v-else>{{ scope.row.reason }}</div> -->

                     <div class="deleted-text" v-if="scope.row.is_delete ==1">
                        <div v-if="scope.row.sec_name=='今日不推荐'">{{ scope.row.not_reason }}</div>
                        <div v-else>{{ scope.row.reason }}</div>
                    </div>
                    <div v-else >
                        <div v-if="scope.row.sec_name=='今日不推荐'">{{ scope.row.not_reason }}</div>
                        <div v-else>{{ scope.row.reason }}</div>
                    </div>


                </template>
            </el-table-column>
            <el-table-column prop="pub_date" label="发布时间" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete ==1">{{ scope.row.pub_date }}</div>
                    <div v-else>{{ scope.row.pub_date }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <div v-if="scope.row.is_delete ==1">
                    <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button disabled type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" >已删除</el-button>
                </div>
                <div v-else>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </div>
                <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
    </section>
    <router-view v-else></router-view>
    </div>
</template>
<script>
    import '../../common/js/DateFormat';
    import util from '../../common/js/util';
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';
    import {ArticleList,Articlesave,Articleupdate,Articledelect,Articleupdateview} from "../../api/ydApi.js";
    // import api from '../../api/api.js';
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
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
                dialogTitle: "新增",
                radio: '1',
                editOrAdd:false,
                filters: {
                    sec_name:'',
                    pub_date:''
                },
                datas: [],
                sels: [],
                total: 0,
                page: 1,
                size: 10,
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
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
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                },

            }
        },
        methods: {
            selsChange: function(sels) {
			    this.sels = sels;
		    },
            handleCurrentChange(val) {
                this.page = val;
            },
            //获取列表
            async getList(para){
                para = {
                    page : this.page,
                    size : this.size,
                    sec_name : this.filters.sec_name,
                    //pub_date : this.filters.pub_date&&new Date(this.filters.pub_date).format('yyyy-MM-dd hh:mm:ss')
                    pub_time : this.filters.pub_date&&new Date(this.filters.pub_date).format('yyyy-MM-dd')
                };
                console.log(JSON.stringify(para));
                
                await api.selectDragonTigerByPage(para).then(res => {
                    console.log(JSON.stringify(res));
                    let result=res.data.result;
                    
                    
                    this.total = res.data.total;
                    var array = [];
                    var times = "";
                    for(var i=0;i<result.length;i++){
                        var date = new Date(result[i].pub_date);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                        var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                        result[i].pub_date=Y+M+D+h+m;
                        times = Y+M+D
                        if(result[i].is_delete=='0'){
                            array.push(times)
                        }
                        
                    }
                    var time = new Date();
                    var Y = time.getFullYear() + '-';
                    var  M = (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1) + '-';
                    var  D = (time.getDate() < 10 ? '0'+(time.getDate()) : time.getDate()) + ' ';
                    var time = Y+M+D
                    // alert(array)
                    // alert(time)
                    if(array.includes(time)){
                        this.iden = "1"
                    }
                    console.log(result)
                        this.datas = result
                });
                // api.getFlag().then((data)=>{
                //     //   alert(JSON.stringify(data))
                //     this.isDisable = data.data
                // });
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },
            handleCurrentChange(val) {
                 this.page = val;
                var para = {
                    page:this.page,
                    size:this.size,
                    sec_name : this.filters.sec_name,
                    pub_date : this.filters.pub_date
                };
            //    alert( JSON.stringify(para))
                // this.getList(this.page,this.size,this.sec_name,this.pub_date)
                this.getList(para)
            },
            async addList(){
                this.editOrAdd = true;
                this.dialogVisible1 = true;
                this.$router.push({path:'/add0',query:{editOrAdd:true,}})
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.showUeEdit = true;
                this.$router.push({path:'/add1',query:{id:row.id,editOrAdd:false,flag:row.flag}})
            },
        
            //删除
            async handleDel(index, row) {
                // const confirmText = [row.sec_name, '若确认删除则不可恢复，确定要删除该股票吗?'] 
                var confirmText=''
                // alert(row.sec_code)
                if(row.sec_code!=null){
                     confirmText = [row.sec_name +"("+row.sec_code+")", '若确认删除则不可恢复，确定要删除该股票吗?']
                }else{
                     confirmText = [row.sec_name, '若确认删除则不可恢复，确定要删除该股票吗?']
                }
                const newDatas = [] 
                const h = this.$createElement 
                for (const i in confirmText) { 
                    newDatas.push(h('p', null, confirmText[i])) }
                        this.$confirm( '提示', 
                        { title: '删除提示',
                        message: h('div', null, newDatas), 
                        showCancelButton: true, 
                        confirmButtonText: '确定', 
                        cancelButtonText: '取消' } ).then(async () => {
                this.listLoading = true;
                  await  api.deleteDragonTiger(row.id).then(res=>{
                    var result=res.data;
                    // alert(JSON.stringify(res))
                    if (res.state) {
                        // alert()
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

            getData() {
                // this.getLabelList();
                var para = {
                    page : this.page,
                    size : this.size,
                    sec_name : this.filters.sec_name,
                    pub_date : this.filters.pub_date
                };
                    // alert(JSON.stringify(para))
                this.getList(para);
            }

        },
        watch: {
          '$route'(val) {
              console.log(val);
                if (val.path === '/dragonTiger1') {
                    this.getData()
                }              
           }
        },
        mounted() {
            this.getData()
            // var para = {
            //     page : this.page,
            //     size : this.size,
            //     sec_name : this.filters.sec_name,
            //     pub_date : this.filters.pub_date
            // };
            // // alert(JSON.stringify(para))
            // this.getList(para);
        //     api.getFlag().then((data)=>{
        // //   alert(JSON.stringify(data))
        //     this.isDisable = data.data
    //   });
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
