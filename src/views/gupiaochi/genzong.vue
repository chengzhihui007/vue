<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="请输入标签关键字"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>


        <!--列表-->
        <el-table  ref="multipleTable" :data="datas" highlight-current-row v-loading="listLoading"    style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="stock_txt" label="股票名称" min-width="100"></el-table-column>
            <el-table-column label="类型" prop="type_txt" min-width="50"> </el-table-column>

            <el-table-column prop="count" label="跟踪次数" min-width="100"></el-table-column>
            <!--<el-table-column prop="view" label="播放总数" min-width="100"></el-table-column>
            <el-table-column prop="like" label="点赞总数" min-width="100"></el-table-column>
            <el-table-column prop="comment" label="分享数" min-width="100"></el-table-column>-->
            <el-table-column prop="create_time" label="发布时间" min-width="100" ></el-table-column>
            <el-table-column label="跟踪状态" min-width="220" prop="status"></el-table-column>
        </el-table>


        <el-col :span="24" class="toolbar">
            <el-pagination   @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize  layout="total, prev, pager, next, jumper" :total=this.total>
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
    import util from '../../common/js/util';
    import api from '../../api/api.js';
    import axios from 'axios'
    export default {
        data() {
            return{
                datas: [],
                total: 0,
                page: 1,
                pageSize:10,
                currentPage: 1,
                listLoading: false,
                select_loading: false,
                filters: {
                    stock_code:'',
                    stock_name:'',
                    keyword:''
                },
            }
        },
        methods: {
            async getList(){

                // var admin = sessionStorage.getItem("user");
                // var a = JSON.parse(admin);
                // this.username=a.user_name;

                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword,
                };
                //console.log("page:::"+this.page+"pagesize:::"+this.pageSize);
                let result=await api.getGuPiaoGenZongList(para);

                for( var i=0;i<result.list.length;i++)
                {
                    var date = new Date(result.list[i].create_time);
                    var Y = date.getFullYear() + '-';
                    var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var  D = date.getDate() + ' ';
                    var  h = date.getHours() + ':';
                    var  m = date.getMinutes() + ':';
                    var  s = date.getSeconds();
                    result.list[i].create_time=Y+M+D+h+m+s;
                    result.list[i].type=parseInt(result.list[i].type);
                    result.list[i].type_txt=parseInt(result.list[i].type)==1?"稳健型":"激进型";
                    result.list[i].stock_txt=result.list[i].stock_name+"("+result.list[i].stock_code+")";
                    result.list[i].status=parseInt(result.list[i].status)==1?"跟踪结束":"";
                }
                this.datas=result.list;
                this.total=result.total;
                //console.log(JSON.stringify(result));
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
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
/*        margin-right: -14px;
        padding-right: 34px;*/
    }
    .ql-container.ql-snow{
        max-height: 200px;
        overflow-y: auto;
    }
    .el-pagination{
        text-align: center;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>