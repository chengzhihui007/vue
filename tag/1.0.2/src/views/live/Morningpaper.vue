<template>
    <section>
        <template>
            <el-row>
                <el-col :span="24">  
                    <div class="tip">
                        <p>每日晨报<el-button type="primary" @click="handleAdd()" style="margin-left:5rem">新增</el-button></p>
                    </div> 
                </el-col>               
                <el-col :span="24">
                    <el-table :data="papers" highlight-current-row v-loading="loading" style="width: 100%;">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column prop="id" align="center" width="60" label="id">
                        </el-table-column>
                        <el-table-column prop="title" align="center" label="标题">
                        </el-table-column>
                        <el-table-column align="center" label="文件">
                            <template slot-scope="scope">
                                <el-button type="text" @click="open5(scope.row.pdffile)">点击预览</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="update_time" align="center" label="上传时间">
                        </el-table-column>                        
                        <el-table-column label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pagesize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totals">
                </el-pagination>
            </div>
            <!--弹窗数据-->
            <el-dialog title="编辑晨报" :visible.sync="editclass" width="30%" center>
                <el-form :model="editruleForm"  ref="editruleForm" label-width="100px"
                         class="demo-ruleForm">                    
                    <el-form-item label="晨报名称" prop="title">
                        <el-input style="width: 46%;" v-model="editruleForm.title"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editclass = false">取 消</el-button>
                    <el-button type="primary" @click="submiteditForm('editruleForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!--弹窗数据-->
            <el-dialog title="添加晨报" :visible.sync="addFormLoading" width="30%" center>
                <el-form :model="addForm"  ref="addForm" label-width="100px"
                         class="demo-ruleForm">                    
                    <el-form-item label="晨报名称:" prop="title">
                        <el-input style="width: 46%;" v-model="addForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="图片地址:" prop="pdffile">
                        <el-upload
                        action="http://ydgpzbj.ydtg.com.cn:84/index/yapi/paperimgup"
                        list-type="picture-card"
                        name="pdffile"
                        :limit="1"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :before-upload="beforeAvatarUpload"
                        :on-exceed="limitmessage"
                        :auto-upload="false">
                        <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editclass = false">取 消</el-button>
                    <el-button type="primary" @click="submiteditForm('addForm')">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </section>
</template>

<script>
    import {mpaper} from '../../api/getdatas';

    export default {
        data() {
            return {
                pagesize:10,
                currentPage:1,
                totals:400,                
                loading: false,
                dialogImageUrl: "",
                dialogVisible: false,
                uploading:true,
                papers: [],
                ruleForm: {
                    id:'',
                    title:'',
                    pdffile:''  
                },               
                editclass: false,
                addFormLoading:false,
                editruleForm:{
                    id:'',
                    title:'',
                    pdffile:''                    
                },
                addForm:{
                    id:'',
                    title:'',
                    pdffile:''  
                }              
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
                this.addForm.pdffile = file.url;                
            },
            limitmessage(){
                this.$message.error('只能上传一张图片');
            },
            handleAdd(){
                 this.addFormLoading = true;
            },
            handleEdit(index, row) {
                this.editclass = true;
                this.editruleForm.tid = row.nickname
                this.editruleForm.title = row.title
                this.editruleForm.start = row.start
                this.editruleForm.end = row.end
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleDel: function (index, row) {
                console.log(index)
                console.log(row)
            },
            getpaper: function () {
                let para={
                    pagesize:this.pagesize,
                    page:this.currentPage
                }
                mpaper(para).then((res) => {                    
                    this.papers = res.data.data                    
                    this.totals = res.data.total
                });
            },
            submitForm(formName) {
                   
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         alert('submit!');
                //     } else {
                //         console.log('error submit!!');
                //         return false;
                //     }
                // });
            },
            submiteditForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.getpaper()                
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getpaper()
            },
            open5(val) {
                this.$alert('<img src="'+val+'" width="100%">', '预览', {
                    dangerouslyUseHTMLString: true
                });
            }
        },
        mounted() {
            this.getpaper()
        }
    }
</script>
<style>
    .block{
        margin: 15px 0;
        
    }
</style>




