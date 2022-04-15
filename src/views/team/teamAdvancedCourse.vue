<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="title" placeholder="请输入标题关键字"></el-input>
				</el-form-item>



		 

				


				<el-form-item>
					<el-date-picker
							v-model="update_time"
							type="date"
							placeholder="发布日期">
					</el-date-picker>
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
					<el-button type="primary"     @click="handleAdd">添加</el-button>
				</el-form-item>

                   <!-- <el-form-item>
					 
					<el-button type="primary"    @click="toSet">套系管理</el-button>
				</el-form-item> -->

                
				<el-form-item style="float:right;">
					<el-button type="primary"      @click="batchLike" :disabled="false">批量点赞</el-button>
				</el-form-item>
				<el-form-item style="float:right;">
					<el-button type="primary"     @click="batchView" :disabled="false">批量浏览量</el-button>
				</el-form-item>
                <el-form-item style="float:right;">
					<el-button type="primary"      @click="batchShare" :disabled="false">批量分享</el-button>
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
		 
           <el-table-column prop="bagName" label="锦囊管理"  width="150">
			</el-table-column>

			<el-table-column prop="setName" label="所属套系"  width="150">
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


            <el-table-column label="分享实数|总数" width="160">
				<template scope="scope">
					<span v-bind:class="{active: (scope.row.shareR)}">{{ scope.row.shareR }}</span>
					|
					<span>{{ scope.row.share }}</span>
                </template>
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
					<el-input-number v-model="likeFrom.batchLikeInput" controls-position="right" v-on:input ="likeEvent(likeFrom.batchLikeInput)"    style="width:220px;"></el-input-number>
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
					<el-input-number v-model="viewFrom.batchViewInput" controls-position="right" v-on:input ="viewEvent(viewFrom.batchViewInput)"   style="width:220px;" ></el-input-number>
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



        	<!--批量分享界面-->
		<el-dialog title="批量分享" :visible.sync="BatchShareDialogVisible"  center>


			<el-form  :model="shareFrom"  label-width="80px"    ref="shareFrom">


				<el-form-item>
					 
					<el-input-number v-model="shareFrom.batchShareInput" controls-position="right" v-on:input ="shareEvent(shareFrom.batchShareInput)"    style="width:220px;" ></el-input-number>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{shareFrom.share}}</font>   个分享吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchShareDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchShareSubmit(shareFrom.batchShareInput,2)" :loading="editLoading">确 定</el-button>
		    </span>
		</el-dialog>



		<!--弹窗数据-->
		<el-dialog title="添加" :visible.sync="editclass"  :close-on-click-modal="false" width="50%"  center>
			<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >
				<el-input v-if="false" v-model="editruleForm.advanced_course_id"  style="width:120px;"   ></el-input>
				<el-input v-if="false" v-model="editruleForm.video_length"  style="width:120px;"   ></el-input>
                <el-input v-if="false" v-model="editruleForm.team_id"  style="width:120px;"   ></el-input>   


                
                 <el-form-item label="选择锦囊" prop="bag_id" >
                <el-select  v-model="editruleForm.bag_id"    clearable placeholder="--请选择锦囊--"  >
                  <el-option
                      v-for="list in bagFrom"
                      :key="list.bag_id"
                      :label="list.name"
                      :value="list.bag_id">
                  </el-option>
                </el-select>
               
              </el-form-item>


             <el-form-item label="选择套系" prop="set_id" >
                <el-select  v-model="editruleForm.set_id"   
                              :disabled="!this.editOrAdd"
                           @change="selectSet(editruleForm.set_id,editruleForm.advanced_course_id)" 
                            clearable placeholder="--请选择套系--"  >
                  <el-option
                      v-for="list in setFrom"
                      :key="list.setId"
                      :label="list.name"
                      :value="list.setId">
                  </el-option>
                </el-select>
               
              </el-form-item>

				 

				<el-form-item label="期" prop="period">
					<!--<el-input v-model="editruleForm.period"  style="width:120px;"   ></el-input>-->

					<el-input-number v-model="editruleForm.period" controls-position="right"   :min="1" ></el-input-number>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="editruleForm.title"  style="width:400px;" auto-complete="off" placeholder="（限20个字以内）"></el-input>
				</el-form-item>


				<el-form-item  label="封面"   prop="cover" >
					<el-upload class="avatar-uploader" action="/api/file/imageUpload/"   accept=".jpg,.png"  :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="editruleForm.cover" :src="editruleForm.cover" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>



               	<el-form-item label="老师">
					{{this.team_name}}
				</el-form-item>
 

				<el-form-item label="课程简介" prop="content">
					<el-input type="textarea" :rows="5" :onkeyup="checkContent(editruleForm.content)"    v-model="editruleForm.content"></el-input>
                     {{this.checkMsg}}
				</el-form-item>

				<el-form-item label="视频文件" prop="play_address">
					<el-upload  class="upload-demo" action="https://wangyi.zslxt.com/cloud/ondemand/uploads" accept=".mp4" :on-success="handleChangeAddAF" :on-remove="handleRemoveAddAF" :limit="1" :on-exceed="handleExceed" :file-list="playAddressFileList">
						<el-button size="small" type="primary">点击上传视频</el-button>
						<div style="float: right;margin-left: 15px;" class="el-upload__tip">点击上传视频</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频文件" prop="play_address" style="display: none" >
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
                <el-form-item>
                   
                    <el-button @click="editclass = false">取 消</el-button>
                    <el-button type="primary" @click="submiteditForm()" :loading="editLoading">确 定</el-button>
              
                </el-form-item>
			</el-form>           
		</el-dialog>
	</section>
