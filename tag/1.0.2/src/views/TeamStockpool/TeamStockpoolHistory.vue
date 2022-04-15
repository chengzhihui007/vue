<template>
	<section>

		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input id="stock_name" placeholder="股票名称" v-model="filters.stock_name"></el-input>
					      </el-form-item>

				          <el-form-item>
						    <el-date-picker
								v-model="filters.create_time"
								type="date"
								placeholder="创建时间">
					  	    </el-date-picker>
					      </el-form-item>

					<el-form-item>
						<el-button type="primary"  v-on:click="getTeamStockpoolByCondition">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		<!--列表-->
		<el-table ref="multipleTable" :data="DataList"  highlight-current-row v-loading="listLoading" :fit="true"  style="width: 100%;">
			 <el-table-column prop="num" label="序号" width="120" >
             </el-table-column>
		                <el-table-column prop="stock_name" label="股票名称">
		                </el-table-column>
		                <el-table-column prop="stock_code" label="股票代码">
		                </el-table-column>
						<el-table-column prop="txtstatus" label="跟踪状态">
						</el-table-column>
		                <el-table-column prop="txtcontent" label="跟踪内容">
		                </el-table-column>
	                    <el-table-column prop="create_time2" label="调入时间" :formatter="formatfoatcreateTime">
		                </el-table-column>
			<el-table-column prop="create_time" label="创建时间" :formatter="formatfoatcreateTime">
			</el-table-column>
		  <el-table-column label="操作" width="300">
		     <template scope="scope">
				<el-button size="small" @click="historyAdd(scope.$index, scope.row)">编辑</el-button>
				<el-button type="danger" size="small"  @click="handleDel(scope.row)">删除</el-button>
			</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

		<!--<editOrAdds :dialogTitle=dialogTitle  :dialogVisible=dialogVisible  :editForm=editForm  @func="b"></editOrAdds>-->
		<!--<history :history_dialogVisible=history_dialogVisible :history_editForm=history_editForm :history_showUeEdit=history_showUeEdit  @func_history="b2" @func_UeEdit="b3"></history>-->

		<!--编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync=dialogVisible  :close-on-click-modal="false" v-on:close="clearEdit">
			<el-form :model="editForm" label-width="150px"  :rules="editFormRules" ref="editForms">

				<el-form-item label="股票名称：" prop="stock_name">
					<el-tag>{{editForm.stock_name}}</el-tag>  <el-tag>{{editForm.stock_code}}</el-tag>  <el-tag>({{editForm.bag_name}})</el-tag>
				</el-form-item>

				<el-form-item label="类型" prop="status">
					<el-radio-group v-model="editForm.status" disabled>
						<el-radio :label="1" >持有</el-radio>
						<el-radio :label="2" >调出</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="观点内容："  prop="content">
					<UeEdit v-if=showUeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=50 :defaultMsg=editForm.content ref='content'></UeEdit>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false;showUeEdit=false;">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>

		</el-dialog>
	</section>
</template>

