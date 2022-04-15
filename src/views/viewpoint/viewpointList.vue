<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">


                <el-form-item>
                    <el-input v-model="content" placeholder="请输入内容关键字"></el-input>
                </el-form-item>


				<el-form-item>
					<el-input v-model="label_name" placeholder="请输入标签关键字"></el-input>
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
							v-model="create_time"
							type="date"
							placeholder="发布日期">
					</el-date-picker>
				</el-form-item>

				<br>

				<el-form-item>
					<el-select v-model="region" style="width:193px;"  clearable  placeholder="请输入指标">
						<!--<el-option label="请选择" value="0"></el-option>-->

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

				<br>

				<el-form-item>
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"    @click="handleAdd">添加</el-button>
				</el-form-item>

				<el-form-item>
					<el-button type="primary"     @click="batchLike('1')" :disabled="false">点赞量注水-财源</el-button>
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



                        <el-table-column   label="内容"      width="300">
                            <template scope="scope">
                                <span>{{ scope.row.content }}</span>
                                <br>


                                <audio :src="scope.row.url" controls="controls" v-if="scope.row.contentMsg == '1'"></audio>

                                <img :src="scope.row.url" width="100" height="100"  v-if="scope.row.contentMsg == '2'" />


                                <video :src="scope.row.url"  height="150" width="200"  controls="controls" v-if="scope.row.contentMsg == '3'"></video>
                            </template>
                        </el-table-column>

                        <el-table-column prop="messageTypeName" label="信息类型" width="120">
                        </el-table-column>

                        <el-table-column prop="label_name" label="标签" width="120">
                        </el-table-column>

						<el-table-column prop="teacherName" label="老师" width="120">
						</el-table-column>





						<el-table-column label="点赞量-财源.实数|总数" width="160">
							<template scope="scope">
								<span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
								|
								<span>{{ scope.row.like }}</span>

							</template>
						</el-table-column>



						<el-table-column prop="share" label="财源.分享数" min-width="100" >
						</el-table-column>


						<el-table-column prop="create_time" label="发布时间" width="220">
						</el-table-column>
						<el-table-column prop="update_time" label="修改时间" width="220">
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




			<!--弹窗数据-->
			<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
				<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >
					<el-input v-if="false" v-model="editruleForm.viewpoint_id"  style="width:120px;"   ></el-input>
					<el-input v-if="false" v-model="editruleForm.video_length"  style="width:120px;"   ></el-input>


					<el-form-item label="标签"   >
						<el-select  v-model="editruleForm.label_type"   @change="selectLableNameList(editruleForm.label_type)"     >
							<!--<el-option
									v-for="list in lableFrom"
									:key="list.type"
									:label="list.type"
									:value="list.type">
							</el-option>-->
							<el-option label="营销性标签" value=1></el-option>
							<el-option label="非营销性标签" value=2></el-option>
						</el-select>

						<el-select  v-model="editruleForm.label_name"    >
							<el-option label="请选择" value=""></el-option>
							<el-option
									v-for="list in lableNameFrom"
									:key="list.name"
									:label="list.name"
									:value="list.name">
							</el-option>
						</el-select>
					</el-form-item>


					<el-form-item label="老师" prop="teacher" >
						<el-select  v-model="editruleForm.teacher"  clearable placeholder="--请选择老师--"  >
							<el-option
									v-for="list in teacherFrom"
									:key="list.id"
									:label="list.name"
									:value="list.id">
							</el-option>
						</el-select>
					</el-form-item>


                    <el-form-item label="信息类型" prop="messageType">
                        <el-select v-model="editruleForm.messageType"  @change="selectmessageType(editruleForm.messageType)"     placeholder="请选择信息类型">
                            <!--<el-option label="请选择" value="0"></el-option>-->
                            <el-option label="文本" value=1></el-option>
                            <el-option label="语音" value=2></el-option>
                            <el-option label="图片" value=3></el-option>
                            <el-option label="视频" value=4></el-option>
                            <el-option label="文本+语音" value=5></el-option>
                            <el-option label="文本+图片" value=6></el-option>
                            <el-option label="文本+视频" value=7></el-option>

                        </el-select>
                    </el-form-item>


					<el-form-item label="观点内容"  prop="content"  v-show="contentFlag" >
						<el-input type="textarea" :rows="5"   v-model="editruleForm.content"></el-input>
					</el-form-item>

					<el-form-item  label="图片"    prop="cover"  v-show="coverFlag" >
						<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editruleForm.cover" :src="editruleForm.cover" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
                   </el-form-item>


					<el-form-item label="语音观点"  prop="play_address"  v-show="play_addressFlag" >
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
							<el-button size="small" type="primary">点击上传语音</el-button>
							<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传语音</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="语音文件"  prop="play_address" style="display: none" >
						<el-input v-model="editruleForm.play_address"></el-input>
					</el-form-item>

					<el-form-item label="视频标题"   prop="video_name" v-show="video_addressFlag" >
						<el-input v-model="editruleForm.video_name"  style="width:400px;" auto-complete="off" ></el-input>
					</el-form-item>

					<el-form-item label="视频观点"  prop="video_address" v-show="video_addressFlag" >
						<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAFvideo" :on-remove="handleRemoveAddAFvideo" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileListvideo">
							<el-button size="small" type="primary">点击上传视频</el-button>
							<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="视频文件"  prop="video_address" style="display: none" >
						<el-input v-model="editruleForm.video_address"></el-input>
					</el-form-item>

					<el-form-item  label="视频封面"   prop="video_image"  v-show="video_addressFlag"  >
						<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarSuccessVideo" :before-upload="beforeAvatarUpload">
							<img v-if="editruleForm.video_image" :src="editruleForm.video_image" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
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
	import util from "../../common/js/util";
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
                label_name:"",
                content:"",
                contentFlag:false,
                coverFlag:false,
                play_addressFlag:false,
                video_addressFlag:false,
                page:1,
                playAddressFileList: [],
                playAddressFileListvideo:[],
                sels: [], //列表选中列
                BatchlikeDialogVisible:false,
                likeFrom:{

                    batchLikeInput:"",
                    like:"",
                    channel:""

                },
                editLoading: false,
                editOrAdd: false,
                editruleForm: {

                  /*  teacher:"",
                    content:"",
                    cover:"",
                    viewpoint_id:"",
                    video_length:"",
                    play_address:"",
                    messageType:"",
                    video_name:"",
                    video_image:"",
                    label_name:"",
                    label_type:""*/

                },
                listLoading: false,
                teacherFrom:{},
                lableFrom:{},
                lableNameFrom:{},
                teacher:"",
                create_time:"",
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

                    teacher: [
                        { required: true, message: '--请选择老师--', trigger: 'change' }
                    ],
                    messageType: [
                        { required: true, message: '--请选择信息类型--', trigger: 'change' }
                    ]

                 /*   video_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],

                    play_address: [
                        { required: true, message: "请选择语音文件", trigger: "change" }
                    ],
                    cover: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ],

                    video_image: [
                        { required: true, message: "请选择视频封面文件", trigger: "change" }
                    ],



                    content: [
                        { required: true, message: "请输入观点内容", trigger: "blur" }
                    ],
                    video_name:[
                        { required: true, message: "请输入视频标题", trigger: "blur" }

                    ]*/
                }



            };
        },

        methods: {

            checkLableName(row){

                if(row.label_type){
                    //alert(row.label_type);
                    this.selectLableNameList(row.label_type);
				}
			},
            selectLableNameList(flag){

                 this.editruleForm.label_name ="";
                this.selectLableName(flag);

			},
            checkForm(row){
                var flag = "0";
                switch(row.messageType)
                {
                    case "1":


                        if(!row.content){ // "",null,undefined,NaN
                            flag = "文本";
                        }

                        break;
                    case "2":

                        if(!row.play_address){
                            flag = "语音";
                        }

                        break;
                    case "3":
                        if(!row.cover){
                            flag =  "图片";
                        }


                        break;
                    case "4":

                        if(!row.video_address ){
                            flag ="视频";
                        }
                        if(!row.video_image ){
                            flag = "视频";
                        }

                        if(!row.video_name ){
                            flag = "视频";
                        }


                        break;
                    case "5":
                        if(!row.content ){
                            flag = "文本+语音";
                        }

                        if(!row.play_address ){
                            flag = "文本+语音";
                        }


                        break;
                    case "6":
                        if(!row.content ){
                            flag ="文本+图片";
                        }

                        if(!row.cover ){
                            flag ="文本+图片";
                        }


                        break;
                    case "7":
                        if(!row.content ){
                            flag ="文本+视频";
                        }

                        if(!row.video_address ){
                            flag ="文本+视频";
                        }
                        if(!row.video_name ){
                            flag = "文本+视频";
                        }

                        if(!row.video_image ){
                            flag ="文本+视频";
                        }

                        break;

                }

                return flag;
			},
            formattContent(row) {

                console.log(row);

                switch(row.messageType)
                {
                    case "1":

                     return  row.content;
                      break;
                    case "2":

                        return  "【语音】 链接:"+row.play_address;
                        break;
                    case "3":

                        return  "【图片】 链接:"+row.cover;

                        break;
                    case "4":
                        return  "【视频】 链接:"+row.video_address;
                        break;
                    case "5":
                        return  row.content+"【语音】 链接:"+row.play_address;

                        break;
                    case "6":
                        return  row.content+"【图片】 链接:"+row.cover;
                        break;
                    case "7":
                        return  row.content+"【视频】 链接:"+row.video_address;
                        break;

                }


            },

            selectmessageType(flag){
                console.log(flag);
                this.hiddenClearMessage();
                switch(flag)
                {
                    case "1":

                        this.contentFlag=true;

                        break;
                    case "2":
                        this.play_addressFlag=true;
                        break;
                    case "3":
                        this.coverFlag=true;
                        break;
                    case "4":
                       this.video_addressFlag =true;
                        break;
                    case "5":
                        this.contentFlag=true;
                        this.play_addressFlag=true;

                        break;
                    case "6":
                        this.contentFlag=true;
                        this.coverFlag=true;
                        break;
                    case "7":
                        this.contentFlag=true;
                        this.video_addressFlag =true;
                        break;

                }
                
                
            },
            hiddenClearMessage(){
                    this.contentFlag=false;
                    this.editruleForm.content ="";
                    this.coverFlag=false;
                    this.editruleForm.cover ="";
                    this.play_addressFlag=false;
                    this.editruleForm.play_address ="";
                    this.video_addressFlag=false;
                    this.editruleForm.video_address ="";
                    this.video_name ="";
                    this.editruleForm.video_image ="";
                    this.playAddressFileList = [];
                    this.playAddressFileListvideo = [];
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },
            handleRemoveAddAFvideo(response, fileList) {
                this.editruleForm.video_address = ""
                this.editruleForm.video_length = ""
            },
            handleChangeAddAFvideo(response, file, fileList) {
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
                    _this.editruleForm.video_address = data.origUrl
                    _this.editruleForm.video_length = data.durationMsec

                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

            },


            handleRemoveAddAF(response, fileList) {
                this.editruleForm.play_address = ""
                this.editruleForm.play_length = ""

            },
            handleChangeAddAF(response, file, fileList) {
                 this.editLoading = true;

                var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
                ws.onopen = function (){
                    console.log('已连接')
                    ws.send(JSON.stringify(response));
                };
                var _this = this
                ws.onmessage = function (evt) {
                     _this.editLoading = false;
                    console.log("已发送");
                    var data = JSON.parse(evt.data)
                    _this.editruleForm.play_address = data.origUrl
                    _this.editruleForm.play_length = data.durationMsec

                    ws.close()
                };
                ws.onclose = function () {
                    console.log("连接已关闭...");
                }

            },
            likeEvent(a,b){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a,
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


            async   batchLikeSubmit(a,b,c){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].viewpoint_id
                    }else{
                        dataArray += ","+this.sels[i].viewpoint_id
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
                let    resultVo =    await api.batchLikeviewPointAdd(para);
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
                    orderBy:"a.viewpoint_id DESC "
                };
                this.starComePage(para);

			},

            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

                var flag =   this.checkForm(this.editruleForm);

                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        if (flag  != "0"){
                            this.$message({
                                message: flag+" 模版不能为空！",
                                type: "error"
                            });
                            return false;
						}
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                            if (this.editOrAdd) {

                                console.log(this.editruleForm);
                                //return false;

                                let para = Object.assign({}, this.editruleForm);

                                para.flag = 1;
                                para.channel = 0;
                                await api.viewPointSave(para);
                            } else {
                             
                                let para = Object.assign({}, this.editruleForm);
                                console.log(para);

                                para.flag = 0;
                                para.channel = 0;
                                await api.viewPointSave(para);
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
                                orderBy:"a.viewpoint_id DESC "
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
                        await api.viewPointDel(row.viewpoint_id);

                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });

                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                            orderBy:"a.viewpoint_id DESC "
                        };
                        this.starComePage(para);


                    })
                    .catch(() => {});
            },

            handleAvatarSuccessVideo(res, file) {


                this.editruleForm.video_image =imageDefault+ res.message;
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
               if(this.create_time != "" && this.create_time != null){

                   var d = new Date(this.create_time);

                      time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

               }


                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.viewpoint_id DESC ",
                    teacher:this.teacher+"",
					updateTime: time,
                    content:this.content,
					region: this.region,
					selectMin:this.selectMin,
					selectMax:this.selectMax,
                    label_name:this.label_name
                };
                this.starComePage(
                    para
                );

            },

            async selectLableName(name){
               // this.editruleForm.label_name = "";

                let paras = {

                    type:name

                };
                let lists=await api.selectViewPointLableList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.lableNameFrom=arr;
                this.listLoading = false;
            },
            async selectLableType(name){
                let paras = {

                    type:name

                };
                let lists=await api.selectViewPointLableList(paras);
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.lableFrom=arr;
                this.listLoading = false;

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

            handleCurrentChange(val) {
                this.page = val;

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.viewpoint_id DESC "
                };
                this.starComePage(
                    para
                );

            },
            async starComePage(keyword) {
               let result =  await api.viewPointListPage(keyword);
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

                this.lableNameFrom ={};
                this.hiddenClearMessage()


                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    viewpoint_id:"",
                    video_name:"",
                    video_address:"",
                    video_name:"",
                    video_image:"",
                    messageType:"",
                    play_address:"",
                    play_length:"",
                    content:"",
                    label_name:"",
                    //label_type:"",
                    teacher:"",
                    cover:"",
                    video_length:""
                }
                this.playAddressFileList = [];
                this.playAddressFileListvideo = [];

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
                console.log(row);



                this.checkLableName(row);
                //this.formattContent(row);
                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    viewpoint_id:row.viewpoint_id,
                    play_address:row.play_address,
                    content:row.content,
                    teacher:row.teacher+"",
                    cover:row.cover,
                    video_length:row.video_length

                }
                this.playAddressFileList = [
                    { name: row.play_address, url: row.play_address }
                ];

                this.playAddressFileListvideo = [
                    { name: row.video_address, url: row.video_address }
                ];


                row.teacher =  row.teacher+"";
                this.selectmessageType(row.messageType);
                 this.editruleForm = { ...row };


            }
            //-------------------------


        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.viewpoint_id DESC "
            };
            this.starComePage(para);
            this.selectTeacherList(0);
            this.selectLableType("");

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




