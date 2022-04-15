<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="sysMenu.path" class="el-menu-vertical-demo" :style="collapsed?'':'width:230px'" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in sysMenu">
						<el-submenu :index="index+''" v-if="!item.leaf && !item.hidden" :key="index">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                   <!-- 二级菜单 -->
              <template v-for="itemChild in item.children">
                <el-submenu v-if="itemChild.children && itemChild.children.length" :index="itemChild.id" :key="itemChild.path">
                    <template slot="title"><span>{{itemChild.name}}</span></template>
                      <!-- 三级菜单 -->
                      <el-menu-item v-for="itemChild_Child in itemChild.children" :index="itemChild_Child.path" :key="itemChild_Child.path">
                    <span slot="title">{{itemChild_Child.name}}</span></el-menu-item>
                </el-submenu>
                
                <el-menu-item v-else :index="itemChild.path" :key="itemChild.path"><span slot="title">{{itemChild.name}}</span></el-menu-item>
              </template>
						<!-- 	<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}
               </el-menu-item> -->
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>

				<!--点击按钮，导航菜单--向左边折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in sysMenu" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="sysMenu.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="sysMenu.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{sysMenu.name}}</strong>
						<el-breadcrumb separator=">" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" v-if="item.name" :key="item.path" :to="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view :token="token"></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import api from "../api/api.js";
export default {
  data() {
    return {
      sysName: "慧选股后台管理",
      collapsed: false,
      sysUserName: "",
      token: "",
      sysUserAvatar:
        "http://app2.zslxt.com/image/327468447.png",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      sysMenu: [],
      props: {
        token: {
          type: String
        }
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {},
    handleclose() {},
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    async getMenu() {
      let user = sessionStorage.getItem("user");
        let result=await api.getMenuInfo(user);
                this.sysMenu=result;
//      var str = [
//        {
//          id: 12,
//          path: "/",
//          name: "运营管理",
//          iconCls: "el-icon-setting",
//          leaf: false,
//          hidden: false,
//          status: true,
//          children: [
//            {
//              id: 15,
//              path: "/Notice",
//              name: "公告管理",
//              hidden: false,
//              status: true
//            },
//            {
//              id: 16,
//              path: "/operate",
//              name: "轮播图管理",
//              hidden: false,
//              status: true
//            }
//          ]
//        },
//         {
//          id: 12,
//          path: "/",
//          name: "解盘",
//          iconCls: "el-icon-document",
//          leaf: false,
//          hidden: false,
//          status: true,
//          children: [
//            {
//              id: 15,
//              path: "/AdvanceKnow",
//              name: "早知晓",
//              hidden: false,
//              status: true
//            }
//
//          ]
//        },
//        {
//          id: 13,
//          path: "/",
//          name: "直播间管理",
//          iconCls: "el-icon-setting",
//          leaf: false,
//          hidden: false,
//          status: true,
//          children: [
//            {
//              id: 18,
//              path: "/zbjclass",
//              name: "课程管理",
//              hidden: false,
//              status: true
//            },
//            {
//              id: 19,
//              path: "/zbjclass2",
//              name: "老师管理",
//              hidden: false,
//              status: true
//            },
//            {
//              id: 20,
//              path: "/noticebullet",
//              name: "弹幕公告管理",
//              hidden: false,
//              status: true
//            },
//            {
//              id: 21,
//              path: "/historys",
//              name: "战绩汇总",
//              hidden: false,
//              status: true
//            },
//            {
//              id: 22,
//              path: "/morningpaper",
//              name: "每日晨报",
//              hidden: false,
//              status: true
//            }
//          ]
//        }
//      ];
//
//      this.sysMenu = str;
    }
  },
  async mounted() {
    console.log('----', this.$route.matched);
    
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.user_name || "";
    }
  },
  created() {
    this.getMenu();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
.el-menu {
  overflow-y: auto;
}
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: left;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>