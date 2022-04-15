<template    >
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="queryForm">
				<el-form-item>
				<el-input id="lsname" v-model="queryForm.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getTeacherList()">查询</el-button>
				</el-form-item>
                 <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                    </el-form-item>
			</el-form>
		</el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"   hlight-current-row v-loading="listLoading" :fit="true" style="width: 100%;">
            <el-table-column prop="name" label="昵称" min-width="60"></el-table-column>
             <el-table-column prop="url" label="介绍链接" min-width="100"></el-table-column>
            <el-table-column label="头像" width="200">
                <template scope="scope">
                    <img :src="scope.row.headImg" width="100" height="100"  />
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="20"  :formatter="formatfoattype"></el-table-column>
            <el-table-column label="执业资格介绍" min-width="100" prop="description"></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"  @click="handleJy(scope.$index,  scope.row.person_id)" v-if="scope.row.del_flag==0">停用</el-button>
                 <el-button type="danger" size="small"  @click="handleQy(scope.$index,  scope.row.person_id)" v-else="">启用</el-button>
                <el-button size="small" v-if="scope.$index==0 && zhiding==0" >置顶</el-button>
                <el-button size="small" v-else-if="scope.row.del_flag==1" >置顶</el-button>
                 <el-button type="danger" size="small"  @click="handletop(scope.$index,  scope.row.person_id)" v-else >置顶</el-button>

            </template>
            </el-table-column>
        </el-table>
<el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  :close-on-click-modal="false">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="选择类型：" prop="type" >
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label=0  >老师</el-radio>
                        <el-radio :label=1 >主持人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="name" :label="typeName">
                   <el-input  v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item prop="url" label="介绍链接：">
                   <el-input  v-model="editForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item  label="上传头像："   prop="headImg" >
                    <el-upload class="avatar-uploader"
                               action="/api/file/imageUpload/"
                               :show-file-list="false"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload"
                               :http-request="fnUploadRequest">
                        <img v-if="editForm.headImg" :src="editForm.headImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="执业资格介绍" prop="description">
                    <el-input type="textarea" :rows="4"  v-model="editForm.description" placeholder="请务必正确填写执业资格信息，资格信息会根据发布内容展示在用户端，不超过50个汉字，例：投资顾问A，执业证书编号A00000000001"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
     </section>
</template>

