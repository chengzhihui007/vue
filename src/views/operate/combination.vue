<template>
	<section>
        <!-- 财源板块组合管理-->
		<!--列表-->
         <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		 <el-form :inline="true" >
			 <div>
		 <el-form-item style="float:right;">
             <el-button type="primary" @click="handleAdd" >添加</el-button>
		 </el-form-item>
			 </div>
			 </el-form>
          </el-col>



		<el-table :data="combination" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="" label="序号" min-width="100" sortable>
				  <template scope="num">
                    {{combination.length - num.$index}}
                </template>
			</el-table-column>
			<el-table-column prop="name" label="产品名称" min-width="200" sortable>
			</el-table-column>
            <el-table-column prop="combination_name" label="组合ID" min-width="200" sortable>
			</el-table-column>
            <el-table-column prop="block_name" label="包含板块" min-width="400" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.row,scope.row.name)">编辑板块</el-button>
				     <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-if="scope.row.del_flag==1">禁用</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)" v-else="">启用</el-button>
				</template>
            
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next, jumper" :current-page="page" @current-change="handleCurrentChange" :page-size=this.pageSize :total=this.total style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog :title=dialogTitle  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px"  ref="editForm">
                <div>
					<el-form-item label="选择产品：" prop="name" >
					<el-select  v-model="editForm.name"   :disabled="isClose==='1'" @change="findMenu(editForm,editForm.name)" ><!--默认3星-->
                <el-option v-for="i in stars" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
				</el-form-item>
				</div>
				<div>
				<el-form-item label="功能选择：" prop="menus" >
				<el-checkbox  v-model="item.status" :disabled="true"  v-for="(item, k1) in sysMenu" :key="k1" :label="item.menus" @change="selectAllcheck(item.id,item.status)"></el-checkbox>
 				<el-radio-group v-model="lh">
 					<el-radio   :disabled="lhClose==='1'"  v-for="(it, k) in dxsysMenu" :key="k"  :label="it.id" >{{it.menus}}</el-radio>
 				</el-radio-group>
				<el-radio-group v-model="dp">
				<el-radio :disabled="spClose==='1'" v-for="(it, k) in spsysMenu" :key="k"  :label="it.id" >{{it.menus}}</el-radio>
			</el-radio-group>
 				</el-form-item>
				</div>
				<span style="color: red;">{{ msg }}</span>
			</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
				</div>
		</el-dialog>
	</section>
