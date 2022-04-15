<template    >
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
				<el-input id="lsname" v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="SelName">查询</el-button>
				</el-form-item>
                 <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                        <el-button type="primary"  @click="handleHost">新增主持人</el-button>
                    </el-form-item>
			</el-form>
		</el-col>
        
        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"   hlight-current-row v-loading="listLoading" :fit="true" style="width: 100%;">
            <el-table-column prop="name" label="老师昵称" min-width="100"></el-table-column>
             <el-table-column prop="url" label="介绍链接" min-width="100"></el-table-column>
            <el-table-column label="头像" width="200">
                <template scope="scope">
                    <img :src="scope.row.headImg" width="100" height="100"  />
                </template>
            </el-table-column>
          <el-table-column prop="type" label="类型" min-width="100"  :formatter="formatfoattype"></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row,scope.row.type)">编辑</el-button>
                <el-button type="danger" size="small"  @click="handleJy(scope.$index, scope.row.team_id)" v-if="scope.row.del_flag==0">停用</el-button>
                 <el-button type="danger" size="small"  @click="handleQy(scope.$index, scope.row.team_id)" v-else="">启用</el-button>
                <el-button size="small" v-if="scope.$index==0 && zhiding==0" >置顶</el-button>
                <el-button size="small" v-else-if="scope.row.del_flag==1" >置顶</el-button>
                 <el-button type="danger" size="small"  @click="handletop(scope.$index,  scope.row.team_id)" v-else >置顶</el-button>
                  
            </template>
            </el-table-column>
        </el-table>
<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  :close-on-click-modal="false">
           <!--新增/编辑界面老师-->
           <div >
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="类型："  v-model="editForm.type" prop="type" >
                    <p>老师</p>
                 </el-form-item>
                <el-form-item prop="name" label="战队名称：">
                   <el-input  v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="special" label="战队特点：">
                   <el-input  v-model="editForm.special" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="战队简介：" prop="introduce">
					<el-input type="textarea" :rows="5" :onkeyup="checkContent(editForm.introduce)"    v-model="editForm.introduce"></el-input>
                     {{this.checkMsg}}
				</el-form-item>
                <el-form-item prop="url" label="跳转链接：">
                   <el-input  v-model="editForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item  label="上传头像："   prop="headImg" >
                    <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="editForm.headImg" :src="editForm.headImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                <el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                  </div>
             </div>
            
        </el-dialog>
         <el-dialog :title=dialogTitlehost :visible.sync="dialogVisiblehost"  :close-on-click-modal="false">
            
             <div> 
                 <el-form :model="editFormHost" label-width="150px" :rules="editFormRulesHost" ref="editFormHost">
                <el-form-item label="类型："  v-model="editFormHost.type" prop="type" >
                      <p >主持人</p>
                 </el-form-item>
                <el-form-item prop="name" label="战队名称：">
                   <el-input  v-model="editFormHost.name" auto-complete="off"></el-input>
                </el-form-item>
              
                <el-form-item prop="url" label="跳转链接：">
                   <el-input  v-model="editFormHost.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item  label="上传头像："   prop="headImg" >
                    <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccesshost" :before-upload="beforeAvatarUpload">
                        <img v-if="editFormHost.headImg" :src="editFormHost.headImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                <el-button @click.native="dialogVisiblehost = false;clearEditHost()">取消</el-button>
                <el-button type="primary" @click.native="editSubmitHost" :loading="editLoading">提交</el-button>
                  </div>

             </div>
         </el-dialog>
     </section>
</template>

