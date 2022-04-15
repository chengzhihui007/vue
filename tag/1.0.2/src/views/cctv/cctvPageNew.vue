<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                    <!--<el-input v-model="filters.title" placeholder="请输入标签关键字"></el-input>-->
                <!--</el-form-item>-->



                <el-form-item>
                    <span>课程类型：</span>
                    <el-select  v-model="filters.type" placeholder="请选择课程类型" >
                        <el-option value="-1" label="请选择">请选择</el-option>
                        <!--<el-option :value="item.value" :label="item.label" v-for="item in options"></el-option>-->
                        <el-option
                                v-for="(list,index) in courseTypeFrom"
                                :key="index"
                                :label="list.name"
                                :value="list.id">
                        </el-option>
                        <!--<el-option value="1" label="开盘见分晓"></el-option>-->
                        <!--<el-option value="2" label="盘面分析"></el-option>-->
                        <!--<el-option value="3" label="股市气象站"></el-option>-->
                        <!--<el-option value="4" label="行情研判"></el-option>-->
                    </el-select>
                </el-form-item>




                <el-form-item>
                    <span>主讲老师：</span>
                    <el-select  v-model="filters.teacher" placeholder="请选择老师" >
                        <el-option value="0" label="请选择">请选择</el-option>
                        <el-option
                                v-for="list in teacherFrom"
                                :key="list.id"
                                :label="list.name"
                                :value="list.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>上传时间:</span>
                    <el-date-picker
                            v-model="filters.date"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="上传时间">
                    </el-date-picker>
                </el-form-item>

                <!--<el-form-item>-->
                    <!--<el-select v-model="filters.type" placeholder="请选择指标">-->
                        <!--<el-option label="请选择" value=""></el-option>-->
                        <!--<el-option label="点赞量" value="like"></el-option>-->
                        <!--<el-option label="播放量" value="view"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-input v-model="filters.min" placeholder="请输入最低指标"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!-- - -->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-input v-model="filters.max" placeholder="请输入最高指标"></el-input>-->
                    <!--</el-form-item>-->
                <el-form-item>
                    <!--<el-button type="primary" @click="getList()">查询</el-button>-->
                    <el-button type="primary" @click="getList()">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <!--<el-button type="primary"  @click="handleAdd">新增</el-button>-->
                    <el-button type="primary"  @click="handleAdd">添加</el-button>
                </el-form-item>
                <!--<div>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary"  @click="handleAdd">新增</el-button>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary"  v-if=" username!=='quanzi1'"  @click.native="batchLikeView('like','批量点赞')">批量点赞</el-button>-->
                        <!--<el-button type="primary"  v-if=" username!=='quanzi1'"  @click.native="batchLikeView('view','批量浏览')">批量浏览</el-button>-->
                    <!--</el-form-item>-->
                <!--</div>-->
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <!--<el-table-column prop="title" label="标题" min-width="200"></el-table-column>-->
            <!--<el-table-column prop="type" label="课程类型" min-width="200">-->
            <el-table-column label="课程类型" min-width="150">
                <template scope="scope">
                    <span >  {{ changeType(scope.row.type) }} </span>
                </template>
            </el-table-column>

            <el-table-column prop="createTime" label="课程时间" min-width="100" :formatter="dateFormatCourseTime" ></el-table-column>



            <el-table-column prop="teacherName" label="主讲老师" min-width="100"></el-table-column>
            <!--<el-table-column prop="audioLength" label="时长" min-width="100"></el-table-column>-->
            <el-table-column label="浏览数" min-width="100">
                <template scope="scope">
                    <span  v-bind:class="{active: (scope.row.like>=0)}">{{ scope.row.view }}</span>
                </template>
            </el-table-column>
            <!-- 2018-08-13 可以用的代码，详细展示 播放数 -->
            <!--<el-table-column label="播放实数|注水数|总数" min-width="100">-->
                <!--<template scope="scope">-->
                    <!--<span  v-bind:class="{active: (scope.row.like>=0)}">{{ scope.row.view }}</span>-->
                    <!--|-->
                    <!--<span>{{ scope.row.viewR }}</span>-->
                    <!--|-->
                    <!--<span >{{ scope.row.view + scope.row.viewR }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->


            <el-table-column label="点赞数" min-width="100">
                <template scope="scope">
                    <span  v-bind:class="{active: (scope.row.like>=0)}">{{ scope.row.like }}</span>
                </template>
            </el-table-column>
            <!-- 2018-08-13 可以用的代码，详细展示 点赞数-->
            <!--<el-table-column label="点赞实数|注水数|总数" min-width="200">-->
                <!--<template scope="scope">-->
                    <!--<span  v-bind:class="{active: (scope.row.like>=0)}">{{ scope.row.like }}</span>-->
                    <!--|-->
                    <!--<span>{{ scope.row.likeR }}</span>-->
                    <!--|-->
                    <!--<span >{{ scope.row.like + scope.row.likeR }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="comment" label="分享数" min-width="100"></el-table-column>-->
            <el-table-column prop="createTime" label="发布时间" min-width="100" :formatter="dateFormat" ></el-table-column>
            <el-table-column label="操作" min-width="150">

                <template scope="scope">
                    <template  v-if="scope.row.status == 1" >
                        <el-button type="danger" size="small"   @click="handleOff(scope.$index, scope.row)">下线</el-button> <!-- 2018-08-14 下线功能 -->
                        <el-button type="warning" size="small"   @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <!--<el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                    </template>

                    <template  v-else-if="scope.row.status == 0" >
                        <!--<el-button type="info" disabled  size="" >该视频已下线</el-button> &lt;!&ndash; 2018-08-14 下线功能 &ndash;&gt;-->
                        <span style="color:gray">已下线    修改</span> <!-- 2018-08-14 下线功能 -->
                        <!--<el-button size="small" disabled   @click="handleEdit(scope.$index, scope.row)">修改</el-button>-->
                        <!--<el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                        <!--<el-button type="danger" disabled  size="small"   @click="handleOff(scope.$index, scope.row)">下线</el-button> &lt;!&ndash; 2018-08-14 下线功能 &ndash;&gt;-->
                    </template>



                </template>

            </el-table-column>

        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title=dialogTitle  :visible.sync="FormVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="addForm" label-width="110px"  :rules="editFormRules" ref="addForm">

                <!--<el-form-item label="期数：" prop="period">-->
                    <!--<el-date-picker-->
                            <!--v-model="addForm.period"-->
                            <!--type="date"-->
                            <!--format="MM-dd"-->
                            <!--value-format="MM-dd"-->
                            <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--&lt;!&ndash;<el-input v-model="addForm.period" auto-complete="off" style="width:100px;" ></el-input>&ndash;&gt;期-->
                <!--</el-form-item>-->

                <!--<el-form-item label="标题：" prop="title">-->
                    <!--<el-input v-model="addForm.title"  auto-complete="off"  placeholder="不超过20个汉字" style="width:500px;"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item label="封面"  prop="cover" >
                    <el-upload
                               class="upload-demo"
                                action="/api/file/imageUpload/"
                                accept=".jpg,.png"
                                :limit="1"
                                :on-success="fileSuccess"
                                :on-error="fileError"
                                :before-remove="beforeRemove"
                                :on-exceed="handleExceed"
                                :file-list="fileList">
                        <el-button size="small" type="primary">点击上传图片</el-button>
                        <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传jpg/png图片文件</div>
                    </el-upload>
                </el-form-item>


                <!--<el-form-item label="老师：" prop="teacher_name">-->
                <!--<el-form-item label="老师：" prop="teacherName">-->
                <!--<el-select label="老师"  v-model="addForm.teacher_name"  placeholder="请选择老师" @change="changelaoshi(addForm.teacher_name)">-->
                   <!-- <el-form-item label="老师：" v-model="addForm.teacherName" prop="teacherName" @change="changelaoshi(addForm.teacherName)">
                    <el-select label="老师"  v-model="addForm.teacherId"  placeholder="请选择老师" @change="changelaoshi(addForm.teacherId)">
                    <el-option
                            v-for="(list,index) in teacherFrom"
                            :key="index"
                            :label="list.name"
                            :value="index">
                    </el-option>
                </el-select>
                </el-form-item>-->
                <el-form-item label="主讲老师：" prop="teacherName">
                    <el-select label="主讲老师"  v-model="addForm.teacherName"  placeholder="请选择主讲老师" @change="changelaoshi(addForm.teacherName)">
                        <el-option
                                v-for="(list,index) in teacherFrom"
                                :key="index"
                                :label="list.name"
                                :value="index"
                                :default="-1"
                                >
                        </el-option>
                    </el-select>
                </el-form-item>

                <!--<el-form-item label="课程简介："  prop="content">-->
                    <!--<el-input-->
                            <!--type="textarea"-->
                            <!--:rows="4"-->
                            <!--placeholder="请输入内容"-->
                            <!--v-model="addForm.content">-->
                    <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="播放地址："  prop="playAddress">-->
                    <!--<el-input-->
                            <!--type="input"-->
                            <!--placeholder="请输入内容"-->
                            <!--v-model="addForm.playAddress">-->
                    <!--</el-input>-->
                <!--</el-form-item>-->

                <!-- 2018-08-15 更改上传文件 -->

                <el-form-item label="视频文件" prop="playAddress">
                    <el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
                        <el-button size="small" type="primary">点击上传视频</el-button>
                        <div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="视频文件" prop="playAddress" style="display: none" >
                    <el-input   v-model="addForm.playAddress"></el-input>
                </el-form-item>











                <el-form-item label="时长："  prop="audioLength">

                    <el-input
                            type="input"
                            placeholder="此字段为服务器返回时长"
                            v-model="addForm.audioLength"
                            readonly="readonly"
                            style="width:25%"
                    ></el-input>
                </el-form-item>
                <!--<el-form-item label="PDF文件:"  prop="pdf" >-->
                    <!--<el-upload-->
                            <!--class="upload-demo"-->
                            <!--action="/api/uploadPdfController/pdfUpload/"-->
                            <!--accept=".pdf"-->
                            <!--:limit="1"-->
                            <!--:on-success="fileSuccess"-->
                            <!--:on-error="fileError"-->
                            <!--:before-remove="beforeRemove"-->
                            <!--:on-exceed="handleExceed"-->
                            <!--:file-list="fileList_pdf">-->
                        <!--<el-button size="small" type="primary">点击上传PDF文件</el-button>-->
                        <!--<div style="float: right;margin-left: 15px;" class="el-upload__tip">上传.pdf文件</div>-->
                    <!--</el-upload>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="老师：" prop="teacher_name">-->
                <el-form-item label="课程类型：" prop="type">
                    <!--<el-select label="视频类型"  v-model="addForm.type"  placeholder="请选择视频类型">-->
                    <el-select label="课程类型"  v-model="type"  placeholder="请选择课程类型">
                        <el-option value="-1" label="请选择课程类型">请选择课程类型</el-option>
                        <!--<el-option :value="item.value" :label="item.label" v-for="item in options"></el-option>-->
                        <el-option
                                v-for="(list,index) in courseTypeFrom"
                                :key="index"
                                :label="list.name"
                                :value="list.id"
                        >
                        </el-option>



                    </el-select>
                </el-form-item>
                <!--S: 2018-08-14 添加：发布时间 -->
                <el-form-item label="课程时间：" prop="createTime">
                    <el-date-picker
                            v-model="createTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="课程时间"
                            default-value="new Date()"
                    >
                    </el-date-picker>
                </el-form-item>
                <!--E: 2018-08-14 添加：发布时间 -->

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false; clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="BatchViewDialogTitle" :visible.sync="BatchViewDialogVisible" >
            <el-form  :model="viewlikeFrom" ref="viewlikeFrom"  label-width="80px"  class="demo-ruleForm"  >
                <el-form-item label="注水数" prop="count"  :rules="[{ required: true, message: '不能为空'}]">
                    <el-input type="number" v-model="viewlikeFrom.count" placeholder="请输入添加数量"  v-on:input="viewEvent(viewlikeFrom.count)"  style="width:220px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{viewlikeFrom.count}}</font>   个浏览吗？</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit()">确 定</el-button>
		    </span>
        </el-dialog>

    </section>
</template>

<script>

    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import moment from 'moment';
    export default {
        data() {
            var checktype = (rule, value, callback) => {
                alert(value);
                var arrayTemp = [];
                this.courseTypeFrom.forEach((value2)=>{
                    arrayTemp.push(value2.id);
                });
                alert(arrayTemp);
                setTimeout(() => {
                    if (!arrayTemp.includes(value)) {
                        callback(new Error("请选择课程类型！"));
                    } else {
                        callback();
                    }
                }, 500);
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
                        console.log("fds");
                    }
                }, 1000);
            };

            return {
                playAddressFileList:[],
                options: [{
                    value: 1,
                    label: '开盘见分晓'
                }, {
                    value: 2,
                    label: '盘面观察'
                }, {
                    value: 3,
                    label: '股市气象站'
                }, {
                    value: 4,
                    label: '行情研判'
                }
                ],
                value: '',
                filters: {
                    title: '',
                    type:'',
                    teacher:'',
                    createTime:'',
                    min:'',
                    max:'',
                },
                BatchViewDialogTitle:'',
                BatchViewDialogVisible:false,
                viewlikeFrom:{
                    type:'',
                    count:'',
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize:20,
                currentPage: 1,
                listLoading: false,
                createtimes:"",
                sels:[],//列表选中列
                FormVisible:false,

                //编辑界面数据
                editForm: {},
                //新增界面数据
                addForm: {

                },
                type:'',
                fileList:[],
                fileList_pdf:[],
                username:'',
                setVisible:false,
                // dialogTitle: "新增",
                dialogTitle: "添加视频",
                setForm:{},
                radio: '1',
                editOrAdd:false,
               editLoading: false,
                teacherFrom:[],
                courseTypeFrom:[],
                teachername:'',
                teacherName:'',
                teacherid:'',
                teacherId:'',
                createTime: new Date(), //2018-08-14新增字段：添加页面，可以选择发布时间。默认是当前时间。
                ZsLoading:false,
                editFormRules: {
                    title: [
                        // { required: true, message: "请输入标题", trigger: "blur" },
                        // { validator: checktitle, message: "限20个汉字以内", trigger: "blur", num: 40 }
                    ],
                    period:[
                        { required: true, message: "请输入期数", trigger: "blur" },
                        /*{ validator: checknumbers, message: "请输入数字 ", trigger: "blur"}*/
                    ],
                    cover:[
                        { required: true, message: "请上传图片", trigger: "blur" },
                    ],
                    audioLength:[
                        // { required: true, message: "请输入课程时长", trigger: "blur" },
                    ],
                    playAddress:[
                        { required: true, message: "请上传课程", trigger: "blur" },
                    ],
                    type:[
                        // { required: true, message: "请选择课程类型", trigger: "blur" },
                        // { validator: checktype, message: "请选择课程类型 ", trigger: "blur"}
                    ],
/*                    pdf:[
                        { required: true, message: "请上传pdf文件", trigger: "blur" },
                    ],*/
                    teacher_name:[
                        { required: true, message: "请选择老师", trigger: "blur" },
                    ],
                    content:[
                        { required: true, message: "请输入课程简介", trigger: "blur" },
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
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAF(response, fileList) {
                this.addForm.playAddress = ""
                this.addForm.audioLength = ""
            },
            handleChangeAddAF(response, file, fileList) {
                this.editLoading = true;

                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function () {
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {
                    _this.editLoading = false;
                    console.log("已发送");
                    var data = JSON.parse(evt.data)
                    _this.addForm.playAddress = data.origUrl
                    _this.addForm.audioLength = data.durationMsec
                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

                /*       let _this = this;
                       var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                       ws.onopen = function() {
                           ws.send(JSON.stringify(response))
                       }
                       ws.onmessage  = function (evt){
                           let res = JSON.parse(evt.data);
                           _this.editruleForm.play_address = res.origUrl
                           _this.editruleForm.video_length = res.durationMsec
                           ws.close();
                       }*/
                /*   this.editruleForm.play_address = response.origUrl
                   this.editruleForm.video_length = response.durationMsec
                   console.log(response.origUrl);
                   console.log(response.duration);*/
            },
            //获取列表
            async getList(){
                var time = "";
                if(this.createtimes != "" && this.createtimes != null){
                    var date =  new Date(this.createtimes);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    // var  h = date.getHours() + ':';
                    // var  m = date.getMinutes() + ':';
                    // var  s = date.getSeconds();
                    // result.list[i].create_time=Y+M+D+h+m+s;
                    time = Y+M+D;
                }
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    createtimes: this.filters.date,
                    title:this.filters.title,
                    teacherId:this.filters.teacher,
                    type:this.filters.type,
                };
                //console.log("aaaaa"+JSON.stringify(para));
                let result =  await api.cctvPage(para);
                // console.log(result);
                // console.log(result.list);


                // result.list.forEach((item,index) =>{
                //     this.courseTypeFrom.forEach((value) => {
                //         if(value.id == item.type){
                //             item.type = value.id;
                //
                //             return false;
                //         }else{
                //             item.type = "课程已下线";
                //         }
                //     });
                // })


                this.datas=result.list;
                this.total=result.total;
                //console.log("fdsfds:::"+ JSON.stringify(result));
            },
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },

            fileSuccess(response, file, fileList){
                console.log(JSON.stringify(file));
                if(response.status=="0")
                {
                    this.$message.error("上传失败");
                }
                else
                {
                    if(response.message.indexOf(".pdf")>-1)
                    {
                        this.addForm.pdf="http://app2.zslxt.com/pdf/"+ response.message;
                        this.fileList_pdf=[{name:this.addForm.pdf,url:this.addForm.pdf}];
                    }
                    else
                    {
                        // this.addForm.cover="http://app2.zslxt.com/image/"+response.message;
                        this.addForm.cover="http://61.235.151.220:10001/image/"+response.message;
                        this.fileList=[{name:this.addForm.cover,url:this.addForm.cover}];
                    }
                }
            },
            fileError(err, file, fileList){
                console.log(JSON.stringify(err));
               this.$message.error("上传文件失败");
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`).then(async () => {
                    if(file.name.indexOf(".pdf")>-1)
                    {
                        this.addForm.pdf="";
                        this.fileList_pdf=[];
                    }
                    else
                    {
                        this.addForm.cover="";
                        this.fileList=[];
                    }
                });
            },


            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;

                    var result = await api.cctvRecordDel(row.cctvId);
                    this.listLoading = false;
                    if(result.status=="1")
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
            //下线
            async handleOff(index, row) {
                this.$confirm('确认将此记录下线吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;

                    var result = await api.cctvRecordOffline(row.cctvId);
                    this.listLoading = false;
                    if(result.status=="1")
                    {
                        this.$message({
                            message: '下线成功',
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
                this.editOrAdd = false;
                this.FormVisible = true;
                this.addForm = Object.assign({}, row);//await api.findRiJianSo(row);

                console.log("编辑时候的addForm:"+JSON.stringify(this.addForm ));
                if (row.cover == null || row.cover=="")
                    this.fileList = [];
                else
                    this.fileList = [{name: row.cover, url: row.cover}];
                // console.warn(row)
                this.teacherName = row.teacherName;
                this.teacherId=row.teacherId;
                // console.info("获取的数据type为："+row.type)
                var aviableCourseTypeArr =[] ;
                this.courseTypeFrom.forEach(value => aviableCourseTypeArr.push(value.id));
                // console.error(aviableCourseTypeArr.includes(row.type))
                if(aviableCourseTypeArr.includes(row.type)==true){
                    this.type = row.type;
                }else{
                    // row.type = "-1";
                    // row.type = "当前课程类型已下线";
                    row.type = "-1";
                    // this.type = -1;
                }
                // this.courseTypeFrom.forEach(value =>{
                //     console.error(value.id);
                //     if(this.type == value.id){
                //         this.type = value.id;
                //     }else{
                //         this.type = -1;
                //     }
                // })
                this.type = row.type;

                this.addForm.audioLength = row.audioLength;
                this.createTime = row.createTime; //2018-08-14 新增 发布时间
                this.playAddressFileList =[{name: row.playAddress,url: row.playAddress}];
            },
            //显示新增界面
            handleAdd: function () {
                // this.dialogTitle = "新增";
                this.dialogTitle = "添加视频";
                this.editOrAdd = true;
                this.FormVisible = true;
                this.type='';
                this.addForm={
                    title:"",
                    period:"",
                    cover:"",
                    pdf:"",
                    teacher:"",
                    teacherName:"",
                    teacherId:"",
                    type:"",
                    playAddress:"",
                    content:"",
                    create_time:"",
                    audioLength:"",
                    createTime:"",
                    fileList:[],
                };
                this.teacherid="";
                this.teacherId="";
                this.teachername="";
                this.teacherName="";
                this.clearEdit();
               //this.$refs.editForm.resetFields();
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {};
                this.addForm = Object.assign({}, tmpObj);
                this.fileList=[];
                this.fileList_pdf=[];
                this.playAddressFileList=[];
            },

            //提交
            async editSubmit() {

                this.$refs.addForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            this.addForm.teacher_name=this.teachername; //2018-08-13,修改有bug，默认是上一个操作的老师名字
                            this.addForm.teacherName = this.teachername;//2018-08-13,修改有bug，默认是上一个操作的老师名字

                            // this.addForm.teacher_name=this.teacherName;//2018-08-14 修改昨天2018-08-13的bug
                            // this.addForm.teacherName = this.teacherName; //2018-08-14 修改昨天2018-08-13的bug


                            this.addForm.teacher=this.teacherid;//2018-08-13,修改有bug，默认是上一个操作的老师名字
                            this.addForm.teacherId = this.teacherid;//2018-08-13,修改有bug，默认是上一个操作的老师名字

                            // this.addForm.teacherId = this.teacherId;//2018-08-14 修改昨天2018-08-13的bug
                            // this.addForm.teacher=this.teacherId;//2018-08-14 修改昨天2018-08-13的bug










                            this.addForm.type = this.type;
                            this.addForm.createTime = this.createTime; //2018-8-14 新增发布时间
                            var result="";
                            if(this.editOrAdd){
                                let para = Object.assign({}, this.addForm);
                                console.log(para);
                               /* console.log(JSON.stringify(this.addForm));
                                let paraJson = JSON.stringify(this.addForm);*/
                                result= await api.cctvRecordAdd(para);
                                // result= await api.cctvRecordAdd(paraJson);
                            }else{
                                this.addForm.update_time=util.formatDate.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                                let para = Object.assign({}, this.addForm);
                                console.log(JSON.stringify(this.addForm));
                                // result= await api.updateShiZhanKe(para);
                                // result= await api.updateShiZhanKe(para);
                                result= await api.cctvRecordUpdate(para);
                            }
                            this.FormVisible = false;
                            if (result.status == "1") {
                                this.$message({ message: '提交成功', type: 'success' });
                                this.getList();
                            }
                            else
                            {
                                this.$message.error('提交失败');
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
            batchLikeView(type,title){

                this.viewlikeFrom={};
                this.viewlikeFrom.type=type;
                this.BatchViewDialogTitle=title;
                if (this.sels.length < 1) {
                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });
                    this.BatchViewDialogVisible = false;
                }
                else
                {
                    this.BatchViewDialogVisible = true;
                }
            },
            async batchViewSubmit(){
                this.$refs.viewlikeFrom.validate(async (valid) => {
                    if (valid) {
                        this.setInfuse(this.viewlikeFrom.type);
                        var dataArray = [];

                        for (var i = 0; i < this.sels.length; i++){

                            var para = {
                                actual_course_id: this.sels[i].actual_course_id,
                                like: this.sels[i].like,
                                view: this.sels[i].view,
                                t:this.sels[i].t,
                                zs_count:this.sels[i].zs_count,
                                play_address:this.sels[i].play_address
                            }
                            dataArray.push(para);
                        }

                        var result = await api.updateShiZhiKe_LikeViewCount(dataArray);

                        if (result.status == "1") {
                            this.$message({
                                message: '注水成功',
                                type: 'success'
                            });
                        }
                        else {
                            this.$message.error('注水失败');
                        }
                        this.BatchViewDialogVisible=false;
                        this.getList();
                    }
                })
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
                //console.log(JSON.stringify(this.teacherFrom));
            },
            changelaoshi:function(index){

                this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
                //console.log("index::::"+index +"teachername:::"+this.teachername+"name::::"+ this.teacherid);
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
            //时间格式化
            dateFormat:function(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },
            //时间格式化
            dateFormatCourseTime:function(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm");
            },
            async getCCTVCourseAvailableList(){
                let paras = {
                    flag:0
                };
                let lists=await api.cctvCourseAvailableList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.courseTypeFrom=arr;
                this.listLoading = false;
                // console.log(JSON.stringify(this.courseTypeFrom));
            },
            changeType:function(value){

                for (var p in this.courseTypeFrom) {
                    if(value == this.courseTypeFrom[p].id){
                        // console.error("传入id是："+value+",匹配到的是："+this.courseTypeFrom[p].id+"---"+this.courseTypeFrom[p].name);
                        return this.courseTypeFrom[p].name;
                    }
                }
                return "课程类型已下线";
            }
        },
        mounted() {
            this.selectTeacherList();
            this.getCCTVCourseAvailableList();
            this.getList();
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
</style>