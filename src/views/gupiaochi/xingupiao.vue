<template>
   	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		<el-tab-pane label="股票池列表" name="first">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="请输入股票名称/代码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                            v-model="filters.datetime"
                            type="date"
                            placeholder="发布时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"   @click.native="batchLikeView('like','批量点赞')">批量点赞</el-button>
                        <el-button type="primary"    @click.native="batchLikeView('view','批量浏览')">批量浏览</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="stock_name" label="股票名称" min-width="100"></el-table-column>
            <el-table-column prop="teacher" label="老师" min-width="50"></el-table-column>
            <!--<el-table-column prop="count" label="跟踪次数" min-width="100"></el-table-column>-->
            <el-table-column prop="viewformat" label="播放总数/真实数" min-width="100"></el-table-column>

            <el-table-column prop="likeformat" label="点赞总数/真实数" min-width="100"></el-table-column>
            <!--<el-table-column prop="comment" label="分享数" min-width="100"></el-table-column>-->
            <el-table-column prop="create_time" label="发布时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" v-if="visibletool==0||visibletool==''"   min-width="220">
                <template  scope="scope">
                    <el-button size="small"   @click.native="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title=dialogTitle :visible.sync="FormVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit"  width="50%">
            <el-form :model="editForm" label-width="110px"  :rules="editFormRules" ref="editForm">

                <el-form-item label="股票名称：" prop="stock_name">
                    <el-select v-model="editForm.stock_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear"
                               :remote-method="select_remoteMethod" :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:180px;">
                        <el-option v-for="item in select_options" :key="item.value"  :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="editForm.stock_code"  auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                </el-form-item>

                <el-form-item label="老师：" prop="teacher">
                    <el-select label="老师"  v-model="editForm.teacher"  placeholder="请选择老师" @change="changelaoshi(editForm.teacher)">
                        <el-option
                                v-for="(list,index) in teacherFrom"
                                :key="index"
                                :label="list.name"
                                :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关注理由：">
                    <UeEdit v-if=showUeEdit :thisData="'reasont'" v-on:ueIpt-say="listenThisUe" :maxWords=20000 :defaultMsg="editForm.reasont" ref='reasont'></UeEdit>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="SubmitForm()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--注水-->
        <el-dialog :title="BatchViewDialogTitle" :visible.sync="BatchViewDialogVisible" >
            <el-form  :model="viewlikeFrom" ref="viewlikeFrom"  label-width="80px"  class="demo-ruleForm"  >
                <el-form-item label="注水数" prop="count"  :rules="[{ required: true, message: '不能为空'}]">
                    <el-input type="number" v-model="viewlikeFrom.count" placeholder="请输入添加数量"  v-on:input="viewEvent(viewlikeFrom.count)"  style="width:220px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{viewlikeFrom.count}}</font>   个吗？</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit()">确 定</el-button>
		    </span>
        </el-dialog>

    </section>


    </el-tab-pane>
		<el-tab-pane label="股票池历史" name="second">
				 <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="filtersLs.keyword" placeholder="请输入股票名称/代码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                            v-model="filtersLs.datetime"
                            type="date"
                            placeholder="发布时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getListLs()">查询</el-button>
                </el-form-item>

               
            </el-form>
        </el-col>


        <!--列表-->
        <el-table  ref="multipleTable" :data="datasLs" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="stock_name" label="股票名称" min-width="100"></el-table-column>
            <el-table-column prop="teacher" label="老师" min-width="50"></el-table-column>
            <!--<el-table-column prop="count" label="跟踪次数" min-width="100"></el-table-column>-->
            <el-table-column prop="viewformat" label="播放总数/真实数" min-width="100"></el-table-column>

            <el-table-column prop="likeformat" label="点赞总数/真实数" min-width="100"></el-table-column>
            <!--<el-table-column prop="comment" label="分享数" min-width="100"></el-table-column>-->
            <el-table-column prop="create_time" label="发布时间" min-width="100" ></el-table-column>
             <el-table-column prop="delete_time" label="删除时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" v-if="visibletool==0||visibletool==''"   min-width="220">
                <template  scope="scope">
        
                    <el-button type="danger" size="small"   @click="handleHy(scope.$index, scope.row)">还原</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChangeLs" :current-page="currentPageLs" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.totalLs>
            </el-pagination>
        </el-col>
			



            	<el-dialog title="还原" :visible.sync="hyclass"  :close-on-click-modal="false" width="50%" center>
                            <el-form :model="hyForm"   ref="hyForm" label-width="100px" >


                                                {{hyForm.msg}}



                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="hyclass = false">取 消</el-button>
                                <el-button type="primary" @click="submitHyForm()" :loading="editLoadingLs">确 定</el-button>
                            </div>
		</el-dialog>

		</el-tab-pane>


	</el-tabs>
