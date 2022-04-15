<template>
	<section>
        <div class="head">{{sec_name+'('+sec_code+')'}}</div>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form>
        <el-form-item>
                <el-button :disabled="isXX =='已下线'" type="primary"@click="handleAdd">添加</el-button>
        </el-form-item>
        </el-form>
        </el-col>
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
            <el-table-column prop="track_date" label="跟踪时间">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_date }}</div>
                    <div v-else>{{ scope.row.track_date }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="track_status" label="跟踪状态">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_status }}</div>
                    <div v-else>{{ scope.row.track_status }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="track_content" label="跟踪内容">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.track_content }}</div>
                    <div v-else>{{ scope.row.track_content }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="user_id" label="最近操作账号">
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.is_delete == 1">{{ scope.row.user_id }}</div>
                    <div v-else>{{ scope.row.user_id }}</div>
                </template>
            </el-table-column>
		  <el-table-column label="操作" width="300">
		     <template scope="scope">
                <div v-if="scope.row.is_delete ==1">
                    <el-button disabled size="small" @click="stockTrack(scope.$index, scope.row)">修改</el-button>
				    <el-button disabled type="danger" size="small"  @click="handleDel(scope.row)">已删除</el-button>
                </div>
                <!-- <div v-else>
                    <el-button size="small" @click="stockTrack(scope.$index, scope.row)" :disabled="scope.row.track_status =='已下线'">修改</el-button>
				    <el-button type="danger" size="small"  @click="handleDel(scope.row)" :disabled="scope.row.track_status =='已下线'">删除</el-button>
                </div> -->
                <div v-else>
                    <el-button size="small" @click="stockTrack(scope.$index, scope.row)" :disabled="scope.row.statu ===1||scope.row.track_status =='已下线'">修改</el-button>
				    <el-button type="danger" size="small"  @click="handleDel(scope.row)" :disabled="scope.row.statu ===1">删除</el-button>
                </div>
			</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

		<!--编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync=dialogVisible  :close-on-click-modal="false" v-on:close="clearEdit">
			<el-form :model="editForm" label-width="150px"  :rules="rules" ref="editForms">

				<el-form-item label="股票名称：" prop="sec_name">
                    <el-input disabled v-model="editForm.sec_name" placeholder="股票名称" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
				</el-form-item>

				<el-form-item label="跟踪状态:" :required="true" prop="track_status">
					<el-radio-group v-model="editForm.track_status" >
                        <el-radio label="调入" :disabled="track_status == '调出'|| track_status == '持有'||track_status == '调入'">调入</el-radio>
						<el-radio label="持有" :disabled="track_status =='调出'">持有</el-radio>
						<el-radio label="调出">调出</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="跟踪内容："  prop="track_content">
					<el-input type="textarea" :rows="2"  placeholder="请输入跟踪内容" style="width:400px" v-model="editForm.track_content"></el-input>
				</el-form-item>
                <el-form-item  label="内容图片：" prop="content_img" >
                    <el-upload 
                        class="avatar-uploader" 
                        action="/api/file/imageUpload/"
                        accept="image/*" 
                        :show-file-list="false"
                        :limit="1" 
                        :file-list="editForm.fileList"
                        :on-remove="handleRemove"
                        :on-exceed="handleExceed"
                        :on-success="handleImageSuccess" 
                        :before-upload="beforeImageUpload">
                        <img v-if="editForm.content_img" :src="editForm.content_img" class="avatar"></img>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
import '../../common/js/DateFormat';
    import util from '../../common/js/util'
    import {imageDefault} from "../../common/js/urls";
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';

  	export default {
  	  data() {			
			return { 
                isXX:'',
                dialogTitle:'',
                dialogVisible:false,
                track_status_add:'',
                track_status:'',
                editForm:{ fileList:[]},
                sec_name:'',
                sec_code:'',
                id:'',
                select_loading: false,
                listLoading: false,
                editLoading: false,
                select_options: [],//键盘宝
                showUeEdit:false,

                alertmsg:"操作成功",
                alerttype:"success",

				editOrAdd:false,
				DataList: [],
				total: 0,
				page: 1,
				size:10,
				currentPage: 1,
                team_id:'',
                team_name:'',
                rules: {
                    track_content: [ 
                        {required: true, message: '请填写操作提示，不超过500个汉字', trigger: 'blur'},
                        {max: 500, message: '内容不超过500个汉字', trigger: 'blur'} 
              ]
                },
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
             handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleImageSuccess(res, file) {
              this.editForm.content_img =imageDefault + res.message;
            },
            handleRemove(response, fileList) {
                this.editForm.content_img = "";
            },   
            handleImageSuccessAdd(res, file) {
              this.addForm.content_img =imageDefault + res.message;
            },
            handleRemoveAdd(response, fileList) {
                this.addForm.content_img = "";
            },          
            beforeImageUpload(file) {
                /* const isJPG = file.type === 'image/jpeg';
                 const isLt2M = file.size / 1024 / 1024 < 2;
                 if (!isJPG) {
                 this.$message.error('上传头像图片只能是 JPG 格式!');
                 }
                 if (!isLt2M) {
                 this.$message.error('上传头像图片大小不能超过 2MB!');
                 }
                 return isJPG && isLt2M;*/
                return true;
            },    
         handleImageSuccess(res, file) {
            console.log(res);
            
            //  alert()
            this.editForm.content_img =imageDefault + res.message;
        },
          handleCurrentChange(val) {
                this.page = val;
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
             var _this = this
            //  alert(JSON.stringify(this.editForm))   //'dfasd(999998)'
             let name = this.editForm.sec_name
            //  var name1 = name.substring(name.indexOf("(")+1,name.indexOf(")"))
            var name1 = name.substring(0,name.indexOf("("))
            //  var name1 = name.match(/\((.+)\)/g)
            //  alert(name1)
          this.$refs.editForms.validate((valid) => {
             if (valid) {
             this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                 this.editLoading = true;
                 let result={};
                 let user = JSON.parse(sessionStorage.getItem('user'));
                 this.editForm.user_id = user.user_name
                 let para = Object.assign({}, this.editForm);
                 var name = para.sec_name
                 var sec_code = name.substring(name.indexOf("(")+1,name.indexOf(")"))
                 var sec_name = name.substring(0,name.indexOf("("))
                 para.sec_name = sec_name
                 para.sec_code = sec_code
                 para.combat_id = this.$route.query.track_id
                 var track_status = para.track_status
                 para.track_status = track_status.toString()
                //  alert(JSON.stringify(para))
                 if(this.editOrAdd){
                     result= await api.addStockTracking(para);
                     
                 }else{
                     result= await api.updateStockTracking(para);
                 }
                 this.FormVisible = false;
                if(result.state){
                    this.$message({message: '提交成功',type: 'success'});
                }else{
                    this.$message.error('提交失败');
                }


                 this.clearEdit();
                 this.$message({
                     message: this.alertmsg,
                     type: this.alerttype
                 });
                 this.editLoading = false;
                 this.list()
             });
            }
           })
         },



         listenThisUe(thisUe){
             this.editForm[thisUe.name] = thisUe.data;
             return thisUe
         },
		   handleCurrentChange(val) {
                this.page = val;
                var para = {
                    page:this.page,
                    size:this.size
                };
				this.list(para);
            },
            
			
			//获取列表
         async list(){
                var sec_code = this.$route.query.sec_code
                this.sec_code = sec_code
		        let para = { 
		        page: this.page,
                size: this.size,
                combat_id: this.$route.query.track_id
                };
                
                console.log("aaa:::",para);
             await api.getStockTrackingList(para).then(res=>{
                    
                    // console.log(JSON.stringify(res));
                    
                    // let arr = [];
                    let lists=res.data.result;
                    console.log(JSON.stringify(lists));
                    
                    this.total = res.data.total;
                    for(let i=0;i<lists.length;i++){
                        var date = new Date(lists[i].track_date);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                        var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                        lists[i].track_date=Y+M+D+h+m;
                    }
                    this.DataList=lists;
                    this.isXX = this.DataList[0].track_status;
                })
                var param = this.$route.query.sec_code
               await api.getNewStockStatus(param).then(res=>{
                   console.log (JSON.stringify(res))
                   if(res.data != null){
                       this.track_status_add = res.data.track_status
                   }
                   

                   
               }) 
		   },

			 handleAdd: function() {
                //  console.log(JSON.stringify(this.editForm));
                 
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.editForm = {
                    sec_name: this.sec_name+'('+this.sec_code+')',
                    track_status: this.track_status_add,
                    content_img:'',
                    track_content:'',
                    fileList:[]
                };
                this.track_status=this.track_status_add;
                // this.clearEdit();
            },

             async stockTrack(index, row) {
                this.editOrAdd = false;
                this.dialogVisible = true;
                this.editForm = {
                    id:row.id,
                    sec_name: row.sec_name+'('+row.sec_code+')',
                    // sec_code: row.sec_code,
                    track_status: row.track_status,
                    track_content:row.track_content,
                    content_img:row.content_img,
                    track_date: new Date().format('yyyy-MM-dd hh:mm:ss')
                };
                this.dialogTitle="编辑";
                this.track_status= row.track_status
            },
             
			//恢复编辑页面为默认
			clearEdit(){
                this.dialogVisible = false;
                this.showUeEdit=false;
			},
			//删除
			handleDel: function(row) {
                // alert(JSON.stringify(row))
            const confirmText = [row.sec_name +"("+row.sec_code+")", '若确认删除则不可恢复，确定要删除该股票吗?'] 
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
                  await  api.deleteStockTracking(row.id).then(res=>{
                      console.log(res);
                      
                    // var result=res.data;
                    if (res.state) {
                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        
                    } else {
                        this.listLoading = false;

                        this.$message({
                            message: "删除失败",
                            type: "error"
                        });
                        
                    }
                    this.list();
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
        //  var track_id = this.$route.query.track_id
        
        //  this.id = track_id
        //   alert(this.id)
         var sec_name = this.$route.query.sec_name
         this.sec_name = sec_name
         var sec_code = this.$route.query.sec_code
         this.sec_code = sec_code
        //  alert(track_id + sec_name +sec_code)


      }
 }
</script>
<style>
.deleted-text{
        color: #999999;
    }
.head{
    font-weight: 500;
    font-size: 20px;
    border-bottom: 2px solid rgb(177, 172, 172);
}
.el-dialog.el-dialog--small{
        overflow-x: hidden;
        font-size: 12px;
        border-bottom: 1px solid blanchedalmond;
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