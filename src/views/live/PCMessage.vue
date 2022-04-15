<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
<!--                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="请输入标签关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.type" placeholder="请选择跟踪状态">
                        <el-option label="请选择跟踪状态" value=""></el-option>
                        <el-option label="跟踪已结束" value="1"></el-option>
                        <el-option label="跟踪未结束" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>-->

                <div>
                    <el-form-item>
                        <el-button type="primary"   @click="handleAdd">新增</el-button>
                    </el-form-item>
<!--                <el-form-item>
                        <el-button type="primary"   @click.native="batchLikeView('like','批量点赞')">批量点赞</el-button>
                        <el-button type="primary"    @click.native="batchLikeView('view','批量浏览')">批量浏览</el-button>
                    </el-form-item>-->
                </div>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" min-width="50"></el-table-column>
            <el-table-column  label="图片" min-width="100">
                <template scope="scope">
                    <img :src="scope.row.picurl" width="100" height="100"  />
                </template>
            </el-table-column>
            <el-table-column prop="tourl" label="跳转地址" min-width="100"></el-table-column>
            <el-table-column prop="subman" label="创建人" min-width="100"></el-table-column>
            <el-table-column prop="createtime" label="创建时间" min-width="100" ></el-table-column>
            <el-table-column prop="flag" label="状态" min-width="100" ></el-table-column>
            <el-table-column prop="type" label="平台" min-width="100" ></el-table-column>
            <el-table-column label="操作"    min-width="100">
                <template  scope="scope">
                    <el-button size="small"  @click.native="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="1" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>


        <el-pagination   @current-change="handleCurrentChange" :current-page="1" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
        </el-pagination>


        <!--新增、修改界面-->
        <el-dialog :title=dialogTitle :visible.sync="FormVisible"   :close-on-click-modal="false" v-on:close="clearEdit"  width="50%">
            <el-form :model="editForm" label-width="110px"  :rules="editFormRules"  ref="editForm">

                <el-form-item label="选择平台:" prop="type">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :disabled=radiodisabled  :label='1'>源达股票</el-radio>
                        <el-radio :disabled=radiodisabled :label='2'>财源股票</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item  label="营销图上传：" prop="picurl">
                    <el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="editForm.picurl"  :src="editForm.picurl"  class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="跳转链接："  prop="tourl">
                    <el-input v-model="editForm.tourl" style="width: 60%"  auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="是否上线:" prop="flag">
                    <el-radio-group v-model="editForm.flag">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="SubmitForm()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {MessageList,MessageSave,MessageEdit,MessageDel} from '../../api/getdatas';

    import qs from 'qs'
    export default {

        data() {
            return{
                datas: [],
                sels:[],//列表选中列
                total: 0,
                page: 1,
                pageSize:5,
                //编辑框表单元素
                editForm:{
                    id:"",
                    flag:"",
                    type:"",
                    picurl:"",
                    tourl:"",
                    subman:""
                },

                editFormRules:{
                    picurl: [
                        { required: true, message: '请选择营销图', trigger: 'blur' }
                    ],
                    tourl: [
                        {required: true, message: '请填写跳转链接', trigger: 'change'}
                    ],
                    flag:[
                        {required: true, message: '是否上线必须选', trigger: 'change'}
                    ],
                    type:[
                        {required: true, message: '平台必须选', trigger: 'change'}
                    ]
                },

                listLoading:false,
                dialogTitle:'',
                editOrAdd:false,//新增或是修改
                FormVisible:false,
                radiodisabled:false,

                editLoading:false,
            }
        },
        methods: {
            getList(){

                let para = {
                    offset: this.page,
                    limit: this.pageSize,
                    //keyword:this.filters.keyword,
                    //type:this.filters.type
                };

                MessageList(JSON.stringify(para)).then((res) =>{
                    for(var i=0;i<res.data.rows.length;i++) {
                        res.data.rows[i].flag = parseInt(res.data.rows[i].flag) == 1 ? "上线状态" : "下线状态";
                        res.data.rows[i].type=parseInt(res.data.rows[i].type)==1?"源达":"财源";
                    }

                    this.datas=res.data.rows;
                    this.total=res.data.total;
                });
            },
            SubmitForm(){
                this.$refs.editForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            if(this.editOrAdd){
                                var admin = sessionStorage.getItem("user");
                                this.editForm.subman= JSON.parse(admin).user_name;

                                let para = Object.assign({}, this.editForm);
                                MessageSave(JSON.stringify(para)).then((res)=>{
                                    if(parseInt(res.data)>0)
                                    {
                                       this.$message({message: '添加成功',type: 'success'});
                                    }
                                    else
                                    {
                                        this.$message({message: '添加失败',type: 'error'});
                                    }
                                    this.FormVisible = false;
                                    this.editLoading = false;
                                    this.getList();
                                });
                            }else{
                                let para = Object.assign({}, this.editForm);
                                MessageEdit(JSON.stringify(para)).then((res)=>{

                                    if(parseInt(res.data)>0)
                                    {
                                        this.$message({message: '修改成功',type: 'success'});
                                    }
                                    else
                                    {
                                        this.$message({message: '修改失败',type: 'error'});
                                    }
                                    this.FormVisible = false;
                                    this.editLoading = false;
                                    this.getList();
                                });
                            }
                        });
                    }
                })
            },
            //删除
            handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    //this.listLoading = true;
                    MessageDel({"id":row.id}).then((res)=>{
                        if(parseInt(res.data)>0)
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
                    });
                })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleAvatarSuccess(res, file) {
                this.editForm.picurl='http://app2.zslxt.com/image/'+ res.message;
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
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            //显示编辑界面
            handleEdit(index, row) {
                this.dialogTitle="编辑";
                this.FormVisible = true;
                this.editOrAdd=false;//改为修改状态
                this.radiodisabled=true;
                this.editForm = Object.assign({}, row);


                if(this.editForm.flag=="上线状态")
                    this.editForm.flag=1;
                else
                    this.editForm.flag=0;

                if(this.editForm.type=="源达")
                    this.editForm.type=1;
                else
                    this.editForm.type=2;
            },
            //显示新增界面
            handleAdd: function (){
                this.dialogTitle = "新增";
                this.editOrAdd=true;
                this.FormVisible = true;
                this.radiodisabled=false;


                this.clearEdit();
            },
            //清空对话框表单。
            clearEdit(){
                var result={
                    id:"",
                    picurl:"",
                    tourl:"",
                    flag:"",
                    type:""
                }
                this.editForm = Object.assign({}, result);
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>
<style>
    /*模态框*/
    .el-dialog.el-dialog--small{
        overflow-x: hidden;
    }
    .el-dialog__body{
        max-height: 800px;
        overflow-y: auto;
        /*            margin-right: -14px;
                    padding-right: 34px;*/
    }
    /*分页栏样式*/
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
    /*上传控件样式*/
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