<template>
    <section>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-select v-model="queryForm.indicatorName" clearable placeholder="请选择叠加条件">
                    <el-option
                        v-for="item in tesezhibiaoList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
                <el-form-item>
                    <el-date-picker :picker-options="startTime" v-model="queryForm.startTime" placeholder="发布时间查询"></el-date-picker>
                    <el-date-picker :picker-options="endTime" v-model="queryForm.endTime" placeholder="结束时间查询"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="exportList()">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="datas" highlight-current-row v-loading="listLoading">
            <el-table-column prop="index" label="序号">
                <template scope="scope">
                    {{datas.length - scope.$index}}
                </template>
            </el-table-column>
            <el-table-column prop="stockPoolName" label="股池名称"></el-table-column>
            <el-table-column prop="indicatorName" label="叠加条件"></el-table-column>
            <el-table-column prop="createTime" label="入池时间"></el-table-column>
            <el-table-column prop="secName" label="股票名称"></el-table-column>
            <el-table-column prop="secCode" label="股票代码"></el-table-column>
        </el-table>
        <el-pagination
                v-if="this.total>this.page.pageSize"
                @current-change="handleCurrentChange"
                :current-page="page.pageNum"
                :page-size="this.page.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="this.total">
        </el-pagination>
    </section>
</template>

<script>
    import api from "../../api/api.js";
    import '../../common/js/DateFormat';
    export default {
        data() {
            return {
                listLoading: false,
                tesezhibiaoList: [
                    {
                      id: '1',
                      name: '放量上攻'
                    },
                    {
                        id: '2',
                        name: '趋势共振'
                    },
                    {
                        id: '3',
                        name: '震荡突破'
                    },
                    {
                        id: '4',
                        name: '探底回升'
                    },
                    {
                        id: '5',
                        name: '趋势反转'
                    },
                    {
                        id: '6',
                        name: '背离反弹'
                    }
                ],
                queryForm: {
                    indicatorName: '',
                    startTime: '',
                    endTime: ''
                },
                startTime: {
                    disabledDate: time => {
                        if (this.queryForm.endTime) {
                            return time.getTime() > new Date(this.queryForm.endTime).getTime();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                endTime: {
                    disabledDate: time => {
                        if (this.queryForm.startTime) {
                            return time.getTime() > Date.now() || time.getTime() < new Date(this.queryForm.startTime).getTime();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                page: {
                    pageNum: 1,
                    pageSize: 15
                },
                total: 0,
                datas: [],
            }
        },
        methods: {
            async query() {
                this.queryList();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getData();
            },
            async queryList() {
                this.page.pageNum = 1;
                this.getData();
            },
            async getData() {
                this.listLoading = true;
                let params = {
                    pageNum: this.page.pageNum,
                    pageSize: this.page.pageSize,
                }
                params.indicatorName = this.queryForm.indicatorName;
                this.queryForm.startTime&&(params.startTime = new Date(this.queryForm.startTime).format('yyyy-MM-dd'));
                this.queryForm.endTime&&(params.endTime = new Date(this.queryForm.endTime).format('yyyy-MM-dd'));
                let resp = await api.findTeSeZhiBiaoHistoryByPage(params);

                if (!resp) {
                    return;
                }

                this.datas = resp.data.list;
                this.total = resp.data.total;
                this.listLoading = false;
            },
            exportList() {
                let params = {};
                params.indicatorName = this.queryForm.indicatorName;
                this.queryForm.startTime&&(params.startTime = new Date(this.queryForm.startTime).format("yyyy-MM-dd"));
                this.queryForm.endTime&&(params.endTime = new Date(this.queryForm.endTime).format("yyyy-MM-dd"));
                api.exportTeSeZhiBiaoHistory(params);
            }
        },
        async mounted() {
            this.queryList();
        }
    }
</script>

<style>
    .line-num-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>