<script>
    import {selTeamName,getReName,setjy,setqy,settop,getTeam,updateTeam,addTeam} from "../../api/ydApi.js";
    import {imageDefault} from "../../common/js/urls";
    import $ from 'jquery';
    export default {
       data() {
           var checkname = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };
            return {
              //  type:"",
               checkMsg:"",
               filters: {
					name: ''
				},
                dialogTitle: "新增",
                dialogTitlehost:"编辑",
                editOrAdd:false,
                editOrAddhost:false,
                datas:[],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                headImg:"",
                zhiding:0,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
               dialogVisiblehost: false,//主持人编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    name:"",
                    special:"",
                    introduce:"",
                    headImg:"",
                    url:""
                },
                editFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { validator: checkname, message: "限6个汉字以内", trigger: "blur", num: 13 }
                    ],
                    special: [
                        { required: true, message: '请输入特点', trigger: 'blur' },
                        { validator: checkname, message: "限8个汉字以内", trigger: "blur", num: 17 }
                    ],
                    introduce: [
                        { required: true, message: '请输入简介', trigger: 'blur' },
                        { validator: checkname, message: "限80个汉字以内", trigger: "blur", num: 161 }
                    ],
                    url: [
                        {required: true, message: '请输入跳转链接：', trigger: 'change'}
                    ],
                   headImg: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ] 
                },
                 //编辑界面数据主持人
                editFormHost: {
                    name:"",
                    special:"",
                    introduce:"",
                   // type:1,
                    headImg:"",
                    url:""
                },
                editFormRulesHost: {
                     name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { validator: checkname, message: "限6个汉字以内", trigger: "blur", num: 13 }
                    ],
                 headImg: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ] 
                }
            }
        },
        methods: {
                getStrLenght(introduce) {
            var len=0;
                for (var i = 0; i < introduce.length; i++) {
                    var a = introduce.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//判断如果输的是汉字，字符串长度+2
                        len += 1;
                    }
                    else {
                        len += 0.5;
                    }
                }
                return len;
        },
           checkContent(introduce){
                let  len =    this.getStrLenght(introduce);
                this.checkMsg = len+"/80";
           },
             handleCurrentChange(val) {
                 this.zhiding=0;
               this.page = val;
               if(parseInt(val)>1)
               {
                 this.zhiding=1;
               }
               let  para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                 };
           this.TeamList(para);
            },
            async SelName(){
                 selTeamName(document.getElementById("lsname").value.trim()).then(res => {
                 this.datas=lists;
                  })
           },
           //列表
            async TeamList(para) {
                getTeam(para).then(res => {
                    let result=res.data;
                   this.total = result.total;
                   this.datas=result.list;
                })
            },
            //控制置顶
           handletop: function (index,id) {
               this.$confirm('确认置顶吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                       settop(id).then(res => {
                        this.listLoading = false;
                        let  para = {
                            pageNo: this.page,
                             pageSize:this.pageSize,
                          };
                        this.TeamList(para);
                         })
                    }).catch(() => {

                    });
            },
            //控制停用启用
           handleJy: function (index,id) {
               this.$confirm('确认停用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                      
                        setjy(id).then(res => {
                        this.listLoading = false;
                        let  para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    };
                        this.TeamList(para);
                    }).catch(() => {
                        });
                    });
            },
            handleQy: function (index,id) {
               this.$confirm('确认启用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        setqy(id).then(res => {
                        this.listLoading = false;
                        let  para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    };
                        this.TeamList(para);
                    }).catch(() => {
                       });
                    });
            },
            //显示编辑界面
            async handleEdit (index,row,type) {
              
               console.log(type);
                //判断主持人老师
                if(type==0)//老师
                {
                    this.dialogTitle = "编辑";
                    this.dialogVisible = true;
                     this.editOrAdd = false;
                   this.editForm = Object.assign({}, row);
                 }
                else
                {
                    this.dialogTitlehost = "编辑";
                    this.dialogVisiblehost = true;
                    this.editOrAddhost = false;
                   this.editFormHost = Object.assign({}, row);
                }
             },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
               this.dialogVisible = true;
              },
             //显示新增界面主持人 
            handleHost: function () {
                this.dialogTitlehost = "新增";
                this.editOrAddhost = true;
               this.dialogVisiblehost = true;
             },
            //提交
            async editSubmit() {
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                         this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                             this.editLoading = true;
                            if(this.editOrAdd){
                                 //判断是否重名
                         this.editForm.type=0;
                        let strname=this.editForm.name+','+this.editForm.type;
                       
                          if(strname)
                            {
                                 getReName(strname).then(res => {
                               let result=res.data;
                             if(result==0)
                               {
                                   this.$message({
                                    message: '老师名称重复，请重新添加！',
                                   type: 'success'
                                  });
                                   
                                }
                                else
                                {
                                        this.editForm.type=0;
                                       let para = Object.assign({}, this.editForm);
                                      
                                       addTeam(para).then(res => {
                                        this.dialogVisible = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.editLoading = false;
                                        var para1 = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                        };
                                        
                                        this.TeamList(para1);
                                    });
                                }
                            });
                                }
                            }else{
                               
                                let para = Object.assign({}, this.editForm);
                                updateTeam(para).then(res => {
                                        this.dialogVisible = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.editLoading = false;
                                        var para1 = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                        };
                                        
                                        this.TeamList(para1);
                                    });
                            }
                          
                        });
                      
                       }
                });
            },
            //提交主持人
            async editSubmitHost() {
               this.$refs.editFormHost.validate(async (valid1) => {
                    if (valid1) {
                     this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                             this.editLoading = true;
                            if(this.editOrAddhost){
                                this.editFormHost.type=1;
                                //判断是否重名
                                 let strname=this.editFormHost.name+','+this.editFormHost.type;
                                 if(strname)
                                   {
                                      getReName(strname).then(res => {
                                     let result=res.data;
                                   if(result==0)
                                      {
                                           this.$message({
                                              message: '主持人名称重复，请重新添加！',
                                             type: 'success'
                                       });
                                    }
                                    else{
                                        this.editFormHost.type=1;
                                     let para = Object.assign({}, this.editFormHost);
                                     addTeam(para).then(res => {
                                        this.dialogVisible = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.editLoading = false;
                                        var para1 = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                        };
                                        
                                        this.TeamList(para1);
                                    });
                                    }
                             });
                                     
                                 }
                            }else{
                                let para = Object.assign({}, this.editFormHost);
                                  updateTeam(para).then(res => {
                                        this.dialogVisible = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.editLoading = false;
                                        var para1 = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                        };
                                        
                                        this.TeamList(para1);
                                    });
                            }

                            this.dialogVisible = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.editLoading = false;
                            let  para = {
                              pageNo: this.page,
                             pageSize:this.pageSize,
                           };
                            this.TeamList(para);
                           
                        });
                       }
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                var result={
                    name:"",
                    headImg:"",
                    special:"",
                    introduce:"",
                   
                    url:""
                }
                this.editForm = Object.assign({}, result);
            },
             //恢复编辑页面为默认
            clearEditHost(){
                var result={
                    name:"",
                    headImg:"",
                    url:""
                }
                this.editFormHost = Object.assign({}, result);
            },
            handleAvatarSuccess(res, file) {//老师
              this.editForm.headImg =imageDefault + res.message;
            },
            handleAvatarSuccesshost(res, file) {//主持人
              this.editFormHost.headImg =imageDefault + res.message;
            },
            beforeAvatarUpload(file) {
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
           formatfoattype:function(row){
                return row.type==0?"老师":"主持人";
            },
            strlen(str) {
               var len = 0;
               for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
               //单字节加1
              if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                 len++;
                 } else {
               len += 2;
             }
           }
             return len;
           },
          },
        mounted() {
            let  para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                 };
            this.TeamList(para);
         }
    }
</script>


<style  >
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
</style>