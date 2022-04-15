<template>
    <section>        
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                    <el-date-picker
                        v-model="filters.pub_date"
                        type="date"
                        placeholder="操作时间查询">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.value" placeholder="请选择功能名称">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                <el-button type="primary"@click="getList()">查询</el-button>
                </el-form-item>
                </div>
            </el-form>
        </el-col>
        <el-table :data="addForm" style="width: 120%">
            <el-table-column prop="date" label="序号" width="260">
                <template scope="num">
                    {{num.$index+1}}
                </template>
            </el-table-column>
            <el-table-column prop="operation_fun" label="操作功能" width="260">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_fun }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_con" label="操作内容" width="260">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_con }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_date" label="操作时间" width="260">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_date }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operation_user" label="操作账号" width="260">
                <template scope="scope">
                    <div class="deleted-text">{{ scope.row.operation_user }}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

        
    </section>
</template>
<script>
import api from "../../api/api.js";
import '../../common/js/DateFormat';
import util from '../../common/js/util'
export default {
    data (){
        return {
            filters:{
                value:'',
                pub_date:''
            },
            page: 1,
            size:10,
            total:'',
            currentPage: 1,
             addForm: [],
             isLabel:'',
            options: [{
                value: '选股条件-选股范围'
                }, {
                value: '选股条件-基本面选股'
                }, {
                value: '选股条件-特色指标选股'
            }]
        };
    },
    methods:{
        handleCurrentChange(val) {
            this.page = val;
        },
        handleCurrentChange(val) {
            this.page = val;
            var para = {
                page:this.page,
                size:this.size,
                operation_fun : this.filters.value,
                pub_time : this.filters.pub_date&&new Date(this.filters.pub_date).format('yyyy-MM-dd')
            };
            this.getList(para)
        },
        //获取列表
        async getList(para){
            para = {
                page : this.page,
                size : this.size,
                operation_fun : this.filters.value,
                // moudle_flag:'1',
                pub_time : this.filters.pub_date&&new Date(this.filters.pub_date).format('yyyy-MM-dd')
            };
            var pathName = this.$router.currentRoute.path;
            console.log(pathName)
            this.isLabel = this.$route.query.isLable
            if(pathName=='/rdztybcl/quanburizhi'){
                para.moudle_flag='1'
            }else if(pathName=='/rdztgcz/quanburizhi'){
                para.moudle_flag='2'
            }else if(pathName=='/rdztgcz/quanburizhi1'){
                para.moudle_flag='3'
            }else if(pathName=='/rdztgcz/quanburizhi2'){
                para.moudle_flag='4'
            }else if(pathName=='/rdztgcz/quanburizhi3'){
                para.moudle_flag='5'
            }else if(pathName=='/rdztgcz/quanburizhi4'){
                para.moudle_flag='6'
            }else if(pathName=='/rdztgcz/quanburizhi5'){
                para.moudle_flag='7'
            }else if(pathName=='/rdztgcz/quanburizhi6'){
                para.moudle_flag='8'
            }else if(pathName=='/rdztgcz/quanburizhi7'){
                para.moudle_flag='9'
            }else if(pathName=='/clsz/RDquanburizhi'){
                if(this.isLabel=='热点之底部一买战法'){
                para.moudle_flag='10'
                }else if(this.isLabel=='热点之底部二买战法'){
                para.moudle_flag='11'
                }else{
                para.moudle_flag='12'
                }
            }else if(pathName=='/clsz/ZTquanburizhi'){
                if(this.isLabel=='热点之底部一买战法'){
                    para.moudle_flag='13'
                }else if(this.isLabel=='热点之底部二买战法'){
                    para.moudle_flag='14'
                }else{
                    para.moudle_flag='15'
                }
            }else if(pathName=='/rdztgaoguan/Ggquanburizhi'){
                para.moudle_flag='16'
            }else if(pathName=='/rdztgaoguan/LHquanburizhi'){
                para.moudle_flag='17'
            }else if(pathName=='/rdztgaoguan/ZLquanburizhi'){
                para.moudle_flag='18'
            }
            // alert(JSON.stringify(para))
            await api.selectOperationLogByPage(para).then(res => {
                // alert(JSON.stringify(res.data))
                if(res.data == null){
                    let result = null
                    this.addForm = result
                    this.total = 0
                }else{
                    let result=res.data.result;
                    this.total = res.data.total;
                    this.addForm = result
                }
            });
        },
        handleEdit(index,row){

        }
    },
    mounted(){
        this.getList();
    }   
}
</script>
<style>
    .head {
        font-size: 20px;
        border-bottom: 1px solid rgb(177, 172, 172);
        padding-bottom: 20px;
        margin-bottom: 50px;
    }
    /* .dialog-footer {
        width:400px;
　　　　 border:1px solid red;
        margin:0 auto;
    }
    .xuandiv{
        width:1400px;
　　　　 border:1px solid red;
        margin:0 auto;
    }
    .divForm{
        width:1000px;
　　　　 border:1px solid red;
        margin:0 auto;
    } */
    .el-pagination{
        text-align: center;
    }
</style>
