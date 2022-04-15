<template>
<div>
    <br>
    <section v-if="$route.path === '/laXinHuoDong'">
  <!--工具条-->
        <el-form :inline="true">
             <el-form-item  style="margin-right: 10px;" class="inline fl">
                <el-select  v-model="filters.status"  clearable   placeholder="请选择活动状态">
					<el-option key="1" label="未开始" value="1"/>
					<el-option key="2" label="进行中" value="2"/>
                    <el-option key="3" label="已结束" value="3"/>
			    </el-select>
            </el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
        </el-form>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="subject_id" label="活动ID" width="200" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.subject_id }}</div>
                </template>            
            </el-table-column>
            <el-table-column prop="subject" label="活动名称" width="150" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.subject }}</div>
                </template> 
            </el-table-column>
            <el-table-column prop="PClink" label="PC活动链接" width="180" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.PCline }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="APPlink" label="APP活动链接" width="180" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.APPline }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="start_time" label="开始时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.start_time }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="end_time" label="结束时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.end_time }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="状态" width="150" >
               <template scope="scope">
                    <div class="deleted-text">{{ scope.row.type }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.updateTime }}</div>
                </template>
            </el-table-column>            
            <el-table-column prop="operator" label="最近操作账号" width="150" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operator }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-col :span="22" class="toolbar">
            <el-pagination  @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
        </el-col> -->
        </section>
     <router-view v-else></router-view>
</div>
</template>

<script>
import '../../common/js/DateFormat';
import tuokeUrl from '../../api/tuoke.js';
import api from "../../api/api.js"
import utils from '../../api/utils.js';
import {imageDefault} from "../../common/js/urls";
import axios from 'axios'
export default {
    data() {
        return {
            ktqxSelectable:false,
            listLoading: false,            
            datas:[],
            huodong:[],
            huodongIDs:[],
            pageNum: 1,
            pageSize: 2,
            total: 20,    
            filters:{
                date:'',
                status:''
            },
            dialogVisible: false,//编辑界面是否显示                    
            dialogTitle:'',
            formAdd:false,    
            editForm: {},
            nodeContent:{},
            param:'',      
        }
    },
    watch: {
        '$route'(val) {
            if (val.path === '/laXinHuoDong') {
                this.datas=[]
                this.getHuoDong()
            }              
        }
    },
    methods: {
        handleEdit(index,row){
            this.editForm = Object.assign({}, row);
            this.$router.push({path:'/laXinHuoDongEdit',query:{id:row.subject_id}})        
        },
        
        async getHuoDong(){
            // this.listLoading=false
            var path = tuokeUrl.url
            var ref = ydc.sync().ref(path);
            //获取节点
            await ref.orderByKey().limitToLast(30).get((res) => {
                for(var key in res.nodeContent){
                    var timestamp =  Date.parse(new Date());
                    if(res.nodeContent[key].state == '1'){
                        res.nodeContent[key].type = '未开始'
                    }
                    if(res.nodeContent[key].state == '2' ){
                        res.nodeContent[key].type = '进行中' 
                    }
                    if(res.nodeContent[key].state == '3'){
                        res.nodeContent[key].type = '已结束' 
                    }
                    res.nodeContent[key].start_time = new Date(res.nodeContent[key].start_time).format('yyyy-MM-dd hh:mm:ss')
                    if(res.nodeContent[key].end_time == 0){
                        res.nodeContent[key].end_time = ''
                    }else{
                        res.nodeContent[key].end_time = new Date(res.nodeContent[key].end_time).format('yyyy-MM-dd hh:mm:ss')
                    }
                    this.datas.push(res.nodeContent[key])
                }
                this.huodong = this.datas
            });
        },
        async getList(){
            var param ={
                str:this.filters.status
            }
            if(param.str == ""){
                this.datas = this.huodong
            }else{
                await api.getLaXinHuoDong(param).then(res => {
                    this.listLoading = true;
                    this.datas = []
                    for(var s in res.data){
                        var timestamp =  Date.parse(new Date());
                        if(res.data[s].state == '1'){
                            res.data[s].type = '未开始'
                        }
                        if(res.data[s].state == '2' ){
                            res.data[s].type = '进行中' 
                        }
                        if(res.data[s].state == '3'){
                            res.data[s].type = '已结束' 
                        }
                        res.data[s].start_time = new Date(res.data[s].start_time).format('yyyy-MM-dd hh:mm:ss')
                        if(res.data[s].end_time == 0){
                            res.data[s].end_time = ''
                        }else{
                            res.data[s].end_time = new Date(res.data[s].end_time).format('yyyy-MM-dd hh:mm:ss')
                        }
                        this.datas.push(res.data[s])
                    }
                    this.listLoading = false;
                });
            }
            
            
        },
        
    },
   async mounted() {     
      console.log(tuokeUrl.url)
         this.getHuoDong()
    },
}
</script>
<style>
    .deleted-text{
        color: #999999;
    }    
    .head {
        display: flex;
        align-items: center;
    }
    .head > div {
        margin-right: 10px;
    }
</style>
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
</style>