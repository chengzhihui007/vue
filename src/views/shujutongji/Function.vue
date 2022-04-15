<template>
<div>
<br/>
<section>
        <!--工具条-->
        <el-form :inline="true">
         <el-form-item > 
                <el-input v-model="filters.name" placeholder="请输入功能名称关键字"></el-input>
            </el-form-item>
           <el-form-item>
                <el-date-picker  v-model="filters.date" type="date" placeholder="时间查询">
                </el-date-picker>
            </el-form-item>
            <el-form-item > 
                <el-button type="primary" @click="pageNum=1;getList()">查询</el-button>
            </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">
           <el-table-column prop="id" label="序号"  width="80" >
                <template scope="scope">
                    <div class="deleted-text" v-if="scope.row.deleted">  {{datas.length - scope.$index}}</div>
                    <div v-else>  {{datas.length - scope.$index}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="fm.name" label="功能名称" width="180" >
            </el-table-column>
            <el-table-column prop="fmp.name" label="所属一级分类" width="140" >
            </el-table-column>
            <el-table-column prop="qx" label="权限" width="100" >
            </el-table-column>
            <el-table-column label="浏览量|点击量" width="200" >
            <template  scope="scope"> 
                {{scope.row.lll}} | {{scope.row.djl}}
            </template>
            </el-table-column>
            <el-table-column prop="dlfk" label="独立访客" width="200" >
            </el-table-column>
            <el-table-column prop="xdlfk" label="新独立访客" width="200" >
            </el-table-column>
            <el-table-column prop="ips" label="IP" width="200" >
            </el-table-column>
            <el-table-column prop="pjfwsc" label="平均访问时长" width="200" >
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.pageSize" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="this.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
 </section>
</div>
</template>
<script>
import '../../common/js/DateFormat';
import api from "../../api/Logapi.js"
import {imageDefault} from "../../common/js/urls";
export default {
    data() {
        return {
            fileList:[],
            labelPosition:'top',
            activeName:'A',
            listLoading: false,            
            groups:[{groupsName:'A',status:1},{groupsName:'B',status:1},{groupsName:'C',status:1},],
            datas:[],
            pageNum: 1,
            pageSize: 15,
            total: 0,    
            filters:{
                name:'',
                date:new Date().format("yyyy-MM-dd"), 
            },
            dialogVisible: false,//编辑界面是否显示                    
            dialogTitle:'回复',
            editForm:{

            },
                 
        }
    },
    methods: {
       handleCurrentChange(val) {
           this.pageNum = val;
           this.getList();
       },        
        async getList() {
                this.listLoading = true;
                let params={
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                                 } 
                this.filters.date&&(params.date=new Date(this.filters.date).format("yyyy-MM-dd"))
                this.filters.name&&(params.name=this.filters.name)
     
                let resp=await api.findFunctionByPage(params)
                if(!resp){
                    return;
                }
                let data=resp.data;
                data.list.forEach(d=>{
                    d.lll||(d.lll=0)
                    d.djl||(d.djl=0)
                    d.dlfk||(d.dlfk=0)
                    d.xdlfk||(d.xdlfk=0)
                    d.ips||(d.ips=0)
                    d.pjfwsc||(d.pjfwsc=0)

                    let hh=parseInt(d.pjfwsc/3600)
                    hh<10&&(hh='0'+hh)
                    let mm= parseInt((d.pjfwsc%3600)/60)
                    mm<10&&(mm='0'+mm)
                    let ss=(d.pjfwsc%3600)%60
                    ss<10&&(ss='0'+ss)

                    d.pjfwsc=hh+":"+mm+":"+ss

                    d.qx||(d.qx='——')
                    d.qx==1&&(d.qx='游客')
                    d.qx==2&&(d.qx='登录')
                    d.qx==3&&(d.qx='三星')
                    d.qx==4&&(d.qx='四星')
                    d.qx==5&&(d.qx='五星')
                })
                this.datas=data.list
                this.total = data.total;
                this.listLoading = false;
        },
    },
   async mounted() {
        var user = sessionStorage.getItem('user');
        var userArray = JSON.parse(user);
        this.team_id = userArray.team_id;
        this.team_name = userArray.team_name;
        this.userName=userArray.user_name       
        this.getList()
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
