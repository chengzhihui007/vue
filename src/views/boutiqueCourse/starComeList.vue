 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			  <el-form :inline="true">
                <el-form-item>
                <el-input v-model="selectbiaoTi" placeholder="请输入标题关键字"></el-input>
                </el-form-item>



					  <!--<el-select v-model="zhuChiRen"  placeholder="请选择主持人">-->
						  <!--<el-option-->
								  <!--v-for="list in zhuChiRenFrom"-->
								  <!--:key="list.nickName"-->
								  <!--:label="list.nickName"-->
								  <!--:value="list.nickName">-->
						  <!--</el-option>-->
					  <!--</el-select>-->





				  <el-form-item>
					  <el-select v-model="laoShi"  clearable  placeholder="请选择老师">
						  <el-option
								  v-for="list in laoShiFrom"
								  :key="list.teacherName"
								  :label="list.teacherName"
								  :value="list.teacherName">
						  </el-option>
					  </el-select>
				  </el-form-item>
				  <el-form-item>
					  <el-select v-model="type"  placeholder="请选择状态">
						  <el-option label="请选择状态" value="0"></el-option>
						  <el-option label="未发布" value="1"></el-option>
						  <el-option label="已发布" value="2"></el-option>
						  <el-option label="停用" value="3"></el-option>

					  </el-select>
				  </el-form-item>
				  <el-form-item>
					  <el-date-picker
							  v-model="timeadd"
							  type="date"
							  placeholder="选择日期">
					  </el-date-picker>
				  </el-form-item>
				  <br>

				  <el-form-item>
					  <el-select v-model="region" style="width:193px;"  placeholder="请输入指标">
						  <el-option label="请选择" value="0"></el-option>
						  <el-option label="浏览量" value="1"></el-option>
						  <el-option label="点赞量" value="2"></el-option>
						  <el-option label="评论量" value="3"></el-option>

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

		<!--列表-->
		<el-table :data="users" @current-change="tabhandleCurrentChange" highlight-current-row v-loading="listLoading" @selection-change="selsChange" @sort-change="sortChang" style="width: 100%;">
			<el-table-column type="selection" width="60" >
			</el-table-column>

			<el-table-column prop="title" label="标题" min-width="100" sortable=custom>
			</el-table-column>


			<el-table-column prop="laoShi" label="老师" min-width="80" sortable=custom>
			</el-table-column>

			<el-table-column prop="viewR" label="播放实数 总数" min-width="70"  >
			</el-table-column>

			<el-table-column prop="comment" label="评论实数 总数" min-width="70"  >
			</el-table-column>

			<el-table-column prop="likeR" label="点赞实数 总数" min-width="70"  >
			</el-table-column>

			<el-table-column prop="collect" label="PPT播放数" min-width="100" sortable=custom>
			</el-table-column>

			<el-table-column prop="collect" label="收藏数" min-width="100" sortable=custom>
			</el-table-column>

			<el-table-column prop="share" label="分享数" min-width="100" sortable=custom>
			</el-table-column>
			<el-table-column prop="updateTime" label="发布时间" width="180" sortable=custom>
			</el-table-column>
			<el-table-column label="操作" width="400">
				<template scope="scope">

					<el-button size="small"  v-if=" username!='quanzi1'" @click="handleEdit(scope.$index, scope.row.rowId)">修改</el-button>
					<!--<el-button size="small"  v-if=" username!='quanzi1'" @click="handleEdit(scope.$index, scope.row.id)">评论</el-button>-->
					<el-button size="small"  v-if=" username!='quanzi1'" @click="likeAdd(scope.$index, scope.row.rowId,scope.row.like)">点赞</el-button>
					<el-button type="small" size="small"  @click="viewAdd(scope.$index, scope.row.rowId,scope.row.view)">浏览</el-button>
					<el-button type="danger" size="small"   v-if=" username!='quanzi1'" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
					<el-select v-model="likeFrom.batchLikeType"  placeholder="请选择批量点赞对象">
						<el-option label="全部" value="0"></el-option>
						<el-option label="源达智投" value="1"></el-option>
						<el-option label="财源滚滚" value="2"></el-option>
					</el-select>
				</el-form-item>

                <el-form-item>
				  <el-input v-model="likeFrom.batchLikeInput" placeholder="请输入添加数量"  @change="likeEvent(likeFrom.batchLikeInput,likeFrom.batchLikeType)"  style="width:220px;"></el-input>
				</el-form-item>

				<el-form-item>
				  <p>您确定为这些标题手动增加 <font size="5" color="red">{{likeFrom.like}}</font>   个赞吗？</p>
				</el-form-item>
			 </el-form>






			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchlikeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchLikeSubmit(likeFrom.batchLikeInput)">确 定</el-button>
		    </span>
		</el-dialog>

		<!--批量浏览界面-->
		<el-dialog title="批量增加浏览量" :visible.sync="BatchViewDialogVisible"  center>

			<el-form   :model="valueFrom"  label-width="80px"   ref="likeFrom">
				<el-form-item>
					<el-select v-model="valueFrom.batchViewType"  placeholder="请选择批量点赞对象">
						<el-option label="全部" value="0"></el-option>
						<el-option label="源达智投" value="1"></el-option>
						<el-option label="财源滚滚" value="2"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-input v-model="valueFrom.batchViewInput" placeholder="请输入添加数量"  @change="valueEvent(valueFrom.batchViewInput,valueFrom.batchViewType)"  style="width:220px;"></el-input>
				</el-form-item>

				<el-form-item>
					<p>您确定为这些标题手动增加  <font size="5" color="red">{{valueFrom.value}}</font>    个浏览数吗？</p>
				</el-form-item>
			</el-form>




			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="BatchViewDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="batchViewSubmit">确 定</el-button>
		    </span>
		</el-dialog>


		    <!--点赞界面-->
		<el-dialog title="点赞" :visible.sync="likeDialogVisible"  center>
			<el-form :model="likeFromR" label-width="80px"   ref="likeForm">
				<el-row class="demo-autocomplete">
					<el-col :span="5">
						<div class="sub-title">现在数量</div>
						<p style="width:60px;display:inline-block">{{likeFromR.like}}</p>



						<strong style="width:30px;display:inline-block">+</strong>

						<el-input v-model="likeFromR.batchViewInput"     @change="likeEvent1(likeFromR.like,likeFromR.batchViewInput,likeFromR.id)"  style="width:60px; display:inline-block"></el-input>

						<strong style="width:30px;display:inline-block">&nbsp; =</strong>


                  </el-col>



					<el-col :span="5">
						<div class="sub-title">增加后数量</div>
						<p>{{likeFromR.likeR}}</p>
					</el-col>
				</el-row>

				<p>您确定为该标题手动增加  <font size="5" color="red">{{likeFromR.batchViewInput}}</font>    个赞吗？</p>
			</el-form>

			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="likeDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="likeSubmit(likeFromR.id)">确 定</el-button>
		    </span>
		</el-dialog>

		<!--浏览界面-->
		<el-dialog title="浏览" :visible.sync="viewDialogVisible"  center>


			<el-form :model="valueFromR" label-width="80px"   ref="likeForm">
				<el-row class="demo-autocomplete">
					<el-col :span="5">
						<div class="sub-title">现在数量</div>
						<p style="width:60px;display:inline-block">{{valueFromR.view}}</p>



						<strong style="width:30px;display:inline-block">+</strong>

						<el-input v-model="valueFromR.batchViewInput"     @change="valueEvent1(valueFromR.view,valueFromR.batchViewInput,valueFromR.id)"  style="width:60px; display:inline-block"></el-input>

						<strong style="width:30px;display:inline-block">&nbsp; =</strong>


					</el-col>



					<el-col :span="5">
						<div class="sub-title">增加后数量</div>
						<p>{{valueFromR.viewR}}</p>
					</el-col>
				</el-row>

				<p>您确定为该标题手动增加  <font size="5" color="red">{{valueFromR.batchViewInput}}</font>    个浏览数吗？</p>
			</el-form>





			<span slot="footer" class="dialog-footer"  center="true">
				<el-button @click="viewDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="viewSubmit(valueFromR.id)">确 定</el-button>
		    </span>
		</el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" width="50%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">


				<el-form-item label="期" prop="qiShu">
					<el-input v-model="editForm.qiShu"  style="width:120px;"   ></el-input>
				</el-form-item>


				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title"  style="width:400px;" auto-complete="off" placeholder="（限20个字以内）"></el-input>
				</el-form-item>

				<el-form-item label="老师" prop="laoShi">
					<el-input v-model="editForm.laoShi" auto-complete="off" style="width:200px;"></el-input>
				</el-form-item>



				<el-form-item label="课程简介" prop="jianJie">
					<el-input type="textarea" :rows="5"   v-model="editForm.jianJie"></el-input>
				</el-form-item>


				<!--<el-form-item label="主持人" prop="zhuChiRen" >-->
					<!--<el-select  v-model="editForm.zhuChiRen"  clearable placeholder="&#45;&#45;请选择主持人&#45;&#45;"  >-->
						<!--<el-option-->
								<!--v-for="list in zhuChiRenFrom"-->
								<!--:key="list.nickName"-->
								<!--:label="list.nickName"-->
								<!--:value="list.nickName">-->
						<!--</el-option>-->
					<!--</el-select>-->
				<!--</el-form-item>-->

				<!--<el-form-item label="嘉宾" prop="laoShi" >-->
					<!--<el-select   v-model="editForm.laoShi"  clearable placeholder="&#45;&#45;请选择老师&#45;&#45;"  >-->
						<!--<el-option-->
								<!--v-for="list in laoShiFrom"-->
								<!--:key="list.nickName"-->
								<!--:label="list.nickName"-->
								<!--:value="list.nickName">-->
						<!--</el-option>-->
					<!--</el-select>-->
				<!--</el-form-item>-->


				<el-form-item  label="封面"   prop="tuPianDiZhi" >
					<el-upload class="upload-demo" action="api/gydPanQianJieDuController/Uploadfile" :multiple="false" :file-list="editForm.fengMianTuList" :on-success="handleAvatarSuccess"  :on-preview="handlePreview"  list-type="picture" :on-remove="handleRemove">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="图片地址" prop="tuPianDiZhi"  style="display: none">
					<el-input   v-model="editForm.tuPianDiZhi"></el-input>
				</el-form-item>

				<el-form-item label="PDF文件"  prop="pdfUrl">
					<el-upload  class="upload-demo" action="api/gydPanHouCeLueController/Uploadfile" accept=".pdf"  :on-success="handleChangeEditPDF" :on-remove="handleRemoveEditPDF" :file-list="fileListEditPDF">
						<el-button size="small" type="primary">点击上传PDF文件</el-button>
						<div style="float: right;margin-left: 15px;" class="el-upload__tip">上传PDF文件</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="PDF地址" prop="pdfUrl" style="display: none">
					<el-input   v-model="editForm.pdfUrl"></el-input>
				</el-form-item>



				<el-form-item>
					<el-date-picker
							v-model="create_time"
							type="date"
							placeholder="选择创建日期">
					</el-date-picker>
				</el-form-item>


				<!--<el-form-item  label="封面" prop="fengMianTu"  >-->
					<!--<el-upload class="avatar-uploader" action="api/gydPanQianJieDuController/Uploadfile" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">-->
						<!--<img v-if="editForm.fengMianTu" :src="editForm.fengMianTu" class="avatar">-->
						<!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
					<!--</el-upload>-->
					<!--<el-dialog :visible.sync="dialogVisible">-->
						<!--<img width="100%" :src="dialogImageUrl" alt="">-->
					<!--</el-dialog>-->
				<!--</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>




	</section>
