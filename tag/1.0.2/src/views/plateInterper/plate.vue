<template>
        <section>
 <!--工具条-->
 <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
                <el-form-item>
                        <el-date-picker
                                v-model="filters.datetime"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="findlist()">查询</el-button>
            </el-form-item>

            <div>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" >新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="handleInfuse(0)" >增加点赞</el-button>
                    <el-button type="primary"  @click="handleInfuse(1)" >增加浏览量</el-button>
                </el-form-item>
            </div>
        </el-form>
    </el-col>
    
   
   
<el-table :data="tableData" @selection-change="selsChange" highlight-current-row v-loading="listLoading" style="width: 100%;">
  <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column type="index" width="60"></el-table-column>
  <el-table-column prop="title" label="标题" min-width="120">
  </el-table-column>
  <el-table-column prop="liulan" label="播放实数 | 总数" min-width="80">
  </el-table-column>
    <el-table-column prop="dianzan" label="点赞实数 | 总数" min-width="80">
    </el-table-column>
    <el-table-column prop="create_time" label="添加时间" min-width="120">
  </el-table-column>
<el-table-column label="操作" min-width="150">
 <template scope="scope">
    <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
    <!--<el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
  </template>
</el-table-column>
</el-table>
<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total  style="text-align: center;"></el-pagination>
<!--批量点赞-->
<el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
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
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="zhushuiVisible = false,editLoading=false">取消</el-button>
        <el-button type="primary" @click.native="zhushuiSubmit()" :loading="editLoading">提交</el-button>
    </div>
</el-dialog>


<!--编辑界面-->
<el-dialog v-if="editFormVisible" :title=dialogTitle :visible.sync="editFormVisible" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
    <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
        <el-form-item label="音频：">
            <el-upload class="upload-demo"
                       action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
                       :on-success="handleChange"
                       accept=".mp4"
                       :on-remove="handleRemove"
                       :on-exceed="handleExceed"
                       multiple
                       :file-list="playAddressFileList">
                <el-button size="small" type="primary">点击上传音频文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
            </el-upload>
            <el-input v-model="playadddress" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit()" :loading="editLoading">发 布</el-button>
    </div>
</el-dialog>

</section>
</template>

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    
    .el-aside {
        color: #333;
    }
</style>

