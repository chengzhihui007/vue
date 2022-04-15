<template>
    <section>        
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="今日荐股" name="0" :disabled="flag==='1'">
                <div class="wrapper">
                    <el-form :model="editForm" :rules="rules" :inline="true" ref="editForm">
                        <el-row :gutter="10">
                            <!-- <el-col :span="5">
                                <el-form-item label="股票名称：" prop="sec_name">
                                    <el-select v-model="editForm.sec_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                                        :change="selectchange()" :loading="select_loading" auto-complete="off" style="width:180px;">
                                        <el-option v-for="item in select_options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="股票代码：" prop='sec_code'>
                                    <el-input v-model="editForm.sec_code" auto-complete="off"   style="width:150px;"></el-input>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="6">
                                <el-form-item label="股票代码：" prop='sec_code'> 
                                    <el-input :disabled="$route.path == '/insert1'" v-model="editForm.sec_code" placeholder="股票代码" style="width:150px;" @blur="getSeatsList(editForm.sec_code)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <div v-if="$route.path == '/insert1'">
                                    <el-form-item label="股票名称：" prop='sec_name'> 
                                        <el-input disabled v-model="editForm.sec_name" placeholder="股票名称" style="width:150px;" ></el-input>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    <el-form-item label="股票名称：" prop='sec_name'> 
                                        <el-input v-model="editForm.sec_name" placeholder="股票名称" style="width:150px;" :disabled="true"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                         <el-row :gutter="10">
                            <el-col>
                                <el-form-item label="止损位:" prop="stop_loss_position">
                                    <el-input v-model="editForm.stop_loss_position" placeholder="输入数据请精确到小数点后两位" auto-complete="off" style="width:300px;"></el-input>
                                </el-form-item>
                            </el-col>
                         </el-row>
                         <el-row :gutter="10">
                            <el-col>
                                <el-form-item label="关注理由：" prop='reasons_concern'> 
                                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editForm.reasons_concern" style="width: 600px"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1()">取 消</el-button>
                        <el-button type="primary" :disabled="idens=='0'" @click="editSubmit()" >提交</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="今日不推荐" name="1" :disabled="flag==='0' || isDisable==='0'">
                <div class="wrapper">
                    <el-form :model="addForm" :rules="rules" ref="addForm">
                        <el-form-item label="不荐股原因：" prop='reasons_concern'>
                            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="addForm.reasons_concern" style="width: 600px"></el-input>
                        </el-form-item>
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
    var checkZhiSunWeri = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写买入区间金额"));
      }
      var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
      if (reg.test(value) === false) {
        callback(new Error("请正确填写金额，数字精确到小数点后两位"));
      }
      callback();
    };
    return {
      desin: false,
      aa: "",
      bb: "",
      idens:'',
      isDisable:'',
      biaoqianForm: [],
      statusForm: {},
      select_loading: false,
      select_options: [], //键盘宝
      options: [],
      editForm: {},
      addForm: {},
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
      is_delete: 0,
      listLoading: false,
      chakanFormVisible: false,
      Loading: false,
      showUeEdit: false,
      dialogVisible: false, //编辑界面是否显示
      editLoading: false,
      //编辑界面数据
      editForm: {},
      defaultModules: {
        toolbar: ["image"]
      },
      rules: {
        sec_name: [
          {
            required: true,
            message: "请填写股票名称/股票代码",
            trigger: "change"
          }
        ],
        sec_code: [
          {
            required: true,
            message: "请填写股票名称/股票代码",
            trigger: "blur"
          },
          {
            required: true,
            len: 6,
            message: "请输入6位数股票代码",
          }
        ],
        reasons_concern: [
          { required: true, message: "请填写理由", trigger: "blur" },
          { max: 15, message: "理由字数不能超过15个汉字", trigger: "blur" }
        ],
        stop_loss_position: [
          { type: "int", validator: checkZhiSunWeri, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    dialogVisible1() {
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
    getList(id) {
      let results = {};
      results = api.getShiZhan(id).then(results => {
        console.log(JSON.stringify(results));
        if (results.data.flag == 1) {
          this.addForm = results.data;
        } else {
          this.editForm = results.data;
          this.editForm.stop_loss_position = this.editForm.stop_loss_position.toFixed(2);
        }
      });
    },
    async getSeatsList(){
      var _this = this
      let sec_code = this.editForm.sec_code;
      if(isNaN(sec_code) === true){
          _this.$message.error('请输入数字');
          return
      }else{
          if(sec_code.length == 6){
          // _this.$message.error('请输入六位有效数字');
          // }else{
              // v.seatsOptions=[]   //开始调用后台方式
          let result= await api.getSeatsListByStockCode(sec_code);
          console.log(JSON.stringify(result));
          
          if(!result.state && sec_code.length == 6){
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
      var _this = this;
      // alert()
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            let result = {};
            let user = JSON.parse(sessionStorage.getItem("user"));
            if (this.editOrAdd) {
              this.editForm.flag = "0";
              this.editForm.groups = this.$route.query.activeName;
              this.editForm.user_id = user.user_name;
              let para = Object.assign({}, this.editForm);
              // alert(JSON.stringify(para))
              var sec_code = para.sec_code;
              let count = await api.getStockStatus(sec_code + "",this.editForm.groups);
              
              // let arr = [];
              // for (var i = 0; i < count.data.length; i++) {
              //   arr.push(count.data[i].track_status);
              //   arr.push(count.data[i].groups)
              // }
             // alert(arr)
             if(count.data == null){
               api.addShiZhan(para).then(e => {
                  if (e.state) {
                    this.idens='0'
                    this.$message({
                      message: "提交成功",
                      type: "success",
                      onClose() {
                       _this.$router.push({path: '/dragonTigerShiZhan'});
                      }
                    });
                  } else {
                    this.$message.error("提交失败");
                  }
                });
             }else{
               if(count.data.groups == this.editForm.groups ){
                if(count.data.track_status=='调出' || count.data.track_status=='已下线'){
                  api.addShiZhan(para).then(e => {
                  if (e.state) {
                    this.idens='0'
                    this.$message({
                      message: "提交成功",
                      type: "success",
                      onClose() {
                       _this.$router.push({path: '/dragonTigerShiZhan'});
                      }
                    });
                  } else {
                    this.idens='1'
                    this.$message.error("提交失败");
                  }
                });
                }else{ 
                  if (count.data.track_status=="调入" || count.data.track_status=="持有") {
                    this.$message({
                      message: "该只股票已推荐请继续跟踪",
                      type: "warning"
                    });
                  }
                }
              }else {
                api.addShiZhan(para).then(e => {
                  if (e.state) {
                    this.idens='0'
                    this.$message({
                      message: "提交成功",
                      type: "success",
                      onClose() {
                        _this.$router.push({path: '/dragonTigerShiZhan'});
                      }
                    });
                  } else {
                     this.idens='1'
                    this.$message.error("提交失败");
                  }
                });
              }
             }
              

              this.dialogVisible = false;
              this.editLoading = false;
            } else {
              let para = Object.assign({}, this.editForm);
              await api.updateShiZhan(para).then(e => {
                console.log(JSON.stringify(e));

                if (e.state) {
                  _this.$message({
                    message: "提交成功",
                    type: "success",
                    onClose() {
                      _this.$router.go(-1);
                    }
                  });
                } else {
                  this.$message.error("提交失败");
                }
              });
            }
          });
        }
      });
    },

    async addSubmit() {
      var _this = this;
      this.$refs.addForm.validate(async valid => {
        //   console.log(JSON.stringify(this.editForm));

        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(async () => {
            this.editLoading = true;
            let result = {};
            let user = JSON.parse(sessionStorage.getItem("user"));
            if (this.editOrAdd) {
              this.flag = 1;
              this.addForm.flag = this.flag;
              this.addForm.is_delete = this.is_delete;
              this.addForm.user_id = user.user_name;
              this.addForm.groups = this.$route.query.activeName;
              let para = Object.assign({}, this.addForm);
              console.log(JSON.stringify(para));

              result = await api.addShiZhan(para);

              this.dialogVisible = false;
              this.editLoading = false;
            } else {
              let para = Object.assign({}, this.addForm);
              result = await api.updateShiZhan(para);
            }
            if (result.state) {
              this.idens='0'
              this.$message({
                message: "提交成功",
                type: "success",
                onClose() {
                  _this.$router.push({path: '/dragonTigerShiZhan'});
                }
              });
            } else {
              this.$message.error("提交失败");
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
    var id = this.$route.query.id;
    if (this.$route.query.editOrAdd) {
      this.editOrAdd = true;
    } else {
      this.getList(id);
    }
    this.activeName = this.flag ? this.flag : "0";
    /* var flag = this.$route.query.flag;
      if(!flag){
          this.activeName = "0"
      }else{
          this.activeName = "1"
      } */
      // alert(this.$route.query.activeName)
    this.isDisable=this.$route.query.isDisable;
    // alert(this.isDisable)
  }
};
</script>
<style slot-scope>
.el-form-item__error {
  /* left: 100px; */
}
.content {
  width: 800px;
}
.head {
  font-size: 20px;
  border-bottom: 1px solid rgb(177, 172, 172);
  padding-bottom: 10px;
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
.dialog-footer {
  padding-left: 200px;
}
.spanStyle {
  padding-left: 100px;
}
</style>
