<template>
  <div id="chat">
    <div class="sidebar">
      <div class="m-card">
        <header><img class="avatar" width="40" height="40" alt="阿丁老师" src="http://live.ydtg.com.cn/userfiles/face/2016211114506228.jpg">
          <p class="name">阿丁老师</p>
        </header>
        <!-- <footer><input class="search" placeholder="search user..."></footer> -->
      </div>
      <!--v-component-->
      <div class="m-list">
        <ul>
          <!--v-for-start-->
          <li v-bind:class="{ active:item.userid==current}" :key="item.id" v-for="item in friend_data" @click="get_user_content(item)">
            <img class="avatar" :alt="item.username" src="../../../static/images/user.png">
            <p class="name">{{item.nickname}} <i v-bind:class="{tip:typeof(no_read_ids[item.userid])!='undefined'}"></i></p>
          </li>

          <!--v-for-end-->
        </ul>
      </div>
      <!--v-component-->
    </div>
    <div class="main">
      <div class="m-message" ref="list">
        <ul :id="index" v-for="(items,index) in content" :key="index">
          <!--v-for-start-->
          <li v-for="item in items" :key="item.id">
            <p class="time"><span>{{item.create_time|dateFrm}}</span></p>
            <div :class="item.type==1?'friend':'self'">              
              <img class="avatar" width="30" height="30" v-if="item.type==1" src="../../../static/images/user.png">
              <img class="avatar" width="30" height="30" v-else src="http://live.ydtg.com.cn/userfiles/face/2016211114506228.jpg">
              <div class="text" v-html="item.content"></div>
            </div>
          </li>
        </ul>
      </div>
      <!--v-component-->
      <div class="m-text"><textarea placeholder="按 Ctrl + Enter 发送" @keyup="sendmsg($event)" v-model="text_data"></textarea><el-button type="primary" class="subbtn" @click="sendmsg2($event)">发送</el-button></div>
      
      <!--v-component-->
    </div>
  </div>
</template>
<script>
// import "../../../static/css/chat.css";
import axios from "axios";
import w_sync from "../../api/userchat.js";
import moment from "moment";
import $ from 'jquery'
export default {
  name: "Chat",
  data() {
    return {
      friend_data: [],
      content: {},
      current: "",      
      kfid: 0,
      no_read_ids: {},
      kfname: "",
      text_data: "",
      current_data: {}
    };
  },
  methods: {
    get_friend: function(){
      var _this = this;
       w_sync
        .ref("/AdingApp/IMservice/")
        .orderByChild("create_time")  
        .limitToLast(100)      
        .on("child_added", function(data) {
          data = data.val();
          // console.log(_this.kfid);
          _this.friend_data.unshift(data);
        });
    },
    //设置为已读
    set_read: function(userid, ids) {
      let obj = {
        userid: userid,
        no_read: ids
      };

      axios.post("https://chat.zslxt.com/api/ading/set_read", obj, {
        headers: { "Content-Type": "application/json;charset=UTF-8" }
      });
      this.$delete(this.no_read_ids, userid);
    },
    sendmsg: function(e) {
      if ((e.ctrlKey && e.which == 13) || e.which == 10) {
        let question = {
          userid: this.current_data.userid,
          username: this.current_data.username,
          nickname: this.current_data.nickname,
          type: 2,
          kfid: this.kfid,
          kfname: this.kfname,
          content: this.text_data
        };
        
        axios.post("https://chat.zslxt.com/api/ading/customer_send", question, {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
        this.text_data = "";
      }
    },
    sendmsg2:function(e){
      let question = {
          userid: this.current_data.userid,
          username: this.current_data.username,
          nickname: this.current_data.nickname,
          type: 2,
          kfid: this.kfid,
          kfname: this.kfname,
          content: this.text_data
        };
        
        axios.post("https://chat.zslxt.com/api/ading/customer_send", question, {
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
        this.text_data = "";
    },
    get_content: function() {
      var _this = this;
      w_sync
        .ref("/AdingApp/IMchatlist/")
        .orderByChild("create_time")
        .limitToLast(200)
        .on("child_added", function(snapshot) {
          var data = snapshot.val();
          // console.log(data)
          var arr = [];
          var no_read_arr = [];

          arr.push(data);
          if (typeof _this.content[data.userid] != "undefined") {
            // console.log(_this.content[data.userid]);
            _this.content[data.userid].push(data);
          } else {
            _this.$set(_this.content, data.userid, arr);
          }

          if (
            data.type == 1 &&
            data.is_read == 0 &&
            data.userid != _this.current
          ) {
            no_read_arr.push(data.keyid);
            if (typeof _this.no_read_ids[data.userid] != "undefined") {
              _this.no_read_ids[data.userid].push(data.keyid);
            } else {
              _this.$set(_this.no_read_ids, data.userid, no_read_arr);
            }
          }
          setTimeout(() => _this.$refs.list.scrollTop = _this.$refs.list.scrollHeight, 150)
          // _this.content_list[data.userid].push(data.createtime);
        });
    },
    get_user_content: function(data) {
      $(".m-message ul").css("display", "none");
      this.current = data.userid;
      this.current_data = data;
      var no_read = this.no_read_ids[this.current];
      if (typeof no_read != "undefined") {
        no_read = no_read.join(",");
        this.set_read(this.current, no_read);
      }
      $("#" + data.userid).css("display", "block");
      $(".m-message").scrollTop($(".m-message")[0].scrollHeight);
      $(this).addClass("active");
    }
  },
  filters: {
    dateFrm: function(el) {
      // console.log(el);
      return moment.unix(el/1000).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  mounted() {    
    this.kfid = this.$route.params.kfid;
    this.kfname = this.$route.params.kfname;
    this.get_friend();
    this.get_content();
  }
};
</script>

<style slot-scope>
@import '../../../static/css/chat.css';
</style>

