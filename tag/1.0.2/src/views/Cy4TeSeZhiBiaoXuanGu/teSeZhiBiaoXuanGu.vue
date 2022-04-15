<template>
    <section>        
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                <el-form-item>
                <el-input v-model="filters.indicator_name" placeholder="指标名称关键字搜索"></el-input>
                </el-form-item>
                
                <el-form-item>
                <el-button type="primary"@click="getList()">查询</el-button>
                </el-form-item>
                </div>
            </el-form>
        </el-col>
        <el-table :data="datas" style="width: 120%">
            <el-table-column prop="" label="序号" width="260" >
                <template scope="num">
                    {{num.$index+1}}
                </template>
            </el-table-column>
            <el-table-column prop="indicator_name" label="指标名称" width="260"></el-table-column>
            <el-table-column prop="indicator_reason" label="指标介绍" width="260"></el-table-column>
            <el-table-column prop="update_time" label="修改时间" width="260">
                <template scope="scope">
                    {{ scope.row.update_time
                        ? new Date(scope.row.update_time).format("yyyy-MM-dd hh:mm")
                        : ''
                    }}
                </template> 
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
        <!--编辑/添加界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form  :model="editForm" :rules="rules" ref="editForm" label-width="100px" >
                <el-form-item label="指标名称：" prop="indicator_name ">
                    <el-input disabled v-model="editForm.indicator_name" placeholder="指标名称" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
				</el-form-item>
               <el-form-item label="指标简介：" prop='indicator_reason'> 
                    <el-input type="textarea" :rows="5" placeholder="请输入指标简介，不超过200个汉字" v-model="editForm.indicator_reason" :value="editForm.indicator_reason" style="width: 600px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="dialogVisible = false;">取消</el-button>
                    <el-button type="primary"@click.native="editSubmit" :loading="editLoading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import api from '../../api/api.js';
import '../../common/js/DateFormat';
import util from '../../common/js/util';
export default {
    data (){
        return {
            editForm:{},
            xuanguForm:{},
            activeName: "first",
            // addForm:{
            //     date:'',
            //     name:'',
            //     address:''
            // },
            filters:{
                indicator_name:'',
                create_time:''
            },
            page: 0,
            size:10,
            total:50,
            idens:'',
            currentPage: 1,
            dialogVisible:false,
            editLoading:false,
            datas:[],
            dialogTitle:'',
            rules:{
                indicator_reason:[
                    {required: true, message: '请填写指标介绍', trigger: 'blur'},
                    {validator:(rule, value, callback)=>{
                            if(!value.trim()){
                                callback(new Error("特色指标介绍不能为空字符串"))
                            }else
                            {callback()}
                        },trigger: 'blur'},
                    {max: 200, message: '指标介绍不能超过200个汉字', trigger: 'blur'}
                ]
            },
            defaultModules: {
                toolbar: ['image']
            },
        };
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleCurrentChange(val) {
            this.page = val;
        },
        handleCurrentChange(val) {
            this.page = val;
            var para = {
                page:this.page,
                size:this.size,
                // sec_name : this.filters.sec_name,
                // pub_date : this.filters.pub_date
            };
            this.getList(para);
        },
        //获取列表
        async getList(para){
            para = {
                page : this.page,
                size : this.size,
                indicator_name : this.filters.indicator_name,
                // pub_time : this.filters.create_time&&new Date(this.filters.create_time).format('yyyy-MM-dd')
            };
            console.log(JSON.stringify(para));
            
            await api.selectCy4IndicatorByPage(para).then(res => {
                console.log(JSON.stringify(res));
                let result=res.data[0].content;
                this.total = res.data[0].totalElements;
                var array = [];
                var times = "";
                // for(var i=0;i<result.length;i++){
                //     var date = new Date(result[i].create_time);
                //     var Y = date.getFullYear() + '-';
                //     var  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                //     var  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                //     var  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                //     var  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
                //     result[i].create_time=Y+M+D+h+m;
                //     times = Y+M+D
                //     if(result[i].type=='0'){
                //         array.push(times)
                //     }
                    
                // }
                for(var i=0;i<result.length;i++){

                }
                this.datas = result
                
            });
        },
        //修改策略
        async editSubmit(){
            this.$refs.editForm.validate((valid) => { 
                // alert(valid)
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                        this.editLoading = true;
                        let result={};
                        let para = {};
                            para.id = this.editForm.id
                            para.indicator_name = this.editForm.indicator_name
                            para.indicator_reason = this.editForm.indicator_reason
                            para.update_time = new Date().format('yyyy-MM-dd hh:mm:ss');
                            result= await api.updateCy4Indicator(para);
                            console.log(JSON.stringify(result));
                            
                            if(result.state){
                                // this.idens='0'
                                // this.flag='1'
                                this.$message({message: '修改成功',type: 'success'});
                            }else{
                                this.$message.error('修改失败');
                            }
                        this.clearEdit();
                        this.dialogVisible = false;
                        this.editLoading = false;
                        this.getList()
                        
                    });
                }
            });
        },
        handleEdit(index,row){
            // alert(JSON.stringify(row))
            this.dialogTitle = "编辑";
            this.editOrAdd = false;
            this.dialogVisible = true;
            this.editForm = Object.assign({}, row);
            this.showUeEdit = true;
        },
        clearEdit(){
            let tmpObj = {
            };
            this.showUeEdit = false;
            this.editForm = Object.assign({}, tmpObj);
        },
    },
    mounted() {
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
