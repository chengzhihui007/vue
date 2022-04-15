<template>
    <section>        
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="策略介绍" name="first" >
                <div class="wrapper">
                    <div  class="head">策略介绍:</div>
                    <div class="divForm">
                        <el-form :model="addForm" :rules="rules" :inline="true" ref="addForm" style="center">
                            <el-row :gutter="10">
                                <el-col>
                                    <el-form-item label="简介：" prop='strategy_reason'> 
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
            <el-tab-pane label="高管资金条件设置" disabled name="second">
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
                        <el-form :model="xuanguForm" :rules="rules">
                            <!-- <el-form :model="xuanguForm" :rules="rules" ref="addForm"> -->
                            <el-form-item >
                                <el-button type="primary"  @click="goGgXuanGu()">选股范围</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(v, i) in banknameList">{{v.selection_condition}}
                            </span>
                            <el-form-item>
                                <el-button type="primary" @click="goGgJiBenMian()">基本面选股</el-button>
                            </el-form-item>
                            <div class="bankitem">
                                <span  prop="banknameList" style="padding:8px" v-for="(v, i) in seleDataList">{{v.parent_name}}<br>
                                    {{v.child_name}}{{v.result_content}}<br>
                                </span>
                            </div>
                            <el-form-item>
                                <el-button type="primary" @click="goGgTeSeZhiBiao()">特色指标选股</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(k, i) in teseList">{{k.selection_condition}}
                            </span>
                        </el-form>
                    </div>
                    <div class="head">选股结果:</div>
                    <el-table :data="addList" style="width: 120%">
                        <el-table-column prop="date" label="序号" width="260">
                            <template scope="num">
                                {{num.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="secName" label="股票名称" width="260">
                             <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="secCode" label="股票代码" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secCode }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upDown" label="涨跌幅" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.upDown }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="presentPrice" label="现价" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.presentPrice }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="executiveFunds"  label="高管资金" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.executiveFunds }}</div>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total></el-pagination>

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
                        <el-table-column prop="operation_con" label="操作内容" width="310">
                            <template scope="scope">
                                <div class="deleted-text"  v-html="scope.row.operation_con"></div>
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
            <el-tab-pane label="龙虎资金条件设置" disabled name='third'>
                <div class="wrapper">
                    <!-- <div v-if="this.banknameList.length==0 && this.seleDataList.length==0 && this.teseList.length==0">
                        <div class="head">选股条件:
                            <el-button type="primary" disabled>立即执行</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="head">选股条件:
                            <el-button type="primary" @click="goLongHuImplementation()">立即执行</el-button>
                        </div>
                    </div> -->
                    <div class="head">选股条件:
                        <el-button type="primary" :loading="loading" @click="goLongHuImplementation()">立即执行</el-button>
                    </div>
                    <div class="xuandiv">
                        <el-form :model="xuanguForm" :rules="rules">
                            <!-- <el-form :model="xuanguForm" :rules="rules" ref="addForm"> -->
                            <el-form-item >
                                <el-button type="primary" @click="goLHXuanGu()">选股范围</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(v, i) in banknameList">{{v.selection_condition}}
                            </span>
                            <el-form-item>
                                <el-button type="primary" @click="goLHJiBenMian()">基本面选股</el-button>
                            </el-form-item>
                            <div class="bankitem">
                                <span  prop="banknameList" style="padding:8px" v-for="(v, i) in seleDataList">{{v.parent_name}}<br>
                                    {{v.child_name}}{{v.result_content}}<br>
                                </span>
                            </div>
                            <el-form-item>
                                <el-button type="primary" @click="goLHTeSeZhiBiao()">特色指标选股</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(k, i) in teseList">{{k.selection_condition}}
                            </span>
                        </el-form>
                    </div>
                    <div class="head">选股结果:</div>
                    <el-table :data="longhuList" style="width: 120%">
                        <el-table-column prop="date" label="序号" width="260">
                            <template scope="num">
                                {{num.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="secName" label="股票名称" width="260">
                             <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="secCode" label="股票代码" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secCode }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upDown" label="涨跌幅" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.upDown }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="presentPrice" label="现价" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.presentPrice }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="seatFouds"  label="席位资金" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.seatFouds }}</div>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total1></el-pagination>

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
                        <el-table-column prop="operation_con" label="操作内容" width="310">
                            <template scope="scope">
                                <div class="deleted-text"  v-html="scope.row.operation_con"></div>
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
            <el-tab-pane label="主力资金条件设置" disabled name='four'>
                <div class="wrapper">
                    <!-- <div v-if="this.banknameList.length==0 && this.seleDataList.length==0 && this.teseList.length==0">
                        <div class="head">选股条件:
                            <el-button type="primary" disabled @click="goZhuLiImplementation()">立即执行</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="head">选股条件:
                            <el-button type="primary" @click="goZhuLiImplementation()">立即执行</el-button>
                        </div>
                    </div> -->
                    <div class="head">选股条件:
                        <el-button type="primary" :loading="loading" @click="goZhuLiImplementation()">立即执行</el-button>
                    </div>
                    <div class="xuandiv">
                        <el-form :model="xuanguForm" :rules="rules" ref="xuanguForm">
                            <el-form-item >
                                <el-button type="primary" @click="goZLXuanGu()">选股范围</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(v, i) in banknameList">{{v.selection_condition}}
                            </span>
                            <el-form-item>
                                <el-button type="primary" @click="goZLJiBenMian()">基本面选股</el-button>
                            </el-form-item>
                            <div class="bankitem">
                                <span  prop="banknameList" style="padding:8px" v-for="(v, i) in seleDataList">{{v.parent_name}}<br>
                                    {{v.child_name}}{{v.result_content}}<br>
                                </span>
                            </div>
                            <el-form-item>
                                <el-button type="primary" @click="goZLTeSeZhiBiao()">特色指标选股</el-button>
                            </el-form-item>
                            <span  prop="banknameList" style="padding:8px" v-for="(k, i) in teseList">{{k.selection_condition}}
                            </span>
                        </el-form>
                    </div>
                    <div class="head">选股结果:</div>
                    <el-table :data="zhuliList" style="width: 120%">
                        <el-table-column prop="date" label="序号" width="260">
                            <template scope="num">
                               {{num.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="secName" label="股票名称" width="260">
                             <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="secCode" label="股票代码" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.secCode }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upDown" label="涨跌幅" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.upDown }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="presentPrice" label="现价" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.presentPrice }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="seatFouds"  label="大单资金" width="260">
                            <template scope="scope">
                                <div class="deleted-text">{{ scope.row.daDanFouds }}</div>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size=this.size layout="total, prev, pager, next, jumper" :total=this.total2></el-pagination>

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
                        <el-table-column prop="operation_con" label="操作内容" width="310">
                            <template scope="scope">
                                <div class="deleted-text"  v-html="scope.row.operation_con"></div>
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
            // activeName: "first",
            // addForm:{
            //     date:'',
            //     name:'',
            //     address:''
            // },
            loading:false,
            value:'',
            page: 0,
            size:10,
            total:0,
            total1:0,
            total2:0,
            currentPage: 1,
            id:'',
            idens:'1',
            flag:'1',
            aa:'0',//判断是否点击立即执行
            type:false,
            dialogVisible:false,
            strReason:'',
            isLable:'',
            banknameList:[],
            stockList:[],
            teseList:[],
            seleDataList:[],
            logList:[],
            strategy_flag:'',
            styleList: [
                ''
            ],
            longhuList:[],
            zhuliList:[],
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
                    {validator:(rule, value, callback)=>{
                            if(!value.trim()){
                                callback(new Error("策略介绍不能为空字符串"))
                            }else
                            {callback()}
                        },trigger: 'blur'},
                    {max: 200, message: '策略简介不能超过200个汉字', trigger: 'blur'}
                ],
            },
            requestCount: 0,
            titleList: {
                'first': '',
                'second': '高管资金条件设置',
                'third': '龙虎资金条件设置',
                'four': '主力资金条件设置'
            },
            isall: 0,
            statu:'',
        };
    },
    watch: {
        activeName(val) {
            this.initData();
        },
    },
    methods:{
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
        // addStyle() {
        //     this.styleList.push('')
        //     // alert(this.styleList.length)
        //     if(this.styleList.length >5){
        //          this.$message.error('策略风格最多只能添加5次');
        //     }
        // },
        handleClick(tab, event) {
            this.isLable = tab.label
            this.$router.push({query: {tab: this.activeName}});
            if(tab.name=='second'){
                this.getGaoGuanZiJin();
            }
            if(tab.name=='third'){
                this.getLongHuZiJin();
            }
            if(tab.name=='four'){
                this.getZhuLiZiJin();
            }
        },
        handleCurrentChange(val) {
            this.page = val;
        },
        handleCurrentChange(val) {
            this.page = val-1;

            if(this.aa=='0'){//筛选前页码跳转
                let page=this.page
                let size=this.size
                this.getGaoGuanZiJin();
                this.getLongHuZiJin();
                this.getZhuLiZiJin();
            }else{//筛选后页码跳转
                let page=this.page
                let size=this.size
                this.goImplementation();
                this.goLongHuImplementation();
                this.goZhuLiImplementation();
            }
            

        },
        //添加策略
        async addSubmit(){
            this.$refs.addForm.validate(async (valid, obj) => {
                // console.log(obj);
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(async () => {
                        this.editLoading = true;
                        let result={};
                        this.addForm.strategy_flag=10;
                        //  var name = this.$router.currentRoute.name;
                        //  if(name=="高管资金"){
                        //      this.addForm.strategy_flag=10;
                        //  }else if(name=="龙虎资金"){
                        //      this.addForm.strategy_flag=11;
                        //  }else{
                        //      this.addForm.strategy_flag=12;
                        //  }
                        if(this.type==false){
                            var time = new Date().format('yyyy-MM-dd hh:mm:ss');
                            this.addForm.strategy_createTime=time;
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            this.addForm.operation_user = user.user_name
                            let para = Object.assign({}, this.addForm);
                            // para = Object.assign(para, {strategy_style: this.styleList.join('、')});
                            console.log(JSON.stringify(para));
                            result= await api.addCeLue(para);
                            console.log(JSON.stringify(result));
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
                            console.log(JSON.stringify(this.styleList));
                            this.addForm = Object.assign(this.addForm, {strategy_style: this.styleList.join('、')});
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
            // var para = {
            //     strategy_flag : '1'
            // }
            // alert(this.addForm.strategy_flag)
            this.strategy_flag = 10
            // alert(JSON.stringify(para))
            api.getStrategy(this.strategy_flag).then((res)=>{
            if(res.data != null){
                this.addForm = res.data
                this.idens='0'
                this.id = this.addForm.id
                this.strReason = this.addForm.strategy_reason
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
          if(this.$router.currentRoute.path==="/zijin"){
              if(this.isLable=='高管资金条件设置'){
                  var moudle_flag='16'
              }else if(this.isLable=='龙虎资金条件设置'){
                  var moudle_flag='17'
              }else if(this.isLable=='主力资金条件设置'){
                  var moudle_flag='18'
              }
          }
          result = await api.getCy4StockSelection(moudle_flag).then((res)=>{
            this.banknameList = res.data;
            
          });
          return result;
        //   alert(this.banknameList.length)
        },
        //获取基本面选股条件
        async getFunStock(){
          let result = {}
          if(this.$router.currentRoute.path==="/zijin"){
              if(this.isLable=='高管资金条件设置'){
                  var moudle_flag='16'
              }else if(this.isLable=='龙虎资金条件设置'){
                  var moudle_flag='17'
              }else if(this.isLable=='主力资金条件设置'){
                  var moudle_flag='18'
              }
          }
          result =  await api.getCy4FundamentalStockSelection(moudle_flag).then((res)=>{
            this.seleDataList = res.data
            // this.getCharStock()
          });
        
         
        },
        //获取特色指标选股条件
        async getCharStock(){
            // alert(123)
          let result = {}
          if(this.$router.currentRoute.path==="/zijin"){
              if(this.isLable=='高管资金条件设置'){
                  var moudle_flag='16'
              }else if(this.isLable=='龙虎资金条件设置'){
                  var moudle_flag='17'
              }else if(this.isLable=='主力资金条件设置'){
                  var moudle_flag='18'
              }
          }
          result = await api.getCy4CharacteristicStock(moudle_flag).then((res)=>{
            this.teseList = res.data
            
          });
          return result;
        },
        goGgXuanGu(){
            var pathName = this.$router.currentRoute;
            // console.log(pathName);
            // alert(this.isLable)
            for(var i=0;i<this.banknameList.length;i++){
                let stockSel = {}
                stockSel.name = this.banknameList[i].selection_condition
                stockSel.close = this.banknameList[i].close
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/Ggxuangufanwei',query:{banknameList:this.stockList,isLable:this.isLable}})
        },
        goLHXuanGu(){
            var pathName = this.$router.currentRoute;
            // console.log(pathName);
            for(var i=0;i<this.banknameList.length;i++){
                let stockSel = {}
                stockSel.name = this.banknameList[i].selection_condition
                stockSel.close = this.banknameList[i].close
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/LHxuangufanwei',query:{banknameList:this.stockList,isLable:this.isLable}})
        },
        goZLXuanGu(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.banknameList.length;i++){
                let stockSel = {}
                stockSel.name = this.banknameList[i].selection_condition
                stockSel.close = this.banknameList[i].close
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/ZLxuangufanwei',query:{banknameList:this.stockList,isLable:this.isLable}})
        },
        goGgJiBenMian(){
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
            console.log(this.stockList);
            this.$router.push({path:'/rdztgaoguan/Ggjibenmianxuangu',query:{seleData:this.stockList,isLable:this.isLable}})
        },
        goLHJiBenMian(){
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
            console.log(this.stockList);
            this.$router.push({path:'/rdztgaoguan/LHjibenmianxuangu',query:{seleData:this.stockList,isLable:this.isLable}})
        },
        goZLJiBenMian(){
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
            console.log(this.stockList);
            this.$router.push({path:'/rdztgaoguan/ZLjibenmianxuangu',query:{seleData:this.stockList,isLable:this.isLable}})
        },
        goGgTeSeZhiBiao(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.teseList.length;i++){
                let stockSel = {}
                stockSel.name = this.teseList[i].selection_condition
                stockSel.radio = this.teseList[i].satisfaction_mode
                stockSel.radio1 = this.teseList[i].contain_ST
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/Ggtesezhibiaoxuanxu',query:{teseList:this.stockList,isLable:this.isLable}})
        
        //   this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu',query:{teseList:this.stockList}})
        },
        goLHTeSeZhiBiao(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.teseList.length;i++){
                let stockSel = {}
                stockSel.name = this.teseList[i].selection_condition
                stockSel.radio = this.teseList[i].satisfaction_mode
                stockSel.radio1 = this.teseList[i].contain_ST
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/LHtesezhibiaoxuanxu',query:{teseList:this.stockList,isLable:this.isLable}})
        
        //   this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu',query:{teseList:this.stockList}})
        },
        goZLTeSeZhiBiao(){
            var pathName = this.$router.currentRoute;
            for(var i=0;i<this.teseList.length;i++){
                let stockSel = {}
                stockSel.name = this.teseList[i].selection_condition
                stockSel.radio = this.teseList[i].satisfaction_mode
                stockSel.radio1 = this.teseList[i].contain_ST
                this.stockList.push(stockSel)
            }
            this.$router.push({path:'/rdztgaoguan/ZLtesezhibiaoxuanxu',query:{teseList:this.stockList,isLable:this.isLable}})
        
        //   this.$router.push({path:'/rdztgcz/tesezhibiaoxuanxu',query:{teseList:this.stockList}})
        },
        //今日操作日志
        todayLog(){
            let result = {}
            // var pathName = this.$router.currentRoute;
            // console.log(pathName);
            
            if(this.$router.currentRoute.path==="/zijin"){
                if(this.isLable=='高管资金条件设置'){
                    // alert(13)
                    var moudle_flag='16'
                }else if(this.isLable=='龙虎资金条件设置'){
                    var moudle_flag='17'
                }else if(this.isLable=='主力资金条件设置'){
                    var moudle_flag='18'
                }
            }
            // alert(moudle_flag)
            result = api.getOperationLog(moudle_flag).then((res)=>{
                // alert(JSON.stringify(res.data));
                this.logList = res.data
            });
            // }
        },
        goQuanBuRiZhi(){
            if(this.$router.currentRoute.path==="/zijin"){
                if(this.isLable=='高管资金条件设置'){
                    this.$router.push({path:'/rdztgaoguan/Ggquanburizhi',query:{isLable:this.isLable}})
                }else if(this.isLable=='龙虎资金条件设置'){
                    this.$router.push({path:'/rdztgaoguan/LHquanburizhi',query:{isLable:this.isLable}})
                }else if(this.isLable=='主力资金条件设置'){
                    this.$router.push({path:'/rdztgaoguan/ZLquanburizhi',query:{isLable:this.isLable}})
                }
            }
        },
        quanburizhi(){
            this.$router.push({path:'/rdztgaoguan/quanburizhi'});
        },
       //获取高管资金待选结果
        getGaoGuanZiJin(){
            // this.getFunStock();
            // alert(JSON.stringify(this.seleDataList))
            let satisfaction_mode_jbm = '' //基本面中是否全部满足
            let contain_ST_jbm = '' //基本面中是佛包含ST
            let satisfaction_mode_tszb = '' //特色指标是否全部满足
            let contain_ST_tszb = ''
            let zhixingList=[]
            let page=this.page
            let size=this.size
       
            if(this.activeName == 'second'){
                if(this.statu == 0){
                    var moudle_flag = "18"
                    api.deleJieDian(moudle_flag);
                    // this.sign = '0'
                    var iden = '0'//查全部
                    api.getGaoGuanZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.addList = res.data.content
                        this.total = res.data.totalElements
                    });
                }else{
                    var iden = '2'//查结果表
                    api.getGaoGuanZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.addList = res.data.content
                        this.total = res.data.totalElements
                    });
                }
                
            }
            
        },
        //获取龙虎资金待选结果
        getLongHuZiJin(){
            let satisfaction_mode_jbm = '' //基本面中是否全部满足
            let contain_ST_jbm = '' //基本面中是佛包含ST
            let satisfaction_mode_tszb = '' //特色指标是否全部满足
            let contain_ST_tszb = ''
            let zhixingList=[]
            let page=this.page
            let size=this.size
            if(this.activeName == 'third'){
                if(this.statu == 0){
                    var moudle_flag = "19"
                    api.deleJieDian(moudle_flag);
                    // this.sign = '0'
                    var iden = '0'//查全部
                    api.getLongHuZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.longhuList = res.data.content
                        this.total1 = res.data.totalElements
                    });
                }else{
                    var iden = '2'//查结果表
                    api.getLongHuZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.longhuList = res.data.content
                        this.total1 = res.data.totalElements
                    });
                }
            }
        },
        //获取主力资金待选结果
        getZhuLiZiJin(){
            let satisfaction_mode_jbm = '' //基本面中是否全部满足
            let contain_ST_jbm = '' //基本面中是佛包含ST
            let satisfaction_mode_tszb = '' //特色指标是否全部满足
            let contain_ST_tszb = ''
            let zhixingList=[]
            let page=this.page
            let size=this.size
            if(this.activeName == 'four'){
                // alert(this.banknameList.length);
                // alert(this.seleDataList.length);
                // alert(this.teseList.length);
                if(this.statu == 0){
                    var moudle_flag = "20"
                    api.deleJieDian(moudle_flag);
                    // this.sign = '0'
                    var iden = '0'//查全部
                    api.getZhuLiZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.zhuliList = res.data.content
                        this.total2 = res.data.totalElements
                    });
                }else{
                    var iden = '2'//查结果表
                    api.getZhuLiZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
                        // console.log(JSON.stringify(res))
                        this.zhuliList = res.data.content
                        this.total2 = res.data.totalElements
                    });
                }
            }
        },
        initData() {
            // this.requestCount = 3;
            // this.getFunStock().then(this.selectStockResult);
            // this.getStockSele().then(this.selectStockResult);
            // this.getCharStock().then(this.selectStockResult);
           
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
                        this.getGaoGuanZiJin();
                        this.getLongHuZiJin();
                        this.getZhuLiZiJin();
                    }) 
                })
            })
            this.todayLog();

        },
        // 选股结果
        // selectStockResult() {
        //     this.requestCount--;
        //     if (this.requestCount === 0) {
        //         // return;
        //         if(this.isLable=='高管资金条件设置'){
        //             this.goImplementation();
        //         }else if(this.isLable=='龙虎资金条件设置'){
        //             this.getLongHuZiJin();
        //         }else if(this.isLable=='主力资金条件设置'){
        //             this.getZhuLiZiJin();
        //         }
        //     }
        // },
        //高管资金添加条件后点击立即执行
      goImplementation(){
          this.loading = true
          this.addList = [];
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
          var contain_ST_jbm = '' //基本面中是佛包含ST
          var satisfaction_mode_tszb = '' //特色指标是否全部满足
          var contain_ST_tszb = '' //特色指标中是佛包含ST
          if(this.seleDataList.length>0){
              satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
              contain_ST_jbm = this.seleDataList[0].contain_ST
          }
          if(this.teseList.length>0){
              satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
              contain_ST_tszb = this.teseList[0].contain_ST
          }
          
        //    api.getGaoGuanZiJin(page,size,zhixingList).then((res)=>{
        //       this.addList = res.data[0].content
        //       this.total = res.data[0].totalElements
        //   });
            var iden = '1'
          api.getGaoGuanZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
              this.addList = res.data.content
              this.total = res.data.totalElements
              this.loading = false
          });
          this.aa = '0';
      },
      //龙虎资金添加条件后点击立即执行
      goLongHuImplementation(){
          this.loading = true
          this.longhuList = [];
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
          var contain_ST_jbm = '' //基本面中是佛包含ST
          var satisfaction_mode_tszb = '' //特色指标是否全部满足
          var contain_ST_tszb = '' //特色指标中是佛包含ST
          if(this.seleDataList.length>0){
              satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
              contain_ST_jbm = this.seleDataList[0].contain_ST
          }
          if(this.teseList.length>0){
              satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
              contain_ST_tszb = this.teseList[0].contain_ST
          }
        //    api.getLongHuZiJin(page,size,zhixingList).then((res)=>{
        //       this.longhuList = res.data[0].content
        //       this.total1 = res.data[0].totalElements
        //   });
        var iden = '1'
          api.getLongHuZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
              this.longhuList = res.data.content
              this.total1 = res.data.totalElements
              this.loading = false
          });
          this.aa = '0';
      },
      //主力资金添加条件后点击立即执行
      goZhuLiImplementation(){
          this.loading = true
          this.zhuliList = [];
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
          var contain_ST_jbm = '' //基本面中是佛包含ST
          var satisfaction_mode_tszb = '' //特色指标是否全部满足
          var contain_ST_tszb = '' //特色指标中是佛包含ST
          if(this.seleDataList.length>0){
              satisfaction_mode_jbm = this.seleDataList[0].satisfaction_mode
              contain_ST_jbm = this.seleDataList[0].contain_ST
          }
          if(this.teseList.length>0){
              satisfaction_mode_tszb = this.teseList[0].satisfaction_mode
              contain_ST_tszb = this.teseList[0].contain_ST
          }
        //    api.getLongHuZiJin(page,size,zhixingList).then((res)=>{
        //       this.longhuList = res.data[0].content
        //       this.total1 = res.data[0].totalElements
        //   });
        var iden = '1'
        
          api.getZhuLiZiJin(page,size,satisfaction_mode_jbm,contain_ST_jbm,satisfaction_mode_tszb,contain_ST_tszb,iden,zhixingList).then((res)=>{
              this.zhuliList = res.data.content
              this.total2 = res.data.totalElements
              this.loading = false
          });
          this.aa = '0';
      }

    },
    mounted(){
        var tab = this.$route.query.tab;
        if (!tab) {
            this.$router.replace({query: {tab: 'first'}});
        }
        this.isLable = this.titleList[tab];
        this.initData();
        // this.$router.path
        // this.getStockSele();
        this.getStrategy();
        this.todayLog();
        // this.getFunStock();
        // this.getXuanGuJieGuo();
        
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
