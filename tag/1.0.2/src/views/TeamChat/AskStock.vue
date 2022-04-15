<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <div>
                    <el-form-item>
                       战队聊天/问股
                    </el-form-item>
                </div>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
           
            <el-table-column prop="user_name" label="用户" width="130" >
                <template scope="scope">
					<span >{{ scope.row.user_name |protect}}</span>
				
                </template>
            </el-table-column>
            <el-table-column prop="ask" label="提问内容" width="380" >
                <template scope="scope">
					<span v-bind:class="{active: (scope.row.ask)}">{{ scope.row.create_time |dateFrm}}</span><br />
					<span>{{ scope.row.ask }}</span>
                </template>
            </el-table-column>
         <el-table-column prop="reply" label="答复内容" width="320"   >
                <template scope="scope" v-if="scope.row.reply!=''">
					<span v-bind:class="{active: (scope.row.reply)}">{{ scope.row.update_time |dateFrm}}</span><br />
					<span>{{ scope.row.reply }}</span>
                </template>
            </el-table-column> 
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
                    <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row.ask_id)">删除</el-button>
                    <el-button  size="small"  @click="handleFront(scope.$index,scope.row.ask_id,scope.row.flag)" v-if="scope.row.flag==1">显示至前台</el-button>
                    <el-button type="danger" size="small"  @click="handleFront(scope.$index,scope.row.ask_id,scope.row.flag)" v-else>显示至前台</el-button>
                </template>
            </el-table-column>
        </el-table>
<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.pageSize layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>
      
        <!--编辑界面-->
        <el-dialog  :title=dialogTitle  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules" >
                <span  >{{editForm.user_name}}</span>
                 <span >{{editForm.create_time |dateFrm}}</span>
                 <p >{{editForm.ask}}</p>
                <el-form-item label="回复内容" prop="reply">
                    <el-input type="textarea" :rows="5"  :onkeyup="checkContent(editForm.reply)"   v-model="editForm.reply"  ></el-input>
                    {{this.checkMsg}}
                </el-form-item>
                  <el-form-item >
                    <template>
                        <el-checkbox v-model="checked">显示到前台</el-checkbox>
                       
                    </template>
                </el-form-item>
              </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="resetForm('editForm')">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" >提交</el-button>
            </div>
        </el-dialog>



    </section>
</template>

<script>
    import {askstockList,askstockUpdate,askstockDel,Front} from "../../api/ydApi.js";
    import moment from "moment";
    export default {
        data() {
               var checktitle = (rule, value, callback) => {
                setTimeout(() => {
                    if (this.strlen(value) > rule.num) {
                        callback(new Error("字数超过限制！"));
                    } else {
                        callback();
                    }
                }, 500);
            };
            return {
                filters: {
                    
                },
                 checkMsg:"",
                team_id:"",
                team_name:"",
                datas: [],
                checked: true,
                total: 0,
                page: 1,
                pageSize: 30,
                currentPage: 1,
                dialogTitle: "添加",
                editOrAdd:false,
                listLoading: false,
                dialogVisible: false,//编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editForm: {
                   reply:""
                },
                rules: {
                    reply: [
                        {required: true, message: '请输入回复内容', trigger: 'blur'},
                        {validator: checktitle, message: '长度在 1/100个汉字', trigger: 'blur', num: 200}
                    ]
                    
                },
            }
        },
        methods: {
             getStrLenght(reply) {
             var len=0;
             if(reply)
             {
                for (var i = 0; i < reply.length; i++) {
                    var a = reply.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {//判断如果输的是汉字，字符串长度+2
                        len += 1;
                    }
                    else {
                        len += 0.5;
                    }
                }
                }
                return len;
        },
           checkContent(reply){
               let  len = 1;
                if(reply)
                 {
                  len =this.getStrLenght(reply);
                  }
                this.checkMsg = len+"/100";
           },
            handleCurrentChange(val) {
                this.page = val;
                this.getList();
            },
            resetForm(formName){
            this.dialogVisible = false;
                this.$refs[formName].resetFields();
            },
            //获取列表数据
            async getList() {
                
                var admin = sessionStorage.getItem("user");
                var a = JSON.parse(admin);
            
                this.username=a.user_name;
                this.team_id = a.team_id;
                this.team_name = a.team_name;
                let para = {
                    pageNo: this.page,
                    pageSize: this.pageSize,
                    team_id:this.team_id
                };
                this.listLoading = true;
                 askstockList(para).then(res => {
                    let result=res.data;
                   this.total = result.total;
                   this.datas=result.list;
                })
              
                this.listLoading = false;

            },
            
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editOrAdd = false;
                this.dialogTitle = "回复";
                this.dialogVisible = true;
                 //勾选是否同步显示状态
                if(this.editForm.flag==1)
                {
                  this.checked=true;
                }
                else
                {
                     this.checked=false;
                }
                this.editForm = Object.assign({}, row);
            },
           
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                      this.$confirm('确认提交吗？', '提示', {}).then( async () => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            this.$refs['editForm'].resetFields();
                            this.dialogVisible = false;
                            if(this.checked)
                            {
                              this.editForm.flag=1;
                            }
                            else
                            {
                                this.editForm.flag=0;
                            }
                              askstockUpdate(para).then(res => {
                                        this.dialogVisible = false;
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                       
                                         this.getList();
                                     });
                         });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
         handleFront: function (index,id,flag) {
               var xs=0;
            if(flag=="0")
              {
                   xs=1;
                 //xs=parseInt(flag)+1;
               }
              if(flag=="1")
              {
                 xs=0;
              }
              let params=id+','+xs+','+this.team_id;
              this.$confirm('确定在前台的显示吗', '提示', {
                        type: 'warning'
                    }).then(async () => {
                        Front(params).then(res => {
                    this.listLoading = false;
                    this.getList();
                    }).catch(() => {
                       });
                    });
            },
            
             //删除
         handleDel: function(index,id) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                .then(async () => {
                this.listLoading = true;
                let askid=id+','+this.team_id;
              askstockDel(askid).then(res => {
                  let result=res.data;
                if (result == 0) {
                    this.listLoading = false;
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.getList();
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
            strlen(str) {
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    var c = str.charCodeAt(i);
                    //单字节加1
                    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                        len++;
                    } else {
                        len += 2;
                    }
                }
                return len;
            }
             },
              filters: {
                 dateFrm: function(el) {
                   var sjc="";
                   if(el)
                     {
                            sjc=moment.unix(el/1000).format("YYYY-MM-DD HH:mm:ss");
                     }
                       return sjc;
                   } ,
                   protect: function(value) {
                       let userName=value;
                       var re = /^0?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[07])[0-9]{8}$/;
                       if (re.test(userName)) {
                            userName = userName.substr(0, 3) + '****' + userName.substr(7);
                        }
                  return userName;
                    //对字符串进行截取
                    //substr(0, 3)表示从0开始取三位
                    //substr(-3)表示从后面数第三位开始取到最后
                    // *号随便加 多长都行
                   // return value.substr(0, 3) + "*" + value.substr(-3);
                }
            
            },
        mounted() {
           
            this.getList();
        }
    }

</script>

<style scoped>

</style>