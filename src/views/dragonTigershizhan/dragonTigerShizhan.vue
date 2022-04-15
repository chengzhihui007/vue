<template>
<el-tabs v-if="$route.path === '/dragonTigerShiZhan'" v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="v.groupsName" :name="v.groupsName" v-for="(v, k) in labelList" :key="k">

    </el-tab-pane>
	<section>

		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input id="stock_name" placeholder="股票名称" v-model="filters.sec_name"></el-input>
					      </el-form-item>

				          <el-form-item>
						    <el-date-picker
								v-model="filters.pub_date"
								type="date"
								placeholder="创建时间">
					  	    </el-date-picker>
					      </el-form-item>

                        <el-form-item>
                            <div v-if="btnAvaliable">
                                <el-button type="primary"  @click="getList()">查询</el-button>
                                <el-button disabled type="primary"@click="addList()">添加</el-button>
                            </div>
                            <div v-else>
                                <el-button type="primary"  @click="getList()">查询</el-button>
                                <el-button :disabled="isDisable==='1'" type="primary"@click="addList()">添加</el-button>
                            </div>
                        </el-form-item>
				</el-form>
			</el-col>
		<!--列表-->
		<el-table ref="multipleTable" :data="DataList"  highlight-current-row v-loading="listLoading" :fit="true"  style="width: 100%;">
			 <!-- <el-table-column prop="id" label="序号" width="120" >
                 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.id }}</div>
                    <div v-else>{{ scope.row.id }}</div>
                </template>
             </el-table-column> -->
              <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    {{DataList.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="sec_name" label="股票名称">
                <template scope="scope">
                    <div v-if="scope.row.is_delete == 1">
                        <div class="deleted-text" v-if="scope.row.sec_name!='今日不推荐' ">{{ scope.row.sec_name+'('+scope.row.sec_code+')'}}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{scope.row.sec_name}}</div>
                        <!-- <div v-else-if="scope.row.is_delete == 1 ">{{scope.row.sec_name}}</div> -->
                        <div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div>
                    </div>
                    <div v-else>
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.sec_name}}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{scope.row.sec_name}}</div>
                        <!-- <div v-else-if="scope.row.is_delete == 1 ">{{scope.row.sec_name}}</div> -->
                        <div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div>
                    </div>
                    <!-- <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.sec_name}}</div>
                    <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{scope.row.sec_name}}</div>
                    <!-- <div v-else-if="scope.row.is_delete == 1 ">{{scope.row.sec_name}}</div> -->
                    <!--<div v-else>{{ scope.row.sec_name+'('+scope.row.sec_code+')' }}</div> -->
                </template>
            </el-table-column>
            <el-table-column prop="stop_loss_position" label="止损位">
                <template scope="scope">
                    <div v-if="scope.row.is_delete == 1">
                        <div class="deleted-text" v-if="scope.row.sec_name!='今日不推荐'">{{ scope.row.stop_loss_position }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐'">{{"——"}}</div>
                        <div v-else>{{ scope.row.stop_loss_position }}</div>
                    </div>
                    <div v-else>
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.stop_loss_position }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                        <div v-else>{{ scope.row.stop_loss_position }}</div>
                    </div>
                    <!-- <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.stop_loss_position }}</div>
                    <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                    <div v-else>{{ scope.row.stop_loss_position }}</div> -->
                </template>
            </el-table-column>
            <el-table-column prop="reasons_concern" label="关注理由">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.reasons_concern }}</div>
                    <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                    <div v-else>{{ scope.row.reasons_concern }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="pub_date" label="发布时间">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.pub_date }}</div>
                    <div v-else>{{ scope.row.pub_date }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="track_date" label="跟踪时间">
                <template scope="scope">
                    <div v-if="scope.row.is_delete == 1">
                        <div class="deleted-text" v-if="scope.row.sec_name !='今日不推荐'">{{ scope.row.track_date }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                        <div v-else>{{ scope.row.track_date }}</div>
                    </div>
                    <div v-else>
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_date }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                        <div v-else>{{ scope.row.track_date }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="track_status" label="跟踪状态">
                <template scope="scope">
                    <div v-if="scope.row.is_delete == 1">
                        <div class="deleted-text" v-if="scope.row.sec_name !='今日不推荐'">{{ scope.row.track_status }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                        <div v-else>{{ scope.row.track_status }}</div>
                    </div>
                    <div v-else>
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_status }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{"——"}}</div>
                        <div v-else>{{ scope.row.track_status }}</div>
                    </div>
                    <!-- <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_status }}</div>
                    <div v-else>{{ scope.row.track_status }}</div> -->
                </template>
            </el-table-column>
            <el-table-column prop="user_id" label="最近操作账号">
                <template scope="scope">
                    <!-- <div v-if="scope.row.is_delete == 1">
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.user_id }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{ scope.row.user_id }}</div>
                        <div v-else>{{ scope.row.user_id }}</div>
                    </div>
                    <div v-else>
                        <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.user_id }}</div>
                        <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{ scope.row.user_id }}</div>
                        <div v-else>{{ scope.row.user_id }}</div>
                    </div> -->
                    <div class="deleted-text">{{ scope.row.user_id }}</div>
                    <!-- <div v-else-if="scope.row.sec_name=='今日不推荐' ">{{ scope.row.user_id }}</div>
                    <div v-else>{{ scope.row.user_id }}</div>  -->
                </template>
            </el-table-column>
		  <el-table-column label="操作" width="300" >
		     <template scope="scope">
                 <div v-if="scope.row.is_delete ==1">
                    <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button disabled size="small" @click="toStockTrack(scope.$index, scope.row)" >股票跟踪</el-button>
				    <el-button disabled type="danger" size="small" @click="handleDel(scope.$index, scope.row)" >已删除</el-button>
                </div>
                <div v-else-if="btnAvaliable">
                    <el-button disabled size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button disabled size="small" @click="toStockTrack(scope.$index, scope.row)"  >股票跟踪</el-button>
				    <el-button disabled type="danger" size="small" @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                </div>
                <div v-else>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.track_status =='已下线'">修改</el-button>
                    <el-button size="small" @click="toStockTrack(scope.$index, scope.row)" :disabled="scope.row.sec_name ==='今日不推荐'">股票跟踪</el-button>
				    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" :disabled="scope.row.track_status =='已下线'" >删除</el-button>
                </div>
                
			</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

		<!--<editOrAdds :dialogTitle=dialogTitle  :dialogVisible=dialogVisible  :editForm=editForm  @func="b"></editOrAdds>-->
		<!--<history :history_dialogVisible=history_dialogVisible :history_editForm=history_editForm :history_showUeEdit=history_showUeEdit  @func_history="b2" @func_UeEdit="b3"></history>-->

		<!--编辑界面-->
		<!-- <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit"  width="50%">
            <el-form :model="editForm" label-width="110px"  :rules="editFormRules" ref="editForm">

                <el-form-item label="股票名称：" prop="sec_name">
                    <el-input v-model="editForm.sec_name" placeholder="股票名称" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                    <el-input v-model="editForm.sec_code" placeholder="股票代码" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                </el-form-item>

                <el-form-item label="止损位：" prop="stop_loss_position">
                    <el-input v-model="editForm.stop_loss_position" placeholder="止损位" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                </el-form-item>

                <el-form-item label="关注理由：">
                   <el-input type="textarea":rows="2"  placeholder="请输入关注理由" style="width:400px" v-model="editForm.reasons_concern"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="SubmitForm()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog> -->
	</section>
