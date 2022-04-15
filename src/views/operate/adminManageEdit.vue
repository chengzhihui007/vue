<template>
<section>
		        <div class="head" style="margin: 20px 0;fontSize:18px">姓名 : {{this.editForm.name}}&#12288;&#12288;&#12288;账号名称 : {{this.editForm.user_name}}&#12288;&#12288;&#12288;所属部门 : {{this.editForm.departName}}</div>
            <div>
 			<el-form :model="editForm" label-width="80px"  ref="editForm">
				<div v-for="item in sysMenu"  style="margin: 5px 0;margin-top:1%" :key="item.id" >
					<el-checkbox  v-model="item.status" @change="selectAllcheck(item.id,item.status)">{{item.name}}</el-checkbox>
					<div>
					<div v-if="itemchild.name!='解盘视频'&&itemchild.name!='价值策略'&&itemchild.name!='热点主题'&&itemchild.name!='营销广告位'" v-for="itemchild in item.children" style="margin-left: 50px;display: inline-block">
						 <el-checkbox v-model="itemchild.status"  @change="selectcheck(item.id,itemchild.id)" >{{itemchild.name}}</el-checkbox>
						 	<div style="margin-left: 50px;">
						 <el-checkbox v-model="itemchildchild.status" v-for="itemchildchild in itemchild.children" @change="selectChildCheck(item.id,itemchild.id,itemchildchild.id)" >{{itemchildchild.name}}</el-checkbox>
						 
					</div>
					</div>
					<div v-if="itemchild.name=='解盘视频'||itemchild.name=='价值策略'||itemchild.name=='热点主题'||itemchild.name=='营销广告位'" v-for="itemchild in item.children" style="margin-left: 50px;">
					<el-checkbox v-model="itemchild.status"  @change="selectcheck(item.id,itemchild.id)" >{{itemchild.name}}</el-checkbox>
					<div style="margin-left: 50px;">
					<el-checkbox v-model="itemchildchild.status" v-for="itemchildchild in itemchild.children" @change="selectChildCheck(item.id,itemchild.id,itemchildchild.id)" >{{itemchildchild.name}}</el-checkbox>
					</div>
					</div>
					</div>
			    </div>
			</el-form>
			<div slot="footer" class="dialog-footer">
					<el-button  @click="dialogVisible1()">返回</el-button>
					<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
            </div>
</section>
 </template>
<script>
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import axios from 'axios';
	export default {
		data() {
			return {
				sysMenu:this.$route.query.sysMenu,
				listLoading: false,
				sels: [],//列表选中列
                editForm:this.$route.query.editForm,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false
			}
		},
		methods: {
		dialogVisible1() {
			this.$router.go(-1);
			},
			selectcheck(pid,id){
				var index=this.findElem(this.sysMenu, "id", pid);//菜单下面有子菜单被选中
				//var childlenght=this.sysMenu[index].children.length;
				var statustruelength=0;
				for(var i=0;i<this.sysMenu[index].children.length;i++){
					if(this.sysMenu[index].children[i].status==true){//查询哪个子菜单被选中
						  if(this.sysMenu[index].children[i].children.length>0){//如果有三级菜单，那么选中
							for(var j=0;j<this.sysMenu[index].children[i].children.length;j++){
								this.sysMenu[index].children[i].children[j].status=true; 
							}
							}
						statustruelength=statustruelength+1;//有几个菜单被选中
					}else if(this.sysMenu[index].children[i].status==false){
						  if(this.sysMenu[index].children[i].children.length>0){//如果有三级菜单，那么选中
							for(var j=0;j<this.sysMenu[index].children[i].children.length;j++){
								this.sysMenu[index].children[i].children[j].status=false; 
							}
							}
					}
				}
			 	if(statustruelength>0){//如果有子菜单被选中则菜单被选中
					this.sysMenu[index].status=true;
				}else if(statustruelength==0){
					this.sysMenu[index].status=false;
				} 

			},
			   selectChildCheck(ppid,pid,id){
				var index=this.findChildElem(this.sysMenu, "id", pid);
				//alert(index.split(',')[0])//一级
				//alert(index.split(',')[1])//二级
				var statustruelength=0;
				//alert(JSON.stringify(this.sysMenu[index.split(',')[0]].children[index.split(',')[1]]));
				for(var i=0;i<this.sysMenu[index.split(',')[0]].children[index.split(',')[1]].children.length;i++){
					//console.log(this.sysMenu[index.split(',')[0]].children[index.split(',')[1]]);
					if(this.sysMenu[index.split(',')[0]].children[index.split(',')[1]].children[i].status==true){//查询哪个子菜单被选中
						statustruelength=statustruelength+1;//有几个菜单被选中
					}
				}
				 if(statustruelength>0){
					this.sysMenu[index.split(',')[0]].status=true;
					this.sysMenu[index.split(',')[0]].children[index.split(',')[1]].status=true;
				}else if(statustruelength==0){
					this.sysMenu[index.split(',')[0]].status=false;
					this.sysMenu[index.split(',')[0]].children[index.split(',')[1]].status=false;
				}  
			},
			selectAllcheck(id,status){
				var index=this.findElem(this.sysMenu, "id", id);
				for(var i=0;i<this.sysMenu[index].children.length;i++){
					this.sysMenu[index].children[i].status=status;
				  if(this.sysMenu[index].children[i].children.length>0){
					for(var j=0;j<this.sysMenu[index].children[i].children.length;j++){
                        this.sysMenu[index].children[i].children[j].status=status; 
					}
				}
				}
			},
			findElem(arrayToSearch,attr,val){
				for (var i=0;i<arrayToSearch.length;i++){
					if(arrayToSearch[i][attr]==val){//点击的内容所在的位置
						return i;
					}
				}
				return -1;
			},
			findChildElem(arrayToSearch,attr,val){//this.sysMenu, "id", pid
			//var rs =[]
			for (var i=0;i<arrayToSearch.length;i++){//一级
				 for(var j=0;j<arrayToSearch[i].children.length;j++){//二级
                       if(arrayToSearch[i].children[j][attr] == val){
						   return i+","+j;
					   } 
				 }
				}
				return -1;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then( async () => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
					       let ceshi=this.sysMenu;
							let result=await api.adduserMenu({userid:para.user_id,datainfo:ceshi});
							if(result.status==1){
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.dialogVisible1();
                                //this.getUsers();
							}else{
                                this.editLoading = false;
                                this.$message({
                                    message: '提交失败',
                                    type: 'success'
                                });
							}
						});
					}
				});
			},
		},
		mounted() {
		/* 	this.name = JSON.parse(sessionStorage.getItem('user')).name;//姓名
			this.departName = JSON.parse(sessionStorage.getItem('user')).departName;//部门名称
			this.user_name = JSON.parse(sessionStorage.getItem('user')).user_name;//账号名称 */
		}
	}
</script>

<style>
   .deleted-text{
        color: #999999;
    }
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
	.dialog-footer {
        padding-left: 200px;
	}
</style>