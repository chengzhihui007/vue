<template>
    <div >
    <el-form-item label='000'>

        <el-input v-model="dialogTitle2" placeholder="请输入内容"></el-input>
        <el-dialog  :title="dialogTitle2"   :visible.sync=dialogVisible close-on-click-modal="false">
        </el-dialog>
    </el-form-item>
    </div>

</template>
<script>

    export default {

        data() {
            return {
                select_loading: false,

                editOrAdd:false,
                DataList: [],
                listLoading: false,
                editLoading: false,
                select_options: [],//键盘宝
                DataObj:{},
                filters:{
                    id:'',
                    stockName:'',
                    stockCode:'',
                    reasont:'',
                    stopLossPosition:'',
                    createTime:'',
                    updateTime:'',
                    outTime:'',
                    status:'',
                    bagId:'',
                    delFlag:'',
                    teamId:'',
                },
                editFormRules: {
                    stockName:[{ required: true, message: '请输入股票名称!', trigger: 'blur'}],
                    stockCode:[{ required: true, message: '请输入股票代码!', trigger: 'blur'}],
                    reasont:[{ required: true, message: '请输入关注理由!', trigger: 'blur'}],
                    stopLossPosition:[{ required: true, message: '请输入止损位!', trigger: 'blur'}],
                    outTime:[{ required: true, message: '请输入调出时间!', trigger: 'blur'}],
                    status:[{ required: true, message: '请输入1已调出，0未调出!', trigger: 'blur'}],
                    bagId:[{ required: true, message: '请输入锦囊id!', trigger: 'blur'}],
                    delFlag:[{ required: true, message: '请输入是否删除!', trigger: 'blur'}],
                    teamId:[{ required: true, message: '请输入战队id!', trigger: 'blur'}],
                },
            }
        },
        methods: {
            add_select_clear(){
                this.editForm.stockCode="";
            },
            select_remoteMethod(query) {

                if (query !== "") {
                    this.select_loading = true;
                    setTimeout(async () => {
                        this.select_loading = false;
                        var result = await kbspiritDataStore.query(query);
                        this.select_options=result;
                        //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                        //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                    }, 200);
                    // console.log(JSON.stringify(this.select_options));
                } else {
                    this.select_options = [];
                }
            },

            selectchange(){
                var r= this.editForm.stockName;

                for( var i in this.select_options)
                {
                    if(this.select_options[i].value==r)
                    {
                        this.editForm.stockName=this.select_options[i].label;
                        this.editForm.stockCode=r;
                    }
                }
                console.log("name:::"+this.editForm.stockName+"value:::"+this.editForm.stockCode);
            },



            handleCurrentChange(val) {
                this.page = val;
                this.list();
            },

            //显示新增界面
            handleAdd: function () {
                this.dialogTitle = "新增";
                //this.editOrAdd = true;
                //this.dialogVisible = true;
                this.clearEdit()
            },
            //显示编辑界面
            async handleEdit (index, row) {
                this.dialogTitle = "编辑";
                //this.editOrAdd = false;
                //this.dialogVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //编辑
            editSubmit: function (){
                this.$refs.editForm.validate((valid) => {
                    if (valid){
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;

                            var reg= /^[0-9]*$/;
                            var str1 = this.editForm.stopLossPosition;


                            if(!reg.test(str1)){
                                this.$message({
                                    message: '警告哦，金额不能为空或者金额保留两位小数',
                                    type: 'warning'
                                });
                                this.editLoading = false;
                                return false;
                            }

                            if(this.editOrAdd){
                                let para = Object.assign({}, this.editForm);
                                addTeamStockpool(para).then(res=>{

                                })
                            }else{
                                let para = Object.assign({}, this.editForm);
                                updateTeamStockpool(para).then(res=>{

                                })
                            }
                            this.dialogVisible = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.editLoading = false;
                        });
                    }
                });
            },
            //恢复编辑页面为默认
            clearEdit(){
                var result={
                    picture:""
                }
                this.editForm = Object.assign({}, result);
            },
            //删除
            handleDel: function(row) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                    .then(async () => {
                        this.listLoading = true;
                        deleteTeamStockpool(row.id).then(res=>{
                            var result=res.data;
                            if (result.status == 1) {
                                this.listLoading = false;
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                                this.list();
                            } else {
                                this.listLoading = false;

                                this.$message({
                                    message: "删除失败",
                                    type: "error"
                                });
                            }
                        });

                    })
                    .catch(() => {
                    });
            },
            formatfoatcreateTime:function(row){
                var timestamp = new Date(row.createTime);
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            },
            formatfoatupdateTime:function(row){
                var timestamp = new Date(row.updateTime);
                return timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
            }
        },
        props: {
            editForm:{
                type:Object
            },
            dialogTitle2:{
                type: String
            },
            dialogVisible:{
                type :Boolean
            }
        },
        mounted() {

        }


    }
</script>