</template>

<script>
import util from "../../common/js/util";
import {imageDefault} from "../../common/js/urls";
import UeEdit from "../UeEdit.vue";
import api from "../../api/api.js";
export default {
  components: { UeEdit },
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
        valueFrom:{
            batchViewType:"",
            batchViewInput:"",
            value:""

        },
        likeFrom:{
            batchLikeType:"",
			batchLikeInput:"",
			like:""

        },
        likeFromR:{
            like:"",
            batchViewInput:"",
            likeR:"",

		},
        valueFromR:{
            view:"",
            batchViewInput:"",
            viewR:""

        },
        editForm: {},
        fileListEditPDF: [],
        form1: {
            image1: ''
        },
        batchLikeInput:"",
        batchViewInput:"",
        //主持人数据
        zhuChiRenFrom:{

        },
        //主持人数据
        laoShiFrom:{

        },
        likeForm: {},
        viewForm: {},
        BatchlikeDialogVisible:false,
        BatchViewDialogVisible:false,
        likeDialogVisible:false,
        viewDialogVisible:false,
        region: '',
        batchLikeType:'',
        batchViewType:'',
        zhuChiRen:'',
        laoShi:'',
		type:'',
        formLabelWidth: '120px',
        fengMianTu: '',

        pickerOptions1: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            }
        },
        timeadd: '',
        username:'',
      editOrAdd: false,
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      pageSize: 15,
      currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列
      selectbiaoTi: "",
        selectMin:"",
        selectMax:"",
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      previewVisible: false,
      zhushuiVisible: false,
      previewObj: {},
      zhushuiObj: {zhushuihaopingshu:""},
      editFormRules: {

          jianJie: [
              { required: true, message: "请输入内容简介", trigger: "blur" },
              { min: 1, max: 50, message: "内容超出限制", trigger: "blur" }
          ],
          title: [
              { required: true, message: "请输入标题", trigger: "blur" },
              { validator: numbers, message: "内容超出限制", trigger: "blur", num: 40 }
          ],
          qiShu: [
              { required: true, message: "请输入期", trigger: "blur" },
              { validator: numbers, message: "限20个字以内", trigger: "blur", num: 40 }
          ],

          laoShi: [{ required: true, message: "请输入直播老师", trigger: "blur" }],
          fengMianTu: [
              { required: true, message: "请选择图片文件", trigger: "change" }
          ],
          tuPianDiZhi: [
              { required: true, message: "请选择图片文件", trigger: "change" }
          ],
          pdfUrl: [
              { required: true, message: "请选择PDF文件", trigger: "change" }
          ],
       },

      defaultModules: {
        toolbar: ["image"]
      }
    };
  },
  methods: {
      likeEvent(a,b){

          this.likeFrom ={
              like:a,
              batchLikeType:b
		  };

	  },
      likeEvent1(a,b,c){
//        alert(parseInt(a)+parseInt(b));
          this.likeFromR ={
              like:a,
              likeR:parseInt(a)+parseInt(b),
              batchViewInput:b,
              id:c

          };

	  },
      valueEvent(a,b){

          this.valueFrom ={
              value:a,
              batchViewType:b

          };

      },
      valueEvent1(a,b,c){

          this.valueFromR ={
              view:a,
              viewR:parseInt(a)+parseInt(b),
              batchViewInput:b,
			  id:c

          };
	  },

      handleChangeEditPDF(response, file) {

          this.editForm.pdfUrl = response.message;

      },
      handleRemoveEditPDF() {
          this.editForm.pdfUrl = "";
      },
      handleAvatarSuccess(response, file, fileList){
          //alert(res.message);
          //this.editForm.fengMianTu = URL.createObjectURL(file.raw);//URL.createObjectURL(file.raw);


          this.editForm.tuPianDiZhi = imageDefault+response.message;
          //this.form1.image1=URL.createObjectURL(file.raw);//URL.createObjectURL(file.raw);
          //console.log(fileList);
      },

      handleRemove(file, fileList) {
          console.log(file, fileList);
      },
      handlePreview(file) {
          console.log(file);
      },

//      beforeAvatarUpload(file) {
//          alert(file.type);
//          //const isJPG = file.type === 'image/png';
//          const isLt2M = file.size / 1024 / 1024 < 2;
//
////          if (!isJPG) {
////              this.$message.error('上传头像图片只能是 JPG 格式!');
////         }
//          if (!isLt2M) {
//              this.$message.error('上传头像图片大小不能超过 2MB!');
//          }
//          //return isJPG && isLt2M;
//          return   isLt2M;
//      },
      //获取主持人列表
      async getZhuChiRen() {
          let paras = {
              pageNo: this.page,
              pageSize: 10,

          };
          let lists=await api.findZhuChiRenList(paras);
          let arr = [];
          for(let i=0;i<lists.length;i++){

                  arr.push(lists[i]);

          }
          this.zhuChiRenFrom=arr;
          this.listLoading = false;
      },
      //获取老师列表
      async getLaoShi() {
          let paras = {
              pageNo: this.page,
              pageSize: 10,

          };
          let lists=await api.findPhclList(paras);
          let arr = [];
          for(let i=0;i<lists.length;i++){

              arr.push(lists[i]);

          }
          this.laoShiFrom=arr;
          this.listLoading = false;
      },
      //点赞新增界面
      likeAdd: function(a,b,c) {

          this.likeDialogVisible = true;
          this.likeFromR = {

              like: c,
			  id:b
          };

      },
      //阅读新增界面
      viewAdd: function(a,b,c) {

          this.viewDialogVisible = true;
          this.valueFromR = {

              view: c,
              id:b
          };

      },
      async  batchLikeSubmit(a) {

          var dataArray="";
          for ( var i=0;i<this.sels.length;i++)
          {
              //alert(this.sels[i].rowId);
			  if(dataArray == ""){
                  dataArray += this.sels[i].rowId
			  }else{
                  dataArray += ","+this.sels[i].rowId
			  }


          }
          let formValue = Object.assign({}, this.likeFrom);
          console.log(formValue);
          var para1 = {
              ids:dataArray,
              batchLikeInput:formValue.like,
              batchLikeType: formValue.batchLikeType,
			  type:"1"
          };

          console.log(para1)
            await api.BatchLikeAdd(para1);

          this.BatchlikeDialogVisible = false

          this.$message({
              message: "批量点赞成功",
              type: "success"
          });

      },
      async  likeSubmit(a){

          let para = Object.assign({}, this.likeFromR);

          var para1 = {
              contentId:a,
              type:"1",
			  likeR:para.likeR,
             like:para.like

          };

          await api.likeAdd(para1);
          this.likeDialogVisible = false

          this.$message({
              message: "点赞成功",
              type: "success"
          });


	  },
      async  viewSubmit(a){
          let para = Object.assign({}, this.valueFromR);
          var para1 = {
              contentId:a,
              type:"2",
              viewR:para.viewR,
              view:para.view

          };
          alert("11");
          console.log(para1);
          await api.likeAdd(para1);
          this.likeDialogVisible = false

          this.$message({
              message: "浏览成功",
              type: "success"
          });


      },

      async  batchViewSubmit() {

          var dataArray="";
          for ( var i=0;i<this.sels.length;i++)
          {
              //alert(this.sels[i].rowId);
              if(dataArray == ""){
                  dataArray += this.sels[i].rowId
              }else{
                  dataArray += ","+this.sels[i].rowId
              }


          }


          let fromView = Object.assign({}, this.valueFrom);
          var para1 = {
              ids:dataArray,
              batchViewInput:fromView.value,
              batchViewType: fromView.batchViewType,
              type:"2"
          };

          alert("1");
          console.log(para1)
		  return false;
          await api.BatchLikeAdd(para1);
          this.BatchViewDialogVisible = false

          this.$message({
              message: "批量浏览成功",
              type: "success"
          });

      },

	  //批量点赞
      batchLike: function() {


        this.likeFrom= {
              batchLikeType:"",
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
	  //批量阅读
      batchView: function() {

          this.valueFrom={
              batchViewType:"",
                  batchViewInput:"",
                  value:""

          }


          if(this.sels.length  < 1){
              this.$message({
                  message: "请选择至少选择一行！",
                  type: "error"
              });

              this.BatchlikeDialogVisible = false;
          }else{

              this.BatchViewDialogVisible = true;
		  }





      },
    async zhushuiSubmit (){
        let result = await api.sethaoping(this.zhushuiObj.gengXinShiJian,this.zhushuiObj.haoPing,this.zhushuiObj.zhushuihaopingshu,this.zhushuiObj.id)
        this.zhushuiVisible = false
        if(result.status==1){
            this.$message({
            message: "注水成功",
            type: "success"
          });
        }
        else{
           this.$message({
            message: "注水失败",
            type: "error"
           });
        }

        var para1 = {
            pageNo:1,
            pageSize:this.pageSize,
            orderBy:"a.updateTime DESC ",
            selectbiaoTi: this.selectbiaoTi
        };
        this.getPanListShowTest(
            para1
        );
//         this.getPanListShow(
//              this.page,
//              this.pageSize,
//              "a.shijian DESC ",
//              this.selectbiaoTi
//            );
    },
    zhushui() {
      if(this.zhushuiObj.haoPing == undefined){
         this.$message({
              message: "请选择注水信息！",
              type: "error"
            });
      }
      else{
        this.zhushuiVisible = true;
      }
    },
    async preview(index, id) {
      this.previewVisible = true;
      this.previewObj = await api.getPanOne(id);
    },
    listenThisUe(thisUe) {
      this.editForm[thisUe.name] = thisUe.data;
      return thisUe;
    },
    handleCurrentChange(val) {
      this.page = val;

        var para = {
            pageNo:this.page,
            pageSize:this.pageSize,
            orderBy:"a.updateTime DESC ",
            selectbiaoTi: this.selectbiaoTi
        };
        this.getPanListShowTest(
            para
        );

//      this.getPanListShow(
//        this.page,
//        this.pageSize,
//        "a.shijian DESC ",
//        this.selectbiaoTi
//      );
    },
    tabhandleCurrentChange(row) {
      this.zhushuiObj = row;
    },
    //编译13位时间戳
    timeFormat(nS) {
      // return new Date(parseInt(("/Date("+nS+")/").substr(6, 13))).toLocaleDateString();
      var timestamp4 = new Date(Number(nS));
      return (
        timestamp4.toLocaleDateString().replace(/\//g, "-") +
        " " +
        timestamp4.toTimeString().substr(0, 8)
      );
    },
    //清空并替换富文本编辑器内容
    clearInsert(name, cont) {
      let ueId = UE.getEditor(this.$refs[name].id);
      // console.log(ueId)
      ueId.execCommand("cleardoc");
      if (cont) {
        ueId.execCommand("insertHtml", cont);
      }
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      this.listLoading = false;
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
    //删除
    async handleDel(index, row) {
      this.$confirm("   您确定删除该记录吗？删除后前台将不再显示，该记录所有的关联数据将同时被删除", "提示", {
        type: "warning"
      })
        .then(async () => {
          this.listLoading = true;
          //NProgress.start();
          console.log(row);
          await api.starComeDel(row.rowId);

          this.listLoading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });

            var para1 = {
                pageNo:this.page,
                pageSize:this.pageSize,
                orderBy:"a.updateTime DESC ",
                selectbiaoTi: this.selectbiaoTi
            };
            this.getPanListShowTest(
                para
            );

//          this.getPanListShow(
//            this.page,
//            this.pageSize,
//            "a.shijian DESC ",
//            this.selectbiaoTi
//          );
        })
        .catch(() => {});
    },
    //显示编辑界面
    async handleEdit(index, row) {
      this.editOrAdd = false;
      let result = await api.getPhclView(row);



		console.info(result);
      this.editForm = result;

        this.fileListEditPDF = [];
        let objPDF = new Object({
            url: "",
            name: this.editForm.pdfUrl
        });
        //alert(this.editForm.pdfUrl);
        if (
            this.editForm.pdfUrl != "" &&
            this.editForm.pdfUrl != "null"
        ) {
            this.fileListEditPDF.push(objPDF);
        }

        this.fengMianTuList = [];
        let objTP = new Object({
            url: this.editForm.tuPianDiZhi,
            name: this.editForm.tuPianDiZhi
        });
        if (
            this.editForm.tuPianDiZhi != "" &&
            this.editForm.tuPianDiZhi != "null"
        ) {
            this.fengMianTuList.push(objTP);
        }



        this.editFormVisible = true;
//      if(this.editForm.biaoTi!=null){
//        this.clearInsert("biaoTi", this.editForm.biaoTi);
//      }
//      if(this.editForm.qiShu!=null){
//        this.clearInsert("qiShu", this.editForm.qiShu);
//      }
//      if(this.editForm.zhuChiRen!=null){
//        this.clearInsert("zhuChiRen", this.editForm.zhuChiRen);
//      }
//      if(this.editForm.laoShi!=null){
//        this.clearInsert("laoShi", this.editForm.laoShi);
//      }

    },
    //显示新增界面
    handleAdd: function() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();


        this.fileListEditPDF = [];


      this.editOrAdd = true;
      this.editFormVisible = true;
      this.editForm = {
          jianJie:"",
          title:"",
          qiShu:month+"-"+day,

          laoShi:"",
          //fengMianTu:"",
          fengMianTuList:[],
          fileListEditPDF:[],
          pdfUrl:"",
          tuPianDiZhi:""

      };

//      this.clearInsert("biaoTi");
//      this.clearInsert("qiShu");
//      this.clearInsert("zhuChiRen");
//      this.clearInsert("imageUrl");
    },
    //编辑
    async editSubmit() {
      this.$refs.editForm.validate(async valid => {
          alert(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;

            if (this.editOrAdd) {
                //alert("1");

              let para = Object.assign({}, this.editForm);
              //alert("11");
              console.log(para);
                //this.editForm.fengMianTu = this.form1.image1;
                //alert(this.editForm.fengMianTu);
              await api.addGydZaoZhiXiaoSomeData(para);
            } else {
                // alert("2");
              let para = Object.assign({}, this.editForm);
                 alert("11");
                console.log(para)
                //this.editForm.fengMianTu = this.form1.image1;
                //alert(this.editForm.fengMianTu);
              await api.updateGydZaoZhiXiaoSomeData(para);
            }
            this.editFormVisible = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.editLoading = false;

              var para1 = {
                  pageNo:this.page,
                  pageSize:this.pageSize,
                  orderBy:"a.updateTime DESC ",
                  selectbiaoTi: this.selectbiaoTi
              };
              this.getPanListShowTest(
                  para1
              );


//            this.getPanListShow(
//              this.page,
//              this.pageSize,
//              "a.shijian DESC ",
//              this.selectbiaoTi
//            );
          });
        }
      });
    },
    sortChang(a, b) {
      if (a.order == "descending") {

          var para1 = {
              pageNo:this.page,
              pageSize:this.pageSize,
              orderBy:a.prop + " desc",
              selectbiaoTi: this.selectbiaoTi
          };
          this.getPanListShowTest(
              para1
          );


//        this.getPanListShow(
//          this.page,
//          this.pageSize,
//          a.prop + " desc",
//          this.selectbiaoTi
//        );
      } else {
          var para1 = {
              pageNo:this.page,
              pageSize:this.pageSize,
              orderBy:a.prop,
              selectbiaoTi: this.selectbiaoTi
          };
          this.getPanListShowTest(
              para1
          );

//        this.getPanListShow(
//          this.page,
//          this.pageSize,
//          a.prop,
//          this.selectbiaoTi
//        );
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    getlist() {

        var d = new Date(this.timeadd);
       // var  time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        var  time =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
        var para = {
			pageNo:1,
			pageSize:this.pageSize,
            orderBy:"a.updateTime DESC ",
            selectbiaoTi: this.selectbiaoTi,
             type: this.type,
            laoShi: this.laoShi,
            timeadd: this.timeadd,
            region: this.region,
            selectMin:this.selectMin,
            selectMax:this.selectMax
        };
          this.getPanListShowTest(
         para
      );


       // alert(time);
//      this.getPanListShow(
//        1,
//        this.pageSize,
//        "a.shijian DESC ",
//          ""
//      );
    },
      //获取盘前列表 test
      async getPanListShowTest(keyword) {

          //var admin = sessionStorage.getItem("user");
          // var a = JSON.parse(admin);
          //this.username=a.user_name;
          let result = await api.getPHclList(keyword);

          //console.log(result.list[0])
          for (let i = 0; i < result.list.length; i++) {
              var view = result.list[i].view;
              var viewR = result.list[i].viewR;
              result.list[i].viewR =view+' \n '+viewR;

              var comment = result.list[i].comment;
              var commentR = result.list[i].commentR;
              result.list[i].comment =comment+' \n '+commentR;

              var like = result.list[i].like;
              var likeR = result.list[i].likeR;
              result.list[i].likeR =like+' \n '+likeR;
          }
          this.users = result.list;

          this.total = result.total;
      }
      ,
    //获取盘前列表
    async getPanListShow(no, size, by, keyword) {
        //var admin = sessionStorage.getItem("user");
       // var a = JSON.parse(admin);
        //this.username=a.user_name;
      let result = await api.getGydPanZaoZhiXiaoList(no, size, by, keyword);

      //console.log(result.list[0])
      for (let i = 0; i < result.list.length; i++) {
          var view = result.list[i].view;
          var viewR = result.list[i].viewR;
          result.list[i].view =view+'\n '+viewR;

          var comment = result.list[i].comment;
          var commentR = result.list[i].commentR;
          result.list[i].comment =comment+'\n '+commentR;

          var like = result.list[i].like;
          var likeR = result.list[i].likeR;
          result.list[i].like =like+'\n '+likeR;
      }
      this.users = result.list;

      this.total = result.total;
    }
  },
  mounted() {
    this.getUsers();

      var para = {
          pageNo:1,
          pageSize:this.pageSize,
          orderBy:"a.updateTime DESC ",
          selectbiaoTi: this.selectbiaoTi
      };
      this.getPanListShowTest(
          para
      );

//    this.getPanListShow(
//      1,
//      this.pageSize,
//      "a.shijian DESC ",
//      this.selectbiaoTi
//    );
    //this.getZhuChiRen();
      this.getLaoShi();
  }
};
</script>

<style>
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
	<!--     -->
.el-dialog.el-dialog--small {
  overflow-x: hidden;
}
.el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
  margin-right: -14px;
  padding-right: 34px;
}
.ql-container.ql-snow {
  max-height: 200px;
  overflow-y: auto;
}
.el-pagination {
  text-align: center;
}
</style>