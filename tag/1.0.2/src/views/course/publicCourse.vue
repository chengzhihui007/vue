<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                <el-input v-model="filters.title" placeholder="请输入关键字搜索"></el-input>
                </el-form-item>
               
                <el-form-item>
                    <el-date-picker
                            v-model="filters.createtime"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
           
                <el-form-item>
                <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>
                <div class="aaa">
                <el-form-item >
                <el-button type="primary" @click="handleAdd">添加</el-button>
                </el-form-item>
                </div>
                <div>
                  <!--   <el-form-item>
                        <el-button type="primary"  @click="点赞">点赞量注水</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"   @click="batchlike()">浏览量注水</el-button>
                    </el-form-item> -->
            <el-button type="primary" @click="batchLike" >点赞量注水</el-button>
						<el-button type="primary"  @click="batchView" >浏览量注水</el-button>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @row-click="change" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column type="index" width="60">
            </el-table-column>

         <!--   <el-table-column   prop="centor_viewpoint_id" label="ID"  min-width="70"></el-table-column>-->
            <el-table-column prop="tilte" label="" min-width="50" v-if="this.title!=''" key="title">
                <template scope="scope">
                    <!-- <span  v-if="scope.row.content!=''">{{ scope.row.title}}</span>
                    <span v-else=""> {{ scope.row.play_address}}</span> -->
                </template>
            </el-table-column>
            <el-table-column prop="period" label="期数" min-width="50" ></el-table-column>
            <el-table-column prop="title" label="课程名称" min-width="90"></el-table-column>
            <el-table-column prop="name" label="老师" min-width="90"></el-table-column>
            <el-table-column prop="createtime" label="添加日期" min-width="90"></el-table-column>
            <el-table-column prop="zanliulan" label="浏览实数/总数" min-width="90"></el-table-column>
             <el-table-column prop="zan" label="点赞实数/总数" min-width="90"></el-table-column>
            <el-table-column label="操作" min-width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

        <!--新增/编辑页面-->
        <el-dialog :title=dialogTitle :visible.sync="dialogVisible"  v-loading="Loading" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
            <el-form :model="addForm" label-width="150px" :rules="editFormRules" ref="addForm">
              
               <el-form-item label="课程标题" prop="title">
                    <el-input v-model="addForm.title" auto-complete="off" style="width:300px;" placeholder="(限20个字以内)" ></el-input>
                </el-form-item>  
                  <el-form-item label="期数" prop="period">
                    <el-input v-model="addForm.period" auto-complete="off" style="width:70px;"  ></el-input> 期
                </el-form-item>
                 <el-form-item label="老师"  prop="teacher">
                <el-select v-model="addForm.teacher" placeholder="请选择老师" >
                    <el-option
                    v-for="item in teacherFrom"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 </el-form-item>
                  <el-form-item label="内容提要：" prop="summary" >
                    <UeEdit v-if=showUeEdit :thisData="'summary'" v-on:ueIpt-say="listenThisUe" :maxWords=200 :defaultMsg="addForm.summary" ref='summary'></UeEdit>

   

                 

                </el-form-item>
                  <el-form-item label="课程立意："  prop="conception">
                    <UeEdit v-if=showUeEdit :thisData="'conception'" v-on:ueIpt-say="listenThisUe" :maxWords=200 :defaultMsg="addForm.conception" ref='conception'></UeEdit>
                 

                </el-form-item>
             
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false;clearEdit()">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        
      <!--批量点赞界面-->
		<el-dialog title="批量点赞" :visible.sync="BatchlikeDialogVisible"  center>


			<el-form  :model="likeFrom"  label-width="80px"    ref="likeFrom" >

				<el-form-item>
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

         
    </section>
</template>

