<template>
    <section>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <el-form>
                        <el-input v-model="queryForm.hotSpotFocusId" clearable placeholder="请输入ID查询"></el-input>
                    </el-form>
                </el-form-item>
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
            <el-table-column prop="hotSpotFocusId" label="ID"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="stocks" label="相关个股"></el-table-column>
            <el-table-column prop="content" label="内容">
                <template scope="scope">
                    <div class="line-num-text" >{{ scope.row.content }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="teacherDescription" label="老师职业资格信息"></el-table-column>
            <el-table-column prop="releaseTime" label="发布时间"></el-table-column>
            <el-table-column prop="operationType" label="操作">
                <template scope="scope">
                    {{scope.row.operationType == '0'? '新增': scope.row.operationType == '1'? '修改': '删除'}}
                </template>
            </el-table-column>
            <el-table-column prop="operationTime" label="操作时间"></el-table-column>
            <el-table-column prop="operator" label="操作账号"></el-table-column>
        </el-table>
        <el-pagination v-if="this.total>this.page.pageSize" @current-change="handleCurrentChange" :current-page="page.pageNum" :page-size="this.page.pageSize" layout="total, prev, pager, next, jumper" :total="this.total"></el-pagination>
    </section>
</template>

<script>
    import api from "../../api/api.js"
    export default {
        data() {
            return {
                listLoading: false,
                queryForm: {
                    hotSpotFocusId: '',
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
                params.hotSpotFocusId = this.queryForm.hotSpotFocusId;
                this.queryForm.startTime&&(params.startTime = new Date(this.queryForm.startTime).format("yyyy-MM-dd"));
                this.queryForm.endTime&&(params.endTime = new Date(this.queryForm.endTime).format("yyyy-MM-dd"));
                let resp = await api.findHistoryByPage(params);

                if (!resp) {
                    return;
                }

                this.datas = resp.data.list;
                this.total = resp.data.total;
                this.listLoading = false;
            },
            exportList() {
                let params = {};
                params.hotSpotFocusId = this.queryForm.hotSpotFocusId;
                this.queryForm.startTime&&(params.startTime = new Date(this.queryForm.startTime).format("yyyy-MM-dd"));
                this.queryForm.endTime&&(params.endTime = new Date(this.queryForm.endTime).format("yyyy-MM-dd"));
                api.exportHotSpotFocusHistory(params);
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