</el-tabs>
<router-view v-else></router-view>  
</template>

<script>
    import '../../common/js/DateFormat';
    import util from '../../common/js/util'
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';

  	export default {
  	  data() {			
			return {
                labelList:[{label:"A",name:"A"},{label:"B",name:"B"},{label:"C",name:"C"}],
                activeName:'A',
                dialogTitle:'',
                dialogVisible:false,
                isDisable:'',
                editForm:{},
                select_loading: false,
                listLoading: false,
                editLoading: false,
                FormVisible:false,
                textarea: "",
                sels: [],
                showUeEdit:false,
                DataList: [],
                editFormRules:{},
				editOrAdd:false,
				filters: {
                    sec_name:'',
                    pub_date:''
			    },
				total: 0,
				page: 1,
				size:10,
				currentPage: 1
		    }
         },
    computed: {
            btnAvaliable() {
                for (var i = 0; i < this.labelList.length; i++) {
                    if (this.labelList[i].groupsName === this.activeName) {
                        return this.labelList[i].status == 0;
                    }
                }
            }
        },
	 methods: {
         selsChange: function(sels) {
			    this.sels = sels;
            },
             handleCurrentChange(val) {
                this.page = val;
            },
		   handleCurrentChange(val) {
                this.page = val;
                this.getList()
            },
            async addList(){
                this.editOrAdd = true;
                // this.dialogVisible1 = true;
                this.$router.push({path:'/insert0',query:{editOrAdd:true,activeName:this.activeName,isDisable:this.isDisable}})
            },
            
            //显示编辑界面
            async handleEdit (index, row) {

                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                // this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                this.showUeEdit = true;
                this.$router.push({path:'/insert1',query:{id:row.id,editOrAdd:false,flag:row.flag,activeName:this.activeName}})
            },
            //获取label列表
            async getLabelList(){
              let userId = JSON.parse(sessionStorage.getItem('user')).user_id;
               let menuId = '88'
                let result=await api.findMenuByUserWriter(userId,menuId);
                this.labelList=result.data;
                
                if(this.labelList.length>0){
                    this.activeName=this.labelList[0].groupsName;
                    // alert(this.activeName)
                    this.getList();
                }else{
                    this.datas=[];
                    this.total=0;
                }
            },
            
		//获取列表
            async getList(para){
                para = {
                    page : this.page,
                    size : this.size,
                    sec_name : this.filters.sec_name,
                    pub_time : this.filters.pub_date&&new Date(this.filters.pub_date).format('yyyy-MM-dd'),
                    groups :this.activeName,
                };
                await api.selectShiZhanByPage(para).then(res => {
                //    alert(JSON.stringify(res))
                
                if(res.data == null){
                    let result = null
                    this.DataList = result
                    this.total = 0
                }else{
                    let result=res.data.list;
                    this.total = res.data.total;
                    for(var i=0;i<result.length;i++){
                        var date = new Date(result[i].pub_date);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                        var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                        result[i].pub_date=Y+M+D+h+m;
                        var date1 = new Date(result[i].track_date);
                        var Y1 = date1.getFullYear() + '-';
                        var  M1 = (date1.getMonth()+1 < 10 ? '0'+(date1.getMonth()+1) : date1.getMonth()+1) + '-';
                        var  D1 = (date1.getDate() < 10 ? '0'+(date1.getDate()) : date1.getDate()) + ' ';
                        var  h1 = (date1.getHours() < 10 ? '0'+(date1.getHours()) : date1.getHours()) + ':';
                        var  m1 = (date1.getMinutes() < 10 ? '0'+(date1.getMinutes()) : date1.getMinutes()) + ':';
                        var  s1 = (date1.getSeconds() < 10 ? '0'+(date1.getSeconds()) : date1.getSeconds());
                        result[i].track_date=Y1+M1+D1+h1+m1+s1;
                    }
                        this.DataList = result
                }
                    
                    // alert(JSON.stringify(result))
                   api.getShiZhanFlag(this.activeName).then((data)=>{
                        // alert(JSON.stringify(data))
                        this.isDisable = data.data
                    });
                });
            },
            

            //删除
            async handleDel(index, row) {
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
                    var result= await api.delectShiZhan(row.id);
                    this.listLoading = false;
                    if(result.state){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error('删除失败');
                    }

                    this.getList();
                }).catch(() => {

                });
            },

            

            async toStockTrack(index,row){
                // alert(JSON.stringify(row))
                this.$router.push({path:'/stockTracking',query:{track_id:row.id,sec_name:row.sec_name,sec_code:row.sec_code,groups:this.activeName}})
            },
		 
             
			//恢复编辑页面为默认
			clearEdit(){
                this.dialogVisible = false;
                this.showUeEdit=false;
            },
            handleClick(tab, event) {
            this.getList();
		},
		
        // formatfoatcreateTime:function(row, column, cellValue, index){
		//    var timestamp = new Date(cellValue);
		//    return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
	    //  },
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
        },
        getData() {
        
          this.getLabelList();
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
                if (val.path === '/dragonTigerShiZhan') {
                    this.getData()
                }              
          }
      },
	  mounted () {
        this.getData()          
        


      }
 }
</script>
<style>
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
    .el-message-box__message p:first-child{
    text-align: center;
    }
</style>