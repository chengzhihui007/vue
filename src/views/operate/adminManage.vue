<template>
	<section>
		<!--工具条-->
<!--		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" width="400" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>-->
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-top:2%">
			<el-table-column prop="" label="序号" min-width="150" sortable>
				 <template scope="num">
					 {{users.length - num.$index}}
                </template>
			</el-table-column>
			<el-table-column prop="user_name" label="姓名" min-width="150" sortable>
				 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del==1">{{ scope.row.user_name }}</div>
                    <div v-else>{{ scope.row.user_name }}</div>
                </template>           
			</el-table-column>
			<el-table-column prop="name" label="账号名称" min-width="150" sortable>
				 <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.del">{{ scope.row.name }}</div>
                    <div v-else>{{ scope.row.name }}</div>
                </template>       
			</el-table-column>
			<el-table-column prop="name" label="所属部门" min-width="150" sortable>
			<template scope="scope">
			<div class="deleted-text" v-if="scope.row.del">{{ scope.row.departName }}</div>
			<div v-else>{{ scope.row.departName }}</div>
		</template>       
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<div v-if="scope.row.del">
					<el-button size="small" disabled @click="handleEdit(scope.$index, scope.row)">编辑用户权限</el-button>
					 <el-button type="danger" size="small"  disabled  @click="handleDel(scope.$index, scope.row)" >已删除</el-button>
					</div>
					<div v-else>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑用户权限</el-button>
                    <el-button type="danger" size="small"   @click="handleDel(scope.$index, scope.row)" >删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="page" :page-size=this.pageSize :total=this.total style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑用户权限"  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px"  ref="editForm">
				<div v-for="item in sysMenu"  style="margin: 5px 0;" >
					<el-checkbox  v-model="item.status" @change="selectAllcheck(item.id,item.status)">{{item.name}}</el-checkbox>
					<div style="margin-left: 20px;">
						 <el-checkbox v-model="itemchild.status" v-for="itemchild in item.children" @change="selectcheck(item.id,itemchild.id)" >{{itemchild.name}}</el-checkbox>
					</div>
			    </div>
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

				sysMenu:[],
				users: [],
				uuid:0,
				person:[],
				userMenu:[],

				total: 0,
                page: 1,
                pageSize: 5,

				listLoading: false,
				sels: [],//列表选中列
                editForm:{},
				editFormVisible: false,//编辑界面是否显示
				editLoading: false
			}
		},
		methods: {
			selectcheck(pid,id){
				var index=this.findElem(this.sysMenu, "id", pid);
				var childlenght=this.sysMenu[index].children.length;
				var statustruelength=0;
				for(var i=0;i<this.sysMenu[index].children.length;i++){
					if(this.sysMenu[index].children[i].status==true){
						statustruelength=statustruelength+1;
					}
				}
				if(statustruelength>0){
					this.sysMenu[index].status=true;
				}else if(statustruelength==0){
					this.sysMenu[index].status=false;
				}

			},
			selectAllcheck(id,status){
				var index=this.findElem(this.sysMenu, "id", id);
				for(var i=0;i<this.sysMenu[index].children.length;i++){
					this.sysMenu[index].children[i].status=status;
				}
			},
			findElem(arrayToSearch,attr,val){
				for (var i=0;i<arrayToSearch.length;i++){
					if(arrayToSearch[i][attr]==val){
						return i;
					}
				}
				return -1;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			async getUsers() {
                let para = {
                    pageNo: this.page,
					pageSize:this.pageSize,
				};
				this.listLoading = true;
				 let result=await api.UserInfoList(para);

                this.total =result.total;
                this.users = result.list;
                this.listLoading = false;
			},
			//显示编辑界面
			async handleEdit(index, row) {//跳转编辑页面
				//this.uuid=row.user_id;
                 this.person=row;
				this.sysMenu=[];
				let result=await api.getMenubyUser(this.person);
				this.sysMenu=result;
				//this.editFormVisible = true;
				this.editForm = Object.assign({}, row);  
			    this.$router.push({path:'/adminManageEdit',query:{sysMenu:this.sysMenu,editForm:this.editForm}})
			},

			   async handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(async() => {
                    this.listLoading = true;
                    var result = await api.deleteUser(row.id);
					this.listLoading = false;
                    if (result.state == true) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('删除失败');
					}
					//this.page = this.currentPage
                    this.getUsers();
                }).catch(() => {});
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
							let result=await api.adduserMenu({userid:this.uuid,datainfo:ceshi});

							if(result.status==1){

                                this.editLoading = false;

                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
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
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getUsers();
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
</style>