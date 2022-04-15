<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="title" placeholder="请输入标题关键字"></el-input>
				</el-form-item>



				<el-form-item>
					<el-select v-model="column_id"  clearable  placeholder="请选择栏目">
						<el-option
								v-for="list in columnFrom"
								:key="list.column_id"
								:label="list.name"
								:value="list.column_id">
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

				<br>

				<el-form-item>
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"    @click="handleAdd">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchLike" :disabled="false">批量点赞</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"     @click="batchView" :disabled="false">批量增加浏览量</el-button>
				</el-form-item>
			</el-form>
		</el-col>






		<el-table :data="boutiqueCourseTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
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
			<el-table-column prop="columnName" label="所属栏目"  width="200">
			</el-table-column>
			<el-table-column prop="teacherName" label="老师" width="120">
			</el-table-column>
			<el-table-column prop="isPayName" width="100" label="是否付费">
			</el-table-column>
			<!--<el-table-column prop="like" label="点赞实数，总数" width="120">
			</el-table-column>-->

		<!--	<el-table-column prop="view" label="浏览实数，总数" width="120">
			</el-table-column>-->
			<el-table-column label="播放实数|总数" width="160">
				<template scope="scope">
					<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
					|
					<span>{{ scope.row.view }}</span>
               </template>
			</el-table-column>

			<el-table-column label="点赞实数|总数" width="160">
				<template scope="scope">
					<span v-bind:class="{active: (scope.row.likeR)}">{{ scope.row.likeR }}</span>
					|
					<span>{{ scope.row.like }}</span>
                </template>
			</el-table-column>
			<el-table-column prop="share" label="分享数" width="110">
			</el-table-column>
			<el-table-column prop="updateTime" label="发布时间" width="220">
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
				<!--	<el-input v-model="likeFrom.batchLikeInput" placeholder="请输入添加数量"    v-on:input ="likeEvent(likeFrom.batchLikeInput)"  style="width:220px;"></el-input>-->
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput)"  :min="1" style="width:220px;"></el-input-number>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput,0)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>

		<!--批量浏览界面-->
		<el-dialog title="批量浏览" :visible.sync="BatchViewDialogVisible"  center>


			<el-form  :model="viewFrom"  label-width="80px"    ref="viewFrom">


				<el-form-item>
					<!--<el-input v-model="viewFrom.batchViewInput" placeholder="请输入添加数量"  v-on:input="viewEvent(viewFrom.batchViewInput)"  style="width:220px;"></el-input>-->
					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput)"  :min="1"  style="width:220px;" ></el-input-number>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{viewFrom.view}}</font>   个浏览吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit(viewFrom.batchViewInput,1)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>


		<!--弹窗数据-->
		<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
			<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >
				<el-input v-if="false" v-model="editruleForm.boutique_course_id"  style="width:120px;"   ></el-input>
				<el-input v-if="false" v-model="editruleForm.video_length"  style="width:120px;"   ></el-input>

				<el-form-item label="发布于" prop="column_id" >
					<el-select  v-model="editruleForm.column_id"  @change="selectColumn(editruleForm.column_id,editruleForm.boutique_course_id)"  clearable placeholder="--请选择栏目--"  >
						<el-option
								v-for="list in columnFrom"
								:key="list.column_id"
								:label="list.name"
								:value="list.column_id">
						</el-option>
					</el-select>
					<font v-if="editruleForm.flagMsg" size="2" color="red">{{"编辑课程时不建议更改栏目和期数,如果需要修改请删除该课程从新编辑!"}}</font>
				</el-form-item>

				<el-form-item label="期" prop="period">
					<!--<el-input v-model="editruleForm.period"  style="width:120px;"   ></el-input>-->
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

				<el-form-item label="视频文件" prop="play_address"  v-if="this.video" >
					<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
						<el-button size="small" type="primary">点击上传视频</el-button>
						<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频文件" prop="play_address" v-if="this.video" style="display: none" >
					<el-input  v-model="editruleForm.play_address"></el-input>
				</el-form-item>

				<el-form-item label="PDF文件" >
					<el-upload  class="upload-demo" action="/api/uploadPdfController/pdfUpload/" accept=".pdf"  :on-success="handleChangeAddPDF"  :on-remove="handleRemoveAddPDF" :file-list="fileListEditPDF">
						<el-button size="small" type="primary">点击上传PDF文件</el-button>
						<div style="float: right;margin-left: 15px;" class="el-upload__tip">上传PDF文件</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="PDF地址"  style="display: none" >
					<el-input   v-model="editruleForm.pdf"></el-input>
				</el-form-item>


			<!--	<el-form-item label="创建日期"  >
					<el-date-picker
							v-model="editruleForm.create_time"
							type="date"
							placeholder="选择创建日期">
					</el-date-picker>
					<font v-if="true" size="3" color="gray">{{"如果需要录入旧数据请选择该课程的创建时间,正常录入数据无需选择!"}}</font>
				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editclass = false">取 消</el-button>
				<el-button type="primary" @click="submiteditForm()" :loading="editLoading">确 定</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