</template>

<script>
    import {imageDefault} from "../../common/js/urls";
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    import util from '../../common/js/util';
    import UeEdit from "../UeEdit.vue";
    import api from '../../api/api.js';

    import axios from 'axios'
    export default {

        components: {UeEdit},
        data() {
            return{
                 hyForm:{
                    stock_pool_id:"",

                    msg:""
                },
                hyclass:false,
                activeName:'first',
                datas: [],
                total: 0,
                datasLs: [],
                totalLs: 0,
                page: 1,
                pageSize:30,
                currentPage: 1,
                currentPageLs: 1,
                listLoading: false,
                select_loading: false,
                sels:[],//列表选中列
                select_options: [],//键盘宝
                FormVisible:false,
                visibletool:false,
                editOrAdd:false,
                filters: {
                    stock_code:'',
                    stock_name:'',
                    keyword:'',
                    datetime:''
                },
                filtersLs: {
                    stock_code:'',
                    stock_name:'',
                    keyword:'',
                    datetime:''
                },

                showUeEdit:false,
                editFormRules: {
                    stock_name:[{ required: true, message: "股票必选", trigger: "blur" }],
                    teacher:[{ required: true, message: "老师必选", trigger: "blur" }],
                },
                //注水
                BatchViewDialogTitle:'',
                BatchViewDialogVisible:false,
                viewlikeFrom:{
                    type:'',
                    count:'',
                },
                //编辑界面数据
                editLoading:false,
                editLoadingLs:false,
                dialogTitle: "新增",
                ueid:'',
                editForm:{
    /*              stock_pool_id:"",
                    stock_name:"",
                    stock_code:"",
                    type:"",
                    reasont:"",
                    count:"",
                    like:"",
                    likeR:"",
                    view:"",
                    viewR:"",
                    create_time:"",
                    update_time:""*/
                },
                teacherFrom:[],
                teachername:'',
                teacherid:'',
            }
        },
        methods: {
            submitHyForm(){

                  this.$refs.hyForm.validate(async valid => {

                    if (valid) {


                    this.editLoading = true;

                     await api.hySave(this.hyForm);


                        this.hyclass = false;
                                    this.$message({
                                        message: "还原成功",
                                        type: "success"
                                    });

                                this.editLoadingLs = false;
                                this.getList();
                                this.getListLs();


                   
                    }
                });

            },
            handleHy(index, row){

                this.hyclass = true;

               //确定要还原2018-11-09 ，14：56更新的合众思壮吗？
                var result = {
                    stock_pool_id:row.stock_pool_id,

                    msg:"确定要还原"+row.create_time+"更新的"+row.stock_name+"吗？",
                    
                    view:row.view,
                    like:row.like

                }
                this.hyForm = result;

            },
            	handleClick(tab, event) {
                    this.getListLs()
			      //console.log(tab, event);
		     },
            //获取列表
            async getList(){

                // var admin = sessionStorage.getItem("user");
                // var a = JSON.parse(admin);
                // this.username=a.user_name;

                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword,
                    datetime:this.filters.datetime,
                    del_flag:0
                };
                if(para.datetime)
                {
                    para.datetime=util.formatDate.format(para.datetime,"yyyy-MM-dd");
                }
                //this.visibletool=this.filters.type;
                //console.log("page:::"+this.page+"pagesize:::"+this.pageSize);
                let result=await api.getGuPiaoChiList(para);

                for(var i=0;i<result.list.length;i++)
                {
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].create_time=Y+M+D+h+m+s;
                    result.list[i].likeformat=result.list[i].like+"/"+result.list[i].likeR;
                    result.list[i].viewformat=result.list[i].view+"/"+result.list[i].viewR;
                    //result.list[i].type=parseInt(result.list[i].type);
                }
                this.datas=result.list;
                this.total=result.total;
                //console.log("fdsfds:::"+ JSON.stringify(result));
            },
               async getListLs(){

                // var admin = sessionStorage.getItem("user");
                // var a = JSON.parse(admin);
                // this.username=a.user_name;

                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    keyword:this.filtersLs.keyword,
                    datetime:this.filtersLs.datetime,
                    del_flag:1
                };
                if(para.datetime)
                {
                    para.datetime=util.formatDate.format(para.datetime,"yyyy-MM-dd");
                }else{
                    para.datetime ="";
                }
                //this.visibletool=this.filters.type;
                //console.log("page:::"+this.page+"pagesize:::"+this.pageSize);
                let result=await api.getGuPiaoChiList(para);

                for(var i=0;i<result.list.length;i++)
                {
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].create_time=Y+M+D+h+m+s;
                    result.list[i].likeformat=result.list[i].like+"/"+result.list[i].likeR;
                    result.list[i].viewformat=result.list[i].view+"/"+result.list[i].viewR;
                    //result.list[i].type=parseInt(result.list[i].type);
                }
                this.datasLs=result.list;
                this.totalLs=result.total;
                //console.log("fdsfds:::"+ JSON.stringify(result));
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //显示新增界面
            handleAdd: function(){
                this.editOrAdd = true;
                this.FormVisible = true;
                this.clearEdit();
                this.showUeEdit = true;
                this.dialogTitle="新增";
                //this.$refs.editForm.resetFields();
            },

            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },

            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            //显示编辑界面
            async handleEdit(index, row) {
                this.editOrAdd = false;
                this.FormVisible = true;
                this.editForm = Object.assign({}, row);//await api.findRiJianSo(row);


                this.showUeEdit = true;
                this.dialogTitle="编辑";
            },

            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;

                    var result= await api.deleteGuPiaoChi(row.stock_pool_id);

                    this.listLoading = false;
                    if(result.status=="1")
                    {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    else
                    {
                        this.$message.error('删除失败');
                    }

                    this.getList();
                }).catch(() => {

                });
            },
            async  SubmitForm(){
                //股票池提交
                this.$refs.editForm.validate(async(valid) => {
                      this.editForm.reasont= this.$refs["reasont"].getUEContent();
                      if(this.editForm.reasont)
                      {
                          if (valid){
                              this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                  this.editLoading = true;
                                  let result={};

                                  if(this.editOrAdd){
                                      this.editForm.count=0;
                                      //this.editForm.create_time=util.formatDate.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                                      //this.editForm.stock_pool_id=String(new Date().getTime());
                                      //将老师列表选中的值赋值给teacher字段
                                      this.editForm.teacher=this.teachername;
                                      this.editForm.teacherid=this.teacherid;
                                      let para = Object.assign({}, this.editForm);
                                      result= await api.addGuPiaoChi(para);
                                  }else{

                                      if(this.teachername !="")
                                      {
                                          this.editForm.teacher=this.teachername;
                                          this.editForm.teacherid=this.teacherid;

                                      }
                                      else
                                      {
                                          //修改时未修改老师字段：
                                          for(var t=0;t<this.teacherFrom.length;t++)
                                          {
                                              if(this.teacherFrom[t].name==this.editForm.teacher)
                                              {
                                                  this.editForm.teacherid=this.teacherFrom[t].id;
                                              }
                                          }
                                      }



                                      this.editForm.update_time=util.formatDate.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                                      let para = Object.assign({}, this.editForm);
                                      result= await api.updateGuPiaoChi(para);
                                  }
                                  this.FormVisible = false;
                                  if(result.status=="1")
                                  {
                                      this.$message({message: '提交成功',type: 'success'});
                                  }else
                                  {
                                      this.$message.error('提交失败');
                                  }

                                  this.editLoading = false;
                                  this.clearEdit();
                                  this.getList();
                              });
                          }
                      }
                      else
                      {
                          this.$message({
                              message: "请输入关注理由",
                              type: "error"
                          });
                      }


                    });
            },



            viewEvent(a){
                this.viewlikeFrom.count=a;
            },
            batchLikeView(type,title){
                this.viewlikeFrom={};
                this.viewlikeFrom.type=type;
                this.BatchViewDialogTitle=title;
                if (this.sels.length < 1) {
                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });
                    this.BatchViewDialogVisible = false;
                }
                else
                {
                    this.BatchViewDialogVisible = true;
                }
            },
            //注水
            async batchViewSubmit(){
                this.$refs.viewlikeFrom.validate(async (valid) => {
                    if (valid) {
                        this.setInfuse(this.viewlikeFrom.type);
                        var dataArray = [];


                        for (var i =0; i < this.sels.length; i++){
                            var para = {
                                stock_pool_id: this.sels[i].stock_pool_id,
                                like: this.sels[i].like,
                                view: this.sels[i].view,
                                t:this.sels[i].t,
                                zs_count:this.sels[i].zs_count
                            }
                            dataArray.push(para);
                        }

                        var result = await api.updateGuPiaoChi_LikeViewCount(dataArray);
                        if (result.status == "1") {
                            this.$message({
                                message: '注水成功',
                                type: 'success'
                            });
                        }
                        else {
                            this.$message.error('注水失败');
                        }
                        this.BatchViewDialogVisible=false;
                        this.getList();
                    }
                })
            },
            setInfuse(type) {
                if (type =="like") {
                    this.sels.forEach(a => {
                        if (
                            Number(this.viewlikeFrom.count) + Number(a.like) >
                            Number(a.view)
                        ){
                            //如果点赞数大于浏览数 提示
                            a.like = a.view;
//                            this.$message({
//                                message: "超过阅读量已调整为阅读量最低！",
//                                type: "warning"
//                            });
                        } else {
                            a.like = Number(this.viewlikeFrom.count) + Number(a.like);
                        }
                        a.zs_count=this.viewlikeFrom.count;
                        a.t="like";
                    });
                } else {
                    this.sels.forEach(a => {
                        a.view = Number(a.view) + Number(this.viewlikeFrom.count);
                        a.t="view";
                        a.zs_count=this.viewlikeFrom.count;
                        //console.log("view::::"+a.view);
                    });

                }
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            handleCurrentChangeLs(val) {
                this.page = val;
                this.getListLs();
            },
            selectchange(){
               var r= this.editForm.stock_name;

               for( var i in this.select_options )
               {
                   if(this.select_options[i].value==r)
                   {
                       this.editForm.stock_name=this.select_options[i].label;
                       this.editForm.stock_code=r;
                   }
               }
                //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
            },
            add_select_clear(){
               this.editForm.stock_code="";
            },
            select_remoteMethod(query) {

                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        var result = await kbspiritDataStore.query(query);
                        this.select_options=result;
                        //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                        //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                    }, 200);
                   // console.log(JSON.stringify(this.select_options));
                } else {
                    this.select_options = [];
                }
            },
            changelaoshi:function(index){

                this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
                //console.log("index::::"+index +"teachername:::"+this.teachername+"name::::"+ this.teacherid);
            },
            //老师列表
            async selectTeacherList() {
                let paras = {
                    flag:0
                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.teacherFrom=arr;
                this.listLoading = false;
                console.log(JSON.stringify(this.teacherFrom));
            },
        },
        mounted() {
            this.selectTeacherList();
            this.getList();
            this.getListLs();
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
 /*          margin-right: -14px;
             padding-right: 34px;*/
         }
    .ql-container.ql-snow{
        max-height: 200px;
        overflow-y: auto;
    }
    .el-pagination{
        text-align: center;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>