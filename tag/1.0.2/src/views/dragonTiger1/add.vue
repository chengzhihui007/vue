<template>
    <section>        
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="今日荐股" name="0" :disabled="flag==='1'">
                <div class="wrapper">
                    <div  class="head">基本信息</div>
                    <el-form :model="editForm" :rules="rules" :inline="true" ref="editForm">
                        <el-row :gutter="10">
                            <!-- <el-col :span="6">
                                <el-form-item label="股票名称：" prop="sec_name">
                                    <el-select :disabled="editForm.flag =='0'" v-model="editForm.sec_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                                        :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:180px;">
                                        <el-option v-for="item in select_options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="股票代码：" prop='sec_code'>
                                    <el-input :disabled="editForm.flag =='0'" v-model="editForm.sec_code" placeholder="股票代码" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="6">
                                <el-form-item label="股票代码：" prop='sec_code'> 
                                    <el-input :disabled="editForm.flag =='0'" v-model="editForm.sec_code" placeholder="股票代码" style="width:150px;" @blur="getSeatsList(editForm.sec_code)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <div v-if="editForm.flag =='0'">
                                    <el-form-item label="股票名称：" prop='sec_name'> 
                                        <el-input disabled v-model="editForm.sec_name" placeholder="股票名称" style="width:150px;" ></el-input>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    <el-form-item label="股票名称：" prop='sec_name'> 
                                        <el-input :disabled="editForm.flag =='0'" v-model="editForm.sec_name" placeholder="股票名称" style="width:150px;"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                             
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="股票标签:" prop='sec_lable'> 
                                    <el-input v-model="editForm.sec_lable" placeholder="股票标签" auto-complete="off" style="width:150px;margin-left:10px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="适用投资者：" :required="true">
                                    <el-select v-model="editForm.investors" placeholder="请选择">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                             </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="股票性质1：" :required="true">
                                    <el-radio-group v-model="editForm.sec_nature1">
                                        <el-radio label="大盘股">大盘股</el-radio>
                                        <el-radio label="中盘股">中盘股</el-radio>
                                        <el-radio label="小盘股">小盘股</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="股票性质2：" :required="true">
                                    <el-radio-group v-model="editForm.sec_nature2">
                                        <el-radio label="无">无</el-radio>
                                        <el-radio label="绩优股">绩优股</el-radio>
                                        <el-radio label="绩庸股">绩庸股</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6" style="width: 800px">
                                <el-form-item label="股票性质3：" :required="true">
                                    <el-radio-group v-model="editForm.sec_nature3">
                                        <el-radio label="无">无</el-radio>
                                        <el-radio label="周期股">周期股</el-radio>
                                        <el-radio label="概念股">概念股</el-radio>
                                        <el-radio label="题材股">题材股</el-radio>
                                        <el-radio label="成长股">成长股</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row :gutter="10">
                            <el-col :span="6" style="width: 1000px">
                                <el-form-item label="推荐理由：" prop='reason' > 
                                    <el-input type="textarea" :rows="2" placeholder="不超过40个汉字" v-model="editForm.reason" style="width: 800px"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div  class="head">操作策略</div>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="建议买入区间：" prop='buy_interval_min'>
                                    <el-input v-model="editForm.buy_interval_min"  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="width: 800px">
                                <el-form-item  prop='buy_interval_max'>
                                ——&nbsp;&nbsp;&nbsp;<el-input v-model="editForm.buy_interval_max"  style="width: 50%;"></el-input>
                                    <span>格式：NN.NN-NN.NN元</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="建议卖出区间：" prop='selling_interval_min'>
                                    <el-input v-model="editForm.selling_interval_min"  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="width: 800px">
                                <el-form-item prop='selling_interval_max'>
                                ——&nbsp;&nbsp;&nbsp;<el-input v-model="editForm.selling_interval_max"  style="width: 50%;"></el-input>
                                    <span>格式：NN.NN-NN.NN元</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="建议止损区间：" prop='stop_loss_min'>
                                    <el-input v-model="editForm.stop_loss_min"  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="width: 800px">
                               <el-form-item prop='stop_loss_max'>
                                ——&nbsp;&nbsp;&nbsp;<el-input v-model="editForm.stop_loss_max"  style="width: 50%;"></el-input>
                                    <span>格式：NN.NN-NN.NN元</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div  class="head">专家分析</div>
                        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick1">
                            <el-tab-pane label="市场热度" name="first" >
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="热度评分：" prop='heat_score'>
                                            <el-input v-model="editForm.heat_score"  placeholder="最低1.0分，最高5.0分，如3.9" auto-complete="off" style="width:300px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="市场解析：" prop='market_analysis'>
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="editForm.market_analysis" style="width: 800px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="主力强度" name="second">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="强度评分：" prop='intensity_score'>
                                            <el-input v-model="editForm.intensity_score" placeholder="最低1.0分，最高5.0分，如3.9" auto-complete="off" style="width:300px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="主力解析：" prop='force_analysis'>
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="editForm.force_analysis" style="width: 800px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="技术分析" name="third">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="走势评分：" prop='trend_score'>
                                            <el-input v-model="editForm.trend_score" placeholder="最低1.0分，最高5.0分，如3.9" auto-complete="off" style="width:300px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="走势分析：" prop='trend_analysis'>
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="editForm.trend_analysis" style="width: 800px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="机构评级" name="fourth">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="价值评分：" prop='value_score'>
                                            <el-input v-model="editForm.value_score" placeholder="最低1.0分，最高5.0分，如3.9" auto-complete="off" style="width:300px;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="价值分析：" prop='value_analysis'>
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="editForm.value_analysis" style="width: 800px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="事件驱动" name="sdf">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <el-form-item label="事件驱动评分：" prop='event_driven_score'>
                                            <el-input v-model="editForm.event_driven_score" placeholder="最低1.0分，最高5.0分，如3.9" auto-complete="off" style="width:300px;"></el-input>
                                        </el-form-item> 
                                        <el-form-item label="事件驱动分析：" prop='event_driven_analysis'>
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="editForm.event_driven_analysis" style="width: 800px"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1()">取 消</el-button>
                        <el-button type="primary" :disabled="idens=='0'" @click="editSubmit()" >提交</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="今日不推荐" name="1" :disabled="flag==='0'">
                <div class="wrapper">
                    <el-form :model="addForm" :rules="addrules" ref="addForm">
                        <el-form-item label="不荐股原因：" prop='not_reason'>
                            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="addForm.not_reason" style="width: 600px"></el-input>
                        </el-form-item>
                        <span class="spanStyle" font color="#FF0000">默认文案可进行编辑，原因最多不超过100个汉字</span>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1()">取 消</el-button>
                        <el-button type="primary" :disabled="idens=='0'" @click="addSubmit()" >提交</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
