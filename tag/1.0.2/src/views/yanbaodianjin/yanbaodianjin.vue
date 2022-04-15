<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="请输入标题关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select  v-model="filters.state" clearable placeholder="请选择状态">
						<el-option label="已发布" value="1"></el-option>
						<el-option label="未发布" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker
							v-model="filters.datetime"
							type="date"
							placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<div>
					<el-form-item>
						<el-select v-model="filters.region" style="width:193px;"  clearable  placeholder="请选择指标">
							<el-option label="浏览量" value="1"></el-option>
							<el-option label="点赞量" value="2"></el-option>

						</el-select>

					</el-form-item>
					<el-form-item  >
						<el-col :span="11">
							<el-input v-model="filters.selectMin" placeholder="请输入指标最低值"></el-input>
						</el-col>
						<el-col class="line" :span="1">-</el-col>
						<el-col :span="11">
							<el-input v-model="filters.selectMax" placeholder="请输入指标最高值"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getList()">查询</el-button>
					</el-form-item>
				</div>
				<div>
					<el-form-item>
						<el-button type="primary"  @click="handleAdd">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary"  @click="handleInfuse(0)" >增加点赞</el-button>
						<el-button type="primary"  @click="handleInfuse(1)" >增加浏览量</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange"  style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<!--<el-table-column prop="stock_analysis_id" label="ID" min-width="100"  ></el-table-column>-->
			<el-table-column prop="title" label="标题" min-width="150"  ></el-table-column>
            <el-table-column prop="teacherName" label="信息来源" min-width="80" ></el-table-column>
            <el-table-column prop="content" label="行业分析" min-width="100" ></el-table-column>
			<el-table-column prop="nameandcode" label="个股" min-width="110"  ></el-table-column>
			<el-table-column prop="liulan" label="浏览实数/总数" min-width="100" ></el-table-column>
			<el-table-column prop="zan" label="点赞实数/总数" min-width="100" ></el-table-column>
			<el-table-column prop="share" label="分享数" min-width="50" ></el-table-column>
			<el-table-column prop="datetime" label="更新时间" min-width="130" ></el-table-column>
			<el-table-column prop="updatetime" label="发布时间" min-width="130" ></el-table-column>
			<el-table-column prop="zhuangtai" label="状态" min-width="50" ></el-table-column>
			<el-table-column label="操作" min-width="120">
				<template scope="scope">
					<el-button size="small"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total  style="text-align: center;"></el-pagination>
		<!--编辑界面-->
		<el-dialog :title=dialogTitle :visible.sync="editFormVisible" :close-on-click-modal="false" v-on:close="clearEdit" width="50%">
			<el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" placeholder="（限20个字以内）" style="width: 320px;"></el-input>
				</el-form-item>

                	<el-form-item label="信息来源" prop="teacher" >
						<el-select  v-model="editForm.teacher"  clearable placeholder="--请选择信息来源--"  >
							<el-option
									v-for="list in teacherFrom"
									:key="list.id"
									:label="list.name"
									:value="list.id">
							</el-option>
						</el-select>
					</el-form-item>

                    <el-form-item label="行业分析"  prop="content"   >
						<el-input type="textarea" :rows="5"   v-model="editForm.content"></el-input>
					</el-form-item>

				<template v-for='(data,index) in editForm.quan'>
					<Smallspot :editForm=data :index=index :ref=spotRef @remove="remSpot"></Smallspot>
				</template>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false;clearEdit()">取消</el-button>
				<!--<el-button type="primary" @click.native="editSubmit(0)" :loading="editLoading">保存</el-button>-->
				<el-button type="primary" @click.native="editSubmit(1)" :loading="editLoading">保存并发布</el-button>
			</div>
		</el-dialog>
		<!--批量点赞-->
		<el-dialog title="注水" :visible.sync="zhushuiVisible" :close-on-click-modal="false">
			<el-form :model="zhushuiObj" ref="zhushuiObj" label-width="100px" class="demo-ruleForm">
				<el-form-item label="注水数" prop="Infuse" :rules="[
                       { required: true, message: '不能为空'},
                       { type: 'number', message: '必须为数字值'}
                       ]">
					<el-input type="Infuse" v-model.number="zhushuiObj.Infuse" auto-complete="off" placeholder="请输入增加数量" v-on:input ="likeEvent(zhushuiObj.Infuse)"></el-input>
				</el-form-item>
				<el-form-item v-if="this.InfuseType==0">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个赞吗？</p>
				</el-form-item>
				<el-form-item v-else="">
					<p>您确定为这些标题手动增加 <font size="5" color="red">{{zhushuiObj.Infuse}}</font>   个阅读数吗？</p>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="zhushuiVisible = false,editLoading=false">取消</el-button>
				<el-button type="primary" @click.native="zhushuiSubmit()" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import UeEdit from '../UeEdit.vue';
	import Smallspot from "./Smallspot.vue";
	import api from '../../api/api.js';
    import kbspiritDataStore from '../../common/js/kbspiritDataStore.js';

    export default {
		components: {Smallspot,UeEdit},
		data() {
			return {
                username:'',
                sortname: "tiJiaoShiJian",
                sortorder: " desc",
                estimatedTime: true,
                biaoTi:'',
                InfuseType:'',
				fabu:0,
                zhushuiObj: { Infuse: null },
                dialogTitle: "新增",
                editOrAdd: true,
				spotRef:'spotModular',
                zhushuiVisible: false,
				currentPage: 1,
				pageSize:10,
                datas: [],
                zhushuiid:'',
                index:"",
				//编辑界面数据
				editForm: {
				},
                teacherFrom:{},
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
                ZsFormVisible:false,
				editLoading: false,
				ZsLoading:false,
				editFormRules: {
                    title: [
						{ required: true, message: '请输入标题', trigger: 'blur' },
                        { max: 20, message: '最多输入20个字符', trigger: 'blur' }
                    ],
                     teacher: [
                        { required: true, message: '--请选择信息来源--', trigger: 'change' }
                    ],
                    content: [
						{ required: true, message: '请输入行业分析', trigger: 'blur' },
                        { max: 4000, message: '最多输入2000字', trigger: 'blur' }
                    ],
				},
			    props: {
			      editForm: {
			        type: Object
			      },

			    },

				addFormVisible: false,//新增界面是否显示
                chakanFormVisible:false,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                     teacher: [
                        { required: true, message: '--请选择信息来源--', trigger: 'change' }
                    ],
                    content: [
						{ required: true, message: '请输入行业分析', trigger: 'blur' },
                        { max: 2000, message: '最多输入2000字', trigger: 'blur' }
                    ], 
				},

			}
		},
		methods: {
			//清空并替换富文本编辑器内容
			clearInsert(name,cont){
				var a = name.toString();
				let ueId = this.$refs[a].id;
				UE.getEditor(ueId).execCommand('cleardoc');
				UE.getEditor(ueId).execCommand('insertHtml', cont);
			},
			handleCurrentChange(val) {
				this.page = val;
                var para = {
                    pageNo:this.page,
                    pageSize:this.pageSize,
                };
                this.getList(para);
			},
            handleSizeChange(val) {
            },
			setSpotRef(index){
				return 'spot' + (Number(index) + 1)
			},
			addSpot: function() {
                this.editForm.quan.push({
					jingXuanGeGu:[
                        {name:'',code:'',content:''}
					]
				})
            },
            remSpot(index){
            	this.editForm.quan.splice(index, 1);
            },
			//删除
			async handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(async() => {
					this.listLoading = true;
                    await api.deleteYanBao(row.stock_analysis_id)
                    this.listLoading = false;
                    var para = {
                        pageNo:this.page,
                        pageSize:this.pageSize,
                    };
                    this.getList(para);
				}).catch(() => {

				});
			},
			//查询
            async find() {
                let para={biaoTi:this.biaoTi}
                await api.chaxun(para);
            },
			//显示编辑界面
			handleEdit: function (index, row) {
                this.dialogTitle = "编辑";
                this.editOrAdd = false;
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				if(this.editForm.is_deploy){
				    this.fabu=1
				}else{
				    this.fabu=0
				}
                this.estimatedTime = false;
                this.showUe = true;
                this.$refs.editForm.resetFields();
			},
            //显示注水页面
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
            likeEvent(a){

                this.zhushuiObj ={
                    Infuse:a,

                };

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
                            a.like = a.view;
                            this.zhushuiid+=a.num +"    ";

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
			//显示新增界面
			handleAdd: function () {
                this.dialogTitle = "新增";
                this.editOrAdd = true;
                this.editFormVisible = true;
                this.estimatedTime = true;
                this.clearEdit()
                this.showUe = true;
//                this.$refs.editForm.resetFields();
			},
            //注水提交
            async zhushuiSubmit() {
                this.$refs.zhushuiObj.validate(async (valid) => {
                    this.editLoading=true;
                    this.setInfuse(this.InfuseType);
                    if(this.InfuseType==0 && this.zhushuiid!=""){
                        this.$confirm('条数为'+this.zhushuiid+"的点赞量超过阅读数，是否取阅读数最低值？", '提示', {
                            type: 'warning'
                        }).then(async () => {
                            if (valid) {
                                for(var i=0;i<this.sels.length;i++){
                                    delete this.sels[i].quan;
                                }
                                let res = await api.updateLikeyanbao(this.sels);
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
                        }).catch(() => {
                            this.editLoading=false;
                        });
					}else{
                        if (valid) {
                            for(var i=0;i<this.sels.length;i++){
                                delete this.sels[i].quan;
                            }
                            let res = await api.updateLikeyanbao(this.sels);
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
			//编辑
			async editSubmit (i) {
                this.editForm.is_deploy=i;
                var para = Object.assign({}, this.editForm)
                let ref = this.spotRef;
                let name='';
                let code='';
                let content="";
                for(let i=0;i<this.$refs[ref].length;i++){
                    para.quan[i] = this.$refs[ref][i].getUeCon()
                    for(let j=0;j<para.quan[i].jingXuanGeGu.length;j++){
                        name=para.quan[i].jingXuanGeGu[j].name;
                        let aa=para.quan[i].jingXuanGeGu[j].content;
                        content=aa.replace(/(\s|&nbsp;)+/g,' ');
                    }
                }
               if(name==undefined || name==""){
                   this.$confirm('股票名称不能为空')
			   }else if(content.length==0){
                    this.$confirm('内容不能为空')
				}else{
                    this.$refs.editForm.validate(async (valid) => {
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                                this.editFormVisible = false;
                                this.editLoading = true;
                                para.quan = JSON.stringify(para.quan)
                                if(this.editOrAdd){
                                    para.stock_analysis_id=String( new Date().getTime())
									para.create_time=String( new Date().getTime());
                                    para.update_time=String( new Date().getTime());
                                    para.stock_json=para.quan;
                                    await api.addYanbao(para)
                                }else{
                                    para.fabu=this.fabu;
                                    if(this.fabu==1){
                                     para.is_deploy=1;
									}
                                    para.update_time=String( new Date().getTime());
                                    await api.updateYanbao(para)
                                }
                                this.clearEdit();
                                this.editLoading = false;
                                var para1 = {
                                    pageNo:this.page,
                                    pageSize:this.pageSize,
                                };
                                this.getList(para1);
                            });
                        }
                    });
				}

			},
            //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                    id: '',
                    biaoTi: '',
                    tiJiaoShiJian:'',
                    gengXinShiJian:'',
                    quan:[{
                        jingXuanGeGu:[
                        ]
                    }]
                };

                this.showUe = false;
                this.editForm = Object.assign({}, tmpObj);
            },
			selsChange: function (sels) {
				this.sels = sels;
			},
          //获取数据列表
			async getList(para){
                 para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    title:this.filters.title,
                    state:this.filters.state,
                    create_time:this.filters.datetime,
                    region: this.filters.region,
                    selectMin:this.filters.selectMin,
                    selectMax:this.filters.selectMax
                };

                let result=await api.getYabBaoList(para);
                for(var i=0;i<result.list.length;i++){
                    var obj = JSON.parse(result.list[i].stock_json);
                    for(var j=0;j<obj[0].jingXuanGeGu.length;j++){
                        result.list[i].nameandcode+=obj[0].jingXuanGeGu[j].name+"("+obj[0].jingXuanGeGu[j].code+")";
                    }
                    result.list[i].nameandcode=result.list[i].nameandcode.substring(9)
                    result.list[i].zan=result.list[i].likeR+"  /  "+result.list[i].like;
					result.list[i].liulan=result.list[i].viewR+"  /  "+result.list[i].view;
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].datetime=Y+M+D+h+m+s;
                    var update = new Date(result.list[i].update_time);
                    var uY = update.getFullYear() + '-';
                    var  uM = (update.getMonth()+1 < 10 ? '0'+(update.getMonth()+1) : update.getMonth()+1) + '-';
                    var  uD = update.getDate() + ' ';
                    var  uh = update.getHours() + ':';
                    var  um = update.getMinutes() + ':';
                    var  us = update.getSeconds();
                    result.list[i].updatetime=uY+uM+uD+uh+um+us;
					if(result.list[i].is_deploy){
					    result.list[i].zhuangtai="发布"
					}else{
					    result.list[i].zhuangtai="未发布"
					}
                    result.list[i].quan = eval(result.list[i].stock_json);
                }
                this.total = result.total;
                this.datas=result.list;
			}
		},
		mounted() {
            var para = {
                pageNo:this.page,
                pageSize:this.pageSize,
            };
            this.getList(para);
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
/*	margin-right: -14px;
	padding-right: 34px;*/
}
.ql-container.ql-snow{
	max-height: 200px;
	overflow-y: auto;
}
</style>