import {imageDefault,pdfDefault} from "../../common/js/urls";
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
                video:true,
                page:1,
                playAddressFileList: [],
                fileListEditPDF: [],
                sels: [], //列表选中列
                BatchlikeDialogVisible:false,
                likeFrom:{

                    batchLikeInput:"",
                    like:""

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
                    play_address: "",
                    column_id:"",
                    teacher:"",
                    content:"",
                    cover:"",
                    boutique_course_id:"",
                    pdf:"",
                    video_length:""

                },
                listLoading: false,

                teacherFrom:{},
                columnFrom:{},
                column_id:"",
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
                boutiqueCourseTables: [],
                scorelist: [],
                editclass: false,
                editrules: {
                    play_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],
                    column_id:[
                        { required: true, message: '--请选择栏目--', trigger: 'change' }
					]
					,
                    cover: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
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
                    title: [
                        { required: true, message: "请输入标题", trigger: "blur" },
                        {
                            max:20,
                            trigger: "blur",
                            message: "内容超出限制"
                           /* validator: numbers,
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
                    _this.editruleForm.play_address = data.origUrl
                    _this.editruleForm.video_length = data.durationMsec

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
            handleRemoveAddPDF() {
                this.editruleForm.pdf = "";
            },
            handleChangeAddPDF(response, file) {
                this.editruleForm.pdf = pdfDefault+ response.message;
            },
           async selectColumn(a,b){
                 
               if (!this.editOrAdd) {
                     this.editruleForm.flagMsg = true;
               }
               var para = {
                   column_id:this.editruleForm.column_id,
				   boutique_course_id:b
               };

             var  a=  await  api.selectColumnForPeriod(para);

             console.log(a);
              if(a == ""){
                  this.editruleForm.period = 1;
                  this.editruleForm.content = "";
			  }else{
                  this.editruleForm.period = a.period;
                  this.editruleForm.content = a.content;
              }
              
              if(a.columnName == "波浪个股解析"){
                    this.video = false;
              }else{
                  this.video = true;
              }
			},
            likeEvent(a){

                this.likeFrom ={
                    like:a,
                    batchLikeInput:a

                };

                //alert("1");

            },
            viewEvent(a){
                this.viewFrom ={
                    view:a,
                    batchViewInput:a

                };



                //alert("1");

            },
            batchLike(){
                this.likeFrom= {

                    batchLikeInput:"",
                    like:""

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
            batchView(){
                this.viewFrom= {

                    batchViewInput:"",
                    view:""

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

            async    batchLikeSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].boutique_course_id
                    }else{
                        dataArray += ","+this.sels[i].boutique_course_id
                    }


                }
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:0,
                    model:"1",
                    flag:b
                };

                console.log(para)
                let    resultVo =       await api.bcBatchLikeAndViewAdd(para);
                this.editLoading = false;
                this.BatchlikeDialogVisible = false

             /*   this.$message({
                    message: "批量点赞成功",
                    type: "success"
                });*/

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: resultVo.message
                });

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.boutique_course_id DESC "
                };
                this.boutiqueCoursePage(para);

            },
            async   batchViewSubmit(a,b){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].boutique_course_id
                    }else{
                        dataArray += ","+this.sels[i].boutique_course_id
                    }

                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:0,
                    model:"1",
                    flag:b
                };

                console.log(para)
                  await api.bcBatchLikeAndViewAdd(para);
                this.editLoading = false;
                this.BatchViewDialogVisible = false

               /* this.$message({
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
                    orderBy:"a.boutique_course_id DESC "
                };
                this.boutiqueCoursePage(para);

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

                                para.flag = 1;
                                para.channel = 0;
                                console.log(para);
                                await api.boutiqueCourseSave(para);
                            } else {

                                let para = Object.assign({}, this.editruleForm);
								 
                                para.flag = 0;
                                para.channel = 0;
                                await api.boutiqueCourseSave(para);
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
                                orderBy:"a.boutique_course_id DESC "
                            };
                            this.boutiqueCoursePage(para);

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
                        var pro = {
                            boutique_course_id:row.boutique_course_id,
                            column_id:row.column_id,

                        };
                        console.log(pro);
                        await api.deleteBoutiqueCourse(pro);

                        this.listLoading = false;
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });

                        var para = {
                            pageNo:this.page,
                            pageSize:this.pageSize,
                            orderBy:"a.boutique_course_id DESC "
                        };
                        this.boutiqueCoursePage(para);


                    })
                    .catch(() => {});
            },

            handleAvatarSuccess(res, file) {
                this.editruleForm.cover =imageDefault+ res.message;
                //this.editruleForm.cover ='http://192.168.11.103:10001/image/' + res.message;
                
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
                    time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                }


                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.boutique_course_id DESC ",
                    title: this.title,
                    column_id:this.column_id,
                    teacher:this.teacher+"",
                    updateTime: time,
                    region: this.region,
                    selectMin:this.selectMin,
                    selectMax:this.selectMax
                };
                this.boutiqueCoursePage(
                    para
                );

            },
            async selectColumnList(){

                let lists=await api.getColumnPage();
                let arr = [];
                for(let i=0;i<lists.length;i++){

                    arr.push(lists[i]);

                }
                this.columnFrom=arr;
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
                    orderBy:"a.boutique_course_id DESC "
                };
                this.boutiqueCoursePage(
                    para
                );

            },
            async boutiqueCoursePage(keyword) {
                let result =  await api.boutiqueCoursePage(keyword);
           /*     for (let i = 0; i < result.list.length; i++) {
                    var view = result.list[i].view;
                    var viewR = result.list[i].viewR;
                    result.list[i].view =view+'，'+viewR;

                    var like = result.list[i].like;
                    var likeR = result.list[i].likeR;
                    result.list[i].like =like+'，'+likeR;
                }*/
                this.boutiqueCourseTables = result.list;

                this.total = result.total;
            },
            handleAdd(){

                
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    boutique_course_id:"",
                    period:"",
                    title:"",
                    play_address:"",
                    video_length:"",
                    content:"",

                    teacher:"",
                    cover:"",
					pdf:"",
                    flagMsg:false
                }
                this.playAddressFileList = [];
                this.fileListEditPDF = [];
                this.editruleForm = result;
            },
            handleEdit(index, row) {
                if(row.columnName == "波浪个股解析"){
                    this.video = false;
                }else{
                    this.video = true;
                }
                console.log(row);
                this.fileListEditPDF = [];
                let objPDF = new Object({
                    url: row.pdf,
                    name: row.pdf
                });
                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    boutique_course_id:row.boutique_course_id,
                    period:row.period,
                    title:row.title,
                    play_address:row.play_address,
                    content:row.content,
                    column_id:row.column_id+"",
                    teacher:row.teacher+"",
                    cover:row.cover,
                    video_length:row.video_length,
                    flagMsg:false,
					pdf:row.pdf

                }
                console.log(row.play_address);

                this.playAddressFileList = [
                    { name: row.play_address, url: row.play_address }
                ];


                if (
                    row.pdf != "" &&
                    row.pdf != "null"
                ) {
                    this.fileListEditPDF.push(objPDF);
                }


                this.editruleForm = result;

            },


            //-------------------------


        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.boutique_course_id DESC "
            };
            this.boutiqueCoursePage(para);
            this.selectTeacherList(0);
            this.selectColumnList();

        }
    };
</script>
<style  >
	.el-dialog.el-dialog--small{
		overflow-x: hidden;
	}
	.el-dialog__body{
		max-height: 800px;
/*		overflow-y: auto;
		margin-right: -14px;
		padding-right: 34px;*/
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
	.active {
		color:blue;
	}
</style>




