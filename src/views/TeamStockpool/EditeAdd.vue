<template>
    <section>
    <!--编辑界面-->
    <el-dialog :title=dialogTitle :visible.sync=currentdialogVisible  :close-on-click-modal="false">

        <el-form :model="cuttenteditForm" label-width="150px" :rules="editFormRules" ref="editForms">

            <el-form-item label="选择锦囊" prop="bag_id">
                {{this.currentdialogVisible}}
                <el-select  v-model="cuttenteditForm.bag_id"    clearable placeholder="--请选择锦囊--"  >
                    <el-option
                            v-for="list in bagFrom"
                            :key="list.bag_id"
                            :label="list.name"
                            :value="list.bag_id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="股票名称：" prop="stock_name">
                <el-select v-model="cuttenteditForm.stock_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear"
                           :remote-method="select_remoteMethod" :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:180px;">
                    <el-option v-for="item in select_options" :key="item.value"  :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="cuttenteditForm.stock_code"  auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
            </el-form-item>


            <el-form-item label="止损位"  prop="stop_loss_position" >
                <el-input type="number" v-model.number="cuttenteditForm.stop_loss_position" auto-complete="off" ></el-input>
            </el-form-item>

            <el-form-item label="关注理由"  prop="reasont">
                <el-input v-model="cuttenteditForm.reasont" auto-complete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="currentdialogVisible = false;">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>

    </section>
    
</template>
<script>

    import {addTeamStockpool,updateTeamStockpool,deleteTeamStockpool,getTeamStockpoolList,teamBagList} from '../../api/ydApi.js';
    import kbspiritDataStore from "../../common/js/kbspiritDataStore.js";
    export default {
        data() {
            return {
                currentdialogTitle:this.dialogTitle,
                currentdialogVisible:this.dialogVisible,
                cuttenteditForm:{},

                select_loading: false,
                listLoading: false,
                editLoading: false,
                select_options: [],//键盘宝
                bagFrom:{},

                alertmsg:"操作成功",
                alerttype:"success",

                editFormRules: {
                    stock_name:[{ required: true, message: '请输入股票名称!', trigger: 'blur'}],
                    stock_code:[{ required: true, message: '请输入股票代码!', trigger: 'blur'}],
                    reasont:[
                        { required: true, message: '请输入关注理由!', trigger: 'blur'},
                        {max: 40, message: '长度在40个字符', trigger: 'blur'}
                    ],
                    stop_loss_position:[
                        { required: true, message: '止损位不能为空'},
                        { type: 'number', message: '止损位必须为数字值'}
                    ],
                    bag_id:[{ required: true, message: '请选择锦囊!', trigger: 'blur'}],
                },
            }
        },
        methods: {
            add_select_clear(){
                this.cuttenteditForm.stock_code="";
            },
            select_remoteMethod(query){

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
                var r= this.cuttenteditForm.stock_name;

                for( var i in this.select_options)
                {
                    if(this.select_options[i].value==r)
                    {
                        this.cuttenteditForm.stock_name=this.select_options[i].label;
                        this.cuttenteditForm.stock_code=r;
                    }
                }
                //console.log("name:::"+this.editForm.stock_name+"value:::"+this.editForm.stock_code);
            },

            async selectTeamBagList(para){
                teamBagList(para).then(res => {
                    let arr = [];
                    for(let i=0;i<res.data.length;i++){
                        //console.log(res.data[i]);
                        res.data[i].bag_id= res.data[i].bag_id+"";
                        arr.push(res.data[i]);   


                    }
                    this.bagFrom=arr;
                });
            },

            //新增、编辑
            editSubmit: function (){
                this.$refs.editForms.validate((valid) => {
                    if (valid){
                        this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                            this.editLoading = true;
                            let objdata = Object.assign({}, this.cuttenteditForm);
                            objdata.team_id="";//获取登陆用户的站点id
                            this.bagFrom.forEach(function(v){
                                if(v.bag_id==objdata.bag_id)
                                {
                                    objdata.bag_name=v.name;
                                }
                            })
                           // console.log("dddd"+JSON.stringify(objdata));

                            if(objdata.editOrAdd){

                                addTeamStockpool(objdata).then(res=>{
                                    if(res.data.status==2)
                                    {
                                        this.alertmsg="添加失败";
                                        this.alerttype="error"
                                    }
                                })
                            }else{
                                updateTeamStockpool(objdata).then(res=>{
                                    if(res.data.status==2)
                                    {
                                        this.alertmsg="修改失败";
                                        this.alerttype="error"
                                    }
                                })
                            }
                            this.currentdialogVisible = false;
                            this.$message({
                                message: this.alertmsg,
                                type: this.alerttype
                            });
                            this.editLoading = false;
                            this.$router.push("/TeamStockPool"); 
                          });
                    }
                });  
            },

        },
        props: {
            editForm: {
                type: Object
            },
            dialogVisible:{
                type: Boolean
            },
            dialogTitle:{
                type: String
            },
            editOrAdd:{
                type:String
            },

        },
        watch: {
            dialogVisible(val){
                this.currentdialogVisible=val;
            },
            currentdialogVisible(val){
                this.$emit("func",val);
            },
            editForm:{
                handler(newval, oldval)
                {
                    this.cuttenteditForm = Object.assign({}, newval);
                     //console.log("sss"+JSON.stringify(this.cuttenteditForm ));
                  }
            }
        },
        mounted() {
               this.selectTeamBagList({});
        }


    }
</script>
