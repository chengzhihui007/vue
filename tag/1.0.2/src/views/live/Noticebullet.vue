<template>
    <section  class="mtop">
        <template>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <el-tag>弹幕添加</el-tag>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23" style="margin-top:10px">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="弹幕内容" prop="content">
                            <el-input placeholder="请输入内容" value="" v-model="ruleForm.content" style="width:0rem;">
                                <el-button slot="append" type="primary" @click="submitForm()">发送</el-button>
                            </el-input>
                        </el-form-item>  
                    </el-form>
                </el-col>
            </el-row>
            <!--弹窗数据-->
            <el-dialog title="编辑广告" :visible.sync="editadvclass" width="30%" center>
                <el-form :model="editadbruleForm" :rules="editadvrules" ref="editadbruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="图片">
                        <el-upload
                                action="https://jsonplaceholder.typicode.com/posts/"
                                list-type="picture-card"
                                :limit="1"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="是否启用">
                        <el-switch v-model="editadbruleForm.static"></el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editadvclass = false">取 消</el-button>
                    <el-button type="primary" @click="submitadveditForm('editadbruleForm')">确 定</el-button>
                </div>
            </el-dialog>

            <el-row style="margin-top: 30px;">
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <el-tag type="danger">公告管理</el-tag>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-table :data="notices" highlight-current-row v-loading="loading" style="width: 100%;">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column align="center" prop="id" width="60" label="id">
                        </el-table-column>
                        <el-table-column align="center" prop="contents" label="内容">
                        </el-table-column>
                        <el-table-column align="center" prop="create_time" label="创建时间">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button size="small" type="primary" plain
                                           @click="handleEdit(scope.$index, scope.row)">修改
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!--弹窗数据-->
            <el-dialog title="编辑公告" :visible.sync="editclass" width="30%" center>
                <el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="内容" prop="contents">
                        <el-input type="textarea" autosize v-model="editruleForm.contents"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editclass = false">取 消</el-button>
                    <el-button type="primary" @click="submiteditForm('editruleForm')">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </section>
</template>

<script>
    import {noticelist, seedbarrage,noticeup} from '../../api/getdatas';
    import qs from 'qs'
    export default {
        data() {
            return {
                filters: {
                    real_name: ''
                },
                loading: false,
                notices:[],
                ruleForm: {
                    contents: ''
                },
                rules: {
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'}
                    ]
                },
                editclass: false,
                editadvclass: false,
                editruleForm: {
                    contents: ''
                },
                editrules: {
                    contents: [
                        {required: true, message: '请填写内容', trigger: 'blur'}
                    ]
                },
                editadbruleForm: {
                    img: '',
                    static: 0
                },
                editadvrules: {
                    img: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ]
                },
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        methods: {
            handleEdit(index, row) {               
                this.editclass = true;
                this.editruleForm.contents = row.contents
            },
            handleadvEdit: function (index, row) {
                this.editadvclass = true;
            },            
            submitForm() {
                let para = Object.assign({}, this.ruleForm)
                seedbarrage(qs.stringify(para)).then((res) => {
                    if (res.data == 1) {
                        this.$message({
                            message: '弹幕发送成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('弹幕发送失败');
                    }
                });

            },
            getnotices(){
                noticelist().then((res)=>{
                    console.log(res.data)
                    this.notices = res.data;
                })
            },
            submiteditForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let para = this.editruleForm
                        noticeup(qs.stringify(para)).then((res) => {
                            if (res.data.status == 1) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.getnotices();
                            } else {
                                this.$message.error('提交失败');
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
           
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            }
        },
        mounted() {
            this.getnotices();
        }
    }
</script>
<style scoped>
.mtop{
    margin-top: 20px;
}
</style>


