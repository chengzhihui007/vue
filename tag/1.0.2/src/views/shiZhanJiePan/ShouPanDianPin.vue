<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-date-picker
                            v-model="filters.searchDate"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

                <div>
                    <el-form-item style="float: right;margin-right: 14%">
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.native="batchLikeView(0)">批量点赞</el-button>
                        <el-button type="primary" @click.native="batchLikeView(1)">批量播放</el-button>

                    </el-form-item>
                </div>
            </el-form>
        </el-col>


        <!--列表-->
        <el-table ref="multipleTable" :data="tableData" highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="liulan" label="播放量实数 | 总数"></el-table-column>
            <el-table-column prop="dianzan" label="点赞实数 | 总数"></el-table-column>
            <el-table-column prop="create_time" label="添加时间"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click.native="handleEdit(scope.$index, scope.row)">修改</el-button>
                   
                </template>
            </el-table-column>
        </el-table>


        <el-col :span="24" class="toolbar">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize
                           layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--弹出界面 添加/修改-->
        <el-dialog :title=dialogTitle :visible.sync="FormVisible" v-loading="editLoading" :close-on-click-modal="false"
                   v-on:close="clearEdit">
            <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
                <el-form-item label="标题" prop="title">
                    <el-input
                            v-model="editForm.title"
                            :disabled="true">
                    </el-input>
                </el-form-item>

                <el-form-item label="音频" >
                    <el-upload
                            class="upload-demo"
                            action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
                            :file-list="uploadFileList"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove"
                            :on-success="handleVocieSuccess"
                            accept=".mp3">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span style="padding-left: 10px" slot="tip" class="el-upload__tip">允许上传mp3文件</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="音频名称"  style="display: none">
                    <el-input v-model="play_address"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="SubmitForm()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--注水界面-->
        <el-dialog :title="BatchViewDialogTitle" :visible.sync="BatchViewDialogVisible" :close-on-click-modal="false" >
            <el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
               <el-form-item label="注水数" prop="Infuse" :rules="[
                     { required: true, message: '不能为空'},
                       { type: 'number', message: '必须为数字值'}
                            ]">
            <el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input>
            </el-form-item>
                  <el-form-item v-if="this.InfuseType==0">
            <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个赞吗？</p>
                     </el-form-item>
                 <el-form-item v-else="">
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个阅读数吗？</p>
                 </el-form-item>
                  </el-form>
            <span slot="footer" class="dialog-footer" center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit()">确 定</el-button>
		    </span>
        </el-dialog>


    </section>
</template>

