<template>
<div>
    <section>
           <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.id" placeholder="请输入ID搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker :picker-options="startTime" v-model="filters.startTime" type="date" placeholder="开始时间">
                    </el-date-picker>
                    <el-date-picker :picker-options="endTime" v-model="filters.endTime" type="date" placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="page=1;getList()">查询</el-button>
                    <el-button  type="primary" @click="exportZhuTi()" >导出</el-button>
                </el-form-item>
                </div>
            </el-form>
        </el-col>
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @selection-change="selsChange" style="width: 150%;">
            <el-table-column type="selection" width="55"></el-table-column>
             <el-table-column prop="id" label="ID"  min-width="80" >
                <template scope="scope">
                    <div class="deleted-text">{{scope.row.themId }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="theme_name" label="主题名称" min-width="80">
                <template scope="scope">
                    <div class="deleted-text" >{{ scope.row.theme_name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="plate_name" label="板块名称(代码)" min-width="100">
                 <template scope="scope">
                    <div class="deleted-text">{{ scope.row.plate_name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="发布时间" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.create_time }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_user" label="操作" min-width="80">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.types}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="操作时间" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_time }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="操作账号" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_user }}</div>
                </template>
            </el-table-column>
            <el-table-column label="详情" min-width="150">
                <template scope="scope">
                        <el-button size="small" @click="handleSee(scope.$index, scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.size" @current-change="handleCurrentChange" :current-page="page" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--编辑/添加界面-->
        <el-dialog :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm"  ref="editForm" label-width="100px" >
                <el-form-item label="发布时间" prop="create_time" label-width="120px">
                    <el-input disabled v-model="editForm.create_time"></el-input>
                </el-form-item>
                <el-form-item label="操作时间" prop="operation_time" label-width="120px">
                    <el-input disabled v-model="editForm.operation_time"></el-input>
                </el-form-item>
                <el-form-item label="主题报告名称" prop="theme_name" label-width="120px">
                    <el-input disabled  v-model="editForm.theme_name"></el-input>
                </el-form-item>
                <el-form-item label="板块名称" prop="plate_name">
                    <el-input disabled v-model="editForm.plate_name"></el-input>
                </el-form-item>
                <el-form-item  label="主题解读封面图：" label-width="100px" style="margin-top:2%" prop="theme_pic" >
                    <el-upload disabled
                        ref="upload"
                        class="avatar-uploader" 
                        action="/api/file/imageUpload/"
                        accept="image/*" 
                        :show-file-list="false">
                        <img v-if="editForm.theme_pic" :src="editForm.theme_pic" width="178px" height="178px" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item  label="主题解读内容:" prop="theme_reason" label-width="100px" style="margin-top:2%">
                     <quill-editor disabled v-model="editForm.theme_reason" >
                    </quill-editor>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
    <!-- <router-view v-else></router-view> -->
    </div>
</template>
<script>
    import '../../common/js/DateFormat';
    import utils from '../../api/utils.js';
    import util from '../../common/js/util';
    import keyboardWizard from "../../common/js/KeyboardWizard.js";
    import {imageDefault} from "../../common/js/urls";
    import UeEdit from '../UeEdit.vue';
    import api from '../../api/api.js';
    import {ArticleList,Articlesave,Articleupdate,Articledelect,Articleupdateview} from "../../api/ydApi.js";
    // import api from '../../api/api.js';
    import axios from 'axios'
    export default {
        data(){
            return {
                filters: {
                    id:'',
                    startTime:'',
                    endTime:''
                },
                datas: [],
                sels: [],
                total: 0,
                page: 1,
                size: 10,
                totalStatus:'',
                currentPage: 1,
                editForm:{},
                listLoading: false,
                dialogVisible: false,
                dialogTitle:'',
                startTime: {
                    disabledDate: time => {
                        if (this.filters.endTime) {
                            return time.getTime() > new Date(this.filters.endTime).getTime()
                        } else {
                            return time.getTime() > Date.now()
                        }
                    }
                },
                // 结束时间大于开始时间，且小于此刻
                endTime: {
                    disabledDate: time => {
                        if (this.filters.startTime) {
                            return time.getTime() > Date.now() || time.getTime() < new Date(this.filters.startTime).getTime()
                        } else {
                            return time.getTime() > Date.now()
                        }
                    }
                },
            }
        },
        methods:{
            selsChange: function(sels) {
                    this.sels = sels;
            },
            handleCurrentChange(val) {
                this.page = val;
            },
            handleCurrentChange(val) {
                this.page = val;
                var para = {
                    page:this.page,
                    size:this.size
                };
                this.getList(para)
            },
            //获取列表
            async getList(para){
                para = {
                    page : this.page,
                    size : this.size,
                    id : this.filters.id,
                    start_time : this.filters.startTime&&new Date(this.filters.startTime).format('yyyy-MM-dd'),
                    end_time : this.filters.endTime&&new Date(this.filters.endTime).format('yyyy-MM-dd')
                };
                await api.selectCy4ThemeInvestmentHistoryByPage(para).then(res => {
                    let result=res.data.result;
                    this.total = res.data.total;
                    this.datas = result
                });
            },
            async exportZhuTi(para) {
                this.listLoading = true;
                para = {
                    page : this.page,
                    size : this.size,
                    id : this.filters.id,
                    start_time : this.filters.startTime&&new Date(this.filters.startTime).format('yyyy-MM-dd'),
                    end_time : this.filters.endTime&&new Date(this.filters.endTime).format('yyyy-MM-dd')
                };
                api.exporZhuTiHistoryByPage(para)
                this.listLoading = false;
            },
            handleSee(index,row){
                this.dialogTitle = "历史记录";
                this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>