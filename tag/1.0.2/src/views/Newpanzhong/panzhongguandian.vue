<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                <el-input v-model="filters.content" placeholder="请输入内容关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select  v-model="filters.name" clearable placeholder="请选择标签">
                        <el-option
                                v-for="item in biaoqianForm"
                                :key="item.label_id"
                                :label="item.name"
                                :value="item.label_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select  v-model="filters.teacher" clearable placeholder="请选择老师">
                        <el-option
                                v-for="list in teacherFrom"
                                :key="list.id"
                                :label="list.name"
                                :value="list.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="filters.datetime"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <div>
                <el-form-item>
                    <el-select v-model="filters.region" style="width:193px;"  clearable  placeholder="请选择指标">
                        <!--<el-option label="浏览量" value="1"></el-option>-->
                        <el-option label="点赞量" value="2"></el-option>
                        <!--<el-option label="评论量" value="3"></el-option>-->

                    </el-select>

                </el-form-item>
                <el-form-item  >
                    <el-col :span="11">
                        <el-input v-model="filters.selectMin" placeholder="请输入指标最低值"></el-input>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="11">
                        <el-input v-model="filters.selectMax" placeholder="请输入指标最高值"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>
                </div>
                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"   @click="batchlike()">批量点赞</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="title" label="内容" min-width="200" key="title">
                <template scope="scope">
                    <span  v-if="scope.row.content!=''">{{ scope.row.title}}</span>
                    <br>
                    <audio v-if="scope.row.play_address!='' && scope.row.content==''" :src="scope.row.play_address" controls="controls"></audio>
                    <video  v-if="scope.row.video_address!='' && scope.row.content==''" :src="scope.row.video_address"  height="150" width="200"  controls="controls" ></video>
                </template>
                <!--<template scope="scope">-->
                    <!--<span  v-if="scope.row.content!=''">{{ scope.row.title}}</span>-->
                    <!--<span v-else=""> {{ scope.row.play_address}}</span>-->
                <!--</template>-->
            </el-table-column>

            <el-table-column prop="name" label="标签" min-width="50"></el-table-column>
            <el-table-column prop="teacherName" label="老师" min-width="50"></el-table-column>
            <el-table-column prop="pay" label="是否收费" min-width="50"></el-table-column>
            <el-table-column prop="zan" label="点赞实数/总数" min-width="100"></el-table-column>
            <el-table-column prop="datetime" label="发布时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

        <!--新增/编辑界面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="标签：" prop="name">
                <el-select  v-model="editForm.name"  placeholder="请选择标签"  @change="changedata(editForm.name)">
                    <el-option
                            v-for="(item,index) in biaoqianForm"
                            :key="index"
                            :label="item.name"
                            :value="index">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="老师：" prop="teacherName">
                    <el-select  v-model="editForm.teacherName"  placeholder="请选择老师"  @change="changelaoshi(editForm.teacherName)">
                        <el-option
                                v-for="(list,index) in teacherFrom"
                                :key="index"
                                :label="list.name"
                                :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="观点内容：" >
                    <UeEdit v-if=showUeEdit :thisData="'content'" v-on:ueIpt-say="listenThisUe" :maxWords=10000 :defaultMsg=editForm.content ref='content'></UeEdit>
                </el-form-item>
                <div><HR> </HR></div>
                <el-form-item label="语音观点：">
                    <el-upload class="upload-demo"
                               action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
                               :on-success="handleChange"
                               accept=".mp4"
                               :on-remove="handleRemove"
                               :on-exceed="handleExceed"
                               multiple
                               :file-list="playAddressFileList">
                        <el-button size="small" type="primary">点击上传音频文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传mp4文件,下方音频地址回显后再提交</div>
                    </el-upload>
                    <el-input v-model="playadddress" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <div><HR> </HR></div>
                <el-form-item label="视频标题："   prop="video_name" >
                    <el-input v-model="editForm.video_name"  style="width:400px;" auto-complete="off" ></el-input>
                </el-form-item>

                <el-form-item  label="视频封面："  >
                    <el-upload
                            class="avatar-uploader"
                            action="/api/file/imageUpload/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="videoimage!='' && videoimage!=null" :src="editForm.video_image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="视频观点：">
                    <el-upload class="upload-demo"
                               action="https://wangyi.zslxt.com/cloud/ondemand/uploads"
                               :on-success="videohandleChange"
                               accept=".mp4"
                               :on-remove="videohandleRemove"
                               :on-exceed="handleExceed"
                               multiple
                               :file-list="videoFileList">
                        <el-button size="small" type="primary">点击上传视频文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传mp4文件,下方视频地址回显后再提交</div>
                    </el-upload>
                    <el-input v-model="videoadddress" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <!--<el-form-item label="发布平台：">-->
                    <!--<el-radio-group v-model="checkList" >-->
                        <!--<el-checkbox :label="1" :key="1"  @change="changeFun(1)">财源股票</el-checkbox>-->
                        <!--<el-checkbox :label="0" :key="0" @change="changeFun(0)">源达股票</el-checkbox>-->
                    <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item label="是否是免费内容：" v-show="desin">
                    <el-radio-group v-model="editForm.is_pay">
                        <el-radio :label="1" >付费</el-radio>
                        <el-radio :label="0" >免费</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--批量点赞-->
        <el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
            <el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="注水数" prop="Infuse" :rules="[
                       { required: true, message: '不能为空'},
                       { type: 'number', message: '必须为数字值'}
                       ]">
                    <el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input>
                    </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个赞吗？</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="zhushuiVisible = false,zhushuiLoading=false">取消</el-button>
                <el-button type="primary" @click.native="zhushuiSubmit()" :loading="zhushuiLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util';
    import UeEdit from '../UeEdit.vue';
    import {panzhongList,panzhongsave,panzhongupdate,panzhongdelect,panzhongupdateview} from "../../api/ydApi.js";
    import api from "../../api/api.js";
    import axios from 'axios'
    export default {
        components: {UeEdit},
        data() {
            return {
                desin:false,
                teacherFrom:[],
                biaoqianForm:[],
                options:[],
                checkList: [],
                multipleSelection:[],
                likeFrom:{},
                playAddressFileList:[],
                videoFileList:[],
                teachername:'',
                teacherid:'',
                videoimage:'',
                biaoqianname:'',
                biaoqianid:'',
                zhifu:'',
                title:'',
                playadddress:'',
                videoadddress:'',
                biaoqianmake:false,
                teachermake:false,
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                radio: '1',
                editOrAdd:false,
                filters: {
                    content: '',
                    name:'',
                    teacherName:'',
                    datetime:''
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                chakanFormVisible:false,
                zhushuiLoading:false,
                sels: [],//列表选中列
                Loading: false,
                showUeEdit:false,
                dialogVisible: false,//编辑界面是否显示
                likeVisible:false,
                ZsFormVisible:false,
                editLoading: false,
                ZsLoading:false,
                zhushuiVisible: false,
                zhushuiObj: { Infuse: null },
                editFormRules: {
                    name: [
                        { required: true, message: '请选择标签', trigger: 'change' }
                    ],
                    teacherName: [
                        { required: true, message: '请选择老师', trigger: 'change' }
                    ],
                },
                //编辑界面数据
                editForm: {
                },
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        methods: {
            likeEvent(a){

                this.zhushuiObj ={
                    Infuse:a,

                };

            },
//            changeFun(val) {
//                this.checkList = val;
//                console.log(this.checkList)
//            },
            changedata: function(index){
                this.biaoqianmake=true;
                this.biaoqianid=this.biaoqianForm[index].label_id;
                this.biaoqianname=this.biaoqianForm[index].name;
                if(this.biaoqianForm[index].is_pay==2){
                    this.desin=true;
                }if(this.biaoqianForm[index].is_pay!=2){
                    this.zhifu=this.biaoqianForm[index].is_pay;
                    this.desin=false;
                }
            },
            changelaoshi:function(index){
                this.teachermake=true;
               this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
            },
            handleAvatarSuccess(res, file) {
                this.editForm.video_image = 'http://192.168.11.103:10001/image/' + res.message;
                this.videoimage= 'http://192.168.11.103:10001/image/' + res.message;
            },
            beforeAvatarUpload(file) {
                return  true;
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

            videohandleChange(response, file){
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

                    _this.videoadddress=data.origUrl;
                    _this.editForm.video_length=data.durationMsec;
                    _this.editLoading = false;
                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

            },


            videohandleRemove(file, fileList) {

                this.editForm.video_address = "";
                this.editForm.video_length = "";
                this.videoadddress=this.editForm.video_address;
            },

            handleExceed(files, fileList){
                this.$message.warning(`当前限制选择 1 个文件~`);
            },

            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.page = val;
            },
            //获取列表
            async getList(para){
//                var datetime=this.filters.datetime.getFullYear() + '-' + (this.filters.datetime.getMonth() + 1) + '-' + this.filters.datetime.getDate() + ' ' + this.filters.datetime.getHours() + ':' + this.filters.datetime.getMinutes() + ':' + this.filters.datetime.getSeconds()
                para = {
                    pageNo: this.page,
                    pageSize:this.pageSize,
                    content:this.filters.content,
                    label_id:this.filters.name,
                    teacher:this.filters.teacher,
                    create_time:this.filters.datetime,
                    region: this.filters.region,
                    selectMin:this.filters.selectMin,
                    selectMax:this.filters.selectMax
                };
                panzhongList(para).then(res => {
                    let result=res.data;
                    for(var i=0;i<result.list.length;i++){
                        if(result.list[i].is_pay==1){
                            result.list[i].pay="付费"
                        }else if(result.list[i].is_pay==0){
                            result.list[i].pay="免费"
                        }else{
                            result.list[i].pay="部分付费部分免费"
                        }
                        this.title=result.list[i].content;
                        result.list[i].zan=result.list[i].likeR+"  /  "+result.list[i].like;
                        var date = new Date(result.list[i].create_time);
                        var Y = date.getFullYear() + '-';
                        var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var  D = date.getDate() + ' ';
                        var  h = date.getHours() + ':';
                        var  m = date.getMinutes() + ':';
                        var  s = date.getSeconds();
                        result.list[i].datetime=Y+M+D+h+m+s;
                    }
                    this.total = result.total;
                    this.datas=result.list;
                    console.log(this.datas)
                });
            },
            //老师列表
            async selectTeacherList() {
                let paras = {
                    flag:0
                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.teacherFrom=arr;
                this.listLoading = false;
            },
            //标签列表
            async biaoqianList() {
                let paras = {
                    flag:1
                };
                let lists=await api.selectBiaoqianList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.biaoqianForm=arr;
                this.listLoading = false;
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                };
                this.getList(para)
            },


            //批量点赞页面
            selsChange: function (sels) {
                this.sels = sels;
            },
            async batchlike () {
                if (this.sels.length != 0) {
                    this.zhushuiVisible = true;
                    this.InfuseType = 1;
                } else {
                    this.$message({
                        message: " 选择一条数据",
                        type: "warning"
                    });
                }
            },
            change(row, event, column) {
                this.$refs.multipleTable.toggleRowSelection(row)
            },
            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var paradel = {
                        centor_viewpoint_id:row.centor_viewpoint_id
                    };
                    panzhongdelect(paradel).then(res => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.listLoading = false;
                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                        };
                        this.getList(para);
                    });
                }).catch(() => {
                });
            },
            //显示编辑界面
            async handleEdit (index, row) {
                console.log(row)
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
                this.dialogVisible = true;

                this.editForm = Object.assign({}, row);
                this.videoimage=this.editForm.video_image;
                if(this.editForm.play_address=="" || this.editForm.play_address==null){
                    this.playAddressFileList =[];
                    this.playadddress="";
                }else{
                    this.playAddressFileList = [{name:this.editForm.play_address,url:this.editForm.play_address}];
                    this.playadddress=this.editForm.play_address;
                }
                if(this.editForm.video_address=="" || this.editForm.video_address==null){
                    this.videoFileList =[];
                    this.videoadddress="";
                }else{
                    this.videoFileList = [{name:this.editForm.video_address,url:this.editForm.video_address}];
                    this.videoadddress=this.editForm.video_address;
                }
                this.showUeEdit = true;
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.dialogVisible = true;
                this.playAddressFileList= [];
                this.videoFileList=[];
                this.playadddress="";
                this.videoadddress="";
                this.showUeEdit = true;
                this.videoimage='';
            },
            //提交
            async editSubmit() {
                this.$refs.editForm.validate(async (valid) => {
                    this.editForm.play_address=this.playadddress;
                    this.editForm.video_address=this.videoadddress;
                    if (valid) {
                        if(this.editForm.content!='' && this.editForm.play_address!=''){
                            this.$confirm('请不要同时输入图文和音频内容')
                        }else if(this.editForm.video_address!='' && this.editForm.play_address!=''){
                            this.$confirm('请不要同时输入视频和音频内容')
                        }else if(this.editForm.video_address!='' && this.editForm.content!=''){
                            this.$confirm('请不要同时输入视频和图文内容')
                        }else{
                            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                this.editLoading = true;
                                if(this.editOrAdd){
                                    this.editForm.label_id=this.biaoqianid;
                                    this.editForm.teacher=this.teacherid;
                                    this.editForm.name=this.biaoqianname;
                                    this.editForm.teacherName=this.teachername;
                                    if(this.desin==false){
                                        this.editForm.is_pay=this.zhifu;
                                    }
                                    this.editForm.shijianchuo=new Date().getTime();
                                    this.editForm.create_time=String( new Date().getTime());
                                    this.editForm.update_time=String( new Date().getTime());
                                    this.editForm.centor_viewpoint_id=String( new Date().getTime());
                                    let para = Object.assign({}, this.editForm);
                                    panzhongsave(para).then(res => {
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
                                        this.getList(para1);
                                    });
                                }else{
                                    if(this.biaoqianmake){
                                        this.editForm.label_id=this.biaoqianid;
                                        this.editForm.name=this.biaoqianname;
                                    }
                                    if(this.teachermake){
                                        this.editForm.teacher=this.teacherid;
                                        this.editForm.teacherName=this.teachername;
                                    }
                                    this.editForm.update_time=String( new Date().getTime());
                                    let para = Object.assign({}, this.editForm);
                                    panzhongupdate(para).then(res => {
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
                                        this.getList(para1);
                                    });
                                }

                            });
                        }


                    }
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            //注水提交
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.zhushuiVisible=false;
                    this.setInfuse(this.InfuseType)
                    if (valid) {
                        panzhongupdateview(this.sels).then(res => {
                            this.$message({
                                message: "注水成功",
                                type: "success"
                            });
                            this.zhushuiLoading=false;
                            this.zhushuiObj.Infuse = 0;
                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                            };
                            this.getList(para);
                        });
                    }
                });

            },
            setInfuse() {
                this.sels.forEach(a => {
                    a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                    a.zhushuishu = this.zhushuiObj.Infuse;
                });
            }
        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
            this.selectTeacherList();
            this.biaoqianList()
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

</style>