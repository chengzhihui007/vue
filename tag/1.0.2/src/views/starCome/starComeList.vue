<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="title" placeholder="请输入标题关键字"></el-input>
				</el-form-item>


				<el-form-item>
					<el-select v-model="compere"  clearable  placeholder="请选择主持人">
						<el-option
								v-for="list in compereFrom"
								:key="list.id"
								:label="list.name"
								:value="list.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="teacher"  clearable  placeholder="请选择老师">
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
							v-model="update_time"
							type="date"
							placeholder="发布日期">
					</el-date-picker>
				</el-form-item>

				<br>

				<el-form-item>
					<el-select v-model="region" style="width:193px;"  clearable  placeholder="请输入指标">
						<!--<el-option label="请选择" value="0"></el-option>-->
						<el-option label="浏览量" value="1"></el-option>
						<el-option label="点赞量" value="2"></el-option>
						<!--<el-option label="评论量" value="3"></el-option>-->

					</el-select>

               </el-form-item>
				<el-form-item  >
					<el-col :span="11">
						<el-input v-model="selectMin" placeholder="请输入指标最低值"></el-input>
					</el-col>
					<el-col class="line" :span="1">-</el-col>
					<el-col :span="11">
						<el-input v-model="selectMax" placeholder="请输入指标最高值"></el-input>
					</el-col>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>

				<br />

				<el-form-item>
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"    @click="handleAdd">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchLike('0')" :disabled="false">点赞量注水-源达</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchView('0')" :disabled="false">播放量注水-源达</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchLike('1')" :disabled="false">点赞量注水-财源</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchView('1')" :disabled="false">播放量注水-财源</el-button>
				</el-form-item>
			</el-form>
		</el-col>






					<el-table :data="starComeTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
						<el-table-column
								type="selection"
								width="55">
						</el-table-column>
						<!--<el-table-column type="index" width="60">
						</el-table-column>
						-->
						<el-table-column prop="period" width="50" label="期数">
						</el-table-column>
						<el-table-column prop="title" label="标题"  width="300">
						</el-table-column>
						<el-table-column prop="compereName" label="主持人" width="120">
						</el-table-column>
						<el-table-column prop="teacherName" label="老师" width="120">
						</el-table-column>

						<el-table-column label="播放量-源达.实数|总数|公众号" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
								|
								<span>{{ scope.row.view }}</span>
                                |
								<span>{{ scope.row.view_gzh }}</span>
							</template>
						</el-table-column>

						<el-table-column label="点赞量-源达.实数|总数|公众号" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
								|
								<span>{{ scope.row.like }}</span>
                                |
								<span>{{ scope.row.like_gzh }}</span>
							</template>
						</el-table-column>


						<el-table-column label="播放量-财源.实数|总数" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.viewRCy)}">{{ scope.row.viewRCy }}</span>
								|
								<span>{{ scope.row.viewCy }}</span>

							</template>
						</el-table-column>

						<el-table-column label="点赞量-财源.实数|总数" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.likeRCy)}">{{ scope.row.likeRCy }}</span>
								|
								<span>{{ scope.row.likeCy }}</span>

							</template>
						</el-table-column>


						<el-table-column prop="share" label="源达.分享数" min-width="100" >
						</el-table-column>
						<el-table-column prop="shareCy" label="财源.分享数" min-width="100" >
						</el-table-column>


						<el-table-column prop="createTime" label="发布时间" width="220">
						</el-table-column>
						<el-table-column prop="updateTime" label="修改时间" width="220">
						</el-table-column>
						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--工具条-->
					<el-col :span="24" class="toolbar">
						<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
					</el-col>


		<!--批量点赞界面-->
		<el-dialog title="批量点赞" :visible.sync="BatchlikeDialogVisible"  center>


			<el-form  :model="likeFrom"  label-width="80px"    ref="likeFrom">


				<el-form-item>
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput,likeFrom.channel)"  :min="1" style="width:220px;"></el-input-number>


				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput,0,likeFrom.channel)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>

		<!--批量浏览界面-->
		<el-dialog title="批量浏览" :visible.sync="BatchViewDialogVisible"  center>


			<el-form  :model="viewFrom"  label-width="80px"    ref="viewFrom">


				<el-form-item>

					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput,viewFrom.channel)"  :min="1"  style="width:220px;" ></el-input-number>

				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{viewFrom.view}}</font>   个浏览吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit(viewFrom.batchViewInput,1,viewFrom.channel)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>


			<!--弹窗数据-->
			<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >
					<el-input v-if="false" v-model="editruleForm.star_come_id"  style="width:120px;"   ></el-input>
					<el-input v-if="false" v-model="editruleForm.video_length"  style="width:120px;"   ></el-input>
					<el-form-item label="期" prop="period">
					<!--	<el-input v-model="editruleForm.period"  style="width:120px;"   ></el-input>-->
						<el-input-number v-model="editruleForm.period" controls-position="right"   :min="1" ></el-input-number>
					</el-form-item>
					<el-form-item label="标题" prop="title">
						<el-input v-model="editruleForm.title"  style="width:400px;" auto-complete="off" placeholder="（限20个字以内）"></el-input>
                    </el-form-item>


					<el-form-item  label="封面"   prop="cover" >
						<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editruleForm.cover" :src="editruleForm.cover" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
                   </el-form-item>

					<el-form-item label="主持人" prop="compere" >
						<el-select  v-model="editruleForm.compere" multiple  clearable placeholder="--请选择主持人--"  >
							<el-option
									v-for="list in compereFrom"
									:key="list.id"
									:label="list.name"
									:value="list.id">
							</el-option>
						</el-select>
					</el-form-item>



					<el-form-item label="老师" prop="teacher" >
						<el-select  v-model="editruleForm.teacher"  clearable placeholder="--请选择主持人--"  >
							<el-option
									v-for="list in teacherFrom"
									:key="list.id"
									:label="list.name"
									:value="list.id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="课程简介" prop="content">
						<el-input type="textarea" :rows="5"   v-model="editruleForm.content"></el-input>
					</el-form-item>


					<el-form-item label="视频文件" prop="play_address">
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
							<el-button size="small" type="primary">点击上传视频</el-button>
							<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="视频文件" prop="play_address" style="display: none" >
						<el-input v-model="editruleForm.play_address"></el-input>
					</el-form-item>


					<el-form-item label="创建日期"  >
						<el-date-picker
								v-model="editruleForm.create_time"
								type="date"
								placeholder="选择创建日期">
						</el-date-picker>
						<font v-if="true" size="3" color="gray">{{"如果需要录入旧数据请选择该课程的创建时间,正常录入数据无需选择!"}}</font>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editclass = false">取 消</el-button>
					<el-button type="primary" @click="submiteditForm()" :loading="editLoading">确 定</el-button>
				</div>
			</el-dialog>

	</section>
