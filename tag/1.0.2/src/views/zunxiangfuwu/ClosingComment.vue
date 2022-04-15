<template>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="v.groupsName" :name="v.groupsName" v-for="(v, k) in labelList" :key="k">

    </el-tab-pane>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">

                <el-form-item>
                    <el-date-picker
                            v-model="filters.releaseTime"
                            type="date"
                            placeholder="推荐时间查询">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-input v-model="filters.title" placeholder="请输入标题关键字搜索"></el-input>
                </el-form-item>
            


                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

            <el-form-item v-if="btnAvaliable">
                <el-button type="primary"  @click="handleAdd">新增</el-button>
            </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="index" label="序号"  width="60">
                    <template scope="num">
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>

            <el-table-column prop="createTime"  label="发布时间"  align="center" min-width="100">
                <template scope="scopeCt">
                    <div :class="{disabled: scopeCt.row.state == 0}">
                        {{scopeCt.row.createTime}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题"  align="center" min-width="150">
                <template scope="scopeTt">
                    <div :class="{disabled: scopeTt.row.state == 0}">
                        {{scopeTt.row.title}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="recentOperatingAccount" label="最近操作账户" align="center" min-width="100">
                <template scope="scopeRc">
                    <div :class="{disabled: scopeRc.row.state == 0}">
                        {{scopeRc.row.recentOperatingAccount}}
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" min-width="150" v-if="btnAvaliable">
                <template scope="scope">
                    <el-button size="small" :disabled="scope.row.state == 0"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger"  :disabled="scope.row.state == 0"  size="small"   @click="handleDel(scope.$index, scope.row)">{{scope.row.state == 0 ? '已' : ''}}删除</el-button>
                </template>
            </el-table-column>


            
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page.sync="page" :page-size="this.pageSize"  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title=dialogTitle  :visible.sync="FormVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="addForm" label-width="110px"  :rules="editFormRules" ref="addForm">
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="addForm.title"  auto-complete="off"  placeholder="不超过30个汉字" style="width:500px;"></el-input>
                </el-form-item>


                    <el-form-item label="语音文件" prop="mp3Path" ref="upload">
                            <el-upload  class="upload-demo"
                            
                                action="/api/file/fileUpload/"
                                accept=".mp3"
                                :before-upload="handleFileBefore"
                                :on-preview="handleFilePreView"
                                :on-success="handleFileSuccess"
                                :on-remove="handleFileRemove"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="playAddressFileList"
                            >
                        
                                <el-button
                                size="small"
                                type="primary"
                                >点击上传语言</el-button>
                                <div
                                style="float: right;margin-left: 15px;"
                                class="el-upload__tip"
                                >文件格式为MP3格式</div>
                            </el-upload>
                            </el-form-item>
                            <el-form-item
                                label="语音地址"
                                prop="mp3Path"
                                style="display: none"
                            >
                            <el-input v-model="addForm.mp3Path"></el-input>

                        </el-form-item>
                            <el-form-item
                                label="语音播放长度"
                                prop="mp3PlayTime"
                                style="display: none"
                            >
                            <el-input v-model="addForm.mp3PlayTime"></el-input>
                        </el-form-item>

                

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false; clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>


    </el-tabs>
</template>

<script>
    import {imageDefault,pdfDefault,mp3Default} from "../../common/js/urls";
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import '../../common/js/DateFormat';
    export default {
        data() {
            var checkFile = (rule, value, callback) => {
                
            };
            var checktitle = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };
            var checknumbers = (rule, value, callback) => {

                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error("请输入数字值"));
                    }
                    else
                    {
                        // console.log("fds");
                    }
                }, 1000);
            };

            return {
                labelList:[{label:"A",name:"A"},{label:"B",name:"B"},{label:"C",name:"C"}],
                activeName:'A',
                playAddressFileList: [],
                value: '',
                filters: {
                    title: '',
                    releaseTime:'',
                },
                BatchViewDialogTitle:'',
                BatchViewDialogVisible:false,
              
                datas: [],
                total: 0,
                page: 1,
                pageSize:10,
                currentPage: 1,
                listLoading: false,

                sels:[],//列表选中列
                FormVisible:false,

                mp3Url:"",

                //新增界面数据
                addForm: {
                },
                fileList:[],

                username:'',
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                radio: '1',
                editOrAdd:false,
               editLoading: false,
                ZsLoading:false,
                editFormRules: {
                    title: [
                        { required: true, message: "请输入标题", trigger: "blur" },
                        { validator: checktitle, message: "限30个汉字以内", trigger: "blur", num: 60 }
                    ],
                    mp3Path: [
                        { required: true, message: "上传MP3音频文件", trigger: "change" },
                    ],
                
                    
                },
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        computed: {
            btnAvaliable() {
                for (var i = 0; i < this.labelList.length; i++) {
                    if (this.labelList[i].groupsName === this.activeName) {
                        return this.labelList[i].status != 0;
                    }
                }
            }
        },
        methods: {

             handleFilePreView(file) {
                //  console.log(file);
                },

             handleFileSuccess(response, file, fileList) {
                 this.addForm.mp3Path = mp3Default+response.message;
                 this.addForm.audioLength = file.size; 

                let audioAddress=mp3Default + response.message;//提交的时候打开
                // let audioAddress='http://cygpcdn-file.yd.com.cn/mp3/4444444444444444444.mp3';//测试的时候打开
                if(audioAddress){
                let audio=new Audio(audioAddress);
                audio.addEventListener("canplay",()=>{
                      var time = audio.duration
                      this.addForm.mp3PlayTime = Math.floor(time).toString()
                });
            }
            this.$refs['upload'].clearValidate()
                },

            handleFileRemove(file, fileList) {
                this.addForm.mp3Path = "";
                this.addForm.audioLength = "";
         },
            handleExceed(files, fileList) {
               this.$message.warning(`当前限制选择 1 个文件~`);
        },

            //获取列表
            async getList(){
                this.datas=[];
                this.total=0;
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    title:this.filters.title,
                    webcastid:this.activeName,
                    createTime:this.filters.releaseTime? new Date(this.filters.releaseTime).format("yyyy-MM-dd"):''
                };
                
                let result=await api.getClosingCommentPage(para);
                     if(result.list.length>0){
                        for( var i=0;i<result.list.length;i++){
                            result.list[i].createTime = result.list[i].createTime.substring(0,16);
                        }
                    this.datas=result.list;
                    this.total=result.total;
                    this.page = result.pageNum;
                    }

            },
            //获取label列表
            async getLabelList(){
              let userId = JSON.parse(sessionStorage.getItem('user')).user_id;
               let menuId = '84'
                let result=await api.findMenuByUserWriter(userId,menuId);
                this.labelList=result.data;
                
                if(this.labelList.length>0){
                    this.activeName=this.labelList[0].groupsName;
                    this.getList();
                }else{
                    this.datas=[];
                    this.total=0;
                }
            },
      

            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.getList();
            },

        
        


            //删除
            async handleDel(index, row) {
                this.$confirm('若删除该内容则不可恢复，确定要要删除该内容吗？', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var result= await api.deleteClosingCommentById(row.id);

                    this.listLoading = false;
                    if(result.state)
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
            //显示编辑界面
            handleEdit (index, row) {
                // console.log("row:::" + JSON.stringify(row));
                this.dialogTitle = "语音修改";
                this.editOrAdd = false;
                this.FormVisible = true;
                this.addForm = Object.assign({}, row);//await api.findRiJianSo(row);
                this.playAddressFileList =[
                    {name: this.addForm.mp3Path,url: this.addForm.mp3Path}
                    ]
                ;
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "语音上传";
                this.editOrAdd = true;
                this.FormVisible = true;
                this.addForm={};
                this.playAddressFileList = [];
                this.clearEdit();
               //this.$refs.editForm.resetFields();
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {};
                this.addForm = Object.assign({}, tmpObj);
                // this.fileList=[];
            },

            //提交
            async editSubmit() {
                
                this.$refs.addForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            var result="";

                            let user =  JSON.parse(sessionStorage.getItem('user'));
                            
                            this.addForm.recentOperatingAccount = user.user_name;
                            this.addForm.webcastid = this.activeName;
                            
                            if(this.editOrAdd){
                                let para = Object.assign({}, this.addForm);
                                // console.log(para)
                                result= await api.addClosingComment(para);
                            }else{
                                let para = Object.assign({}, this.addForm);
                                result= await api.updateClosingCommentById(para);
                            }
                            // console.log(result);
                            
                            this.FormVisible = false;
                            if (result.state) {
                                this.$message({ message: '提交成功', type: 'success' });
                                this.getList();
                            }
                            else
                            {
                                this.$message.error(result.data);
                            }
                            this.editLoading = false;
                            this.clearEdit();
                        });
                    }
                });
            },
            viewEvent(a){
                this.viewlikeFrom.count=a;
            },
     
         

            selsChange: function (sels) {
                this.sels = sels;
            },
            setInfuse(type) {
                if (type =="like") {
                    this.sels.forEach(a => {
                        if (
                            Number(this.viewlikeFrom.count) + Number(a.like) >
                            Number(a.view)
                        ) {
                            a.like = a.view;
                            this.$message({
                                message: "超过阅读量已调整为阅读量最低！",
                                type: "warning"
                            });
                        } else {
                            a.like = Number(this.viewlikeFrom.count) + Number(a.like);
                        }

                        a.t="like";
                        a.zs_count=this.viewlikeFrom.count;

                    });
                } else {
                    this.sels.forEach(a => {
                        //console.log(a.view);
                        a.view = Number(a.view) + Number(this.viewlikeFrom.count);

                        a.t="view";
                        a.zs_count=this.viewlikeFrom.count;
                    });
                }
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

            handleFileBefore(file) {
                const isMP3 = file.type === 'audio/mp3';
                if (!isMP3) {
                this.$message.error('上传音频必须是MP3格式!');
                }
                return isMP3 ;
            },

        handleClick(tab, event) {
            this.getList();
		},

        },
        mounted() {
            this.getLabelList();
        //    this.getList();
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
        /*         margin-right: -14px;
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
		width: 128px;
		height: 128px;
		line-height: 128px;
		text-align: center;
	}
     .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .re-item {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #e1e1e1;
        margin-top: 20px;
    }
    .unre {
        width: 100%;
        padding: 100px 0;
        text-align: center;
        font-size: 30px;
        background-color: #e1e1e1;
    }
    /* 推荐股票 */
    .rec-title {
        line-height: 40px;
    }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
    .disabled {
        color: #55555577;
    }
</style>