import util from "../../common/js/util";
import UeEdit from "../UeEdit.vue";
import api from "../../api/api.js";
import keyboardWizard from "../../common/js/KeyboardWizard.js";
import {
  ArticleList,
  Articlesave,
  Articleupdate,
  Articledelect,
  Articleupdateview
} from "../../api/ydApi.js";
// import api from '../../api/api.js';
import axios from "axios";
export default {
  components: { UeEdit },
  data() {
      var checkJinE = (rule, value, callback) => {
        if (!value) {
             callback(new Error('请填写买入区间金额'));
        }
        var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
        if (reg.test(value) === false) {
            callback(new Error('请正确填写金额，数字精确到小数点后两位'));
        }
        callback();
      };
      var checkPingFen = (rule, value, callback) => {
        if (!value) {
            callback(new Error('请填写评分'));
        }
        if(value<1.0){
            callback(new Error('最低为1.0分'));
        }
        if(value>5.0){
            callback(new Error('不能超过5.0分'));
        }
        var reg = /^(([1-5]{1}\d*)|(0{1}))(\.\d{1})$/;
        if (reg.test(value) === false) {
            callback(new Error('请正确填写金额，数字精确到小数点后一位'));
        }
        callback();
      };
    return {
      desin: false,
    //   isDisable:'',
      aa: "",
      bb: "",
      idens:'',
      biaoqianForm: [],
      select_loading: false,
      select_options: [],//键盘宝
      options: [],
      editForm:{},
      addForm:{
          not_reason:'因市场出现非常态的下跌，赚钱效应非常弱，操作难度非常大，因此暂不做个股提示，持币的暂时观望，尺幅的谨慎调仓，耐心等待投资机会的出现。'
      },
      textarea: "",
      activeName: "",
      activeName2: "first",
      title: "",
      dialogTitle: "新增",
      editOrAdd: false,
      filters: {
        sec_name: "",
        pub_date: ""
      },
      datas: [],
      flag: this.$route.query.flag,
      is_delete:0,
      listLoading: false,
      chakanFormVisible: false,
      Loading: false,
      showUeEdit: false,
      dialogVisible: false, //编辑界面是否显示
      editLoading: false,
      //激进型（默认）、积极型、稳健型、谨慎型、保守型
      options: [
        {
          value: "选项1",
          label: "激进型"
        },
        {
          value: "选项2",
          label: "积极型"
        },
        {
          value: "选项3",
          label: "稳健型"
        },
        {
          value: "选项4",
          label: "谨慎型"
        },
        {
          value: "选项5",
          label: "保守型"
        }
      ],
      
      //编辑界面数据
      editForm: {
          investors:'激进型',
          sec_nature1:'大盘股',
          sec_nature2:'无',
          sec_nature3:'无'
      },
      defaultModules: {
        toolbar: ["image"]
      },
      rules: {
          sec_name: [
              {required: true, message: '请填写股票名称/股票代码', trigger: 'change'}
          ],
          sec_code: [
              {required: true, message: '请填写股票名称/股票代码', trigger: 'blur'}
          ],
          sec_lable: [
              {required: true, message: '请填写股票标签', trigger: 'blur'},
              {max: 6, message: '长度在6个字符', trigger: 'blur'}
          ],
          reason: [   
              {required: true, message: '请填写推荐理由', trigger: 'blur'},
              {max: 40, message: '推荐理由字数不能超过40个汉字', trigger: 'blur'}
          ],
          buy_interval_min: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          buy_interval_max: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          selling_interval_min: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          selling_interval_max: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          stop_loss_min: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          stop_loss_max: [
              {type: 'int', validator: checkJinE, trigger: 'blur' }
          ],
          heat_score: [
              {type:'int', validator: checkPingFen, trigger: 'blur' }
          ],
          intensity_score: [
              {type:'int', validator: checkPingFen, trigger: 'blur' }
          ],
          trend_score: [
              {type:'int', validator: checkPingFen, trigger: 'blur' }
          ],
          value_score: [
              {type:'int', validator: checkPingFen, trigger: 'blur' }
          ],
          event_driven_score: [
              {type:'int', validator: checkPingFen, trigger: 'blur' }
          ],
          market_analysis: [   
              {required: true, message: '请填写分析信息', trigger: 'blur'},
              {max: 200, message: '分析内容最多不能超过200个汉字', trigger: 'blur'}
          ],
          force_analysis: [   
              {required: true, message: '请填写分析信息', trigger: 'blur'},
              {max: 200, message: '分析内容最多不能超过200个汉字', trigger: 'blur'}
          ],
          trend_analysis: [   
              {required: true, message: '请填写分析信息', trigger: 'blur'},
              {max: 200, message: '分析内容最多不能超过200个汉字', trigger: 'blur'}
          ],
          value_analysis: [   
              {required: true, message: '请填写分析信息', trigger: 'blur'},
              {max: 200, message: '分析内容最多不能超过200个汉字', trigger: 'blur'}
          ],
          event_driven_analysis: [   
              {required: true, message: '请填写分析信息', trigger: 'blur'},
              {max: 200, message: '分析内容最多不能超过200个汉字', trigger: 'blur'}
          ],
      },
      addrules:{
          not_reason: [   
              {required: true, message: '请填写推荐理由', trigger: 'blur'},
              {max: 100, message: '推荐理由字数不能超过100个汉字', trigger: 'blur'}
          ]
      }
    };
  },
  methods: {
      dialogVisible1(){
          this.$router.go(-1);
      },
      add_select_clear() {
                this.editForm.sec_code = "";
        },
        select_remoteMethod(query) {

            if (query !== "") {
                this.select_loading = true;
                setTimeout(async () => {
                    this.select_loading = false;
                    var result = await keyboardWizard.query(query);
                    this.select_options = result;
                    //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                    //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                }, 200);
                // console.log(JSON.stringify(this.select_options));
            } else {
                this.select_options = [];
            }
        },
        selectchange() {
            var r = this.editForm.sec_name;

            for (var i in this.select_options) {
                if (this.select_options[i].value == r) {
                    this.editForm.sec_name = this.select_options[i].label;
                    this.editForm.sec_code = r;
                }
            }
        },

     handleClick(tab, event) {
        console.log(tab, event);
      },
      handleClick1(tab, event) {
        console.log(tab, event);
      },
      getList(id){
        //   this.$refs.editForm.validate(async valid => {
              api.getDragonTiger(id).then((results) => {
                console.log(results);
                if(results.data.flag == 1){
                    this.addForm = results.data
                }else{
                    this.editForm = results.data
                    this.editForm.buy_interval_min = this.editForm.buy_interval_min.toFixed(2)
                    this.editForm.buy_interval_max = this.editForm.buy_interval_max.toFixed(2)
                    this.editForm.selling_interval_min = this.editForm.selling_interval_min.toFixed(2)
                    this.editForm.selling_interval_max = this.editForm.selling_interval_max.toFixed(2)
                    this.editForm.stop_loss_min = this.editForm.stop_loss_min.toFixed(2)
                    this.editForm.stop_loss_max = this.editForm.stop_loss_max.toFixed(2)
                    this.editForm.heat_score = this.editForm.heat_score.toFixed(1)
                    this.editForm.intensity_score = this.editForm.intensity_score.toFixed(1)
                    this.editForm.trend_score = this.editForm.trend_score.toFixed(1)
                    this.editForm.value_score = this.editForm.value_score.toFixed(1)
                    this.editForm.event_driven_score = this.editForm.event_driven_score.toFixed(1)    
                }
              });
              
        //   });
      },

      async getSeatsList(){
            var _this = this
            let sec_code = this.editForm.sec_code;
            if(isNaN(sec_code) === true){
                _this.$message.error('请输入数字');
                return
            }else{
                if(sec_code.length != 6){
                _this.$message.error('请输入六位有效数字');
                }else{
                    // v.seatsOptions=[]   //开始调用后台方式
                let result= await api.getSeatsListByStockCode(sec_code);
                console.log(JSON.stringify(result));
                
                if(!result.state){
                    _this.$message.error('此股票未上龙虎榜')
                    return
                }
                var data = result.data
                var dataJson = JSON.parse(data)
                
                _this.$set(_this.editForm, 'sec_name', dataJson[0].stock)
                }
            }
            
        },
    
    //提交
    async editSubmit() {
        console.log(this.$refs.editForm);
        
        // alert()
        var _this = this
      this.$refs.editForm.validate(async (valid, obj) => {
        console.log(obj);
        
        if (valid) {
            
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            let result={};  
            let user = JSON.parse(sessionStorage.getItem('user'));
            if (this.editOrAdd) {
                this.editForm.flag=0;
                this.editForm.user_id = user.user_name
                let para = Object.assign({}, this.editForm);
                console.log(JSON.stringify(para));
                
                result= await api.addDragonTiger(para);
                this.dialogVisible = false;
                this.editLoading = false;
            } else {
                let para = Object.assign({}, this.editForm);
                result= await api.updateDragonTiger(para);
            }
            if(result.state){
                this.idens='0'
                this.$message({message: '提交成功',type: 'success', onClose() {
                    _this.$router.push({path: '/dragonTiger1'});
                }});
                
            }else{
                this.$message.error('提交失败');
            }
          });
        }
      });
    },

    async addSubmit() {
        var _this = this
      this.$refs.addForm.validate(async valid => {
        //   console.log(JSON.stringify(this.editForm));
          
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            let result={};
            let user = JSON.parse(sessionStorage.getItem('user'));
            if (this.editOrAdd) {
                this.flag = 1
                this.addForm.flag=this.flag;
                this.addForm.is_delete = this.is_delete
                this.editForm.user_id = user.user_name
                let para = Object.assign({}, this.addForm);
                result= await api.addDragonTiger(para);
                this.dialogVisible = false;
                this.editLoading = false;
            } else {
                let para = Object.assign({}, this.addForm);
                result= await api.updateDragonTiger(para);
            }
            if(result.state){
                this.idens='0'
                this.$message({message: '提交成功',type: 'success', onClose() {
                   _this.$router.push({path: '/dragonTiger1'});
                }});
            }else{
                this.$message.error('提交失败');
            }
            // router.go(-1)
          });
        }
      });
    },
    //恢复编辑页面为默认
    clearEdit() {
      let tmpObj = {};
      this.showUeEdit = false;
      this.editForm = Object.assign({}, tmpObj);
    }
  },

 
  mounted() {
    //    var list = axios.get("https://newf10.ydtg.com.cn/apis/fis/v1/pcapp/qtd/keyDemons?searchKey=6000&page=1&size=10");
    //    alert(JSON.stringify(list))
    //   this.$refs['editForm'].resetFields();
      var id = this.$route.query.id;
      if(this.$route.query.editOrAdd){
        this.editOrAdd = true;
      }else{
        this.getList(id);
      }
      this.activeName = this.flag ? this.flag : "0";
      /* var flag = this.$route.query.flag;
      if(!flag){
          this.activeName = "0"
      }else{
          this.activeName = "1"
      } */

    //   this.isDisable=this.$route.query.isDisable
      
  }
};
</script>
<style slot-scope>
.el-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
.el-form-item__content{
    display: inline-block;
}
.el-form-item__input{
    display: inline-block;
}
.content {
  width: 800px;
}
.head {
  font-size: 20px;
  border-bottom: 1px solid rgb(177, 172, 172);
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.el-dialog.el-dialog--small {
  overflow-x: hidden;
}
.el-dialog__body {
  max-height: 800px;
  overflow-y: auto;
  /*        margin-right: -14px;
        padding-right: 34px;*/
}
.ql-container.ql-snow {
  max-height: 200px;
  overflow-y: auto;
}
.el-pagination {
  text-align: center;
}
.topbox {
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.per {
}
.per span {
  float: left;
}
.per input {
}
.wrapper {
  padding-left: 100px;
}
.wrapper > div {
  margin-bottom: 20px;
}
.dialog-footer{
    padding-left: 200px;
}
.spanStyle{
    padding-left: 100px;
}
</style>