<script>
    import util from '../../common/js/util'
    import {addstockhistory,updatestockhistory,deletestockhistory,getstockhistoryList} from '../../api/ydApi.js';
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    import UeEdit from '../UeEdit.vue';
//    import editOrAdds from "./EditeAdd.vue";
//    import history from "./history.vue";

  	export default {
  	    components:{UeEdit},
  	  data() {			
			return {
			    //////////////////////////////
                dialogTitle:'',
                dialogVisible:false,

                editForm:{},
                select_loading: false,
                listLoading: false,
                editLoading: false,
                select_options: [],//键盘宝
                showUeEdit:false,

                alertmsg:"操作成功",
                alerttype:"success",

				editOrAdd:false,
				DataList: [],

				filters: {
				    	stock_name:'',
				    	stock_code:'',
				    	create_time:'',
				    	team_id:'',
			    },
				total: 0,
				page: 1,
				pageSize:20,
				currentPage: 1,
                team_id:'',
                team_name:'',
                editFormRules: {
                    content: [ { required: true, message: '请输入观点内容!', trigger: 'change' }, ]
                },
		    }
		 },
	 methods: {
         add_select_clear(){
             this.editForm.stock_code="";
         },
         select_remoteMethod(query){
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

         selectchange(){
             var r= this.editForm.stock_name;

             for( var i in this.select_options)
             {
                 if(this.select_options[i].value==r)
                 {
                     this.editForm.stock_name=this.select_options[i].label;
                     this.editForm.stock_code=r;
                 }
             }
             //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
         },

         editSubmit: function (){
          this.$refs.editForms.validate((valid) => {
             if (valid) {
             this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                 this.editLoading = true;
                 let objdata = Object.assign({}, this.editForm);
                 //console.log("dddd"+JSON.stringify(objdata));

                 if(objdata.editOrAdd){
                     //获取登陆用户的站点id
                     objdata.team_id=this.team_id;
                     addstockhistory(objdata).then(res=>{
                         if(res.data.status==2)
                         {
                             this.alertmsg="添加失败";
                             this.alerttype="error"
                         }
                         this.list();
                     })
                 }else{
                     updatestockhistory(objdata).then(res=>{
                         if(res.data.status==2)
                         {
                             this.alertmsg="修改失败";
                             this.alerttype="error"
                         }
                         this.list();
                     })
                 }

                 this.clearEdit();
                 this.$message({
                     message: this.alertmsg,
                     type: this.alerttype
                 });
                 this.editLoading = false;
             });
            }
           })
         },



         listenThisUe(thisUe){
             this.editForm[thisUe.name] = thisUe.data;
             return thisUe
         },

         add_select_clear(){
             this.editForm.stockCode="";
         },
		   handleCurrentChange(val) {
                this.page = val;
                
				this.list();
			},
			//根据查询条件查询
			async getTeamStockpoolByCondition(){

				let para = {
					pageNo: this.page,
                    pageSize: this.pageSize,
                    team_id:this.team_id,
                    stock_name:this.filters.stock_name,
				    create_time:this.filters.create_time,
                };
               
				 getstockhistoryList(para).then(res=>{
                    let result=res.data;

                    let arr = [];
                    let lists=result.list;
                    for(let i=0;i<lists.length;i++){
                        arr.push(lists[i]);
                        lists[i].num=i+1;
                        lists[i].txtcontent=this.formathtml(lists[i].content);
                        lists[i].txtstatus=this.formatstatus(lists[i].status);
                    }
                    this.DataList=lists;
                    this.total=result.total;
				});
			},
			//获取列表
         async list(){
				//var admin = sessionStorage.getItem("user");
		        let para = { 
		        pageNo: this.page,
				pageSize: this.pageSize,
                team_id:this.team_id,//战队id
                stock_name:this.filters.stock_name,
				create_time:this.filters.create_time,
                };
                console.log("aaa:::",para);
              getstockhistoryList(para).then(res=>{
                    let result=res.data;
                    let arr = [];
                    let lists=result.list;
                    for(let i=0;i<lists.length;i++){
                        arr.push(lists[i]);
                        lists[i].num=i+1;
                        lists[i].txtcontent=this.formathtml(lists[i].content);
                        lists[i].txtstatus=this.formatstatus(lists[i].status);
                    }
                    this.DataList=lists;
                    this.total=result.total;
				})
		   },

		 	//显示跟踪
			 async historyAdd(index,row)
			 {
                 var isgo= this.chkteam();
                 if(!isgo)
                 {
                     return;
                 }

			     this.dialogVisible=true;
			     this.showUeEdit=true;
                 var result={
                     editOrAdd:false,
                 }
			     this.editForm=Object.assign({}, row,result);
                 console.log("fff"+JSON.stringify(this.editForm));
             },
             
			//恢复编辑页面为默认
			clearEdit(){
                this.dialogVisible = false;
                this.showUeEdit=false;
			},
			//删除
			handleDel: function(row) {
                var isgo= this.chkteam();
                if(!isgo)
                {
                    return;
                }

                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                this.listLoading = true;
                    deletestockhistory(row.history_stock_id).then(res=>{
                    var result=res.data;
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

         chkteam(){
             if(this.team_id == "0"){
                 this.$message({
                     message: "该登录帐号没有战队组权限，不能操作！",
                     type: "error"
                 });
                 return false;
             }
             else
             {
                 return true;
             }
         },

        formatfoatcreateTime:function(row, column, cellValue, index){
		   var timestamp = new Date(cellValue);
		   return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
	     },
	    formathtml:function (str) {
            return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
        },
        formatstatus:function(status){
           let str="";
           if(status==0)
           {
              str="调入"; 
           }
           else if(status==1)
           {
               str="持有";
           }
           else if(status==2)
           {
               str="调出";
           }
           return str;
        }


	  },

	  mounted() {
          
          var user = sessionStorage.getItem('user');
          var userArray = JSON.parse(user);
          this.team_id = userArray.team_id;
          this.team_name = userArray.team_name;
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
     .avatar-uploader .el-upload {
         border: 1px dashed #d9d9d9;
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
     }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-row {
        margin-bottom: 20px;
    }

</style>