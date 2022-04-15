<template>
  <div class="content">
    <div class="chosecon">
      <div class="title">特色指标选股</div>
      <div class="chosebox">
        <div class="cbtitle">选股条件</div>
        <div class="cbcon clear">
          <div class="cbleft">
            <div class="cbcontitle">特色指标选股</div>
            <div class="cbleft-con">
              <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <div class="cbright">
            <div class="cbcontitle">已选条件</div>
            <div class="cbright-con">
              <el-form ref="choseform" :model="choseform" label-width="80px">
                <el-form-item label="满足方式" prop="option1">
                  <!-- <el-radio-group v-model="choseform.option1"> -->
                    <el-radio v-model="radio" label="0">全部满足</el-radio>
                    <el-radio v-model="radio" label="1">任一满足</el-radio>
                  <!-- </el-radio-group> -->
                </el-form-item>
                <el-form-item label="包含ST股" prop="option2">
                  <!-- <el-radio-group v-model="choseform.option2"> -->
                    <el-radio v-model="radio1" label="0">是</el-radio>
                    <el-radio v-model="radio1" label="1">否</el-radio>
                  <!-- </el-radio-group> -->
                </el-form-item>
                <div class="line"></div>
                <div class="banknamelist">
                    <div class="selper" 
                        v-for="(v, k) in selectedList" 
                        :key="k"  
                        @mouseenter="bnMouseenter(k)"
                        @mouseleave="bnMouseleave(k)">
                        <i class="el-icon-close" v-show="v.close" @click="bknameDeleteClick(k)"></i>
                        <p>{{v.name}}</p>
                    </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="chosebtn">
        <el-button class="banknameclearall" type="primary" @click="bnclearallClick" v-if="selectedList.length > 0">清空当前已选</el-button>
        <el-button @click="choseClose">取消</el-button>
        <el-button @click="choseConfirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from "../../api/api.js";
  export default {
    data() {
      return {
        radio:'0',
        radio1:'1',
        pop: false, //二级弹窗
        selected:[],
        moudle_flag:'',
        currentData: {
          option1: '',
          option2: ''
        }, //pop里的数据
        seleData: [], //已选择数据列表
        choseform: {
          option1: '',
          option2: '',
        },
        seleShowClose: [
          false, false
        ],
        treedata: [
          // {label: '蓝粉彩带'},
          // {label: '主力吸筹'},
          // {label: '操盘提醒'},
          // {label: '周期拐点'},
          // {label: '主力动态'},
          // {label: '主升浪战法'},
          // {label: '底部一买战法'},
          // {label:'趋势二买战法'}
        ],
        selectedList:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      this.selectedList =this.$route.query.teseList
      //  var sel = sessionStorage.getItem('teseList');
        // this.selectedList = JSON.parse(sel);
        // this.selected = JSON.parse(sel);
        this.selected = this.selectedList;
        this.getList();
    },
    methods: {
      bnMouseenter(n) {
        this.selectedList[n].close = true;
        this.$set(this.selectedList)
      },
      bnMouseleave(n) {
        this.selectedList[n].close = false;
        this.$set(this.selectedList)
      },
      bknameDeleteClick(n){
          this.selectedList.splice(n,1);
          this.$set(this.selectedList);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      //获取特色指标元素
      getList(){
          api.getTeSeZhiBiao().then(res => {
              for(var i=0;i<res.data.length;i++){
                var tree = {}
                tree.label = res.data[i].indicator_name
                this.treedata.push(tree)
              }
          });
      },
      //一级弹窗关闭
      choseClose() {
        this.$router.go(-1)
      },
      //一级弹窗确定
      choseConfirm() {

        // sessionStorage.setItem('teseList', JSON.stringify(this.selectedList));
        // this.$router.go(-1)
        let arr = [];
        let result = {}
        this.isLabel = this.$route.query.isLable
        var pathName = this.$router.currentRoute.path;
        if(pathName=='/rdztybcl/tesezhibiaoxuanxu'){
          this.moudle_flag='1'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu'){
          this.moudle_flag='2'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu1'){
          this.moudle_flag='3'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu2'){
          this.moudle_flag='4'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu3'){
          this.moudle_flag='5'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu4'){
          this.moudle_flag='6'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu5'){
          this.moudle_flag='7'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu6'){
          this.moudle_flag='8'
        }else if(pathName=='/rdztgcz/tesezhibiaoxuanxu7'){
          this.moudle_flag='9'
        }else if(pathName=='/clsz/RDtesezhibiaoxuanxu'){
          if(this.isLabel=='热点之一飞冲天'){
            this.moudle_flag='10'
          }else if(this.isLabel=='热点之步步为赢'){
            this.moudle_flag='11'
          }else{
            this.moudle_flag='12'
          }
        }else if(pathName=='/clsz/ZTtesezhibiaoxuanxu'){
          if(this.isLabel=='主题之一飞冲天'){
            this.moudle_flag='13'
          }else if(this.isLabel=='主题之步步为赢'){
            this.moudle_flag='14'
          }else{
            this.moudle_flag='15'
          }
        }else if(pathName=='/rdztgaoguan/Ggtesezhibiaoxuanxu'){
          this.moudle_flag='16'
        }else if(pathName=='/rdztgaoguan/LHtesezhibiaoxuanxu'){
          this.moudle_flag='17'
        }else if(pathName=='/rdztgaoguan/ZLtesezhibiaoxuanxu'){
          this.moudle_flag='18'
        }
        for(var i=0;i<this.selectedList.length;i++){
            let stockSel = {}
            stockSel.moudle_flag = this.moudle_flag
            stockSel.satisfaction_mode = this.radio
            stockSel.contain_ST = this.radio1
            stockSel.selection_condition = this.selectedList[i].name
            stockSel.operation_user = JSON.parse(sessionStorage.getItem('user')).user_name
            arr.push(stockSel)
        }
        if(arr.length==0){
            api.deleteCy4CharacteristicStock(this.moudle_flag).then(()=>{
                this.$router.go(-1)
            });
        }else{
          api.addCy4CharacteristicStock(arr).then(()=>{
                this.$router.go(-1)
          });
        }
      },
      //清除选择列表
      bnclearallClick(){
          this.selectedList = [];
          this.$set(this.selectedList);
          this.selected=[]
          this.$set(this.selected);
      },
      handleNodeClick(data, data1, data2) {
        //元素不能重复选择
        for(var i=0;i<this.selected.length;i++){
            if(this.selected[i].name.indexOf(data1.data.label) > -1 && data1.data.label.length == this.selected[i].name.length){
                return;
            }
        }
        this.selected.push({
          name:data1.data.label,
          close:false
        })
        this.selectedList=this.selected
      }
    }
  }
</script>
<style scoped>
  .content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
  }
  .banknamelist{
    width: 400px;
    min-height: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .chosecon {
    width: 700px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -300px;
    margin-left: -350px;
    background: #e4e4e4;
    padding: 10px 20px 20px;
  }

  .title {
    font-size: 20px;
    color: #000;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    padding-bottom: 10px;
  }

  .chosebox {
    background: #FFF;
    padding: 0 20px 20px;
  }

  .cbtitle {
    font-size: 16px;
    color: #000;
    line-height: 30px;
  }

  .cbcon {
  }

  .cbleft {
    width: 160px;
    float: left;
    margin-right: 10px;
  }

  .cbcontitle {
    font-size: 14px;
    color: #000;
    line-height: 30px;
    background: #e3e3e3;
    text-align: center;
  }

  .cbright {
    width: 450px;
    float: right;
  }

  .cbleft-con {
    height: 320px;
    border: 1px solid #e1e1e1;
    overflow-y: auto;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #e1e1e1;
  }

  .selectedbox {

  }

  .selper {
    padding: 10px 0 0 30px;
    margin-bottom: 10px;
    position: relative;
  }

  .selper-hover {
    background: rgba(0, 0, 0, .1);
  }

  .selper .el-icon-close {
    font-size: 20px;
    position: absolute;
    top: 12px;
    left: 0px;
  }

  .selper p {
    font-size: 14px;
    color: #000000;
    line-height: 24px;
  }

  .selper p.name {
    color: #169db5;
  }

  .selectedbox {
    height: 325px;
    overflow-y: auto;
  }

  .pop {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .4);
  }

  .popcon {
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -150px;
    margin-left: -200px;
    background: #FFF;
    padding: 10px 20px;
  }

  .poptitle {
    font-size: 16px;
    color: #000;
    line-height: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    padding-bottom: 10px;
  }

  .popcon .t {
    line-height: 30px;
    margin-bottom: 5px;
  }

  .popcon .selper {
    padding: 0;
    width: 200px;
    height: 30px;
    line-height: 30px;
  }

  .popcon .txtper {

  }

  .popcon .txtinput {
    width: 40px;
  }

  .popbtn {
    margin-top: 20px;
    text-align: right;
  }
  .chosebtn{
    margin-top: 10px;
    text-align: right;
  }

  /deep/ .el-form-item {
    margin-bottom: 0;
  }
</style>
