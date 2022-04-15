<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.title" placeholder="请输入标题关键字搜索"></el-input>
                </el-form-item>

            	<el-form-item>
					<el-date-picker
							v-model="filters.releaseTime"
							type="date"
							placeholder="发布时间查询">
					</el-date-picker>
				</el-form-item>

                <!-- <el-date-picker 
                    v-model="filters.date" 
                    type="date" 
                    placeholder="时间查询">
                 </el-date-picker> -->




                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

            <el-form-item>
                <el-button type="primary"  @click="handleAdd">新增</el-button>
            </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"   @selection-change="selsChange"  style="width: 100%;">
            <el-table-column type="index" label="序号"  width="60">
                  <template scope="num">
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="releaseTime"  label="发布时间"  align="center" min-width="100"></el-table-column>
            <el-table-column prop="title" label="标题"  align="center" min-width="100"></el-table-column>
            <el-table-column prop="content" label="内容" align="center" min-width="200"></el-table-column>
            <el-table-column prop="poolNumber" label="预选股票池(只)" align="center" min-width="80"></el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
                <template scope="scope">
                    <el-button size="small"   @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page.sync="page" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title=dialogTitle  :visible.sync="FormVisible"  v-loading="editLoading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="addForm" label-width="110px"  :rules="editFormRules" ref="addForm">
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="addForm.title"  auto-complete="off"  placeholder="不超过30个汉字" style="width:500px;"></el-input>
                </el-form-item>

                <el-form-item label="课程简介："  prop="content">
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="分析内容最多不超过500字"
                            v-model="addForm.content">
                    </el-input>
                </el-form-item>

                 <el-form-item  label="分析图片："   prop="picUrl" >
                    <el-upload class="avatar-uploader" 
                               action="/api/file/imageUpload/" 
                               :show-file-list="false" 
                               :on-success="handleAvatarSuccess" 
                               :on-remove="handleRemoveAdd"
                               :before-upload="beforeAvatarUpload">
                        <img v-if="addForm.picUrl" :src="addForm.picUrl" width="600px" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="龙虎实力榜"  v-if="this.editOrAdd">
						<el-radio v-model="addForm.isRec" label="1" >今日荐股</el-radio>
						<el-radio v-model="addForm.isRec" label="0">今日不荐股</el-radio>
				</el-form-item>

                <el-form-item label="龙虎实力榜"  v-if="!this.editOrAdd">
						<el-radio v-model="addForm.isRec" label="1" v-if="addForm.isRec == 1">今日荐股</el-radio>
						<el-radio v-model="addForm.isRec" label="0" v-if="addForm.isRec == 0">今日不荐股</el-radio>
				</el-form-item>

                <!-- 推荐股票 -->
                <div class="re-list"  v-if="addForm.isRec == 1">
                    <el-button type="primary" @click="addRec">添加</el-button>
                    <div class="re-item" v-for="(v, k) in recommendationStocksTodayList" :key="k">

                        <el-row :gutter="20">
                            <el-col :span="3">
                                <div class="rec-title">股票{{k+1}}：</div>
                            </el-col>
                            <el-col :span="8">
                                <el-input v-model="v.stockCode" placeholder="股票代码" style="width:100%;" @blur="getSeatsList(v,k)"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <div  class="rec-title">股票名称：</div>
                            </el-col>
                            <el-col :span="4">
                                <el-input v-model="v.stockName" placeholder="股票名称" style="width:120px;" :disabled="true"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="danger" @click="deleteRec(k)">删除</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <div  class="rec-title">参与席位：</div>
                            </el-col>
                            <el-col :span="8">
                                <el-select v-model="v.seats" placeholder="请选择"  style="width:100%;" @change="seatChanged($event, v)">
                                    <el-option
                                        v-for="(item, k) in v.seatsOptions"
                                        :key="k"
                                        :label="item.branch"
                                        :value="item.branchID">
                                    </el-option>
                                </el-select>
                                <el-input v-model="v.seatsName"    :disabled="true" style="display: none"></el-input><!-- style="display: none" -->
                            </el-col>
                            <el-col :span="3">
                                <div  class="rec-title">席位特点：</div>
                            </el-col>
                            <el-col :span="4">
                                <el-input v-model="v.characteristic" placeholder="不超过12个字" style="width:120px;" ></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <div  class="rec-title">席位胜率：</div>
                            </el-col>
                            <el-col :span="8">
                                <el-input v-model="v.percentage" placeholder="席位胜率为整数百分比，如100%" style="width:100%;" ></el-input>
                            </el-col>
                            <el-col :span="3">
                                <div  class="rec-title">技术评分：</div>
                            </el-col>
                                <el-col :span="4">
                                    <el-select v-model="v.score" placeholder="请选择"  style="width:120px;">
                                        <el-option
                                            v-for="item in scoreOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="unre" v-else>
                    今日暂不推荐股票
                </div>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="FormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmitValid()" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {imageDefault,pdfDefault} from "../../common/js/urls";
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import '../../common/js/DateFormat';
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
                        // console.log("fds");
                    }
                }, 1000);
            };

            return {
                checkRec:true,
                recommendationStocksTodayList: [{
                    stockName: '',//股票代码
                    stockCode: '',//股票名称
                    seats: '',
                    characteristic: '', // 席位特点
                    percentage: '', // 席位胜率
                    score: '', // 技术评分
                    seatsOptions: [],
                }],
                seatsOptions: [
                    {
                        value: '1',
                        label: '营业部1'
                    },
                    {
                        value: '2',
                        label: '营业部2'
                    },
                    {
                        value: '3',
                        label: '营业部3'
                    },
                    {
                        value: '4',
                        label: '营业部4'
                    },
                    {
                        value: '5',
                        label: '营业部5'
                    },
                    {
                        value: '6',
                        label: '营业部6'
                    }
                ],
                scoreOptions: [
                    {
                        value: '1',
                        label: '一颗星'
                    },
                    {
                        value: '2',
                        label: '两颗星'
                    },
                    {
                        value: '3',
                        label: '三颗星'
                    },
                    {
                        value: '4',
                        label: '四颗星'
                    },
                    {
                        value: '5',
                        label: '五颗星'
                    },
                ],
                options:[],
                value: '',
                filters: {
                    title: '',
                    releaseTime:'',
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
                pageSize:10,
                currentPage: 1,
                listLoading: false,

                sels:[],//列表选中列
                FormVisible:false,

                //新增界面数据
                addForm: {
                    isRec:'1',
                },
                fileList:[],

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
                ZsLoading:false,
                editFormRules: {
                    title: [
                        { required: true, message: "请输入标题", trigger: "blur" },
                        { validator: checktitle, message: "限30个汉字以内", trigger: "blur", num: 60 }
                    ],
                    content: [
                        { required: true, message: "请输入内容", trigger: "blur" },
                        { validator: checktitle, message: "限500个汉字以内", trigger: "blur", num: 1000 }
                    ],
                   
                    // picUrl:[
                    //     { required: true, message: "请上传图片", trigger: "blur" },
                    // ],
                    // content:[
                    //     { required: true, message: "请输入课程简介", trigger: "blur" },
                    // ]
                },
                defaultModules: {
                    toolbar: ['image']
                }

            }
        },
        methods: {
            seatChanged(val, row) {
                // console.log(row);
                // console.log(val);
                let seatsArr = row.seatsOptions
                for(var i =0 ;i<seatsArr.length;i++){
                    if(seatsArr[i].branchID == row.seats){
                        row.seatsName=seatsArr[i].branch
                    //    this.$set(row) 
                    }
                }
                
            },
            deleteRec(k) {
                if(this.recommendationStocksTodayList.length==1){
                    this.$message.error("最后一项不能删除");
                }else{
                    this.recommendationStocksTodayList.splice(k, 1)
                }
            },
            addRec(){
                 if(this.recommendationStocksTodayList.length==15){
                    this.$message.error("最多只能添加十五项");
                }else{
                    this.recommendationStocksTodayList.push({
                        stockName: '',
                        stockCode: '',
                        seats: '',
                        characteristic: '', // 席位特点
                        percentage: '', // 席位胜率
                        score: '', // 技术评分
                    });
                }

            },
            //获取列表
            async getList(){
                this.datas=[];
                    this.total=0;
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    title:this.filters.title,
                    releaseTime:this.filters.releaseTime? new Date(this.filters.releaseTime).format("yyyy-MM-dd"):''
                };
                
                let result=await api.getFourDimensionalPoolPage(para);
                     if(result.list.size>0){
                        for( var i=0;i<result.list.size;i++){
                            result.list[i].releaseTime = result.list[i].releaseTime.substring(0,16);
                        }
                    }
                    this.datas=result.list;
                    this.total=result.total;
                    this.page =result.pageNum;
            },
            async getSeatsList(v,k){
                
                let stockCode = v.stockCode

                if(isNaN(stockCode) === true){
                   this.$message.error('请输入数字');
                   return
                }
                
                if(stockCode.length != 6){
                this.$message.error('请输入六位有效数字');
                return;
                }
                
               let isrep = false;
               await this.recommendationStocksTodayList.forEach((val,idx) => {
                    if(idx != k){
                        if(val.stockCode == stockCode){
                            this.$message.error('推荐股票重复');                        
                            isrep = true;
                            return;
                        }
                    }                    
                });
                if(isrep){
                    return;
                }
                //  v.seatsOptions=[{value: '1',label: '营业部1'},{value: '2',label: '营业部2'}]   //开始调用后台方式
                    v.seatsOptions=[]   //开始调用后台方式
                let result= await api.getSeatsListByStockCode(stockCode);
                
                if(!result.state){
                    this.$message.error('此股票未上龙虎榜')
                    return
                }
                var data = result.data
                var dataJson = JSON.parse(data)
                
                    for(var i in dataJson){
                v.seatsOptions.push ({
                    "branch":dataJson[i].branch,
                    "buyamt":dataJson[i].buyamt,
                    "branchID":dataJson[i].branchID,
                })
                }
                v.stockName = dataJson[0].stock
                    this.$set(v)
                    
                
                
            },
      
            // async getSeatsList(v){},
            listenThisUe(thisUe){
                this.editForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            handleCurrentChange(val) {
                this.getList();
            },

            //删除
            async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async () => {
                    this.listLoading = true;
                    var result= await api.deleteFourDimensionalPoolById(row.id);

                    this.listLoading = false;
                    if(result.state)
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
            //显示编辑界面
            handleEdit (index, row) {
                // console.log("row:::" + JSON.stringify(row));
                this.dialogTitle = "专家分析";
                this.editOrAdd = false;
                this.FormVisible = true;
                this.addForm = Object.assign({}, row);//await api.findRiJianSo(row);
                if(this.addForm.isRec == 0){
                    this.recommendationStocksTodayList = [];  
                }else{
                    this.recommendationStocksTodayList = [].concat(this.addForm.recommendationStocksTodayList)
                   for(var i=0;i<this.recommendationStocksTodayList.length;i++){
                       this.getSeatsList(this.recommendationStocksTodayList[i],i)
                   }
                }
            },
            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "专家分析";
                this.editOrAdd = true;
                this.FormVisible = true;
                this.recommendationStocksTodayList = [
                    {
                    stockName: '',//股票代码
                    stockCode: '',//股票名称
                    seats: '',
                    characteristic: '', // 席位特点
                    percentage: '', // 席位胜率
                    score: '', // 技术评分
                }
                ];
                this.addForm={
                    isRec:"1",
                    title:"",
                    picUrl:"",
                    content:"",
                };
                // this.clearEdit();
               //this.$refs.editForm.resetFields();
            },
            //恢复编辑页面为默认
            clearEdit(){
                // let tmpObj = {};
                // this.addForm = Object.assign({}, tmpObj);
                // this.fileList=[];

            },

            //提交
            async editSubmit() {

                this.$refs.addForm.validate(async (valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            if(this.addForm.isRec == 1 ){
                                this.addForm.recommendationStocksTodayList = this.recommendationStocksTodayList
                            }else{
                                this.addForm.recommendationStocksTodayList = []
                            }
                            var result="";
                            if(this.editOrAdd){
                                
                                let para = Object.assign({}, this.addForm);
                                // console.log(para);
                                result= await api.addFourDimensionalPool(para);
                            }else{
                                let para = Object.assign({}, this.addForm);
                                // console.log(JSON.stringify(this.addForm));
                                result= await api.updateFourDimensionalPool(para);
                            }
                            this.FormVisible = false;
                            
                            if (result.state) {
                                this.$message({ message: '提交成功', type: 'success' });
                                this.getList();
                            }
                            else
                            {
                                this.$message.error(result.data);
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
     
         

            selsChange: function (sels) {
                this.sels = sels;
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

            handleAvatarSuccess(res, file) {
                this.addForm.picUrl =imageDefault + res.message;
                this.coverFileList = [{ name: this.addForm.picUrl, url: this.addForm.picUrl}];
            },
            
            handleRemoveAdd(response, fileList) {
               this.addForm.picUrl = "";
               this.coverFileList = [];
            },       

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
      },

       handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件~`);
            },

        editSubmitValid(){
            var isRecNull = true;
            if(this.addForm.isRec ==1){
         for (let index = 0; index < this.recommendationStocksTodayList.length; index++) {
             const element = this.recommendationStocksTodayList[index];
             
             if(element.stockCode == null || element.stockCode == ''){
                 isRecNull = false
                this.$message.error('推荐股票不能为空');
                    break
             }
             if(element.seats == null || element.seats == ''){
                 isRecNull = false
                this.$message.error('股票'+(Number(index)+Number(1))+'参与席位不能为空');
                    break
             }
             if(element.characteristic == null || element.characteristic == ''){
                 isRecNull = false
                this.$message.error('股票'+(Number(index)+Number(1))+'席位特点不能为空');
                    break
             }
             if(element.characteristic != null && element.characteristic != ''){
                 if(element.characteristic.length>12){
                     isRecNull = false
                    this.$message.error('股票'+(Number(index)+Number(1))+'席位特点不能超过12字');
                        break
                 }
             }
             if(element.percentage == null || element.percentage == ''){
                 isRecNull = false
                this.$message.error('股票'+(Number(index)+Number(1))+'席位胜率不能为空');
                    break
             }
             if(element.percentage != null || element.percentage != ''){
                 let boolean = new RegExp("^[1-9][0-9]*$").test(element.percentage)
                    if(!boolean){
                         isRecNull = false
                       this.$message.error('股票'+(Number(index)+Number(1))+'席位胜率必须为整数');   
                     break
                    }
             }
             if(element.percentage != null || element.percentage != ''){
                    if(element.percentage>100){
                         isRecNull = false
                       this.$message.error('股票'+(Number(index)+Number(1))+'席位胜率不能超过100%');   
                     break
                    }
             }
              if(element.score == null || element.score == ''){
                 isRecNull = false
                this.$message.error('股票'+(Number(index)+Number(1))+'技术评分不能为空');
                    break
             }

            var stockCodei = element.stockCode
            for (let j = 0; j < this.recommendationStocksTodayList.length; j++) {
                if(j == index){
                    continue
                }
                
             let stockCodej = this.recommendationStocksTodayList[j].stockCode;
             if(stockCodei == stockCodej){
                  isRecNull = false
                this.$message.error('股票'+(Number(j)+Number(1))+'跟股票'+(Number(index)+Number(1))+'重复');
                    break
             }
                
            }
                }
            }
             if(isRecNull){
                 this.editSubmit()
                }
        }
           

        },
        mounted() {
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
		width: 128px;
		height: 128px;
		line-height: 128px;
		text-align: center;
	}
     .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .re-item {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #e1e1e1;
        margin-top: 20px;
    }
    .unre {
        width: 100%;
        padding: 100px 0;
        text-align: center;
        font-size: 30px;
        background-color: #e1e1e1;
    }
    /* 推荐股票 */
    .rec-title {
        line-height: 40px;
    }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>