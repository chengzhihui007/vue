<template>
  <div class="content">
    <div class="chosecon">
      <div class="title">选股范围</div>
      <div class="chosebox">
        <div class="cbtitle">选股条件</div>
        <div class="cbcon clear">
          <div class="cbleft">
            <div class="cbcontitle">选股范围</div>
            <div>
                <el-select v-model="editForm.sec_name" filterable remote clearable placeholder="关键词" v-on:clear="add_select_clear" :remote-method="select_remoteMethod"
                    @change="selectchange" :loading="select_loading" auto-complete="off" style="" required: true>
                    <el-option v-for="(item, k) in select_options" :key="k" :label="item.label" :value="item.label">
                    </el-option>
                </el-select>
            </div>
            <div class="cbleft-con">
              <!-- <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
               <el-button round>常用</el-button>
            </div>
          </div>
          <div class="cbright">
            <!-- <div class="cbcontitle">已选板块</div> -->
            <div class="cbright-con">
              <el-form ref="choseform" :model="choseform" label-width="80px">
                  <div class="banknamebox">
                    <div class="banknamelist">
                        <div class="bnli" v-for="(v, k) in banknameList" :key="k"  @mouseenter="bnMouseenter(k)"
                    @mouseleave="bnMouseleave(k)">
                            <i class="el-icon-close" v-show="v.close" @click="bknameDeleteClick(k)"></i>
                            <p>{{v.name}}</p>
                        </div>
                    </div>
                    <div v-if="this.banknameList.length == 0">
                      <div class="banknameclearall" hidden @click="bnclearallClick" >清空</div>
                    </div>
                    <div v-else>
                      <div class="banknameclearall" @click="bnclearallClick" >清空</div>
                    </div>
                    <!-- <div class="banknameclearall" @click="bnclearallClick" >清空</div> -->
                  </div>
                
                <div class="line"></div>
                <div class="selectedbox">
                  <div class="stitle">常用</div>
                  <div class="comlist">
                      <div class="comli" v-for="(v, k) in comList" :key="k" :class="v.act ? 'act' : ''" @click="comliClick(v)">{{v.name}}</div>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="chosebtn">
        <el-button @click="choseClose">取消</el-button>
        <el-button @click="choseConfirm" type="primary">确定</el-button>
      </div>
    </div>
    <div class="pop" v-show="pop">
      <div class="popcon">
        <div class="poptitle">参数设置：</div>
        <p class="t">报告期</p>
        <select class="selper" v-model="currentData.option1">
          <option>1最新一期</option>
          <option>2最新一期</option>
          <option>3最新一期</option>
          <option>4最新一期</option>
        </select>
        <div class="txtper">股东总数<input class="txtinput" type="text" v-model="currentData.option2"/>万（可直接输入数值）</div>
        <div class="popbtn">
          <el-button size="small" @click="popClose">取消</el-button>
          <el-button size="small" @click="popConfirm" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import keyboardWizard from "../../common/js/KeyboardWizard.js";
    import api from "../../api/api.js";
  export default {
    data() {
      return {
        pop: false, //二级弹窗
        currentData: {
          option1: '',
          option2: ''
        }, //pop里的数据
        select_loading:false,
        editForm:{},
        isLabel:'',
        select_options:[],
        moudle_flag:'',
        seleData: [
          {
            name: '1盈利能力指标',
            content: '营业利润率大于15%'
          },
          {
            name: '2盈利能力指标',
            content: '营业利润率大于15%'
          },
          {
            name: '3盈利能力指标',
            content: '营业利润率大于15%'
          },
          {
            name: '4盈利能力指标',
            content: '营业利润率大于15%'
          },
          {
            name: '3盈利能力指标',
            content: '营业利润率大于15%'
          },
          {
            name: '4盈利能力指标',
            content: '营业利润率大于15%'
          }
        ], //已选择数据列表
        choseform: {
          option1: '',
          option2: '',
        },
        seleShowClose: [
          false, false
        ],
        treedata: [
          {
            label: '常用',
            children: [
                {label: 'A股板块',pop: true},
                {label: '沪A股',pop: true},
                {label: '深A股',pop: true},
                {label: '深证中小板',pop: true},
                {label: '深证创业板',pop: true}
            ],
            // children: []
          }
          
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        banknameList: [],//选股
        comList: [
            {
                name: 'A股板块',
                act: false
            },
            {
                name: '沪A股',
                act: false
            },
            {
                name: '深A股',
                act: false
            },
            {
                name: '深证中小板',
                act: false
            },
            {
                name: '深证创业板',
                act: false
            },
            {
                name: '科创板',
                act: false
            },
        ], //常用
      }
    },
    mounted() {
        // var name = this.$router.currentRoute.path;
        this.banknameList =this.$route.query.banknameList
        // this.isLabel = this.$route.query.isLable
        // alert(JSON.stringify(this.banknameList))
    },
    methods: {
      add_select_clear() {
        this.editForm.sec_code = "";
      },
      select_remoteMethod(query) {
            if (query !== "") {
                this.select_loading = true;
                setTimeout(async () => {
                this.select_loading = false;
                var result = await keyboardWizard.query(query);
                console.log(JSON.stringify(result));
                
                this.select_options = result;
                //this.editForm.stock_code = this.select_options[0]? this.select_options[0].value: "";
                //this.editForm.stock_name=this.select_options[0]? this.select_options[0].label: "";
                }, 200);
                // console.log(JSON.stringify(this.select_options));
            } else {
                this.select_options = [];
            }
        },
        selectchange(val) {
            // alert(val)
            // var r = this.editForm.sec_name;
            console.log(this.banknameList)
            // this.arr.push(this.editForm.sec_name);
            for(var i=0;i<this.banknameList.length;i++){
                if(this.banknameList[i].name.indexOf(val) > -1 && val.length == this.banknameList[i].name.length){
                    return;
                }
            }
            this.banknameList.push({
                name: this.editForm.sec_name,
                close: false
            })
            this.comList.forEach((v, k) => {
                if(v.name.indexOf(val) > -1){
                    v.act = true;
                }
            });
            this.$set(this.banknameList);
            console.log(this.selectedList);
        },
        // 选中板块列表hover
      bnMouseenter(n) {
        this.banknameList[n].close = true;
        this.$set(this.banknameList)
      },
      bnMouseleave(n) {
        this.banknameList[n].close = false;
        this.$set(this.banknameList)
      },
      handleNodeClick(data) {
        console.log(data);
      },
      // 选中列表hover
      selperMouseenter(n) {
        this.seleShowClose[n] = true;
        this.$set(this.seleShowClose, n, true)
      },
      selperMouseleave(n) {
        this.seleShowClose[n] = false;
        this.$set(this.seleShowClose, n, false)
      },
      selperClick(v) {
        this.pop = true;
      },
      //一级弹窗关闭
      choseClose() {
        // this.$parent.fatherMethod();
        // this.$router.push({path:'/cy4Strategy'})
        this.$router.go(-1)
      },
      //一级弹窗确定
      choseConfirm() {
        let arr = [];
        this.isLabel = this.$route.query.isLable
        var pathName = this.$router.currentRoute.path;
        
        if(pathName=='/rdztybcl/xuangufanwei'){
            this.moudle_flag='1'
        }else if(pathName=='/rdztgcz/xuangufanwei'){
            this.moudle_flag='2'
        }else if(pathName=='/rdztgcz/xuangufanwei1'){
          this.moudle_flag='3'
        }else if(pathName=='/rdztgcz/xuangufanwei2'){
          this.moudle_flag='4'
        }else if(pathName=='/rdztgcz/xuangufanwei3'){
          this.moudle_flag='5'
        }else if(pathName=='/rdztgcz/xuangufanwei4'){
          this.moudle_flag='6'
        }else if(pathName=='/rdztgcz/xuangufanwei5'){
          this.moudle_flag='7'
        }else if(pathName=='/rdztgcz/xuangufanwei6'){
          this.moudle_flag='8'
        }else if(pathName=='/rdztgcz/xuangufanwei7'){
          this.moudle_flag='9'
        }else if(pathName=='/clsz/RDxuangufanwei'){
          if(this.isLabel=='热点之一飞冲天'){
            this.moudle_flag='10'
          }else if(this.isLabel=='热点之步步为赢'){
            this.moudle_flag='11'
          }else{
            this.moudle_flag='12'
          }
        }else if(pathName=='/clsz/ZTxuangufanwei'){
          if(this.isLabel=='主题之一飞冲天'){
            this.moudle_flag='13'
          }else if(this.isLabel=='主题之步步为赢'){
            this.moudle_flag='14'
          }else{
            this.moudle_flag='15'
          }
        }else if(pathName=='/rdztgaoguan/Ggxuangufanwei'){
          this.moudle_flag='16'
        }else if(pathName=='/rdztgaoguan/LHxuangufanwei'){
          this.moudle_flag='17'
        }else if(pathName=='/rdztgaoguan/ZLxuangufanwei'){
          this.moudle_flag='18'
        }
        // alert(JSON.stringify(this.banknameList))
        for(var i=0;i<this.banknameList.length;i++){
            let stockSel = {}
            stockSel.moudle_flag = this.moudle_flag
            stockSel.selection_condition = this.banknameList[i].name
            stockSel.close = this.banknameList[i].close
            stockSel.operation_user = JSON.parse(sessionStorage.getItem('user')).user_name
            arr.push(stockSel)
        }
        // alert(JSON.stringify(arr))
        if(arr.length==0){
          api.deleteCy4StockSelection(this.moudle_flag).then(()=>{
                this.$router.go(-1)
          });
        }else{
          api.addCy4StockSelection(arr).then(()=>{
              this.$router.go(-1)
          });
        }
        
      
      },
      
      //二级弹窗关闭
      popClose() {
        this.pop = false;
      },
      //二级弹窗确定
      popConfirm() {
        //   alert(123)
        console.log(this.editForm);
        
        this.pop = false;
      },
      seleDelete(n) {
        this.seleData.splice(n, 1);
      },
      handleNodeClick(data, data1, data2) {
        if (data.pop) {
          this.pop = true;
        }
      },
      //清除板块列表
      bnclearallClick(){
          this.banknameList = [];
          this.comList.forEach((v, k) => {
              v.act = false;    
          });
          // alert(JSON.stringify(this.comList))
          this.$set(this.comList);
      },
      //删除板块名字
      bknameDeleteClick(n){
          this.comList.forEach((v, k) => {
              if(v.name.indexOf(this.banknameList[n].name) > -1){
                  v.act = false;
              }
          })
          this.banknameList.splice(n,1);
          console.log(this.banknameList)
          this.editForm.sec_name = '';
          this.$set(this.comList);
          this.$set(this.banknameList);
      },
      //常用选择
      comliClick(v){
        // alert(JSON.stringify(this.banknameList))     
        v.act = true;   
        for(var i=0;i<this.banknameList.length;i++){
            if(this.banknameList[i].name.indexOf(v.name) > -1 && v.name.length == this.banknameList[i].name.length){
                return;
            }
        }
        this.banknameList.push({
            name: v.name,
            close: false
        })
      }
    },

  }
</script>
<style scoped>
p{
    margin: 0;
    padding: 0;
}
.clear{
    clear: both;
    zoom: 1;
    content: '';
    overflow:hidden;
}
.clear::after{
    content:'';
}
  .content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
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
  .banknamebox{
    display: flex;
    flex-direction: row;
  }
  .banknamelist{
    width: 400px;
    min-height: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .bnli{
    /* display: flex;
    flex-direction: row; */
    margin-right: 20px;
    margin-bottom: 10px;
    height: 30px;
    position: relative;
  }
  .bnli i{
      position: absolute;
      left: 0;
      top: 5px;
     font-size: 20px;
     cursor: pointer;
  }
  .bnli p{
      display: inline-block;
      height: 20px;
      font-size: 14px;
      line-height: 30px;
      margin-left: 20px;
  }
  .banknameclearall{
      width: 80px;
      height: 30px;
      background: #CCC;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
  }
  .stitle{
      line-height: 20px;
      font-size: 16px;
      margin: 10px 0;
  }
  .comlist{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .comli{
      margin: 10px;
      cursor: pointer;
  }
  .comli.act{
      color: rgb(98, 191, 219);
  }
</style>
