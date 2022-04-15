<template>
<div>
    <section>
           <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item  style="margin-right: 10px;" class="inline fl">
                    <el-select  v-model="filters.tszb"  clearable   placeholder="请选择叠加条件">
                        <el-option key="0" label="放量上攻" value="放量上攻"/>
                        <el-option key="1" label="趋势共振" value="趋势共振"/>
                        <el-option key="2" label="震荡突破" value="震荡突破"/>
                        <el-option key="3" label="探底回升" value="探底回升"/>
                        <el-option key="4" label="趋势反转" value="趋势反转"/>
                        <el-option key="5" label="背离反弹" value="背离反弹"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker :picker-options="startTime" v-model="filters.startTime" type="date" placeholder="开始时间">
                    </el-date-picker>
                    <el-date-picker :picker-options="endTime" v-model="filters.endTime" type="date" placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="page=1;getList()">查询</el-button>
                    <el-button  type="primary" @click="exportReDian()" >导出</el-button>
                </el-form-item>
                </div>
            </el-form>
        </el-col>
        <el-table  ref="multipleTable" :data="datas"  highlight-current-row v-loading="listLoading" :fit="true" @selection-change="selsChange" style="width: 150%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="" label="序号" min-width="60" >
                <template scope="num">
                    <!-- {{num.$index+1}} -->
                    {{datas.length - num.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="theme_name" label="股池名称" min-width="80">
                <template scope="scope">
                    <div class="deleted-text" >{{ scope.row.stockPoolName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="plate_name" label="股池分类" min-width="100">
                 <template scope="scope">
                    <div class="deleted-text">{{ scope.row.xgfwStr }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="叠加条件" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.tszb }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_user" label="入池时间" min-width="80">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.createTime}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="股票名称" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.secName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="股票代码" min-width="100" >
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.secCode }}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.size" @current-change="handleCurrentChange" :current-page="page" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>   
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
                    tszb:'',
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
                    tszb : this.filters.tszb,
                    startTime : this.filters.startTime&&new Date(this.filters.startTime).format('yyyy-MM-dd hh:mm'),
                    endTime : this.filters.endTime&&new Date(this.filters.endTime).format('yyyy-MM-dd hh:mm')
                };
                await api.selectReDianCeLueHistoryByPage(para).then(res => {
                    let result=res.data.result;
                    this.total = res.data.total;
                    this.datas = result
                });
            },
            async exportReDian(para) {
                this.listLoading = true;
                para = {
                    page : this.page,
                    size : this.size,
                    tszb : this.filters.tszb,
                    startTime : this.filters.startTime&&new Date(this.filters.startTime).format('yyyy-MM-dd hh:mm'),
                    endTime : this.filters.endTime&&new Date(this.filters.endTime).format('yyyy-MM-dd hh:mm')
                };
                api.exporReDianCeLueByPage(para)
                this.listLoading = false;
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>