<script>
    import {listShouPanDianPin,saveShouPanDianPin,updateShouPanDianPin,deleteShouPanDianPin,zhuShuiShouPanDianPin} from "../../api/cyApi.js";
      export default {
      data() {
            return {
                uploadFileList: [],
                tableData: [],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                select_loading: false,
                sels: [],//列表选中列
                select_options: [],//键盘宝
                FormVisible: false,
                editOrAdd: false,
                filters: {
                    searchDate: ''
                },
                 play_address:'',
                editFormRules: {
                    title: [{required: true, message: "标题必填", trigger: "blur"}],
                    play_address: [{required: true, message: "音频必选", trigger: "change"}],
                },
               audio_length:'',
                BatchViewDialogTitle:'',
                InfuseType:'',
                BatchViewDialogVisible: false,
                zhushuiObj: { Infuse: null },
                zhushuiid: '',
                zhushuiVisible: false,
                zhushuiLoading:false,
                zhushuiObj: {
                    type: '',
                    count: '',
                },
                //编辑界面数据
                editLoading: false,
                dialogTitle: "新增",
                ueid: '',
                editForm: {
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
                
            }
        },
        methods: {
            likeEvent(a){
                this.zhushuiObj ={
                    Infuse:a,
                };
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleVocieSuccess(response, file) {
              this.editLoading = true;
              var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {

                    console.log("已发送");
                    var data = JSON.parse(evt.data);
                    console.log(data.origUrl);
                    console.log(data.durationMsec);
                    _this.play_address=data.origUrl;
                    _this.audio_length=data.durationMsec;
                     _this.uploadFileList = [{name:_this.play_address,url:_this.play_address}];
                    _this.editLoading = false;
                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }
             
            },
            //获取列表
            async getList(para) {
                 para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    create_time : this.filters.searchDate,
                };
             
                 listShouPanDianPin(para).then(res => {
                 this.tableData = res.data.list;
                   
                    for(var i=0;i<this.tableData.length;i++){
                        var timesnip1=this.tableData[i].create_time;
                        var timestamp1 = new Date(timesnip1);//直接用 new Date(时间戳) 格式转化获得当前时间
                        this.tableData[i].create_time=timestamp1.toLocaleDateString().replace(/\//g, "-") + " " + timestamp1.toTimeString().substr(0, 8);
                        var timesnip2=this.tableData[i].update_time;
                        var timestamp2 = new Date(timesnip2);//直接用 new Date(时间戳) 格式转化获得当前时间
                        this.tableData[i].update_time=timestamp2.toLocaleDateString().replace(/\//g, "-") + " " + timestamp2.toTimeString().substr(0, 8);
                        this.tableData[i].liulan=this.tableData[i].viewR+"  /  "+this.tableData[i].view;
                        this.tableData[i].dianzan=this.tableData[i].likeR+"  /  "+this.tableData[i].like;
                    }
                    this.total = res.data.total;
                });
               
             },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.FormVisible = true;
                //初始化标题
                var date = new Date();
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                this.editForm.title = Y + M + D + "期";
                this.uploadFileList = [];
                this.play_address="";
            },

            //恢复编辑页面为默认
            clearEdit() {
                let tmpObj = {};
                
                this.editForm = Object.assign({}, tmpObj);
            },
            
          
            //显示编辑界面
            async handleEdit(index, row) {
                this.dialogTitle = "修改";
                this.editOrAdd = false;
                this.FormVisible = true;
                this.editForm = Object.assign({}, row);
               if(this.editForm.play_address=="" || this.editForm.play_address==null){
                    this.uploadFileList = [];
                    this.play_address="";
                }else{
                    this.uploadFileList = [{name:this.editForm.play_address,url:this.editForm.play_address}];
                    this.play_address=this.editForm.play_address;
                }
               

            },
              async SubmitForm() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {closeOnClickModal:false}).then(async () => {
                            let para = this.editForm;
                            this.editForm.play_address=this.play_address;
                            this.editForm.audio_length=this.audio_length;
                          
                            this.editFormVisible = false;
                            this.editLoading = true;
                              if (this.dialogTitle == "新增") {
                                //添加
                                saveShouPanDianPin(para).then(res => {
                                    this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                   
                                });
                               } 
                               else 
                            {
                              //更新
                              if(para.audio_length==0){
                                    delete para.audio_length;
                                }
                                delete para.create_time;
                                para.update_time=String( new Date().getTime());
                                updateShouPanDianPin(para).then(res => {
                                    this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                   });
                             }
                              var paralist = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                             this.getList(paralist);
                            this.FormVisible = false;
                           this.editLoading = false;
                         });
                    }
                 });
            },
            viewEvent(a) {
                this.zhushuiObj.count = a;
            },
            batchLikeView(type) {
                if (this.sels.length < 1) {
                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });
                    this.BatchViewDialogVisible = false;
                }
                else {
                    this.InfuseType = type
                    this.BatchViewDialogVisible = true;
                }
            },
           
            async batchViewSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                        if (valid) {
                        this.setInfuse(this.InfuseType);
                        if(this.InfuseType==0 && this.zhushuiid!=""){
                        this.$confirm('条数为'+this.zhushuiid+"的点赞量超过阅读数，是否取阅读数最低值？", '提示', {
                            type: 'warning'
                        }).then(async () => {
                            if (valid) {
                                for(var i=0;i<this.sels.length;i++){
                                    delete this.sels[i].create_time;
                                    delete this.sels[i].update_time;
                                }
                               
                                zhuShuiShouPanDianPin(this.sels).then(res => {
                                    this.$message({
                                        message: "注水成功",
                                        type: "success"
                                    });
                                    this.zhushuiVisible = false;
                                    this.editLoading=false;
                                    this.zhushuiObj.Infuse = 0;
                                    var para = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.getList(para);
                                });
                            }
                        }).catch(() => {
                            this.editLoading=false;
                        });
                    }else{
                        if (valid) {
                            for(var i=0;i<this.sels.length;i++){
                                delete this.sels[i].create_time;
                                delete this.sels[i].update_time;
                            }
                            zhuShuiShouPanDianPin(this.sels).then(res => {
                                this.$message({
                                    message: "注水成功",
                                    type: "success"
                                });
                                this.zhushuiVisible = false;
                                this.editLoading=false;
                                this.zhushuiObj.Infuse = 0;
                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                };
                                this.getList(para);
                            });

                        }
                    }

         }
                })
            },
           setInfuse(type) {
                if (type === 0) {
                    this.zhushuiid='';
                    for (var i=0;i<this.sels.length;i++)
                    {
                        var  a =   this.sels[i];
                        console.log(a)
                        if (
                            Number(this.zhushuiObj.Infuse) + Number(a.like) >
                            Number(a.view)
                        ) {
                            a.like = a.view;
                            this.zhushuiid+=a.num +"    ";

                            a.zhushuishu=a.view-a.like;
                            a.type=0;
                        } else {
                            a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                            a.zhushuishu = this.zhushuiObj.Infuse;
                            a.type=0;
                        }
                    }
                } else {
                    this.sels.forEach(a => {
                        console.log(a)
                        this.zhushuiid='';
                        a.view = Number(a.view) + Number(this.zhushuiObj.Infuse);
                        a.zhushuishu=this.zhushuiObj.Infuse;
                        a.type=1;
                    });
                }
            },

              handleRemove(file, fileList) {

                this.editForm.play_address = "";
                this.editForm.audio_length = "";
                this.play_address=this.editForm.play_address;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
           
        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.closeComments_id DESC "
            };
           
            this.getList(para);
        }
    }
</script>
<style>
    .el-dialog.el-dialog--small {
        overflow-x: hidden;
    }

    .el-dialog__body {
        max-height: 800px;
        overflow-y: auto;
        /*            margin-right: -14px;
                    padding-right: 34px;*/
    }

    .ql-container.ql-snow {
        max-height: 200px;
        overflow-y: auto;
    }

    .el-pagination {
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