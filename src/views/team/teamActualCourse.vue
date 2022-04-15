<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.title" placeholder="请输入标签关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select  v-model="filters.teacher" placeholder="请选择老师" >
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
                            type="datetime"
                            placeholder="发布时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-select v-model="filters.type" placeholder="请选择指标">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="点赞量" value="like"></el-option>
                        <el-option label="播放量" value="view"></el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.min" placeholder="请输入最低指标"></el-input>
                    </el-form-item>
                    <el-form-item>
                        -
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.max" placeholder="请输入最高指标"></el-input>
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

                <div>
                    <el-form-item>
                        <el-button type="primary"  @click="handleAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  v-if=" username!=='quanzi1'"  @click.native="batchLikeView('like','批量点赞')">批量点赞</el-button>
                        <el-button type="primary"  v-if=" username!=='quanzi1'"  @click.native="batchLikeView('view','批量浏览')">批量浏览</el-button>
                      	<el-button type="primary"     @click="batchShare" :disabled="false">批量分享</el-button>
				 </el-form-item>  
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="period" label="期数" min-width="100"></el-table-column>
            <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
             <el-table-column prop="bagName" label="锦囊管理"  width="150">
               </el-table-column>
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
            <el-table-column prop="create_time" label="发布时间" min-width="100" ></el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small"   @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row.actual_course_id)">删除</el-button>
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
                   
                 <el-form-item label="选择锦囊" prop="bag_id" >
                <el-select  v-model="addForm.bag_id"    clearable placeholder="--请选择锦囊--" @change="changebag(addForm.bag_id)" >
                  <el-option
                      v-for="list in bagFrom"
                      :key="list.bag_id"
                      :label="list.name"
                      :value="list.bag_id">
                  </el-option>
                </el-select>
               
              </el-form-item>
                 <el-form-item label="标题：" prop="title">
                    <el-input v-model="addForm.title"  auto-complete="off"  placeholder="不超过20个汉字" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="期数：" prop="period">
                    <el-date-picker
                            v-model="addForm.period"
                            type="date"
                            format="MM-dd"
                            value-format="MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                    <!--<el-input v-model="addForm.period" auto-complete="off" style="width:100px;" ></el-input>-->期
                </el-form-item>
                <el-form-item label="封面图片"  prop="cover" >
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

             	<el-form-item label="老师"  v-model="addForm.team_id"  >
					{{this.team_name}}
				</el-form-item>

                <el-form-item label="课程简介："  prop="content">
                    <el-input
                            type="textarea"
                            :rows="5" :onkeyup="checkContent(addForm.content)"
                            placeholder="请输入内容"
                            v-model="addForm.content">
                    </el-input>
                     {{this.checkMsg}}
                </el-form-item>


                <el-form-item label="PDF文件:"  prop="pdf" >
                    <el-upload
                            class="upload-demo"
                            action="/api/uploadPdfController/pdfUpload/"
                            accept=".pdf"
                            :limit="1"
                            :on-success="fileSuccess"
                            :on-error="fileError"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            :file-list="fileList_pdf">
                        <el-button size="small" type="primary">点击上传PDF文件</el-button>
                        <div style="float: right;margin-left: 15px;" class="el-upload__tip">上传.pdf文件</div>
                    </el-upload>
                </el-form-item>



            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false; clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
          <!--批量浏览界面--><!--批量点赞界面-->
        <el-dialog :title="BatchViewDialogTitle" :visible.sync="BatchViewDialogVisible" >
            <el-form  :model="viewlikeFrom" ref="viewlikeFrom"  label-width="80px"  class="demo-ruleForm"  >
                <el-form-item label="注水数" prop="count"  :rules="[{ required: true, message: '不能为空'}]">
                    <el-input type="number" v-model="viewlikeFrom.count" placeholder="请输入添加数量"  v-on:input="viewEvent(viewlikeFrom.count)"  style="width:220px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <p>您确定为这些标题手动增加 <font size="5" color="red">{{viewlikeFrom.count}}</font>   个吗？</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchViewSubmit()">确 定</el-button>
		    </span>
        </el-dialog>
          	<!--批量分享界面-->
		<el-dialog title="批量分享" :visible.sync="BatchShareDialogVisible"  center>


			<el-form  :model="shareFrom"  label-width="80px"    ref="shareFrom">


				<el-form-item>
					 
					<el-input-number v-model="shareFrom.batchShareInput" controls-position="right" v-on:input ="shareEvent(shareFrom.batchShareInput)"  :min="1"  style="width:220px;" ></el-input-number>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{shareFrom.share}}</font>   个分享吗？</p>
				</el-form-item>
			</el-form>


			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchShareDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchShareSubmit(shareFrom.batchShareInput,2)" >确 定</el-button>
		    </span>
		</el-dialog>
    </section>