</template>

<script>
import {teamBagList,selectAdvancedForPeriod,teamAdvancedPageList,teamAdvancedSave,teamAdvancedDel,advancedCoursebatchViewAdd,teamSetPageList} from "../../api/ydApi.js";
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
                checkMsg:"",
                 team_id:"",
                team_name:"",
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
                BatchShareDialogVisible:false,
                shareFrom:{
                    batchShareInput:"",
                    share:""
                },
                editLoading: false,
                editOrAdd: false,
                editruleForm: {
                    period: "",
                    title: "",
                    play_address: "",
                    set_id:"",
                    bag_id:"",
                    content:"",
                    cover:"",
                    advanced_course_id:"",
                    pdf:"",
                    video_length:""

                },
                listLoading: false,

                teacherFrom:{},
                setFrom:{},
                bagFrom:{},
                columnFrom:{},
                column_id:"",
                teacher:"",
                title:"",
                update_time:"",
                region:"",
                selectMin:"",
                selectMax:"",
                total: 0,
                pageSize: 30,
                currentPage: 1,
                loading: false,
                boutiqueCourseTables: [],
                scorelist: [],
                editclass: false,
                editrules: {
                    play_address: [
                        { required: true, message: "请选择视频文件", trigger: "change" }
                    ],
                    set_id:[
                        { required: true, message: '--请选择套系--', trigger: 'change' }
                    ]
                    ,
                     bag_id:[
                        { required: true, message: '--请选择锦囊--', trigger: 'change' }
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
                            message: "（限20个字以内）"
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
                  getStrLenght(content) {
            var len=0;
             
             if(content == null){
                  content = ""; 
             }else{
                 
             }
            console.log(content.length);
            console.log(2);
                for (var i = 0; i < content.length; i++) {
                    var a = content.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//判断如果输的是汉字，字符串长度+2
                        len += 1;
                    }
                    else {
                        len += 0.5;
                    }
                }
                return len;
        },
           checkContent(content){
                let  len =    this.getStrLenght(content);
                this.checkMsg = len+"/50";
           },
               toSet(){
                  
                 let routeUrl = this.$router.resolve({
                    path: "/teamSet" 
                });
                window.open(routeUrl .href, '_blank');
            },
            async selectSet(a,b){

               
               if (!this.editOrAdd) {
                     this.editruleForm.flagMsg = true;
               }
               var para = {
                   set_id:this.editruleForm.set_id,
				   advanced_course_id:b
               };

            // var  a=  await  api.selectColumnForPeriod(para);
             console.log(para);
            selectAdvancedForPeriod(para).then(res => {
             console.log(res.data);

                    
                         console.log(res.data);
                                if(a == ""){
                                    this.editruleForm.period = 1;
                                    this.editruleForm.content = "";
                                }else{
                                    this.editruleForm.period = res.data.period;
                                    this.editruleForm.content = res.data.content;
                                }
                 });

            
           },
           async selectTeamSetList(para){

                       teamSetPageList(para).then(res => {
                    
                        let arr = [];
                        
                            for(let i=0;i<res.data.length;i++){
                                  console.log(res.data[i]);
                                  res.data[i].setId= res.data[i].setId+"";
                                arr.push(res.data[i]);

                            }
                            this.setFrom=arr;
                            this.listLoading = false;

                            });

            },
            async selectTeamBagList(para){
                   teamBagList(para).then(res => {
                    
                        let arr = [];
                        
                            for(let i=0;i<res.data.length;i++){
                                  console.log(res.data[i]);
                                  res.data[i].bag_id= res.data[i].bag_id+"";
                                arr.push(res.data[i]);

                            }
                            this.bagFrom=arr;
                            this.listLoading = false;

                            });
            },
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
				   advanced_course_id:b
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
            shareEvent(a){
                console.log(a);
                  this.shareFrom ={
                    share:a,
                    batchShareInput:a

                };
            },
            batchLike(){
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

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
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

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
            batchShare(){
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                    this.shareFrom= {

                    batchShareInput:"",
                    share:""

                }

                if(this.sels.length < 1){

                    this.$message({
                        message: "请选择至少选择一行！",
                        type: "error"
                    });

                    this.BatchShareDialogVisible = false;
                }else{
                    this.BatchShareDialogVisible = true;
                }

                
            },
            async    batchLikeSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].advanced_course_id
                    }else{
                        dataArray += ","+this.sels[i].advanced_course_id
                    }


                }
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    channel:2,
                    model:"1",
                    flag:b,
                    team_id:this.team_id
                };

                console.log(para)


                  
                     advancedCoursebatchViewAdd(para).then((res) => {
                                
                                 this.editLoading = false;
                                this.BatchlikeDialogVisible = false

                            /*   this.$message({
                                    message: "批量点赞成功",
                                    type: "success"
                                });*/

                                this.$notify({
                                    title: '提示',
                                    dangerouslyUseHTMLString: true,
                                    message: res.data.message
                                });

                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                    orderBy:"a.advanced_course_id DESC ",
                                    team_id:this.team_id
                                };
                                this.boutiqueCoursePage(para);

                            });


                //let    resultVo =       await api.bcBatchLikeAndViewAdd(para);
               

            },
           async batchShareSubmit(a,b){
               

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].advanced_course_id
                    }else{
                        dataArray += ","+this.sels[i].advanced_course_id
                    }

                }
                let formValue = Object.assign({}, this.shareFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.share,
                    channel:2,
                    model:"2",
                    flag:b,
                    team_id:this.team_id
                };

                console.log(para)


                advancedCoursebatchViewAdd(para).then((res) => {
                                
                                this.editLoading = false;
                                this.BatchShareDialogVisible = false
                                     

                            /* this.$message({
                                    message: "批量浏览成功",
                                    type: "success"
                                });*/
                                this.$notify({
                                    title: '提示',
                                    dangerouslyUseHTMLString: true,
                                    message: res.data.message
                                });

                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                    orderBy:"a.advanced_course_id DESC "  ,
                                      team_id:this.team_id
                                };
                                this.boutiqueCoursePage(para);

                            });


            },
            async   batchViewSubmit(a,b){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].advanced_course_id
                    }else{
                        dataArray += ","+this.sels[i].advanced_course_id
                    }

                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:2,
                    model:"1",
                    flag:b,
                    team_id:this.team_id
                };

                console.log(para)


                advancedCoursebatchViewAdd(para).then((res) => {
                                
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
                                    orderBy:"a.advanced_course_id DESC ",
                                    team_id:this.team_id
                                };
                                this.boutiqueCoursePage(para);

                            });


                  //await api.bcBatchLikeAndViewAdd(para);
                

            },

            selsChange: function(sels) {
                this.sels = sels;
            },
            submiteditForm(){

                 let  len  =    this.getStrLenght(this.editruleForm.content);
                    if(len > 50 ){

                            this.$message({
                                message: "课程简介（限50个汉字）！",
                                type: "error"
                            });
                            return  false;
                    }


                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                            if (this.editOrAdd) {


                                let para = Object.assign({}, this.editruleForm);

                                para.flag = 1;
                                para.channel = 0;
                                console.log(para);


                                
                                   teamAdvancedSave(para).then((res) => {
                                          this.editclass = false;
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                        this.editLoading = false;

                                        var para = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                            orderBy:"a.advanced_course_id DESC ",
                                            team_id:this.team_id
                                        };
                                        this.boutiqueCoursePage(para);
                                });


                               
                            } else {

                                let para = Object.assign({}, this.editruleForm);
								 
                                para.flag = 0;
                                para.channel = 0;
                                    teamAdvancedSave(para).then((res) => {
                                          this.editclass = false;
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                        this.editLoading = false;

                                        var para = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                            orderBy:"a.advanced_course_id DESC ",
                                           team_id:this.team_id
                                        };
                                        this.boutiqueCoursePage(para);
                                });
                            }
                          

                        });
                    }
                });
            },
            handleDel: function(index, row) {
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                
                this.$confirm("   您确定删除该记录吗？删除后前台将不再显示，该记录所有的关联数据将同时被删除", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        this.editOrAdd = false;
                        //NProgress.start();
                        console.log(row);
                        var pro = {
                            advanced_course_id:row.advanced_course_id,
                            team_id:this.team_id
                            //,column_id:row.column_id,

                        };
                        console.log(pro);


                               teamAdvancedDel(pro).then((res) => {
                                
                                           this.listLoading = false;
                                            this.$message({
                                                message: "删除成功",
                                                type: "success"
                                            });

                                            var para = {
                                                pageNo:this.page,
                                                pageSize:this.pageSize,
                                                orderBy:"a.advanced_course_id DESC ",
                                               team_id:this.team_id
                                            };
                                            this.boutiqueCoursePage(para);
                                    });

 


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
                    orderBy:"a.advanced_course_id DESC ",
                    title: this.title,
                    column_id:this.column_id,
                    teacher:this.teacher+"",
                    updateTime: time,
                    region: this.region,
                    selectMin:this.selectMin,
                    selectMax:this.selectMax,
                    team_id:this.team_id
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
                    orderBy:"a.advanced_course_id DESC ",
                    team_id:this.team_id
                };
                this.boutiqueCoursePage(
                    para
                );

            },
            async boutiqueCoursePage(keyword) {

                   teamAdvancedPageList(keyword).then(res => {
                    
                    this.boutiqueCourseTables = res.data.list;

                    this.total = res.data.total;


                });

               
            },
            handleAdd(){

                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }

                 var bag_idR = "";
                if(this.bagFrom.length == 1){
                    bag_idR = this.bagFrom[0].bag_id;
                }

                console.log(this.bagFrom.length);

                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    advanced_course_id:"",
                    period:"",
                    title:"",
                    play_address:"",
                    video_length:"",
                    content:"",
                    set_id:"",
                     bag_id:bag_idR,
                    cover:"",
					pdf:"",
                    flagMsg:false,
                    team_id:this.team_id
                }
                this.playAddressFileList = [];
                this.fileListEditPDF = [];
                this.editruleForm = result;
            },
            handleEdit(index, row) {
                if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

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
                    advanced_course_id:row.advanced_course_id,
                    period:row.period,
                    title:row.title,
                    play_address:row.play_address,
                    content:row.content,
                    set_id:row.set_id+"",
                    bag_id:row.bag_id+"",
                    //teacher:row.teacher+"",
                    cover:row.cover,
                    video_length:row.video_length,
                    flagMsg:false,
					pdf:row.pdf,
                    team_id:this.team_id

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



                console.log(result);
                this.editruleForm = result;

            },


            //-------------------------


        },
        mounted() {
             var user = sessionStorage.getItem('user');
            var userArray = JSON.parse(user);
            this.team_id = userArray.team_id;
            this.team_name = userArray.team_name;

            
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.advanced_course_id DESC ",
                team_id:this.team_id
            };
            this.boutiqueCoursePage(para);
            var paraSet = {
                
                team_id:this.team_id
            };
            this.selectTeamSetList(paraSet);
            this.selectTeamBagList({team_id:this.team_id});
             this.selectTeacherList(0);
            //this.selectColumnList();

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
    .el-dialog {
        height: 100%;
        overflow: auto;
    }
</style>




