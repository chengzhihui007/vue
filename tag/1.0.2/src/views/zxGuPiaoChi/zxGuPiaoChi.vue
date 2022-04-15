<template>
	<section class="mtop">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="title" placeholder="请输入关键字"></el-input>
				</el-form-item>





				<el-form-item>
					<el-date-picker
							v-model="recommend_time"
							type="date"
							placeholder="推荐日期">
					</el-date-picker>
				</el-form-item>



				<el-form-item>
					<el-select v-model="status" style="width:193px;"  clearable  placeholder="请选择状态">
						<!--<el-option label="请选择" value="0"></el-option>-->
						<el-option label="正常" value="1"></el-option>
						<el-option label="已出池提醒" value="2"></el-option>
						<el-option label="已下线" value="3"></el-option>
						<!--<el-option label="评论量" value="3"></el-option>-->

					</el-select>

				</el-form-item>

				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>



				<el-form-item>
					<!--v-if=" username!='quanzi1'"-->
					<el-button type="primary"    @click="handleAdd">添加</el-button>
				</el-form-item>

				<el-form-item>
					<el-button type="primary"     @click="batchView" :disabled="false">批量增加浏览量</el-button>
				</el-form-item>
			</el-form>
		</el-col>






		<el-table :data="stockPoolTables" highlight-current-row v-loading="loading"  @selection-change="selsChange"  style="width: 100%;">
			<el-table-column
					type="selection"
					width="55">
			</el-table-column>
			<!--<el-table-column type="index" width="60">
            </el-table-column>
            -->
			<el-table-column prop="stock_code" width="200"  :formatter="formattgeGuDaiMa"  label="推荐股票">
			</el-table-column>
			<el-table-column label="浏览实数|总数" width="160">
				<template scope="scope">
					<span v-bind:class="{active: (scope.row.viewR)}">{{ scope.row.viewR }}</span>
					|
					<span>{{ scope.row.view }}</span>

				</template>
			</el-table-column>


			<el-table-column prop="recommend_time" label="推荐时间" width="200">
			</el-table-column>
			<el-table-column prop="track_time" label="最新跟踪时间" width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态"   :formatter="formattStatus" width="120">
			</el-table-column>


			<el-table-column label="操作" width="600">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)"  v-if="scope.row.status !=3 ">编辑</el-button>


					<el-button size="small" @click="trackEdit(scope.$index, scope.row)"   >股票跟踪</el-button>


					<el-button size="small" @click="downlineEdit(scope.$index, scope.row)"  v-if="scope.row.status == 2">下线</el-button>


				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
		</el-col>




		<!--批量浏览界面-->
		<el-dialog title="批量浏览" :visible.sync="BatchViewDialogVisible"  center>


			<el-form  :model="viewFrom"  label-width="80px"    ref="viewFrom">


				<el-form-item>

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












		<!-- -->
		<el-dialog title="下线" :visible.sync="downlineclass"  :close-on-click-modal="false" width="50%" center>
			<el-form :model="downlineForm" :rules="editrules" ref="downlineForm" label-width="100px" >


                                   {{downlineForm.msg+"确定要下线该股票吗?"}}



			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="downlineclass = false">取 消</el-button>
				<el-button type="primary" @click="submitdownlineForm()" :loading="editLoading">确 定</el-button>
			</div>
		</el-dialog>













		<!--股票跟踪-->
		<el-dialog title="股票跟踪" :visible.sync="trackclass"  :close-on-click-modal="false" width="50%" center>
			<el-form :model="trackForm" :rules="editrules" ref="trackForm" label-width="100px" >


				<el-form-item label="操作建议" prop="advice">
					<el-input type="textarea" :rows="5"   v-model="trackForm.advice"></el-input>

				</el-form-item>

				<el-form-item  label="添加图片"    >
					<el-upload class="avatar-uploader" action="/api/file/imageUpload/" :show-file-list="false" :on-success="handleAvatarTrackSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="trackForm.advice_image" :src="trackForm.advice_image" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item >
                      <el-checkbox v-model="trackForm.outPool">出池提醒</el-checkbox>
				</el-form-item>



				<el-form-item >
					<el-button @click="trackclass = false">取 消</el-button>


					<el-button type="primary" @click="submittrackForm()"   :disabled ="editDisabled" :loading="editTrkLoading">确 定</el-button>
				</el-form-item>

				 <el-collapse  v-model="activeName" accordion >

					<el-collapse-item  title="点击展开与合并历史跟踪信息" name="1">

						<div v-for="list in trackList">
							<el-form-item label="跟踪时间" >
								{{list.track_time}}
							</el-form-item>
							<el-form-item label="操作建议" >
								{{list.advice}}
								<img :src="list.image"  />
							</el-form-item>
							<HR> </HR>
						</div>
					</el-collapse-item>
				</el-collapse>

			</el-form>

		</el-dialog>



		<!--弹窗数据-->
		<el-dialog title="编辑" :visible.sync="editclass"  :close-on-click-modal="false" width="50%" center>
			<el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" >

				<el-form-item label="股票名称：" prop="stock_name">
					<el-select v-model="editruleForm.stock_name" :disabled="this.inputFlag" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear"
							   :remote-method="select_remoteMethod" :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:120px;">
						<el-option v-for="item in select_options" :key="item.value"  :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-input v-model="editruleForm.stock_code" :disabled="this.inputFlag"  auto-complete="off" style="width:120px;margin-left:10px;"></el-input>
				</el-form-item>




				<el-form-item label="股票类型" prop="type">
					<el-select v-model="editruleForm.type" style="width:193px;"  clearable  placeholder="请选择股票类型">
						<!--<el-option label="请选择" value="0"></el-option>-->
						<el-option label="激进型" value=1></el-option>
						<el-option label="稳健型" value=3></el-option>
                        <!-- <el-option label="积极型" value=2></el-option>
						<el-option label="谨慎型" value=4></el-option>
						<el-option label="保守型" value=5></el-option> -->


					</el-select>
				</el-form-item>

				<el-form-item label="推荐原因" prop="reasons">
					<el-input type="textarea" :rows="5"   v-model="editruleForm.reasons"  placeholder="最多可填写300个汉字" ></el-input>
                        
				</el-form-item>

				<el-form-item  label="上传图片"    >
					<el-upload class="avatar-uploader" action="/api/file/imageUpload/" accept=".jpg,.png"  :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="editruleForm.image" :src="editruleForm.image" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

                	<el-form-item label="操作策略：" >
                	</el-form-item>
 
				<el-form-item label="参考买入区间" prop="purchase">
					<el-input type="purchase"  v-model="editruleForm.purchase"   auto-complete="off"  min="0"   style="width:120px;"></el-input>
					-
					<el-input type="purchase"  v-model="editruleForm.purchaseE"   auto-complete="off"  min="0"   style="width:120px;"></el-input>
					<span>元  格式：NN.NN-NN.NN元</span>

				</el-form-item>

				<el-form-item label="参考止损区间" prop="stop">
					<el-input v-model="editruleForm.stop"    style="width:120px;"></el-input>
					-
			    	<el-input v-model="editruleForm.stopE"    style="width:120px;"></el-input>

					<span>元  格式：NN.NN-NN.NN元</span>
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
    import {stockPoolPageList,gpcSave,selectrackingList,trackSave,downlineSave,batchViewStockAdd} from "../../api/cyApi.js";

    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";





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
                inputFlag:false,
                activeName: '1',//展开name为1的折叠板
                trackList:[],
                select_options: [],//键盘宝
                select_loading: false,
                page:1,
                playAddressFileList: [],
                sels: [], //列表选中列


                BatchViewDialogVisible:false,
                viewFrom:{

                    batchViewInput:"",
                    view:""

                },
                editLoading: false,
                editTrkLoading: false,
                editDisabled:false,
                editOrAdd: false,
                editruleForm: {
                    stock_name:"",
                    stock_code:"",
                    recommendTime:"",
                    is_day:"",
                    type:"",
                    image:"",
                    purchase:"",
                    purchaseE:"",
                    sell:"",
                    sellE:"",
                    stop:"",
                    stopE:"",
                    reasons:""
                },
                trackForm:{
                    enjoy_stockPooll_id:"",
                    advice:"",
                    advice_image:"",
                    outPool:""
                },


                downlineForm:{
                    enjoy_stockPooll_id:"",

                    msg:""
                },

                listLoading: false,


                title:"",
                recommend_time:"",
                status:"",

                total: 0,
                pageSize: 20,
                currentPage: 1,
                loading: false,
                stockPoolTables: [],
                scorelist: [],
                editclass: false,
                trackclass:false,
                remindingclass:false,
                remindingShowclass:false,
                downlineShowclass:false,
                downlineclass:false,
                editrules: {

                    image: [
                        { required: true, message: "请选择图片文件", trigger: "change" }
                    ],
                    type: [
                        { required: true, message: '--请选择股票类型--', trigger: 'change' }
                    ],

                    stock_name:[{ required: true, message: "请选择股票", trigger: "blur" }],

                    reasons: [
                        { required: true, message: "请输入推荐原因", trigger: "blur" },
                        {
                            max:300,
                            trigger: "blur",
                            message: "推荐原因字数过多，请保持300个汉字内"
                            /*validator: numbers,
                            message: "内容超出限制",
                            trigger: "blur",
                            num: 40*/
                        }
                    ],


                    downline: [
                        { required: true, message: "请输入下线原因", trigger: "blur" },
                        {
                            max:500,
                            trigger: "blur",
                            message: "内容超出限制"
                            /*validator: numbers,
                            message: "内容超出限制",
                            trigger: "blur",
                            num: 40*/
                        }
                    ],
                    advice: [
                        { required: true, message: "请输入操作建议", trigger: "blur" },
                        {
                            max:300,
                            trigger: "blur",
                            message: "内容超出限制"
                            /*validator: numbers,
                            message: "内容超出限制",
                            trigger: "blur",
                            num: 40*/
                        }
                    ],
					change: [
                        { required: true, message: "请输入变更提醒", trigger: "blur" },
                        {
                            max:100,
                            trigger: "blur",
                            message: "内容超出限制"
                            /*validator: numbers,
                            message: "内容超出限制",
                            trigger: "blur",
                            num: 40*/
                        }
                    ],
                    recommendTime: [
                        {
                            type: "date",
                            required: true,
                            message: "请选择推荐时间",
                            trigger: "blur"
                        }
                    ],
                    purchase: [
                        { required: true, message: '金额不能为空'}
                    ],
                     stop: [
                        { required: true, message: '金额不能为空'}
                    ],
                 
                }



            };
        },

        methods: {
            formattStatus:function(row){
                if(row.status == "1"){
                    return "正常";
				}
                if(row.status == "2"){
                    return "已出池提醒";
                }
                if(row.status == "3"){
                    return "已下线";
                }
			},
            formattgeGuDaiMa: function(row) {
                return row.stock_name + "(" + row.stock_code+ ")";
            },
            add_select_clear() {
                this.editruleForm.stock_code="";
            },
            select_remoteMethod(query) {

                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        var result = await kbspiritDataStore.query(query);
                        this.select_options=result;
                        //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                        //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                    }, 200);
                    // console.log(JSON.stringify(this.select_options));
                } else {
                    this.select_options = [];
                }
            },
            selectchange(){
                var r= this.editruleForm.stock_name;

                for( var i in this.select_options )
                {
                    if(this.select_options[i].value==r)
                    {
                        this.editruleForm.stock_name=this.select_options[i].label;
                        this.editruleForm.stock_code=r;
                    }
                }
                //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
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
                /*  console.log(response);
                  this.editruleForm.play_address = response.origUrl
                  this.editruleForm.video_length = response.durationMsec
                  console.log(response.origUrl);
                  console.log(response.duration);*/
            },

            viewEvent(a){
                this.viewFrom ={
                    view:a,
                    batchViewInput:a

                };



                //alert("1");

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

            async   batchViewSubmit(a,b){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].enjoy_stockPooll_id
                    }else{
                        dataArray += ","+this.sels[i].enjoy_stockPooll_id
                    }


                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    channel:1,
                    model:"12",
                    flag:b
                };

                console.log(para)
                //await  api.batchViewStockAdd(para);

                     batchViewStockAdd(para).then((res) => {
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
                                        orderBy:"a.enjoy_stockPooll_id DESC "
                                    };
                                    this.stockPoolPage(para);

                            });

               

            },
            selsChange: function(sels) {
                this.sels = sels;
            },
			async submittrackForm(){

                this.$refs.trackForm.validate(async valid => {
                    if (valid) {
                   this.editTrkLoading = true;

                        trackSave(this.trackForm).then((res) => {
                                 this.trackclass = false;
                                    this.$message({
                                        message: "提交成功",
                                        type: "success"
                                    });

                                this.editTrkLoading = false;

                                 var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                    orderBy:"a.enjoy_stockPooll_id DESC "
                                };
                                this.stockPoolPage(para);
                        });
                        
                         
                    //await api.trackSave(this.trackForm);
                      //this.editTrkLoading = false;
                    }
                });

			},
			async submitdownlineForm(){
                this.$refs.downlineForm.validate(async valid => {

                    if (valid) {


                    this.editLoading = true;

                    //await api.downlineSave(this.downlineForm);


                        downlineSave(this.downlineForm).then((res) => {
                                  this.downlineclass = false;
                                    this.$message({
                                        message: "提交成功",
                                        type: "success"
                                    });

                                this.editLoading = false;

                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                    orderBy:"a.enjoy_stockPooll_id DESC "
                                };
                                this.stockPoolPage(para);
                        });

                   
                    }
                });

			},

            submiteditForm(){

                 var reg= /^\+?(\d*\.\d{2})$/;
                      

                var str1 = this.editruleForm.purchase;
                var str2 = this.editruleForm.purchaseE;

                var str5 = this.editruleForm.stop;
                var str6 = this.editruleForm.stopE;

                 if(!(reg.test(str1) &&reg.test(str2)   &&reg.test(str5)&&reg.test(str6))){
                     this.$message({
                         message: '警告哦，金额不能为空或者金额保留两位小数',
                         type: 'warning'
                     });
                     return false;
				 }



                this.$refs.editruleForm.validate(async valid => {

                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                            this.editLoading = true;

                             if (this.editOrAdd) {

                               
                                let para = Object.assign({}, this.editruleForm);

                                para.flag = 1;
                                para.channel = 1;
                                console.log(para);
                                //await api.gpcSave(para);

                                 gpcSave(para).then((res) => {
                                        this.editclass = false;
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                        this.editLoading = false;

                                        var para = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                            orderBy:"a.enjoy_stockPooll_id DESC "
                                        };
                                        this.stockPoolPage(para);

                                 });

                            } else {

                              
                                let para = Object.assign({}, this.editruleForm);
                                console.log(para);

                                para.flag = 0;
                                para.channel = 1;
                                //await api.gpcSave(para);

                                 gpcSave(para).then((res) => {
                                        this.editclass = false;
                                        this.$message({
                                            message: "提交成功",
                                            type: "success"
                                        });
                                        this.editLoading = false;

                                        var para = {
                                            pageNo:this.page,
                                            pageSize:this.pageSize,
                                            orderBy:"a.enjoy_stockPooll_id DESC "
                                        };
                                        this.stockPoolPage(para);

                                 });
                                console.log(para);
                            }
                         

                        });
                    }
                });
            },

            handleAvatarSuccess(res, file) {


                    this.editruleForm.image =imageDefault + res.message;

               // this.editruleForm.image ='http://app2.zslxt.com/image/' + res.message;
            },
            handleAvatarTrackSuccess(res, file) {
                    this.trackForm.advice_image =imageDefault+ res.message;

                //this.trackForm.advice_image ='http://app2.zslxt.com/image/' + res.message;
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
                if(this.recommend_time != "" && this.recommend_time != null){

                    var d = new Date(this.recommend_time);

                    time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

                }


                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.enjoy_stockPooll_id DESC ",
                    title: this.title,
                    recommendTimeStr:time,
                    status:this.status

                };
                this.stockPoolPage(
                    para
                );

            },

            handleCurrentChange(val) {
                this.page = val;


				var  time = "";
                if(this.recommend_time != "" && this.recommend_time != null){

                    var d = new Date(this.recommend_time);

                    time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;

                }
 

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.enjoy_stockPooll_id DESC ",
                    title: this.title,
                    recommendTimeStr:time,
                    status:this.status
                };
                this.stockPoolPage(
                    para
                );

            },
            async stockPoolPage(keyword) {


                stockPoolPageList(keyword).then(res => {
                    console.log(keyword);
                    this.stockPoolTables = res.data.list;

                    this.total = res.data.total;


                });

                //let result =  await api.stockPoolPage(keyword);


            },
            handleAdd(){

                this.inputFlag = false;
                this.editOrAdd = true;
                this.editclass = true;
                var result = {
                    stock_name:"",
                    stock_code:"",
                    recommendTime:"",
                    is_day:"1",
                    type:"",
                    image:"",
                    purchase:"",
                    purchaseE:"",
                    sell:"",
                    sellE:"",
                    stop:"",
                    stopE:"",
                    reasons:""
                }
                this.playAddressFileList = [];
                this.editruleForm = result;



            },
            async  trackEdit(index, row){
                this.editDisabled = false;
                this.trackclass = true;
                var result = {
                    enjoy_stockPooll_id:row.enjoy_stockPooll_id,
                    advice_image:"",
                    advice:"",
                    outPool:false
                }

                this.trackForm = result;


                selectrackingList(result).then((res) => {
                    console.log(res.data);
                    this.trackList  = res.data;
                    

                    if(res.data[0].outPool){
                        this.editDisabled = true;
					}

                });





            },


            downlineEdit(index, row){
                this.downlineclass = true;

                var result = {
                    enjoy_stockPooll_id:row.enjoy_stockPooll_id,

					msg:row.stock_name + "(" + row.stock_code+ ")"

                }
                this.downlineForm = result;
            },

            handleEdit(index, row) {
                this.inputFlag = true;
                console.log(row);
                this.editOrAdd = false;
                this.editclass = true;
                var result = {
                    enjoy_stockPooll_id:row.enjoy_stockPooll_id,
                    stock_name:row.stock_name,
                    stock_code:row.stock_code,
                    recommendTime:row.recommend_time,
                    is_day:row.is_day+"",
                    type:row.type+"",
                    image:row.image,
                    purchase:row.purchase,
                    purchaseE:row.purchaseE,
                    sell:row.sell,
                    sellE:row.sellE,
                    stop:row.stop,
                    stopE:row.stopE,
                    reasons:row.reasons

                }

                result.recommendTime =
                    !row.recommendTimeStr || row.recommendTimeStr == ""
                        ? ""
                        : new Date(row.recommendTimeStr);


                this.editruleForm = result;

            }

            //-------------------------


        },
        mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.enjoy_stockPooll_id DESC "
            };
            this.stockPoolPage(para);


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




