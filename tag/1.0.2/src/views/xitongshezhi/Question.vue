<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
              <el-form-item>
					 <el-select v-model="projectValue"  style="width:193px;" clearable @change="currentSel">
                     <el-option   v-for="item in options"  :key="item.value"  :label="item.label"  :value="item.value">  </el-option> 
                   </el-select>
				</el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading"  style="width: 100%;">
         	<el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="createtime" label="收集日期" width="100" >
                <template scope="scope">
					{{ scope.row.createtime |dateFrm}}<br />
				 </template>
            </el-table-column>
             <el-table-column prop="type" label="所属项目" width="120" >
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="150" >
            </el-table-column>
            <el-table-column prop="des" label="问题描述" width="500" >
            </el-table-column>
     </el-table>
       <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
     </section>
</template>

<script>
    import {QuestionList} from "../../api/ydApi.js";
    import moment from "moment";
    export default {
        data() {
            return {
                filters: {
                    
                },
                datas: [],
                total: 0,
                page: 1,
                pageSize: 30,
                currentPage: 1,
                listLoading: false,
                projectValue: '201902',
                 options: [
                     {    value: '201902',    label: '2019年2月'  }, 
                     {    value: '201903',    label: '2019年3月'  },
                     {    value: '201904',    label: '2019年4月'  }, 
                     {    value: '201905',    label: '2019年5月'  },
                     {    value: '201906',    label: '2019年6月'  }, 
                     {    value: '201907',    label: '2019年7月'  },
                     {    value: '201908',    label: '2019年8月'  }, 
                     {    value: '201909',    label: '2019年9月'  },
                     {    value: '201910',    label: '2019年10月'  }, 
                     {    value: '201911',    label: '2019年11月'  },
                     {    value: '201912',    label: '2019年12月'  },
                     {    value: '202001',    label: '2020年1月'  }, 
                     {    value: '202002',    label: '2020年2月'  },
                 ]  
               }
        },
        methods: {
           handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
               currentSel(selVal){
                   this.projectValue=selVal;
                  this.getList();
           },
            //获取列表数据
            async getList() {
               let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    seldate:this.projectValue
                };
                this.listLoading = true;
                 QuestionList(para).then(res => {
                    let result=res.data;
                   this.total = result.total;
                   this.datas=result.list;
                })
               this.listLoading = false;
               },
          },
            filters: {
                 dateFrm: function(el) {
                   var sjc="";
                   if(el)
                     {
                         sjc=moment.unix(el/1000).format("YYYY-MM-DD");
                     }
                       return sjc;
                   } ,
            },
        mounted() {
            this.getList();
        }
    }

</script>

<style scoped>

</style>