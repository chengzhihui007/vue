<template>
    <section>
    <!--编辑界面-->
    <el-dialog :title=historyTitle :visible.sync=historyVisible  :close-on-click-modal="false" v-on:close="clearEdit">

        <el-form :model="historyForm" label-width="150px"   :rules="editFormRules" ref="editForms">

            <el-form-item label="股票名称：" prop="stock_name">
                <el-tag>{{historyForm.stock_name}}</el-tag>  <el-tag>{{historyForm.stock_code}}</el-tag>  <el-tag>({{historyForm.bag_name}})</el-tag>
            </el-form-item>


            <el-form-item label="类型" >
                <el-radio v-model="radio" label="1">持有</el-radio>
                <el-radio v-model="radio" label="2">调出</el-radio>
            </el-form-item>

            <el-form-item label="观点内容："   >
                <UeEdit v-if=showUeEdit :thisData="'content'"   v-on:ueIpt-say="listenThisUe" :maxWords=50 :defaultMsg=historyForm.content ref='content'></UeEdit>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="historyVisible = false;showUeEdit=false;">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
        

    </el-dialog>
    </section>
</template>
<script>

    import {addstockhistory,updatestockhistory,deletestockhistory,getstockhistoryList} from '../../api/ydApi.js';
    import util from '../../common/js/util';
    import UeEdit from '../UeEdit.vue';

    export default {
        components:{UeEdit},
        data() {
            return {
                historyTitle:'股票跟踪',
                historyVisible:this.history_dialogVisible,
                historyForm:{},
                radio:'1',

                showUeEdit:true,
                select_loading: false,
                listLoading: false,
                editLoading: false,
                alertmsg:"操作成功",
                alerttype:"success",

                team_id2 :'',
                team_name2 :'',
                editFormRules: {
                    // content: [
                    //     { required: true, message: '请输入观点内容', trigger: 'change' }                        
                    // ]
                },
            }
        },
        methods: {
            listenThisUe(thisUe){
                this.historyForm[thisUe.name] = thisUe.data;
                return thisUe
            },
            clearEdit(){
                this.showUeEdit=false;
            },
            //新增、编辑
            editSubmit: function (){     

              //alert(this.historyForm.content);
              if(this.historyForm.content == ""){
                  this.$message({
                        message: "请输入观点内容！",
                        type: "error"
                    });
                    return false
              }
             this.$refs.editForms.validate((valid) => {
                 
             if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            let objdata = Object.assign({}, this.historyForm);

                            objdata.team_id=this.team_id2;//获取登陆用户的站点id
                            objdata.stockpool_id=objdata.id;
                            objdata.status=this.radio;
                            

                          //console.log("dddd"+JSON.stringify(objdata));

                            if(objdata.editOrAdd){
                                addstockhistory(objdata).then(res=>{
                                      //调用父组件方法，刷新父组件列表。
                                      this.$emit('func_b4');
                                    if(res.data.status==2)
                                    {

                                        // 2019-2-25  修改 原来是 添加失败 后来修改为添加成功
                                        this.alertmsg="操作成功";
                                        this.alerttype="success"
                                        
                                    }
                                })
                            }else{
                                updatestockhistory(objdata).then(res=>{
                                      this.$emit('func_b4');
                                    if(res.data.status==2)
                                    {
                                        this.alertmsg="修改失败";
                                        this.alerttype="error"
                                    }
                                })
                            }
                            this.historyVisible = false;
                            this.$message({
                                message: this.alertmsg,
                                type: this.alerttype
                            });
                            this.editLoading = false;
                          
                        });
                 }
             })
            },

        },
        props: {
            history_editForm: {
                type: Object
            },
            history_dialogVisible:{
                type: Boolean
            },
            history_showUeEdit:{
                type: Boolean
            }
        },
        watch: {
            history_dialogVisible(val){
                this.historyVisible=val;
            },
            historyVisible(val){
                this.$emit("func_history",val);
            },
            history_showUeEdit(val){
                this.showUeEdit=val;
            },
            showUeEdit(val)
            {
                this.$emit("func_UeEdit",val);
            },
            history_editForm:{
                handler(newval, oldval)
                {
                    this.historyForm = Object.assign({}, newval);
                    //console.log("sss" + JSON.stringify(this.historyForm));
                }
            }
        },
        mounted() {



           var user2 = sessionStorage.getItem('user');
            var userArray2 = JSON.parse(user2);
            this.team_id2 = userArray2.team_id;
            this.team_name2 = userArray2.team_name;
        }


    }
</script>