<script>
    import {plateList,platesave,plateupdate,platedelect,plateupdateview} from "../../api/cyApi.js";
    import util from '../../common/js/util'
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {
            ElFormItem,
        },
        data() {
            return {
                //列表数据集合
                tableData: [],
                //编辑页面是否显示
                editLoading: false,
                //编辑添加页面显示title
                dialogTitle: '添加',
                //状态目前是添加和编辑
                editOrAdd: "",
                //分页默认个数
                total: 0,
                listLoading: false,
                sels: [],
                InfuseType:'',
                playadddress:'',
                //当前数据页码
                page: 1,
                pageSize: 10,
                currentPage: 1,
                spotRef: 'spotModular',
                //注水id
                zhushuiid: '',
                status: '',
                //热点狙击类别
                categoryId: 16902,
                zhushuiObj: { Infuse: null },
                zhushuiVisible: false,
                zhushuiLoading:false,
                playAddressFileList:[],
                filters: {
                    code: '',
                    name: '',
                    title: '',
                    datetime: ""
                },
                viewlikeFrom: {
                    type: '1',
                    count: '',
                },
                BatchViewDialogTitle: '',
                BatchViewDialogVisible: false,
                editFormVisible: false, //编辑界面是否显示
                props: {
                    editForm: {
                        type: Object
                    },
                },
                //编辑添加页面字段校验规则
                editFormRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 20,
                        message: '限20个字以内',
                        trigger: 'blur'
                    }]
                },

                //编辑界面数据
                editForm: {
                    id: '',
                    title: '',
                    banKuai: [{
                        bankuaifenxi: '',
                        bankuaizhangfu: '',
                        redianfangxiang: '',
                        redianduanping: '',
                        geguzhangdiebi: '',
                        zijinduibi: '',
                        zhangtingjiashu: '',
                        redianfenxi: '',
                        jingxuangegu: [{
                            name: '',
                            code: '',
                            reason: '',
                            analysis: ''
                        }]
                    }]
                }
            }
        },
        methods: {
            likeEvent(a){
                this.zhushuiObj ={
                    Infuse:a,
                };
            },
            async findlist(para) {
                para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    create_time:this.filters.datetime,
                };
                plateList(para).then(res => {
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
            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.plateInterper_id DESC "
                };
                this.findlist(para);
            },
            alertMessage(msg) {
                this.$message({
                    message: msg,
                    type: 'success'
                });
            },
            handleChange(response, file){
                this.editLoading = true;
                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {

                    console.log("已发送");
                    var data = JSON.parse(evt.data)
                    _this.playadddress=data.origUrl;
                    _this.editForm.audio_length=data.durationMsec;
                    _this.editLoading = false;
                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

            },
            handleRemove(file, fileList) {

                this.editForm.play_address = "";
                this.editForm.audio_length = "";
                this.playadddress=this.editForm.play_address;
            },
            handleExceed(files, fileList){
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            selsChange: function (sels) {
                this.sels = sels;
                console.log(sels)
            },
            setSpotRef(index){
                return 'spot' + (Number(index) + 1)
            },
            //显示注水页面
            async handleInfuse(type) {
                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = type
                } else {
                    this.$message({
                        message: " 选择一条数据",
                        type: "warning"
                    });
                }
            },
            //显示编辑界面
            handleEdit: function(index, row) {
                console.log(row)
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.status = row.statusDesc;
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                if(this.editForm.play_address=="" || this.editForm.play_address==null){
                    this.playAddressFileList =[];
                    this.playadddress="";
                }else{
                    this.playAddressFileList = [{name:this.editForm.play_address,url:this.editForm.play_address}];
                    this.playadddress=this.editForm.play_address;
                }
            },
            //显示新增界面
            handleAdd: function() {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.editFormVisible = true;
                this.playAddressFileList= [];
                this.playadddress="";
                this.clearEdit();
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.editForm = Object.assign({}, tmpObj);
            },
            //注水提交
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.editLoading=true;
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
                                console.log(this.sels)
                                plateupdateview(this.sels).then(res => {
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
                                    this.findlist(para);
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
                            plateupdateview(this.sels).then(res => {
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
                                this.findlist(para);
                            });

                        }
                    }
                });

            },
            //删除
//            async handleDel(index, row) {
//                this.$confirm('确认删除该记录吗?', '提示', {
//                    type: 'warning'
//                }).then(async () => {
//                    this.listLoading = true;
//                    console.log(row)
//                    var paradel = {
//                        plateInterper_id:row.plateInterper_id
//                    };
//
//                    goldSearchdelect(paradel).then(res => {
//                        this.listLoading = false;
//                        this.$message({
//                            message: '删除成功',
//                            type: 'success'
//                        });
//                        var para = {
//                            pageNo:this.page,
//                            pageSize:this.pageSize,
//                            orderBy:"a.plateInterper_id DESC "
//                        };
//                        this.findlist(para);
//                    });
//
//
//                }).catch(() => {
//                });
//            },
            //提交
            async editSubmit() {
                this.$refs.editForm.validate(async(valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async() => {
                            let ref = this.spotRef;
                            this.editForm.play_address=this.playadddress;
                            let para = this.editForm;
                            this.editFormVisible = false;
                            this.editLoading = true;
                            console.log(para)
                            if (this.editOrAdd) {
                                //添加
                                para.plateInterper_id=String( new Date().getTime())
                                para.create_time=String( new Date().getTime());
                                para.update_time=String( new Date().getTime());
                                platesave(para).then(res => {
                                    this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    var paralist = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.findlist(paralist);
                                });
                            } else {
                                //更新
                                delete para.create_time;
                                para.update_time=String( new Date().getTime());
                                plateupdate(para).then(res => {
                                    this.$message({
                                        message: "发布成功",
                                        type: "success"
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    var paralist = {
                                        pageNo:this.page,
                                        pageSize:this.pageSize,
                                    };
                                    this.findlist(paralist);
                                });
                            }

                        });
                    }
                });
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
        },

        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.plateInterper_id DESC "
            };
            this.findlist(para);
        }
    };
</script>