</template>

<script>
    import api from "../../api/api.js";
    import {imageDefault,pdfDefault} from "../../common/js/urls";
    import util from '../../common/js/util';
    import {teamBagList,updateShiZhiKe_LikeViewCount,getShiZhanKeList,addShiZhanKe,updateShiZhanKe,deleteShiZhanKe,Verification,updateShareCount} from "../../api/ydApi.js";
    export default {
        data() {
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
                      //  console.log("fds");
                    }
                }, 1000);
            };

            return {
                options:[],
                value: '',
                team_id:"",
                team_name:"",
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
                BatchlikeDialogVisible:false,
                
                viewlikeFrom:{
                    type:'',
                    count:'',
                },
                BatchShareDialogVisible:false,
                shareFrom:{
                    batchShareInput:"",
                    share:""
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize:30,
                currentPage: 1,
                listLoading: false,

                sels:[],//列表选中列
                FormVisible:false,

             
                //新增界面数据
                addForm: {
                     period: "",
                    title: "",
                    play_address: "",
                    bag_id:"",
                 
                    content:"",
                    cover:"",
                    actual_course_id:"",
                    pdf:"",
                    video_length:""
                },
                fileList:[],
                fileList_pdf:[],
                 bagFrom:{},
                username:'',
                setVisible:false,
                dialogTitle: "新增",
                setForm:{},
                radio: '1',
                editOrAdd:false,
               editLoading: false,
                teacherFrom:[],
                teachername:'',
                teacherid:'',
                bag_id:'',
                ZsLoading:false,
                editFormRules: {
                    title: [
                        { required: true, message: "请输入标题", trigger: "blur" },
                        { validator: checktitle, message: "限20个汉字以内", trigger: "blur", num: 40 }
                    ],
                    period:[
                        { required: true, message: "请输入期数", trigger: "blur" },
                        /*{ validator: checknumbers, message: "请输入数字 ", trigger: "blur"}*/
                    ],
                   cover:[
                        { required: true, message: "请上传图片", trigger: "blur" },
                    ],
                   /*  pdf:[
                        { required: true, message: "请上传pdf文件", trigger: "blur" },
                    ],
                    teacher_name:[
                        { required: true, message: "请选择老师", trigger: "blur" },
                    ],*/
                    content:[
                        { required: true, message: "请输入课程简介", trigger: "blur" },
                        { validator: checktitle, message: "限50个汉字以内", trigger: "blur", num: 100 }
                    ]
                },
                
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        methods: {
               getStrLenght(content) {
               var len=0;
               if(content)
               {
                for (var i = 0; i < content.length; i++) {
                    var a = content.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//判断如果输的是汉字，字符串长度+2
                        len += 1;
                    }
                    else {
                        len += 0.5;
                    }
                }
                return len;}
        },
           checkContent(content){
               var len=1;
                if(content)
               {
                  len =    this.getStrLenght(content);
               }
                this.checkMsg = len+"/50";
           },
            //获取列表
            async getList(){

               var admin = sessionStorage.getItem("user");
                var a = JSON.parse(admin);
               
              
                this.username=a.user_name;
                this.team_id = a.team_id;
                this.team_name = a.team_name;
              
               // console.log( this.filters.teacher);
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    title:this.filters.title,
                    teacher:this.filters.teacher,
                    createTime:this.filters.createTime,
                    min:this.filters.min,
                    max:this.filters.max,
                    type:this.filters.type,
                    team_id:this.team_id
                };
                
                 getShiZhanKeList(para).then(res=>{
                        let result=res.data;
                 for( var i=0;i<result.list.length;i++)
                {
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].create_time=Y+M+D+h+m+s;
                }
                this.datas=result.list;
                this.total=result.total;
               // console.log("fdsfds:::"+ JSON.stringify(result));
                }
                	)
                
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
                //console.log(JSON.stringify(file));
                if(response.status=="0")
                {
                    this.$message.error("上传失败");
                }
                else
                {
                    if(response.message.indexOf(".pdf")>-1)
                    {
                        this.addForm.pdf= pdfDefault+ response.message;
                        this.fileList_pdf=[{name:this.addForm.pdf,url:this.addForm.pdf}];
                    }
                    else
                    {
                        this.addForm.cover=imageDefault+response.message;
                         this.fileList=[{name:this.addForm.cover,url:this.addForm.cover}];
                    }
                }
            },
            fileError(err, file, fileList){
               // console.log(JSON.stringify(err));
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
            async handleDel(index, actual_course_id) {
                     if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    console.log(actual_course_id);
                    deleteShiZhanKe(actual_course_id).then(res=>{
                                     let result=res.data;
                                   if (result.status == "1") {
                                     this.$message({ message: '删除成功', type: 'success' });
                                       this.getList();
                                }
                                   else
                                   {
                                this.$message.error('删除失败');
                                      }
                                 });
                     this.listLoading = false;
                    this.getList();
                }).catch(() => {
                });
            },
            //显示编辑界面
            handleEdit (index, row) {
                //console.log("row:::" + JSON.stringify(row));
                this.addForm.create_time;
                this.editOrAdd = false;
                this.FormVisible = true;
                //this.addForm = Object.assign({}, row);//await api.findRiJianSo(row);
                /* if (row.cover == null || row.cover=="")
                    this.fileList = [];
                else
                    this.fileList = [{name: row.cover, url: row.cover}];
                if (row.pdf == null ||row.pdf=="")
                    this.fileList_pdf = [];
                else
                    this.fileList_pdf = [{name: row.pdf, url: row.pdf}];

                this.teachername=row.teacher_name;
                this.teacherid=row.teacher;
                this.bag_id=row.bag_id; */

                  var result = {
                    actual_course_id:row.actual_course_id,
                    period:row.period,
                    title:row.title,
                    play_address:row.play_address,
                    content:row.content,
                   
                    bag_id:row.bag_id+"",
                    //teacher:row.teacher+"",
                    cover:row.cover,
                    video_length:row.video_length,
                    flagMsg:false,
					pdf:row.pdf,
                    team_id:this.team_id,
                    create_time:row.create_time
                }
                this.addForm = result;
              //console.log(this.teachername+"  "+this.teacherid);
            },
            //显示新增界面
            handleAdd: function () {
                     if(this.team_id == "0"){
                        this.$message({
                            message: "该登录帐号没有战队组权限，不能操作！",
                            type: "error"
                       });
                       return false;

                }
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.FormVisible = true;
                  var bag_idR = "";
                if(this.bagFrom.length == 1){
                    bag_idR = this.bagFrom[0].bag_id;
                }
               this.addForm={
                    title:"",
                    period:"",
                    cover:"",
                    pdf:"",
                    teacher:"",
                    teacher_name:"",
                    content:"",
                    create_time:"",
                     bag_id:""
                };
                this.clearEdit();
               //this.$refs.editForm.resetFields();
            },
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {};
                this.addForm = Object.assign({}, tmpObj);
                this.fileList=[];
                this.fileList_pdf=[];

            },

            //提交
            async editSubmit() {
                 if(this.addForm.cover == ""){
                      this.$message({
                                       message: '图片地址不能为空！',
                                         type: 'error'
                                           });

                          return  false;
                 }
                    console.log(this.addForm);
                   this.addForm.team_id=this.team_id;
                      this.addForm.bag_id=this.bag_id;
                           console.log(this.addForm.bag_id);
                    let newForm=this.addForm;
                 
              this.$refs.addForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                           var result="";
                            if(this.editOrAdd){
                                    //判断是否重名
                              let strname=this.addForm.period+','+this.team_id;
                             // console.log(strname);
                                if(strname)
                                {
                                       Verification(strname).then(res=>{
                                     result=res.data;
                                      
                                     if(result==0)
                                         {
                                       this.$message({
                                       message: '该期数已存在，请重新添加！',
                                         type: 'success'
                                           });
                                        }
                                        else
                                       { 
                                           // console.log(2);
                                         //  console.log(this.addForm);
                                        // let para = Object.assign({}, this.addForm);
                                            addShiZhanKe(newForm).then(res=>{
                                        let result=res.data;
                                         if (result.status == "1") {
                                         this.$message({ message: '提交成功', type: 'success' });
                                       this.getList();
                                         }
                                   else
                                   {
                                       this.$message.error('提交失败');
                                }
                                 });
                               } 
                                });
                              }
                            }
                            else
                            {
                                this.addForm.update_time=util.formatDate.format(new Date(),"yyyy-MM-dd hh:mm:ss");
                                let para = Object.assign({}, this.addForm);
                                    console.log(this.addForm.cover);
                                    updateShiZhanKe(newForm).then(res=>{
                                    let result=res.data;
                                    if (result.status == "1") {
                                    this.$message({ message: '提交成功', type: 'success' });
                                         this.getList();
                            }
                            else
                            {
                                this.$message.error('提交失败');
                            }
                               });
                            }
                            this.FormVisible = false;
                            
                            this.editLoading = false;
                            this.clearEdit();
                        });
                    }
                });
            },
            viewEvent(a){
                this.viewlikeFrom.count=a;
            },
            shareEvent(a){
                console.log(a);
                  this.shareFrom ={
                    share:a,
                    batchShareInput:a

                };
            },
            //批量分享
             batchShare(){

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
            //批量分享
            async batchShareSubmit(a,b){
               this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].actual_course_id
                    }else{
                        dataArray += ","+this.sels[i].actual_course_id
                    }

                }
               let formValue = Object.assign({}, this.shareFrom);
               // console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.share,
                    channel:2,
                    model:"2",
                    flag:b
                };
                 console.log(para)
                        updateShareCount(para).then((res) => {
                                this.editLoading = false;
                                this.BatchShareDialogVisible = false
                                this.$notify({
                                    title: '提示',
                                    dangerouslyUseHTMLString: true,
                                    message: res.data.message
                                });
                           });
             },
            //批量点赞浏览
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
                //浏览
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
                        console.log(dataArray);
                        updateShiZhiKe_LikeViewCount(dataArray).then(res=>{
                            var result =res.data; 
                        if (result.status == "1") {
                            this.$message({
                                message: '注水成功',
                                type: 'success'
                            });
                        }
                        else {
                            this.$message.error('注水失败');
                        }
                        }) 
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
               // console.log(arr);
                this.listLoading = false;
            },
           //锦囊列表
             async selectTeamBagList(para){
                   teamBagList(para).then(res => {
                       console.log(res.data);
                    let arr = [];
                        for(let i=0;i<res.data.length;i++){
                               //   console.log(res.data[i]);
                                  res.data[i].bag_id= res.data[i].bag_id+"";
                                arr.push(res.data[i]);

                            }
                            this.bagFrom=arr;
                            this.listLoading = false;

                            });
            },
            changelaoshi:function(index){
                 this.teachername=this.teacherFrom[index].name;
                this.teacherid=this.teacherFrom[index].id;
                //console.log("index::::"+index +"teachername:::"+this.teachername+"name::::"+ this.teacherid);
            },
            changebag:function(index){
                console.log(index);
               this.bag_id=index;
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
        },
        mounted() {
                this.getList();
            this.selectTeamBagList({team_id:this.team_id});
            this.selectTeacherList(0);
           
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