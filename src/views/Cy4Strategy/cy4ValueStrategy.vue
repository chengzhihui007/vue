<template>
    <section>        
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="策略名称" name="first">
                <div class="wrapper">
                    <div  class="head">策略介绍:</div>
                    <div class="divForm">
                        <el-form :model="addForm" :visible.sync=dialogVisible :rules="rules" :inline="true" ref="addForm" style="center">
                            <el-row :gutter="10">
                                <el-col>
                                    <el-form-item label="简介：" prop='strategy_reason' > 
                                        <el-input type="textarea" :rows="5" placeholder="请输入简介，不超过200个汉字" v-model="addForm.strategy_reason" :disabled="idens=='0'" :value="addForm.strategy_reason" style="width: 600px"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button v-show="flag==='2'" type="primary" @click="cancelSubmit()" >取消</el-button>
                        <el-button v-show="idens==='0'" type="primary" @click="editSubmit()" >编辑</el-button>
                        <el-button v-show="idens==='1'" type="primary" @click="addSubmit()" >保存</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="条件设置(暂缓开发)" disabled name="second">
                <div class="wrapper">
                    <!-- <div v-if="this.banknameList.length==0 && this.seleDataList.length==0 && this.teseList.length==0">
                        <div class="head">选股条件:
                            <el-button type="primary" disabled @click="goImplementation()">立即执行</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="head">选股条件:
                            <el-button type="primary" @click="goImplementation()">立即执行</el-button>
                        </div>
                    </div> -->
                    <div class="head">选股条件:
                        <el-button type="primary" :loading="loading" @click="goImplementation()">立即执行</el-button>
                    </div>
                    <div class="xuandiv">
                        <el-form :model="xuanguForm" :rules="rules" ref="xuanguForm">
                            <el-form-item >
                                <el-button type="primary"@click="goXuanGu()">选股范围</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(v, i) in banknameList">{{v.selection_condition}}
                            </span>
                            <el-form-item>
                                <el-button type="primary"@click="goJiBenMian()">基本面选股</el-button>
                            </el-form-item>
                            <div class="bankitem">
                                <span  prop="seleDataList" style="padding:8px" v-for="(v, i) in seleDataList">{{v.parent_name}}<br>
                                    {{v.child_name}}{{v.result_content}}<br>
                                </span>
                            </div>
                            <el-form-item>
                                <el-button type="primary" @click="goTeSeZhiBiao()">特色指标选股</el-button>
                            </el-form-item>
                             <span  prop="teseList" style="padding:8px" v-for="(k, i) in teseList">{{k.selection_condition}}
                            </span>
                        </el-form>
                    </div>
                    <div class="head">选股结果:</div>
                    <!-- <div v-if="$route.path === '/cy4ValueStrategy'">
                        <el-table :data="addList" style="width: 120%">
                    </div>
                    <div v-else="$route.path === '/cy4ValueStrategy1'">
                        <el-table :data="diguzhiList" style="width: 120%">
                    </div> -->
                    <el-table :data="addList" style="width: 120%">
                        <el-table-column prop="date" label="序号" width="160">
                            <template scope="num">
                                {{num.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="secName" label="股票名称" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="secCode" label="股票代码" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secCode }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="presentPrice" label="最新价" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.presentPrice }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upDown" label="涨跌幅" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.upDown }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="volume" label="成交量" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.volume }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="turnover" label="成交额" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.turnover }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="peRatio" label="市盈率（TTM）" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.peRatio }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pbRatio" label="市净率" width="160">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.pbRatio }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

                    <div class="head">今日操作日志:
                        <el-button type="primary" @click="goQuanBuRiZhi()">查看全部日志</el-button>
                    </div>
                    <el-table :data="logList" style="width: 120%" height="400">
                        <el-table-column prop="date" label="序号" width="310">
                            <template scope="num">
                                {{num.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_fun" label="操作功能" width="310">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.operation_fun }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_con" label="操作内容" width="310" >
                            <template scope="scope">
                                <div class="deleted-text" v-html="scope.row.operation_con" > </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_date" label="操作时间" width="310">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.operation_date }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_user" label="操作账号" width="310">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.operation_user }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import api from "../../api/api.js";
import '../../common/js/DateFormat';
import util from '../../common/js/util'
export default {
    data (){
        return {
            addForm:{},
            xuanguForm:{},
            activeName: this.$route.query.tab || 'first',
            loading:false,
            page: 0,
            page1: 0,
            page2: 0,
            page3: 0,
            page4: 0,
            page5: 0,
            page6: 0,
            page7: 0,
            size:10,
            total:0,
            currentPage: 1,
            aa:'0',//判断是否点击立即执行
            idens:'1',
            iden:'',
            flag:'1',
            id:'',
            type:false,
            strategy_flag:'',
            dialogVisible:false,
            strReason:'',
            banknameList:[],
            stockList:[],
            seleDataList:[],
            teseList:[],
            content:"",
            statu:'',
            logList:[],
             addList: [{
                date: '1',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '3',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '4',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
            }],
            rules:{
                strategy_reason: [   
                    {required: true, message: '请填写策略介绍', trigger: 'blur'},
                    {max: 200, message: '策略简介不能超过200个汉字', trigger: 'blur'}
                ]
            }
        };
    },
    watch: {
        "$route"() {
            var tab = this.$route.query.tab;
            this.activeName = tab || 'first';
            this.getStrategy();
            // this.getStockSele();
            // this.getFunStock();
            let a = this.getFunStock()
            let b = this.getStockSele();
            let c = this.getCharStock();
            a.then(res => {
                b.then(res => {
                    c.then(res => {
                        if(this.banknameList.length==0 && this.seleDataList.length==0 && this.teseList.length==0){
                            this.statu = 0
                        }else{
                            this.statu = 1
                        }
                        this.getXuanGuJieGuo();
                    }) 
                })
            })
            this.todayLog();
            this.addList=[];
            this.currentPage = 1
        },
        activeName(val) {
            this.$router.push({query: {tab: val}})
        }
    },
    methods:{
        handleClick(tab, event) {
        },
        // handleCurrentChange(val) {
        //     var pg = val;
        //     if(this.$route.path=='/cy4ValueStrategy'){
        //         this.page = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy1'){
        //         this.page1 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy2'){
        //         this.page2 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy3'){
        //         this.page3 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy4'){
        //         this.page4 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy5'){
        //         this.page5 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy6'){
        //         this.page6 = pg
        //     }else if(this.$route.path=='/cy4ValueStrategy7'){
        //         this.page7 = pg
        //     }
        // },
        handleCurrentChange(val) {
            // alert(val)
            var pages = val-1;
            if(this.aa=='0'){//筛选前页码跳转
                if(this.$route.path=='/cy4ValueStrategy'){
                    this.page = pages
                }else if(this.$route.path=='/cy4ValueStrategy1'){
                    this.page1 = pages
                }else if(this.$route.path=='/cy4ValueStrategy2'){
                    this.page2 = pages
                }else if(this.$route.path=='/cy4ValueStrategy3'){
                    this.page3 = pages
                }else if(this.$route.path=='/cy4ValueStrategy4'){
                    this.page4 = pages
                }else if(this.$route.path=='/cy4ValueStrategy5'){
                    this.page5 = pages
                }else if(this.$route.path=='/cy4ValueStrategy6'){
                    this.page6 = pages
                }else if(this.$route.path=='/cy4ValueStrategy7'){
                    this.page7 = pages
                }
                
                let size=this.size
                this.getXuanGuJieGuo();
            }else{//筛选后页码跳转
                // let page=this.page
                if(this.$route.path=='/cy4ValueStrategy'){
                    let page=this.page
                }else if(this.$route.path=='/cy4ValueStrategy1'){
                    let page=this.page1
                }else if(this.$route.path=='/cy4ValueStrategy2'){
                    let page=this.page2
                }else if(this.$route.path=='/cy4ValueStrategy3'){
                    let page=this.page3
                }else if(this.$route.path=='/cy4ValueStrategy4'){
                    let page=this.page4
                }else if(this.$route.path=='/cy4ValueStrategy5'){
                    let page=this.page5
                }else if(this.$route.path=='/cy4ValueStrategy6'){
                    let page=this.page6
                }else if(this.$route.path=='/cy4ValueStrategy7'){
                    let page=this.page7
                }
                let size=this.size
                this.goImplementation();
            }
        },
        //添加高成长策略
        async addSubmit(){
            this.$refs.addForm.validate(async (valid, obj) => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                        this.editLoading = true;
                        let result={};
                        var name = this.$router.currentRoute.name;
                        if(name=='高成长'){
                            this.addForm.strategy_flag=2;
                        }else if(name=='低估值'){
                            this.addForm.strategy_flag=3;
                        }else if(name=='高分红'){
                            this.addForm.strategy_flag=4;
                        }else if(name=='高盈利'){
                            this.addForm.strategy_flag=5;
                        }else if(name=='高送转'){
                            this.addForm.strategy_flag=6;
                        }else if(name=='股东增持'){
                            this.addForm.strategy_flag=7;
                        }else if(name=='业绩预增'){
                            this.addForm.strategy_flag=8;
                        }else{
                            this.addForm.strategy_flag=9;
                        }  
                        
                        if(this.type==false){
                            var time = new Date().format('yyyy-MM-dd hh:mm:ss');
                            this.addForm.strategy_createTime=time;
                            this.addForm.strategy_type=0;
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            this.addForm.operation_user = user.user_name
                            let para = Object.assign({}, this.addForm);
                            result= await api.addCeLue(para);
                            this.id = result.data
                            this.dialogVisible = false;
                            this.editLoading = false;
                            if(result.state){
                                this.idens='0'
                                this.strReason = this.addForm.strategy_reason
                                this.$message({message: '提交成功',type: 'success'});
                            }else{
                                this.$message.error('提交失败');
                            }
                        }else{
                            this.addForm.id = this.id
                            this.addForm.strategy_updateTime = new Date().format('yyyy-MM-dd hh:mm:ss');
                            result= await api.updateCeLue(this.addForm);
                            if(result.state){
                                this.idens='0'
                                this.flag='1'
                                this.strReason = this.addForm.strategy_reason
                                this.$message({message: '修改成功',type: 'success'});
                            }else{
                                this.$message.error('修改失败');
                            }
                        }
                        
                    });
                }
            });
        },
        //获取最新的策略介绍进行回显
        getStrategy(){
            var pathName = this.$router.currentRoute.path;
            if(pathName=='/cy4ValueStrategy'){
                this.strategy_flag = 2
            }else if(pathName=='/cy4ValueStrategy1'){
                this.strategy_flag = 3
            }else if(pathName=='/cy4ValueStrategy2'){
                this.strategy_flag = 4
            }else if(pathName=='/cy4ValueStrategy3'){
                this.strategy_flag = 5
            }else if(pathName=='/cy4ValueStrategy4'){
                this.strategy_flag = 6
            }else if(pathName=='/cy4ValueStrategy5'){
                this.strategy_flag = 7
            }else if(pathName=='/cy4ValueStrategy6'){
                this.strategy_flag = 8
            }else if(pathName=='/cy4ValueStrategy7'){
                this.strategy_flag = 9
            }
            api.getStrategy(this.strategy_flag).then((res)=>{
            if(res.data != null){
                this.addForm = res.data
                this.strReason = this.addForm.strategy_reason
                this.idens='0'
                this.id = this.addForm.id
            }else{
                this.addForm=[]
                this.idens='1'
            }
            
            });
        },
        editSubmit(){
            this.idens='1'
            this.flag='2'
            this.type=true
        },
        cancelSubmit(){
            this.$refs['addForm'].resetFields();
            
            this.addForm.strategy_reason = this.strReason
            this.idens='0'
            this.flag='1'
        },
        //获取选股范围条件
       async getStockSele(){
          let result = {}
          var pathName = this.$router.currentRoute;
          if(pathName.name=='高成长'){
              var moudle_flag='2'
          }else if(pathName.name=='低估值'){
              var moudle_flag='3'
          }else if(pathName.name=='高分红'){
              var moudle_flag='4'
          }else if(pathName.name=='高盈利'){
              var moudle_flag='5'
          }else if(pathName.name=='高送转'){
              var moudle_flag='6'
          }else if(pathName.name=='股东增持'){
              var moudle_flag='7'
          }else if(pathName.name=='业绩预增'){
              var moudle_flag='8'
          }else if(pathName.name=='白马绩优'){
              var moudle_flag='9'
          }
          result =await api.getCy4StockSelection(moudle_flag).then((res)=>{
            this.banknameList = res.data
          });
          return result;    
          
        },
        //获取基本面选股条件
       async getFunStock(){
          let result = {}
          var pathName = this.$router.currentRoute;
          if(pathName.name=='高成长'){
              var moudle_flag='2'
          }else if(pathName.name=='低估值'){
              var moudle_flag='3'
          }else if(pathName.name=='高分红'){
              var moudle_flag='4'
          }else if(pathName.name=='高盈利'){
              var moudle_flag='5'
          }else if(pathName.name=='高送转'){
              var moudle_flag='6'
          }else if(pathName.name=='股东增持'){
              var moudle_flag='7'
          }else if(pathName.name=='业绩预增'){
              var moudle_flag='8'
          }else if(pathName.name=='白马绩优'){
              var moudle_flag='9'
          }
            result =await api.getCy4FundamentalStockSelection(moudle_flag).then((res)=>{
            this.seleDataList = res.data
            this.getCharStock()
            });
          return result;
        },
        //获取特色指标选股条件
       async getCharStock(){
          let result = {}
          var pathName = this.$router.currentRoute;
          if(pathName.name=='高成长'){
              var moudle_flag='2'
          }else if(pathName.name=='低估值'){
              var moudle_flag='3'
          }else if(pathName.name=='高分红'){
              var moudle_flag='4'
          }else if(pathName.name=='高盈利'){
              var moudle_flag='5'
          }else if(pathName.name=='高送转'){
              var moudle_flag='6'
          }else if(pathName.name=='股东增持'){
              var moudle_flag='7'
          }else if(pathName.name=='业绩预增'){
              var moudle_flag='8'
          }else if(pathName.name=='白马绩优'){
              var moudle_flag='9'
          }
            result = await api.getCy4CharacteristicStock(moudle_flag).then((res)=>{
                this.teseList = res.data
            });
            return result;
        },
        goXuanGu(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.banknameList.length;i++){
                let stockSel = {}
                stockSel.name = this.banknameList[i].selection_condition
                stockSel.close = this.banknameList[i].close
                this.stockList.push(stockSel)
            }
            if(pathName.name=='高成长'){
                // var moudle_flag='2'
                this.$router.push({path:'/rdztgcz/xuangufanwei',query:{banknameList:this.stockList}})
            }else if(pathName.name=='低估值'){
                this.$router.push({path:'/rdztgcz/xuangufanwei1',query:{banknameList:this.stockList}})
            }else if(pathName.name=='高分红'){
                this.$router.push({path:'/rdztgcz/xuangufanwei2',query:{banknameList:this.stockList}})
            }else if(pathName.name=='高盈利'){
                this.$router.push({path:'/rdztgcz/xuangufanwei3',query:{banknameList:this.stockList}})
            }else if(pathName.name=='高送转'){
                this.$router.push({path:'/rdztgcz/xuangufanwei4',query:{banknameList:this.stockList}})
            }else if(pathName.name=='股东增持'){
                this.$router.push({path:'/rdztgcz/xuangufanwei5',query:{banknameList:this.stockList}})
            }else if(pathName.name=='业绩预增'){
                this.$router.push({path:'/rdztgcz/xuangufanwei6',query:{banknameList:this.stockList}})
            }else if(pathName.name=='白马绩优'){
                this.$router.push({path:'/rdztgcz/xuangufanwei7',query:{banknameList:this.stockList}})
            }
            // this.$router.push({path:'/rdztgcz/xuangufanwei',query:{banknameList:this.stockList}})
        },
        goJiBenMian(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.seleDataList.length;i++){
                let stockSel = {}
                stockSel.parentName = this.seleDataList[i].parent_name
                stockSel.name = this.seleDataList[i].child_name
                stockSel.dyVal = this.seleDataList[i].calculation_symbol
                stockSel.jieyu = this.seleDataList[i].fill_data_left
                stockSel.jieyu1 = this.seleDataList[i].fill_data_right
                stockSel.bgq = this.seleDataList[i].report_period
                stockSel.radio = this.seleDataList[i].satisfaction_mode
                stockSel.radio1 = this.seleDataList[i].contain_ST
                stockSel.numVal = this.seleDataList[i].fill_data
                stockSel.content = this.seleDataList[i].result_content
                this.stockList.push(stockSel)
            }
            if(pathName.name=='高成长'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu',query:{seleData:this.stockList}})
            }else if(pathName.name=='低估值'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu1',query:{seleData:this.stockList}})
            }else if(pathName.name=='高分红'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu2',query:{seleData:this.stockList}})
            }else if(pathName.name=='高盈利'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu3',query:{seleData:this.stockList}})
            }else if(pathName.name=='高送转'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu4',query:{seleData:this.stockList}})
            }else if(pathName.name=='股东增持'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu5',query:{seleData:this.stockList}})
            }else if(pathName.name=='业绩预增'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu6',query:{seleData:this.stockList}})
            }else if(pathName.name=='白马绩优'){
                this.$router.push({path:'/rdztgcz/jibenmianxuangu7',query:{seleData:this.stockList}})
            }
        },
        goTeSeZhiBiao(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.teseList.length;i++){
                let stockSel = {}
                stockSel.name = this.teseList[i].selection_condition
                stockSel.radio = this.teseList[i].satisfaction_mode
                stockSel.radio1 = this.teseList[i].contain_ST
                this.stockList.push(stockSel)
            }
            if(pathName.name=='高成长'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu',query:{teseList:this.stockList}})
            }else if(pathName.name=='低估值'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu1',query:{teseList:this.stockList}})
            }else if(pathName.name=='高分红'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu2',query:{teseList:this.stockList}})
            }else if(pathName.name=='高盈利'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu3',query:{teseList:this.stockList}})
            }else if(pathName.name=='高送转'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu4',query:{teseList:this.stockList}})
            }else if(pathName.name=='股东增持'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu5',query:{teseList:this.stockList}})
            }else if(pathName.name=='业绩预增'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu6',query:{teseList:this.stockList}})
            }else if(pathName.name=='白马绩优'){
                this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu7',query:{teseList:this.stockList}})
            }
        },
        //今日操作日志
        todayLog(){
            let result = {}
            var pathName = this.$router.currentRoute;
            if(pathName.name=='高成长'){
                var moudle_flag='2'
            }else if(pathName.name=='低估值'){
                var moudle_flag='3'
            }else if(pathName.name=='高分红'){
                var moudle_flag='4'
            }else if(pathName.name=='高盈利'){
                var moudle_flag='5'
            }else if(pathName.name=='高送转'){
                var moudle_flag='6'
            }else if(pathName.name=='股东增持'){
                var moudle_flag='7'
            }else if(pathName.name=='业绩预增'){
                var moudle_flag='8'
            }else if(pathName.name=='白马绩优'){
                var moudle_flag='9'
            }
            result = api.getOperationLog(moudle_flag).then((res)=>{
                console.log(JSON.stringify(res));
                
                this.logList = res.data
            });
            // }
        },
        goQuanBuRiZhi(){
            var pathName = this.$router.currentRoute;
            if(pathName.name=='高成长'){
                // var moudle_flag='2'
                this.$router.push({path:'/rdztgcz/quanburizhi'})
            }else if(pathName.name=='低估值'){
                this.$router.push({path:'/rdztgcz/quanburizhi1'})
            }else if(pathName.name=='高分红'){
                this.$router.push({path:'/rdztgcz/quanburizhi2'})
            }else if(pathName.name=='高盈利'){
                this.$router.push({path:'/rdztgcz/quanburizhi3'})
            }else if(pathName.name=='高送转'){
                this.$router.push({path:'/rdztgcz/quanburizhi4'})
            }else if(pathName.name=='股东增持'){
                this.$router.push({path:'/rdztgcz/quanburizhi5'})
            }else if(pathName.name=='业绩预增'){
                this.$router.push({path:'/rdztgcz/quanburizhi6'})
            }else if(pathName.name=='白马绩优'){
                this.$router.push({path:'/rdztgcz/quanburizhi7'})
            }
        },
        
        //获取选股结果
       getXuanGuJieGuo(){
            var pathName = this.$router.currentRoute;
            var zhixingList=[]
            // let  page=this.page
            // let  size =this.size
            let satisfaction_mode_jbm = '' //基本面中是否全部满足
            let contain_ST_jbm = '' //基本面中是否包含ST
            let satisfaction_mode_tszb = '' //特色指标是否全部满足
            let contain_ST_tszb = ''
            let flag = 0
            if(this.$route.path=='/cy4ValueStrategy'){
                if(this.$route.query.tab == 'second'){
                //     let path = "/ydhxgtest/SelectCondition/gaochengzhang/"
                //     ydc.sync().ref(path).orderByKey().get(d=>{
                //         if(d.success){
                //             zhixingList = d.nodeContent.list.replace(/\'/g, "");
                //             page = this.page;
                //             size = this.size;
                //             satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                //             contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                //             satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                //             contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                //             // alert(zhixingList)
                //             api.getGaoChengZhang(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList,flag).then((res)=>{
                //                 this.addList = res.data.content
                //                 this.total = res.data.totalElements
                //             });
                //         }else{
                //             api.getGaoChengZhang(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList,flag).then((res)=>{
                //                 this.addList = res.data.content
                //                 this.total = res.data.totalElements
                //             });
                //         }
                //     })
                // }
                    
                    if(this.statu == 0){
                        var moudle_flag = "4"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        this.iden = '0'//查全部
                        api.getGaoChengZhang(this.page,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,this.iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        this.iden = '2'//查结果表
                        api.getGaoChengZhang(this.page,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,this.iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy1'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/diguzhi/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getDiGuZhi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getDiGuZhi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                   if(this.statu == 0){
                        var moudle_flag = "5"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getDiGuZhi(this.page1,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getDiGuZhi(this.page1,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy2'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/gaofenhong/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getGaoFenHong(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getGaoFenHong(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    if(this.statu == 0){
                        var moudle_flag = "6"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getGaoFenHong(this.page2,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getGaoFenHong(this.page2,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy3'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/gaoyingli/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getGaoYingLi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getGaoYingLi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    if(this.statu == 0){
                        var moudle_flag = "7"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getGaoYingLi(this.page3,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getGaoYingLi(this.page3,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy4'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/xianjinniu/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getGaoSongZhuan(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getGaoSongZhuan(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    if(this.statu == 0){
                        var moudle_flag = "8"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getGaoSongZhuan(this.page4,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getGaoSongZhuan(this.page4,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy5'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/zengchihuigou/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getZengChiHuiGou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getZengChiHuiGou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    
                    // alert(this.page5)
                    if(this.statu == 0){
                        var moudle_flag = "9"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        
                        api.getZengChiHuiGou(this.page5,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getZengChiHuiGou(this.page5,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy6'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/gaoyunying/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getGaoYunYing(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getGaoYunYing(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    if(this.statu == 0){
                        var moudle_flag = "10"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getGaoYunYing(this.page6,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getGaoYunYing(this.page6,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }else if(this.$route.path=='/cy4ValueStrategy7'){
                if(this.$route.query.tab == 'second'){
                    // let path = "/ydhxgtest/SelectCondition/baimajiyou/"
                    // ydc.sync().ref(path).orderByKey().get(d=>{
                    //     if(d.success){
                    //         zhixingList = d.nodeContent.list.replace(/\'/g, "");
                    //         page = this.page;
                    //         size = this.size;
                    //         satisfaction_mode_jbm = d.nodeContent.satisfaction_mode_jbm;
                    //         contain_ST_jbm = d.nodeContent.contain_ST_jbm;
                    //         satisfaction_mode_tszb = d.nodeContent.satisfaction_mode_tszb;
                    //         contain_ST_tszb = d.nodeContent.contain_ST_tszb;
                    //         api.getBaiMaJiYou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }else{
                    //         api.getBaiMaJiYou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,zhixingList).then((res)=>{
                    //             this.addList = res.data.content
                    //             this.total = res.data.totalElements
                    //         });
                    //     }
                    // })
                    if(this.statu == 0){
                        var moudle_flag = "11"
                        api.deleJieDian(moudle_flag);
                        // this.sign = '0'
                        var iden = '0'//查全部
                        api.getBaiMaJiYou(this.page7,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }else{
                        var iden = '2'//查结果表
                        api.getBaiMaJiYou(this.page7,this.size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                            this.addList = res.data.content
                            this.total = res.data.totalElements
                        });
                    }
                }
            }

     },
        //立即执行
        goImplementation(){
            
            this.addList = [];
            if(this.$route.path=='/cy4ValueStrategy'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  var iden = ''
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getGaoChengZhang(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                  var iden = '1';
                  api.getGaoChengZhang(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });   
                this.aa = '0';
                
            }else if(this.$route.path=='/cy4ValueStrategy1'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getDiGuZhi(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                this.iden = '1';
                  api.getDiGuZhi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,this.iden,zhixingList).then((res)=>{
                    //   alert(JSON.stringify(res))
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                  this.iden = '2'
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy2'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getGaoFenHong(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                var iden = '1';
                  api.getGaoFenHong(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy3'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getGaoYingLi(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                var iden = '1';
                  api.getGaoYingLi(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy4'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getGaoSongZhuan(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                var iden = '1';
                  api.getGaoSongZhuan(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy5'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                //   xuangu.bkmc = xuangufanwei
                //   zhixingList.push(xuangu)
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getZengChiHuiGou(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                // alert(JSON.stringify(zhixingList))
                var iden = '1';
                  api.getZengChiHuiGou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy6'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                        zhixingList.push(xuangu)
                  }
                 
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                        zhixingList.push(tese)
                  }
                  
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getGaoYunYing(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                var iden = '1';
                  api.getGaoYunYing(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }else if(this.$route.path=='/cy4ValueStrategy7'){
                this.loading = true
                let  page=this.page
                let  size =this.size
                let zhixingList=[]
                
                for(var i=0;i<this.seleDataList.length;i++){
                    if(this.seleDataList[i].child_name == '总股本'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_shares = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_shares = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最新价格'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.latest_price = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.latest_price = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通A股'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_shares_float_ashare = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通比例'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.float_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.float_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东总数'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.holder_num = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.holder_num = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务收入'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.revenue = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.revenue = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产总计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_assets = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_assets = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股东权益合计'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_quity_atsopc = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股公积金'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.mggjj = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.mggjj = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '投资收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.invest_income = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.invest_income = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股净资产'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.net_profit_per_share = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_per_share = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股收益'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.basic_eps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.basic_eps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '每股现金流'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                        zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.operate_cash_flow_ps = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '成交量'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.trans_vol = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.trans_vol = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净利润率（%）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.net_profit_margin = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '最近2年净利润率'){
                        let zhixing={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.net_profit_margin_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.net_profit_margin_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '过去2年净资产收益率'){
                        let zhixing={}
                        let zhixing1={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data //上上年
                        }else{
                            zhixing.operator = '&'
                            zhixing1.operator = '&'
                            zhixing.total_wgt_1 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                            zhixing.total_wgt_2 = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '主营业务利润'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.op = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.op = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.op = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '营业收入增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.total_revenue_yoy_sq = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '加权净资产收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.wgt_avg_roe = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '资产负债比率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.asset_liab_ratio = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '应收账款周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.account_receivable_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '存货周转次数'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.inventory_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流动资产周转率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                            zhixing.operator = '>'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='小于'){
                            zhixing.operator = '<'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else if(this.seleDataList[i].calculation_symbol=='等于'){
                            zhixing.operator = '='
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                        }else{
                            zhixing.operator = '&'
                            zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                        }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总资产周转率'){
                            let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_capital_turnover = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年营业收入增长率'){
                        let zhixing={}
                        let zhixing1={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.revenue_one = this.seleDataList[i].fill_data //上年
                                zhixing.revenue_two = this.seleDataList[i].fill_data //上上年
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.revenue_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上年
                                zhixing1.revenue_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right //上上年
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    if(this.seleDataList[i].child_name == '股价涨跌幅'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.up_down = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.up_down = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市盈率（动）'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.current_asset_turnover_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '总市值'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.total_market_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.total_market_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '流通市值'){
                        let zhixing={}
                            if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '二级行业平均市盈率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.virculation_value_avg = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '市净率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_market_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_market_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '股利收益率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.dividend_yield = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.dividend_yield = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '净收益增长率'){
                        let zhixing={}
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing.net_income_growth_rate = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                            zhixingList.push(zhixing)
                    }
                    if(this.seleDataList[i].child_name == '连续2年净收益增长率'){
                        let zhixing={}
                        let zhixing1={}
                        
                        if(this.seleDataList[i].calculation_symbol=='大于'){
                                zhixing.operator = '>'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='小于'){
                                zhixing.operator = '<'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else if(this.seleDataList[i].calculation_symbol=='等于'){
                                zhixing.operator = '='
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data
                                zhixing.net_income_growth_rate_two = this.seleDataList[i].fill_data
                            }else{
                                zhixing.operator = '&'
                                zhixing1.operator = '&'
                                zhixing.net_income_growth_rate_one = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                                zhixing1.net_income_growth_rate_two = this.seleDataList[i].fill_data_left+','+this.seleDataList[i].fill_data_right
                            }
                        zhixingList.push(zhixing)
                        zhixingList.push(zhixing1)
                    }
                    
                    //三年营业收入复合增速、三年归母净利润复合增速
                }
                  //获取选股范围(板块名称)放到zhixingList中
                  var xuangufanwei=''
                  let xuangu={}
                  for(var i=0;i<this.banknameList.length;i++){
                      if(i<this.banknameList.length-1){
                          xuangufanwei += this.banknameList[i].selection_condition+','
                      }else{
                          xuangufanwei += this.banknameList[i].selection_condition
                      }
                  }
                  if(this.banknameList.length>0){
                      xuangu.bkmc = xuangufanwei
                      zhixingList.push(xuangu)
                  }
                  //获取特色指标条件放到zhixingList中
                  var tesezhibiao=''
                  let tese={}
                  for(var i=0;i<this.teseList.length;i++){
                      if(i<this.teseList.length-1){
                          tesezhibiao += this.teseList[i].selection_condition+','
                      }else{
                          tesezhibiao += this.teseList[i].selection_condition
                      }
                  }
                  if(this.teseList.length>0){
                      tese.tszb = tesezhibiao
                      zhixingList.push(tese)
                  }
                //   alert(JSON.stringify(zhixingList))
                  var satisfaction_mode_jbm = '' //基本面中是否全部满足
                  var contain_ST_jbm = '' //基本面中是否包含ST
                  var satisfaction_mode_tszb = '' //特色指标是否全部满足
                  var contain_ST_tszb = '' //特色指标中是否包含ST
                  if(this.seleDataList.length>0){
                      satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
                      contain_ST_jbm = this.seleDataList[0].contain_ST
                  }
                  if(this.teseList.length>0){
                      satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
                      contain_ST_tszb = this.teseList[0].contain_ST
                  }
                // api.getBaiMaJiYou(page,size,zhixingList).then((res)=>{
                //     this.addList = res.data[0].content
                //     this.total = res.data[0].totalElements
                // });
                var iden = '1';
                  api.getBaiMaJiYou(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                    //   alert(JSON.stringify(res))
                      this.addList = res.data.content
                      this.total = res.data.totalElements
                      this.loading = false
                  });
                this.aa = '0';
            }
            // this.loading = false
        }
    },
    mounted(){
        this.getStrategy();
        let a = this.getFunStock()
        let b = this.getStockSele();
        let c = this.getCharStock();
        a.then(res => {
            b.then(res => {
                c.then(res => {
                    if(this.banknameList.length==0 && this.seleDataList.length==0 && this.teseList.length==0){
                        this.statu = 0
                    }else{
                        this.statu = 1
                    }
                    this.getXuanGuJieGuo();
                }) 
            })
        })
        this.todayLog();
        this.addList=[];
        
        var pathName = this.$router.currentRoute;
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
    .dialog-footer {
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
    }
    .el-pagination{
        text-align: center;
    }
    .bankitem{
        /* display: flex;
        flex-direction: row; */
    }
    .bankitem span{
       display: inline-block;
        margin-right: 20px;
        margin-bottom: 10px;
        background: #333;
        color: #FFF;
    }
</style>