</template>
<script>
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import axios from 'axios';
	export default {
		data() {
			return {
				lh: '',
				dp:'',
				radio2:'a',
				checkList:[],
                 stars: [{
                    value: '三星',
                    label: '三星'
                    }, {
                    value: '四星',
                    label: '四星'
                    }, {
                    value: '五星',
                    label: '五星'
                    }],
				sysMenu:[],
				xz:'',
				dxsysMenu:[],
				spsysMenu:[],
				isClose:'0',
				lhClose:'0',
				spClose:'0',
				editOrAdd:false,
				addsysMenu:[],
                //users: [],
                combination:[],
				startName:"",//三星
				//person:[],
				userMenu:[],
				dialogTitle:'添加',
                value:'',
				total: 0,
				msg: '',
                page: 1,
                pageSize: 5,
				listLoading: false,
				sels: [],//列表选中列
				editForm:{menus:[],name:'三星'},
				addForm:{},
				editFormVisible: false,//编辑界面是否显示
				addFormVisible: false,//新增界面是否显示
				editLoading: false,
		/* 		 editrules: {
                    name: [
                        { required: true, message: "请选择板块名称", trigger: "change" }
					],
					  menus: [
                        { required: true, message: "请选择分组名称", trigger: "change" }
					],
					} */
			}
		},
		methods: {
		
			selectAllcheck(id,status){
				// var index=this.findElem(this.sysMenu, "id", id);
				// for(var i=0;i<this.sysMenu[index].children.length;i++){
				// 	this.sysMenu[index].children[i].status=status;
				// }
			},
			findElem(arrayToSearch,attr,val){
				for (var i=0;i<arrayToSearch.length;i++){
					if(arrayToSearch[i][attr]==val){
						return i;
					}
				}
				return -1;
			},
			     //控制停用启用
            handleDel: function (index, row) {
				this.editForm = Object.assign({}, row);
				if(row.del_flag==1){// 1是启用  0 是禁用 
				    api.findCombinationByStar(this.editForm.name).then((data)=>{
                        if(data.data == 0){
                             this.$message({
                                message: this.editForm.name+'只存在一个组合,该组合不能被禁用',
                                type: 'success'
                                });
                        }else{
				 const confirmText = [this.editForm.name +"("+this.editForm.combination_name+")", '当前小组被禁用后，该小组下用户将不能查看相关信息，是否确认禁用?'] 
                            const newDatas = [] 
                            const h = this.$createElement 
                            for (const i in confirmText) { 
                                newDatas.push(h('p', null, confirmText[i])) }
                                 this.$confirm( '提示', 
                                 { title: '禁用提示',
                                  message: h('div', null, newDatas), 
                                 showCancelButton: true, 
                                 confirmButtonText: '确定', 
                                 cancelButtonText: '取消' } ).then(async () => {
						         this.editForm.del_flag=0;
						  let result=await api.deletCombination(this.editForm.id,this.editForm.del_flag,this.editForm.name);
						  this.$message({
                                message: '已禁用',
                                type: 'success'
                                });
					/* 	if(result.data == 0){
							alert("应该该星级只存在一个组合,所以该组合不能被禁用")
							row.del_flag==0
						} */
                        this.listLoading = false;
                        this.getCombination();
                    }).catch(() => {

                    }); 
                      }
                    })
                    
                   /*  this.$confirm('当前产品被禁用后，该产品下将不能发布任何信息，是否确认禁用?', '禁用提示', {
                        type: 'warning'
                    }).then(async () => {
						this.editForm.del_flag=0;

						let result=await api.deletCombination(this.editForm.id,this.editForm.del_flag,this.editForm.name);
						if(result.data == 0){
							alert("应该该星级只存在一个组合,所以该组合不能被禁用")
							row.del_flag==0
						}
                        this.listLoading = false;
                        this.getCombination();
                    }).catch(() => {

                    }); */
                } if(row.del_flag==0){
                    this.$confirm('确认启用该产品吗?', '提示', {
                        type: 'warning'
                    }).then(async () => {

                        this.editForm.del_flag=1;
						let result=await api.deletCombination(this.editForm.id,this.editForm.del_flag,this.editForm.name);
						
                        this.listLoading = false;
						this.getCombination();
						 this.$message({
                            message: '已启用',
                            type: 'success'
                            });
                    }).catch(() => {

                    });
                }

            },
			handleCurrentChange(val) {
				this.page = val;
                //this.getUsers();
                this.getCombination();
			},
			//获取用户列表
            async getCombination(){
				this.listLoading = true;
				let result = await api.combinationInfoList(this.page,this.pageSize) 
				result = result.data;
				this.total =result.total;
                this.combination = result.result;
                this.listLoading = false;
			},
			//显示编辑界面
			async handleEdit(row,name) {
				this.lhClose='0'; 
				this.spClose='0';
			    this.msg ='';
                this.startName=name;
				this.id = row.id;
				this.dialogTitle ='编辑';
				this.isClose ='1';
				this.editOrAdd =false;
				this.lh = '';
				this.dp = '';
				this.sysMenu=[];
				this.dxsysMenu=[];
				this.spsysMenu=[];
				//alert(JSON.stringify(row.block_name))
				let result=await api.findStarList(name);///star/findStarList 参数 star_name
				for (var i = 0; i < result.data.length; i++) {
				if(result.data[i].menus.indexOf("龙虎实战精选") !=-1 ){
					this.dxsysMenu.push(result.data[i])
					  row.block_name.split('、').forEach(element => {
					if(element == result.data[i].menus){
					 	this.lh =result.data[i].id;
					}
				    }); 
				}else if(result.data[i].menus.indexOf("收盘点评") !=-1){
				     row.block_name.split('、').forEach(element => {
					if(element == result.data[i].menus){
					 	this.dp =result.data[i].id;
					}
				    }); 
					this.spsysMenu.push(result.data[i])
				}else{
					this.sysMenu.push(result.data[i])
				}
			}
				///this.sysMenu=result.data;
				//alert(JSON.stringify(this.spsysMenu))
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
            },
		async findMenu(row,name){//龙虎实战精选和收盘点评默认选中第一个且置灰,如果多个的话默认选中第一个
				this.startName=name;
				this.sysMenu=[];
				this.dxsysMenu=[];
				this.spsysMenu=[];
                let result=await api.findStarList(name);///star/findStarList 参数 star_name
				//this.sysMenu=result.data;
					for (var i = 0; i < result.data.length; i++) {
				if(result.data[i].menus.indexOf("龙虎实战精选") !=-1 ){//lhClose 如果只有一个
					this.dxsysMenu.push(result.data[i])
				} else if(result.data[i].menus.indexOf("收盘点评") !=-1){
					this.spsysMenu.push(result.data[i])
				}else{
					this.sysMenu.push(result.data[i])
				}
			}
			if(this.dxsysMenu.length == 1){//龙虎实战
				this.lhClose='1' 
				this.lh=this.dxsysMenu.id
			}else if(this.dxsysMenu.length > 1){
                this.lh=this.dxsysMenu[0].id
			}
			if(this.spsysMenu.length == 1){//收盘
				this.spClose='1' 
				this.dp=this.spsysMenu.id
			}else if(this.spsysMenu.length > 1){
                this.dp=this.spsysMenu[0].id
			}
			},
			//显示添加页面
            async handleAdd() {
				this.lhClose='0' 
				this.spClose='0';
				this.editForm.name = '五星';
				this.msg ='';
				this.lh = '';
				this.dp = '';
				this.dialogTitle ='添加'
				this.sysMenu=[];
				this.dxsysMenu=[];
				this.spsysMenu=[];
				this.isClose ='0';
				this.editOrAdd =true;
				this.startName='五星';
				this.id ="";
				let result=await api.findStarList("五星");///star/findStarList 参数 star_name  添加界面默认三星
				    for (var i = 0; i < result.data.length; i++) {
					  if(result.data[i].menus.indexOf("龙虎实战精选") !=-1 ){
					this.dxsysMenu.push(result.data[i])
				} else if(result.data[i].menus.indexOf("收盘点评") !=-1){
					this.spsysMenu.push(result.data[i])
				}
				else{
					this.sysMenu.push(result.data[i])
					  }
					}
				//this.sysMenu=result.data;
				this.editFormVisible = true;
				//this.editForm = this.sysMenu;
			/* 	this.editForm={
					name:'',
					menus:[result.data]
				} */
				
				// this.clearEdit()
            },
			       //恢复编辑页面为默认
            clearEdit(){
                let tmpObj = {
                };
                this.showUeEdit = false;
                this.editForm = Object.assign({}, tmpObj);
            },
            isProhibit(index,row){
				
				//alert(JSON.stringify(row.block_name))
				//if(row.block_name.container)
		        this.$confirm('当前小组被禁用后，该小组下用户将不能查看相关信息，是否确认禁用?', '禁用提示', {}).then( async () => {

			})
			},
			//编辑
			editSubmit: function () {  //更新与添加
			let sysMenu=Object.assign([], this.sysMenu);
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.msg ='';
						let para = Object.assign({}, this.editForm);
						this.dxsysMenu.forEach(element => {
							 if(element.id == this.lh){
								 let exist=false;
								 for(let i=0 ;i< sysMenu.length;i++){
									 if( sysMenu[i].menus==element.menus){
										 exist=true;
									 }
								 }
								 if(!exist){
								  sysMenu.push(element)
								 }
							 }
						});
						this.spsysMenu.forEach(element => {
							 if(element.id == this.dp){
								  let dpexist=false;
					          for(let i=0 ;i< sysMenu.length;i++){
							     if( sysMenu[i].menus==element.menus){
									 dpexist =true;
								  // sysMenu.push(element)
								 }
							  }
							   if(!dpexist){
								  sysMenu.push(element)
								 }
							 }
						});
						if(this.editOrAdd ==true){//新增  去查询该组合是否存在
						let ceshi= sysMenu
						 api.findcombinationByNameAndBlack({conbination:this.startName,datainfo:ceshi}).then((data) =>{
                             if(data.data !=null){
                                    this.msg = '该组合已存在，请勿重复添加'
                                }else{
							this.$confirm('确认提交吗？', '提示', {}).then( async () => {
							this.editLoading = true;
							//NProgress.start();
						  // let ceshi=this.sysMenu.concat(this.dxsysMenu);
							let result=await api.addmenuBytar({conbination:this.startName,id:this.id,datainfo:ceshi});///star/addmenuBytar
							if(result.state==true){

                                this.editLoading = false;

                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
                                //this.getUsers();
                                this.getCombination();
							}else{
                                this.editLoading = false;
                                this.$message({
                                    message: '添加失败',
                                    type: 'success'
                                });
							}
						});
						}
						 })
						}else{
							let ceshi= sysMenu
							 api.findcombinationByNameAndBlack({conbination:this.startName,datainfo:ceshi}).then((data) =>{
                             if(data.data !=null){
									this.msg = '该组合已存在，请勿重复添加'
									  this.$message({
                                            message: '该组合已存在，请勿重复添加',
                                            type: 'success'
                                        });
                                }else{
							this.$confirm('确认修改吗？', '提示', {}).then( async () => {
							this.editLoading = true;
							//NProgress.start();
						//	let para = Object.assign({}, this.editForm);
						  // let ceshi=this.sysMenu.concat(this.dxsysMenu);
							let result=await api.addmenuBytar({conbination:this.startName,id:this.id,datainfo:ceshi});///star/addmenuBytar
							if(result.state==true){

                                this.editLoading = false;

                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
                                //this.getUsers();
                                this.getCombination();
							}else{
                                this.editLoading = false;
                                this.$message({
                                    message: '修改失败',
                                    type: 'success'
								});
							}
							})
							}
						});
						}
				
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
            //this.getUsers();
            this.getCombination();
		}
	}
</script>

<style>
	.el-dialog.el-dialog--small{
		overflow-x: hidden;
	}
	.el-dialog__body{
		max-height: 600px;
		overflow-y: auto;
		margin-right: -14px;
		padding-right: 34px;
	}
	.ql-container.ql-snow{
		max-height: 200px;
		overflow-y: auto;
	}
	.el-pagination{
		text-align: center;
	}
</style>
<style >
.el-message-box__message p:first-child{
    text-align: center;
}
</style>