<script>
import util from "../../common/js/util";
import UeEdit from "../UeEdit.vue";
import api from "../../api/api.js";
import axios from "axios";
import config from "../../common/js/config";
export default {
  components: { UeEdit },
  data() {
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      addForm: {
        title: "",
        period: "",
        teacher: "",
        summary: "",
        conception: ""
      },
      desin: false,
      compereFrom: [],
      teacherFrom: [],
      teacher:"",
      biaoqianForm: [],
      options: [],
      checkList: [],
      multipleSelection: [],
      likeFrom:{

                  batchLikeInput:"",
                  like:""

              },
      playAddressFileList: [],
      teachername: "",
      teacherid: "",
      biaoqianname: "",
      biaoqianid: "",
      zhifu: "",
      zhushuiid:'',
      title: "",
      playadddress: "",
      biaoqianmake: false,
      teachermake: false,
      setVisible: false,
      dialogTitle: "新增",
      setForm: {},
      radio: "1",
      editOrAdd: false,
      filters: {
        title: "",
        createtime: ""
      },
      datas: [],
       BatchViewDialogVisible:false,
      viewFrom:{

              batchViewInput:"",
              view:""

          },
      BatchlikeDialogVisible:false,
      total: 0,
      page: 1,
      pageSize: 20,
      currentPage: 1,
      listLoading: false,
      chakanFormVisible: false,
      zhushuiLoading: false,
      sels: [], //列表选中列
      Loading: false,
      showUeEdit: false,
      dialogVisible: false, //编辑界面是否显示
      likeVisible: false,
      ZsFormVisible: false,
      editLoading: false,
      ZsLoading: false,
      zhushuiVisible: false,
      zhushuiObj: { Infuse: null },
      
      editFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" },
         { max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        period: [{ required: true, message: "请输入期数", trigger: "change" }
        ],
        teacher: [
          { required: true, message: "请选择老师", trigger: "change" }
        ],
    /*     summary: [ 
             // { required: true, message: "请输入内容简介", trigger: "blur" },
              { min: 1, max: 100, message: "内容超出限制", trigger: "change" }
          ],
        conception: [
           // { required: true, message: "请输入内容简介", trigger: "blur" },
            { min: 1, max: 100, message: "内容超出限制", trigger: "change" }
        ] */
      },
      //编辑界面数据
      editForm: {},
      defaultModules: {
        toolbar: ["image"]
      }
    };
  },
  methods: {
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
                console.log(this.sels);
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
    async   batchLikeSubmit(a,b){
                this.editLoading = true;
                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].id
                    }else{
                        dataArray += ","+this.sels[i].id
                    }


                }
                let formValue = Object.assign({}, this.likeFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.like,
                    flag:b,
                    channel:0
                };

                console.log(para)
                let    resultVo =    await api.updateLikepublicCourse(para);
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
               this.getList(para);

      },
        async   batchViewSubmit(a,b){

                this.editLoading = true;

                var dataArray="";
                for ( var i=0;i<this.sels.length;i++)
                {
                    //alert(this.sels[i].rowId);
                    if(dataArray == ""){
                        dataArray += this.sels[i].id
                    }else{
                        dataArray += ","+this.sels[i].id
                    }


                }
                let formValue = Object.assign({}, this.viewFrom);
                console.log(formValue);
                var para = {
                    ids:dataArray,
                    count:formValue.view,
                    flag:b,
                    channel:0
                };

                console.log(para)
                   await  api.updateLikepublicCourse(para);
                this.editLoading = false;

                this.BatchViewDialogVisible = false

          /*      this.$message({
                    message: "批量浏览成功",
                    type: "success"
                });*/

                this.$notify({
                    title: '提示',
                    dangerouslyUseHTMLString: true,
                    message: "注水成功!",
                   // duration:0
                });

                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                    orderBy:"a.star_come_id DESC "
                };
                this.getList(para);

            },

     //显示批量注水页面
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
             
  
    
    //添加/修改
    addSubmit() {
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
          this.addForm.summary = this.$refs["summary"].getUEContent();
          this.addForm.conception = this.$refs["conception"].getUEContent();
          let para = Object.assign({}, this.addForm);
          let res = await api.addPublicCourse(para);
          if (res == true) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          }
          this.dialogVisible = false;
          var paraa = {
            pageNo: this.page,
            pageSize: this.pageSize
          };
          this.getList(paraa);
           });
        }
      });
    },
    //            changeFun(val) {
    //                this.checkList = val;
    //                console.log(this.checkList)
    //            },
    changedata: function(index) {
      this.biaoqianmake = true;
      this.biaoqianid = this.biaoqianForm[index].label_id;
      this.biaoqianname = this.biaoqianForm[index].name;
      if (this.biaoqianForm[index].is_pay == 2) {
        this.desin = true;
      }
      if (this.biaoqianForm[index].is_pay != 2) {
        this.zhifu = this.biaoqianForm[index].is_pay;
        this.desin = false;
      }
    },
    changelaoshi: function(index) {
      this.teachermake = true;
      this.teachername = this.teacherFrom[index].name;
      this.teacherid = this.teacherFrom[index].id;
    },
    handleChange(response, file) {
      this.editLoading = true;
      var ws = new WebSocket("wss://cyvideo.ydtg.com.cn");
      ws.onopen = function() {
        console.log("已连接");
        ws.send(JSON.stringify(response));
      };
      var _this = this;
      ws.onmessage = function(evt) {
        console.log("已发送");
        var data = JSON.parse(evt.data);
        _this.playadddress = data.origUrl;
        _this.editForm.audio_length = data.durationMsec;
        _this.editLoading = false;
        ws.close();
      };
      ws.onclose = function() {
        console.log("连接已关闭...");
      };
    },
    handleRemove(file, fileList) {
      this.editForm.play_address = "";
      this.editForm.audio_length = "";
      this.playadddress = this.editForm.play_address;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件~`);
    },

    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.page = val;
    },
    //获取列表
    async getList(para) {
      //                var datetime=this.filters.datetime.getFullYear() + '-' + (this.filters.datetime.getMonth() + 1) + '-' + this.filters.datetime.getDate() + ' ' + this.filters.datetime.getHours() + ':' + this.filters.datetime.getMinutes() + ':' + this.filters.datetime.getSeconds()
      para = {
        pageNo: this.page,
        pageSize: this.pageSize,
        title: this.filters.title,
        createtime: this.filters.createtime
      };
      console.log(para);
      let result = await api.getPublicCourseList(para);
      for (var i = 0; i < result.list.length; i++) {
        /* if(result.list[i].is_pay==1){
                        result.list[i].pay="付费"
                    }else if(result.list[i].is_pay==0){
                        result.list[i].pay="免费"
                    }else{
                        result.list[i].pay="部分付费部分免费"
                    } */
        // this.title=result.list[i].content;
        result.list[i].zan =
          result.list[i].likeR + "  /  " + result.list[i].like;
           result.list[i].zanliulan =
          result.list[i].viewR + "  /  " + result.list[i].view;
        var date = new Date(result.list[i].createtime);
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var D = date.getDate() + " ";
        var h = date.getHours() + ":";
        var m = date.getMinutes() + ":";
        var s = date.getSeconds();
        result.list[i].createtime = Y + M + D + h + m + s;
      }
      this.total = result.total;

      this.datas = result.list;
      console.log(this.datas);
    },
    //老师列表
    async selectTeacherList() {
      let paras = {
        flag: 0
      };
      let lists = await api.selectPersonList(paras);
      let arr = [];
      for (let i = 0; i < lists.length; i++) {
        arr.push(lists[i]);
      }
      this.teacherFrom = arr;
      this.listLoading = false;
    },
    //标签列表
    async biaoqianList() {
      let paras = {
        flag: 1
      };
      let lists = await api.selectBiaoqianList(paras);
      let arr = [];
      for (let i = 0; i < lists.length; i++) {
        arr.push(lists[i]);
      }
      this.biaoqianForm = arr;
      this.listLoading = false;
    },
    listenThisUe(thisUe) {
      this.editForm[thisUe.name] = thisUe.data;
      return thisUe;
    },
    handleCurrentChange(val) {
      this.page = val;
      var para = {
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.getList(para);
    },

    //批量点赞页面
    selsChange: function(sels) {
      this.sels = sels;
    },
    async batchlike() {
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
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    //删除
    async handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(async () => {
          this.listLoading = true;
          await api.deletepubliccourse(row.id);
          this.listLoading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          var para = {
            pageNo: this.page,
            pageSize: this.pageSize
          };
          this.getList(para);
        })
        .catch(() => {});
    },
    //显示编辑界面
    async handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.editOrAdd = false;
      this.dialogVisible = true;
     
      var para2 = {
        id: row.id,
        name:row.name,
        teacher: row.teacher+"",
        period: row.period,
        title: row.title,
        summary: row.summary,
        conception: row.conception,
        /*  createtime:row.createtime, */
      //  orgid: row.orgid,
      /*   status: row.status, */
       // webcastId: row.webcastId
      };
      this.addForm = para2;
      this.showUeEdit = true;
    },
    //显示新增界面
    handleAdd: function() {
      this.dialogTitle = "新增";
      this.addForm = { ...{} };
      this.editOrAdd = true;
      this.dialogVisible = true;
      this.playAddressFileList = [];
      this.playadddress = "";
      this.showUeEdit = true;
    },

    //提交
    async editSubmit() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;

            if (this.editOrAdd) {
              this.editForm.label_id = this.biaoqianid;
              this.editForm.teacher = this.teacherid;
              this.editForm.name = this.biaoqianname;
              this.editForm.teacherName = this.teachername;
              if (this.desin == false) {
                this.editForm.is_pay = this.zhifu;
              }
              this.editForm.play_address = this.playadddress;
              this.editForm.shijianchuo = new Date().getTime();
              this.editForm.create_time = String(new Date().getTime());
              this.editForm.update_time = String(new Date().getTime());
              this.editForm.centor_viewpoint_id = String(new Date().getTime());
              let para = Object.assign({}, this.editForm);
              await api.addpanzhong(para);
            } else {
              if (this.biaoqianmake) {
                this.editForm.label_id = this.biaoqianid;
                this.editForm.name = this.biaoqianname;
              }
              if (this.teachermake) {
                this.editForm.teacher = this.teacherid;
                this.editForm.teacherName = this.teachername;
              }
              this.editForm.play_address = this.playadddress;
              this.editForm.update_time = String(new Date().getTime());
              let para = Object.assign({}, this.editForm);
              await api.editpanzhong(para);
            }
            this.dialogVisible = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.editLoading = false;
            var para1 = {
              pageNo: this.page,
              pageSize: this.pageSize
            };
            this.getList(para1);
          });
        }
      });
    },
    //恢复编辑页面为默认
    clearEdit() {
      let tmpObj = {};
      this.showUeEdit = false;
      this.editForm = Object.assign({}, tmpObj);
    },
    //注水提交
    async zhushuiSubmit() {
      this.$refs.zhushuiObj.validate(async valid => {
        this.zhushuiLoading = true;
        this.setInfuse(this.InfuseType);
      /*   var pagesa={
          like:this.sels.like,
          likeR:this.sels.likeR,
          id:this.sels.id

        }; */
        
       if(this.InfuseType==0 && this.zhushuiid!=""){
                        this.$confirm('条数为'+this.zhushuiid+"的点赞量超过阅读数，是否取阅读数最低值？", '提示', {
                            type: 'warning'
                        }).then(async () => {
                            if (valid) {
                                for(var i=0;i<this.sels.length;i++){
                                    delete this.sels[i].quan;
                                    
                                    this.sels[i].createtime= this.sels[i].createtime.getTime;
                                        
                                    this.sels[i].like= this.zhushuiid;
                                }
                                let res = await api.updateLikepublicCourse(this.sels);
                                if (res.success) {
                                    this.$message({
                                        message: "注水成功",
                                        type: "success",
                                        // duration: 0
                                    });
                                    this.zhushuiVisible = false;
                                } else {
                                    this.$message({
                                        message: "注水失败",
                                        type: "error"
                                    });
                                }
                                this.editLoading=false;
                                this.zhushuiObj.Infuse = 0;
                                var para = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                };
                                this.getList(para);
                            }
                        }).catch(() => {
                            this.editLoading=false;
                        });
					}else{
                        if (valid) {
                            for(var i=0;i<this.sels.length;i++){
                                delete this.sels[i].quan;
                            }
                            let res = await api.updateLikepublicCourse(this.sels);
                            if (res.success) {
                                this.$message({
                                    message: "注水成功",
                                    type: "success"
                                });
                                this.zhushuiVisible = false;
                            } else {
                                this.$message({
                                    message: "注水失败",
                                    type: "error"
                                });
                            }
                            this.editLoading=false;
                            this.zhushuiObj.Infuse = 0;
                            var para = {
                                pageNo:this.page,
                                pageSize:this.pageSize,
                            };
                            this.getList(para);
                        }
					}


                });

            },
  /*   setInfuse() {
      this.sels.forEach(a => {
        a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
        a.zhushuishu = this.zhushuiObj.Infuse;
        a.view = Number(this.zhushuiObj.Infuse) + Number(a.view);
      });
    } */
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
                            this.zhushuiid+=a.like +this.zhushuiObj.Infuse;

                            a.zhushuishu=a.view-a.like;
                            a.type=0;
                        } else {
                            a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                            a.zhushuishu = this.zhushuiObj.Infuse;
                            a.type=0;
                        }

                    }


             /*      this.sels.forEach(a  => {
                        this.zhushuiid='';

						if (
                            Number(this.zhushuiObj.Infuse) + Number(a.like) >
                            Number(a.view)
                        ) {
                            a.like = a.view;
                            //alert(a.num)
                            this.zhushuiid+=a.num +"    ";

                            a.zhushuishu=a.view-a.like;
                            a.type=0;
                        } else {
                            a.like = Number(this.zhushuiObj.Infuse) + Number(a.like);
                            a.zhushuishu = this.zhushuiObj.Infuse;
                            a.type=0;
                        }
                    });*/
                } else {
                    this.sels.forEach(a => {
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
      pageNo: this.page,
      pageSize: this.pageSize
    };
    this.getList(para);
    this.selectTeacherList();
    this.biaoqianList();
  }
};
</script>

<style>
.el-dialog.el-dialog--small {
  overflow-x: hidden;
}
.el-dialog__body {
  max-height: 800px;
  overflow-y: auto;
  /*        margin-right: -14px;
        padding-right: 34px;*/
}
.ql-container.ql-snow {
  max-height: 200px;
  overflow-y: auto;
}
.el-pagination {
  text-align: center;
}
.aaa{
  float: right;
}
</style>