</template>

<script>
    
    import {imageDefault} from "../../common/js/urls";
    import api from "../../api/api.js";

    export default {
        data() {
            var numbers = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };
            return {
                page:1,
                playAddressFileList: [],
                sels: [], //列表选中列
                BatchlikeDialogVisible:false,
                likeFrom:{

                    batchLikeInput:"",
                    like:"",
                    channel:""

                },
                BatchViewDialogVisible:false,
                viewFrom:{

                    batchViewInput:"",
                    view:""

                },
                editLoading: false,
                editOrAdd: false,
                editruleForm: {
                    period: "",
                    title: "",

                    compere: "",
                    teacher:"",
                    content:"",
                    cover:"",
                    star_come_id:"",
                    video_length:"",
                    play_address:""

                },
                listLoading: false,
                compereFrom:{},
                teacherFrom:{},
                compere:"",
                teacher:"",
                title:"",
                update_time:"",
                region:"",
                selectMin:"",
                selectMax:"",
                total: 0,
                pageSize: 15,
                currentPage: 1,
				loading: false,
                starComeTables: [],
                scorelist: [],
				editclass: false,
				editrules: {
                    play_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],
                    cover: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ],
                    compere: [
					{ required: true, message: '--请选择主持人--', trigger: 'change' }
			    	],
                    teacher: [
                        { required: true, message: '--请选择老师--', trigger: 'change' }
                    ],
                    period: [
                        { required: true, message: '请输入期数', trigger: 'blur' }
                     ],
                    content: [
                        { required: true, message: "请输入课程简介", trigger: "blur" }
                    ],
                    title:[
                        { required: true, message: "请输入标题", trigger: "blur" },
                            {
                                max:20,
                                trigger: "blur",
                                message: "内容超出限制"
                                /*validator: numbers,
                                message: "内容超出限制",
                                trigger: "blur",
                                num: 40*/
                            }
                        ]
                }



            };
        },

        methods: {
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAF(response, fileList) {
                this.editruleForm.play_address = ""
                this.editruleForm.video_length = ""
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
                    console.log(data);
                    _this.editruleForm.play_address = data.origUrl
                    _this.editruleForm.video_length = data.durationMsec

                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }
              /*  console.log(response);
				this.editruleForm.play_address = response.origUrl
                this.editruleForm.video_length = response.durationMsec
				console.log(response.origUrl);
                console.log(response.duration);*/
            },
            likeEvent(a,b){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a,
                    channel:b

                };

                //alert("1");

            },
            viewEvent(a,b){
                this.viewFrom ={
                    view:a,
                    batchViewInput:a,
                    channel:b

                };



                //alert("1");

            },
            batchLike(a){
                console.log(this.sels);
                this.likeFrom= {

                    batchLikeInput:"",
                    like:"",
                    channel:a

                }

                if(this.sels.length < 1){

                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });

                    this.BatchlikeDialogVisible = false;
                }else{
                    this.BatchlikeDialogVisible = true;
                }


            },
            batchView(a){
                this.viewFrom= {

                    batchViewInput:"",
                    view:"",
                    channel:a

                }

                if(this.sels.length < 1){

                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });

                    this.BatchViewDialogVisible = false;
                }else{
                    this.BatchViewDialogVisible = true;
                }


            },

            async   batchLikeSubmit(a,b,c){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].star_come_id
                    }else{
                        dataArray += ","+this.sels[i].star_come_id
                    }


                }
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:c,
                    model:"1",
					flag:b
                };

                console.log(para)
                let    resultVo =    await api.batchLikeAndViewAdd(para);
                this.editLoading = false;

                this.BatchlikeDialogVisible = false


                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: resultVo.message
                });


            /*    this.$message({
                    message: "批量点赞成功",
                    type: "success"
                });*/

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.star_come_id DESC "
                };
                this.starComePage(para);

			},
            async   batchViewSubmit(a,b,c){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].star_come_id
                    }else{
                        dataArray += ","+this.sels[i].star_come_id
                    }


                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:c,
                    model:"1",
                    flag:b
                };

                console.log(para)
                   await  api.batchLikeAndViewAdd(para);
                this.editLoading = false;

                this.BatchViewDialogVisible = false

          /*      this.$message({
                    message: "批量浏览成功",
                    type: "success"
                });*/

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: "注水成功!"
                });

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.star_come_id DESC "
                };
                this.starComePage(para);

            },
            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                            if (this.editOrAdd) {


                                let para = Object.assign({}, this.editruleForm);
                                para.compere = para.compere.join(',');
                                para.flag = 1;
                                para.channel = 0;
                                await api.starComeSave(para);
                            } else {
                             
                                let para = Object.assign({}, this.editruleForm);
                                console.log(para);
                                para.compere = para.compere.join(',');
                                para.flag = 0;
                                para.channel = 0;
                                await api.starComeSave(para);
                                console.log(para);
                            }
                            this.editclass = false;
                            this.$message({
                                message: "提交成功",
                                type: "success"
                            });
                            this.editLoading = false;

                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                                orderBy:"a.star_come_id DESC "
                            };
                            this.starComePage(para);

                        });
                    }
                });
			},
            handleDel: function(index, row) {
                this.$confirm("   您确定删除该记录吗？删除后前台将不再显示，该记录所有的关联数据将同时被删除", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        //NProgress.start();
                        console.log(row);
                        await api.starComeDel(row.star_come_id);

                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });

                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                            orderBy:"a.star_come_id DESC "
                        };
                        this.starComePage(para);


                    })
                    .catch(() => {});
            },

            handleAvatarSuccess(res, file) {

                this.editruleForm.cover =imageDefault+ res.message;
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
            getlist() {
                var  time = "";
               if(this.update_time != "" && this.update_time != null){

                   var d = new Date(this.update_time);

                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

               }


                var para ={
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.star_come_id DESC ",
                    title: this.title,
                    compere:this.compere+"",
                    teacher:this.teacher+"",
					updateTime: time,
					region: this.region,
					selectMin:this.selectMin,
					selectMax:this.selectMax
                };
                this.starComePage(
                    para
                );

            },
            async selectTeacherList(flag) {
                let paras = {
                    //pageNo: this.page,
                    //pageSize: 10,
					flag:flag
                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.teacherFrom=arr;
                this.listLoading = false;
            },
            async selectCompereList(flag) {
                let paras = {
                    //pageNo: this.page,
                    //pageSize: 10,
                    flag:flag

                };
                let lists=await api.selectPersonList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){
                    arr.push(lists[i]);
                }
                this.compereFrom=arr;
                this.listLoading = false;
            },
            handleCurrentChange(val) {
                this.page = val;

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.star_come_id DESC "
                };
                this.starComePage(
                    para
                );

            },
            async starComePage(keyword) {
               let result =  await api.starComePage(keyword);
             /*   for (let i = 0; i < result.list.length; i++) {
                    var view = result.list[i].view;
                    var viewR = result.list[i].viewR;
                    result.list[i].view =view+'，'+viewR;

                    var like = result.list[i].like;
                    var likeR = result.list[i].likeR;
                    result.list[i].like =like+'，'+likeR;
                }*/
                this.starComeTables = result.list;

                this.total = result.total;
            },
            handleAdd(){
                var periodAdd = 1;


         if(this.starComeTables.length == 0){
             console.log(1);
               periodAdd = 1
		 }else{
             console.log(parseInt(this.starComeTables[0].period)+1);
               periodAdd = parseInt(this.starComeTables[0].period)+1
		 }

                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    star_come_id:"",
                    period:periodAdd,
                    title:"",
                    play_address:"",
                    content:"",
                    compere:[],
                    teacher:"",
                    cover:"",
                    video_length:""
                }
                this.playAddressFileList = [];
                this.editruleForm = result;


                //begin
              /*  var socket;
                if(typeof(WebSocket) == "undefined") {
                    console.log("您的浏览器不支持WebSocket");
                }else {
                    console.log("您的浏览器支持WebSocket");
                }
                socket = new WebSocket("wss://localhost:9091/websocket");
                //打开事件
                socket.onopen = function() {
                    console.log("Socket 已打开");
                    //socket.send("这是来自客户端的消息" + location.href + new Date());
                };
                //获得消息事件
                socket.onmessage = function(msg) {
                    console.log("获取消息");
                    console.log(msg.data);

                    //发现消息进入    调后台获取
                    //getCallingList();
                };
                //关闭事件
                socket.onclose = function() {
                    console.log("Socket已关闭");
                };
                //发生了错误事件
                socket.onerror = function() {
                    alert("Socket发生了错误");
                }

			*/
                //end
			},
            handleEdit(index, row) {

                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    star_come_id:row.star_come_id,
                    period:row.period,
                    title:row.title,
                    play_address:row.play_address,
                    content:row.content,
                    compere:row.compere.split(","),
                    teacher:row.teacher+"",
                    cover:row.cover,
                    video_length:row.video_length

                }
                this.playAddressFileList = [
                    { name: row.play_address, url: row.play_address }
                ];

                this.editruleForm = result;

            }
            //-------------------------


        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.star_come_id DESC "
            };
            this.starComePage(para);
            this.selectTeacherList(0);
            this.selectCompereList(1);
          

        }
    };
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
	.active {
		color:blue;
	}
</style>




