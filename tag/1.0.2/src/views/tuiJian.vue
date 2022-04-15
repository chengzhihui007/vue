<template>
	<section>
		<div class="list">
			<p>
				<span>ID</span>
				<span class="neirong">标题</span>
				<span class="timer">时间</span>
				<span>类型</span>
			</p>
			<el-checkbox-group v-model="sels" v-for="(a,index) in users">
				<el-checkbox :checked="a.xuanze" :label="a.id" :key="a.id" v-on:change="change(index)">{{index+1}}</el-checkbox>
				<span class="neirong">{{a.neirong}}</span>
				<input class="timer" type="text" :disabled="!a.xuanze" v-bind:ref="a.id" v-model="users[index].shijian" value="" />
				<span>{{a.mingcheng}}</span>
			</el-checkbox-group>
		</div>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="submit" :disabled="this.sels.length===0 || this.sels.length>3 || this.sels.length<3">提交</el-button>
			<strong>请选择三条</strong>
		</el-col> 

	</section>
</template>

<script>
	import util from '../common/js/util';
	import api from '../api/api.js';
	export default {
		data() {
			return {
				aaa : 'zjfm',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				sels: [],//列表选中列
		        multipleSelection: []

			}
		},
		methods: {
			change(index){
				let _index = index
				this.users[_index].xuanze = !this.users[_index].xuanze;
			},
			async submit(){
				let _this = this;
				var ids = this.sels.toString();
				var idarr=ids.split(',');
                var dataArray=new Array();
				for ( var i=0;i<idarr.length;i++)
				{
				    var id=parseInt(idarr[i]);
                    for(var j = 0; j < this.users.length; j++){
                        var sid=parseInt(this.users[j].id);
                        if(id== sid)
						{
                            dataArray.push({"id":id,"shijian":this.users[j].shijian});
						}
                    }
				}
				//console.log(JSON.stringify(dataArray));
				/*	let para = {
					"a":[]
				}

			for( let a in idarr){

                    //console.log("str:::"+_id+" shijian:::"+this.users[_id].shijian);
					let _id = this.sels[a];
					// console.log(this.users[_id].shijian)
					para['a'][a] = {
						"id" : this.sels[a],
						"shijian" : this.$refs[_id][0].value
					}
					console.log(para)
				}
				var str =JSON.stringify(para['a']);*/
                var str=JSON.stringify(dataArray);
				await api.updateTuiJian(str).then(function (response) {
				    if(response.message == "ok"){
					    _this.$message({
		                    message: '提交成功',
		                    type: 'success'
		                });	
				    }
				    else
					{
                        _this.$message({
                            message: '提交失败',
                            type: 'error'
                        });
					}
				})
				this.getTrackListShow()
				
				// await api.updateTuiJian(ids)
			},
			//获取列表
			async getTrackListShow(){
				let result=await api.getTuiJian();
				this.users = result;

				for(let i = 0; i < this.users.length; i++){
					this.users[i].xuanze == "0" ? this.users[i].xuanze = false : this.users[i].xuanze = true;
				}
			}
		},
		mounted() {
			this.getTrackListShow();
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
	.list{
		display: block;
	}
	.list p > span{
		display: inline-block;
		min-width: 100px;
	}
	.neirong{
		display: inline-block;
		min-width: 300px !important;
	}
	.timer{
		width: 100px !important;
		border-radius: 5px;
		padding-left: 10px;
		margin: 0 20px;
	}
	.tianjia{
		width: 100px !important;
		border-radius: 5px;
		padding-left: 10px;
		margin: 0 20px;
	}
	.el-checkbox-group{
		height: 50px;
		line-height: 50px;
	}
	.el-checkbox{
		width: 80px;
	}
	strong{
		display: inline-block;
		vertical-align: middle;
		font-size: 24px;
		text-align: center;
		color: red;
		line-height: 36px;
		padding-left: 50px;
	}
</style>