<script>
    import api from '../../api/api.js';
    import utils from '../../api/utils.js';
    import {imageDefault} from "../../common/js/urls";
    export default {
       data() {
           window.type_name = '老师';
           var checkname = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };

           var checkDescription = (rule, value, callback) => {
               setTimeout(() => {
                   if (this.strlen(value) > rule.num) {
                       callback(new Error("字数超过限制！"));
                   } else {
                       callback();
                   }
               }, 500);
           };
            return {
                type:0,
               query: {
					name: ''
				},
				queryForm: {
                    name: ''
                },
                dialogTitle: "新增",
                editOrAdd:false,
                datas:[],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                headImg:"",
                zhiding:0,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                    name:"",
                    type:"",
                    headImg:"",
                    url:"",
                    description:""
                },
                editFormRules: {
                    name: [
                        { required: true, message: '请填写老师名称', trigger: 'blur' },
                        { validator: checkname, message: "昵称在10个汉字以内", trigger: "blur", num: 20 }
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ],
                    url: [
                        {required: false, message: '请选择类型', trigger: 'change'},
                        {validator:(rule, value, callback)=>{
                            try{
                                if(value && !/^(http|https)/i.test(value)){
                                    callback(new Error("请输入带有http或https协议的地址"))
                                   return
                                }
                                if (value) {
                                    new URL(value)
                                }
                            }catch(e){
                                callback(new Error("请输入正确链接地址"))
                            }
                            callback()
                        },trigger: 'blur'}
                    ],
                    headImg:[
                        {required: true, message: '请上传头像', trigger: 'change'}
                    ],
                    description: [
                        {required: true, message: '请填写执业资格介绍', trigger: 'blur'},
                        {validator: checkDescription, message: "执业资格介绍在50个汉字以内", trigger: "blur", num: 100 }
                    ]
                },
                typeName: '昵称'
            }
        },
        watch: {
            editForm:{
                //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
                handler(curVal,oldVal){
                    if (curVal.type === 0) {
                        this.typeName = '老师昵称';
                        this.editFormRules.name[0].message = '请填写老师名称';
                        //this.$refs.editForm.validate();
                        this.$refs.editForm.clearValidate()
                    } else if (curVal.type === 1) {
                        this.typeName = '主持人昵称';
                        this.editFormRules.name[0].message = '请填写主持人名称';
                        // this.$refs.editForm.validate();
                        this.$refs.editForm.clearValidate()
                    }

                },
                deep:true
            }
        },
        methods: {
             handleCurrentChange(val) {
                 this.zhiding=0;
               this.page = val;
               if(parseInt(val)>1)
               {
                 this.zhiding=1;
               }
              // let  para = {
                   this.query.pageNo=this.page;
                    this.query.pageSize=this.pageSize;
                // };
               this.TeacherList(this.query);

            },
       /*      async SelTeacherName(){
			  let lists=await api.selTeacherName(document.getElementById("lsname").value.trim());
                 this.datas=lists;
           }, */
           //老师列表
            async TeacherList(query, val) {
                if (val != null && val != '') {
                    this.query.pageNo = val;
                    this.page = val;
                }
               let result=await api.getTeacher(this.query);
                 this.total = result.total;
                   this.datas=result.list;
            },
            async getTeacherList() {
                this.query.name = this.queryForm.name;
                this.query.pageNo = 1;
                this.page = 1;
                let result=await api.getTeacher(this.query);
                this.total = result.total;
                this.datas=result.list;
            },
            //控制置顶
           handletop: function (index,id) {

               this.$confirm('确认置顶吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let result=await api.settop(id);
                        this.listLoading = false;
                       // let  para = {
                   this.query.pageNo=this.page;
                   this.query.pageSize=this.pageSize;
                  //  };
                  this.TeacherList(this.query);


                    }).catch(() => {

                    });
            },
            //控制停用启用
           handleJy: function (index,id) {
               this.$confirm('确认停用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let result=await api.setjy(id);
                        this.listLoading = false;
                       // let  para = {
                    this.query.pageNo= this.page,
                    this.query.pageSize=this.pageSize
                   // };
                       this.TeacherList(this.query);

                        //this.SelTeacherName();
                    }).catch(() => {

                    });
            },
            handleQy: function (index,id) {
               this.$confirm('确认启用吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        let result=await api.setqy(id);
                        this.listLoading = false;
                       // let  para = {
                    this.query.pageNo = this.page,
                    this.query.pageSize=this.pageSize
                     this.TeacherList(this.query);
                   // };
                    }).catch(() => {

                    });
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "编辑";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
                //this.$refs["editForm"].resetFields();//去除验证
             },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.clearEdit()
            },
            //提交
            async editSubmit() {
                 if(this.editForm.name.match(/^[ ]*$/)){
                    this.$message({
                        message: this.typeName + "不能输入空格!",
                        type: "error"
                    });
                    return false;
                }


                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {

                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            if(this.editOrAdd){
                                //判断是否重名
                        let strname=this.editForm.name+','+this.editForm.type;
                        if(strname)
                        {
                            let result=await api.getReName(strname);
                            if(result==0) {
                                this.$message({
                                    message: this.typeName + '重复，请重新添加！',
                                    type: 'error'
                                });
                                this.editLoading = false;
                                return;

                            }  else {
                                let para = Object.assign({}, this.editForm);
                                await api.addTeacher(para)
                            }

                        }
                          }else{
                                let para = Object.assign({}, this.editForm);
                                await api.updateTeacher(para)
                            }
                            this.dialogVisible = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.editLoading = false;
                            //let  para = {
                    this.query.pageNo=this.page;
                    this.query.pageSize=this.pageSize;
                     this.TeacherList(this.query);
                   // };
                        });
                    }
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                var result={
                    name:"",
                    type:"",
                    headImg:"",
                    url:""
                }
                this.editForm = Object.assign({}, result);
            },
            handleAvatarSuccess(res, file) {
                //let strurl=this.globalHttpUrl;

                //  this.editForm.headImg ='http://192.168.11.103:10001/image/' + res.message;
              //  this.editForm.headImg ='http://app2.zslxt.com/image/' + res.message;
              // this.editForm.headImg =imageDefault + res.message;
            },
            fnUploadRequest(option) {
                utils.ossput(new Date().getTime().toString(), option.file).then(res => {
                    this.editForm.headImg = res.url;
                });
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type == 'image/jpeg';
                const isPNG = file.type == 'image/png';
                 const isLt2M = file.size / 1024 / 1024 < 0.5;
                 if (!isJPG&&!isPNG) {
                    this.$message.error('图片格式不正确');
                    return false;
                 }

                 if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 500KB!');
                 }
                 return (isPNG || isJPG) && isLt2M;
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
           // let  para = {
                   this.query.pageNo=this.page;
                   this.query.pageSize=this.pageSize;
                  this.TeacherList(this.query);
             //    };

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
    .el-textarea {
        resize:none;
    }
</style>
