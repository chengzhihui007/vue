<template>
  <el-row :gutter="20">
    <el-col :span="6" class="chatlist">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>最新消息</span>
        </div>
        <div class="msglist">
          <div v-for="(item,index) in sortlist" :key="item.id" @click="getuserchat(item.uid,item.nick,index)" class="text item" :class="{'active':id==index}">
            <p><i class="el-icon-bell blue"></i>{{item.nick}}<span class="creatime">{{item.createtime | format}}</span></p>
            <p v-if="item.role == 12" class="teacher">{{item.contents | ellipsis}}</p>
            <p v-else>{{item.contents | ellipsis}}</p>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>聊天窗口</span>
        </div>
        <div class="text content" ref="list" id="cscrolltop">
          <div v-for="l in userchatlist" :key="l.id" :class="parseInt(l.group)!=12?'':'textright'">
            <p><span v-if="l.group==12">阿丁老师</span><span v-else>{{l.nick}}</span> <span class="userchattime">{{l.createtime | format}}</span></p>
            <p class="teacherchat" v-if="parseInt(l.group)==12" v-html="l.contents"></p>
            <p class="userchat" v-else v-html="l.contents"></p>
          </div>
        </div>
        <div class="footer">
          <el-row :gutter="24">
            <el-col :span="21">
              <UeEdit :maxWords=10000 ref='content' keep-alive class="uedit"></UeEdit>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" class="submit" v-on:click="getContent()">发送</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import moment from "moment";
import axios from 'axios';
import UeEdit from '../ChatUe.vue';
import service from "../../api/chat.js";
import w_sync from "../../api/userchat.js";
import qs from 'Qs'
export default {
  components: {
    UeEdit
  },
  data() {
    return {
      chatarray: [],
      userid:'',
      userchatlist:[],
      nick:'',
      currtime:'',
      id:''
    };
  },
  methods: {
    sortKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    getuserchat(val,nick,i){
      this.id=i;
      w_sync.ref("roomguandian/users/"+this.userid).off()
      this.userid = val;
      this.nick = nick;
      this.userchatlist = []
      var _this = this;
      w_sync.ref("roomguandian/users/"+this.userid).orderByKey().limitToLast(20).on("child_added", function(snap) {
          // console.log(snap.val())
          _this.userchatlist.push(snap.val());
      })

      // console.log(this.$refs.list.scrollHeight)
      setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 150)
    },
    replaceFace (con) {
        // if(con.match(/<img.*?(?:>|\/>)/gi)) {
        //   alert(123);
        // }
        return con;
    },
    getContent(){
      let id = this.userid;
      if(!id){
        this.$message.error('请选择要回复的学员')
        return
      }      
      let content = this.$refs["content"].getUEContent();
      
      if(content.trim()){
        let para = {
          'contents': content,
          'to': id
        }
        console.log(para)
        axios.post('https://chat.zslxt.com/api/ading/replysend',para).then(res => {
          console.log(res.data)
        })
        this.$refs["content"].setUEContent();
        setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 150)
      }else{
        this.$message.error('回复的内容不能为空');
      }
    }
  },
  computed: {
    sortlist: function() {
      return this.sortKey(this.chatarray, "createtime").reverse();
    }

  },
  filters: {
    /*解析时间戳*/
    format: function(value) {
      return moment(parseInt(value)).format("MM/DD HH:mm");
    },
    ellipsis(value) {
      if (!value) {
        return "";
      }
      let msg = value.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
      msg = msg.replace(/[|]*\n/, '') //去除行尾空格
      msg = msg.replace(/&nbsp;/ig, ''); //去掉npsp
      msg = msg.replace(/&lt;.*?&gt;/ig, ''); //去掉npsp
      if (msg.length > 20) {
        return msg.slice(0, 20) + "...";
      }
      return msg;
    }
  },
  created() {
    this.chatarray = service.msgArr;
  },
  watch:{
    userchatlist() {
      setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 150)
    }
  }
};
</script>
<style slot-scope>
.text {
  font-size: 14px;
}
.blue {
  color: #67c23a;
  font-size: 16px;
  margin-right: 4px;
}
.footer{
  margin-top: 15px;
}
.creatime {
  font-size: 10px;
  color: #909399;
  float: right;
  margin-right: 15px;
}
.item {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}
.item:hover {
  /* background-color: bisque; */
  cursor: pointer;
}
.item.active {
  background:#dcdee2;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.teacher {
  color: #cc0f16;
}
.box-card {
  width: 100%;
  margin-top: 20px;
  height: 750px;
}
.msglist{
  overflow-y: scroll;
  height: 650px;
}
.teachat{
  float: right;
  color: #000;
  clear: both;
}
.content{
  height: 450px;
  overflow-y: scroll;
}
.teacherchat{
  background-color: #b2e281;
  border-radius: 5px;
  text-align: left;
  display: inline-block;
  margin-left: 10px;
  position: relative;
  padding: 6px 10px;
  max-width: 800px;
  min-height: 36px;
  line-height: 24px;
  box-sizing: border-box;
  font-size: 14px;
}
.teachat:before{
  right: -12px;
  vertical-align: middle;
  border-right-color: transparent;
  border-left-color: #b2e281;
}
.userchat{
  border-radius: 5px;
  clear: both;
  position: relative;
  padding: 6px 10px;
  max-width: 800px;
  min-height: 36px;
  line-height: 24px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: left;
  word-break: break-all;
  background-color: #DCDFE6;
}
.userchat img{max-width: 100%;}
.userchattime{
    display: inline-block;
    padding: 0 10px;
    font-size: 10pt;
    color: #fff;
    border-radius: 2px;
    background-color: #dcdcdc;
}
.textright {
  padding-right:15px;
  text-align: right;
}
</style>

