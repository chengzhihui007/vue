import Vue from 'vue'
import babelpolyfill from 'babel-polyfill'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './routes'

import axios from 'axios';
Vue.prototype.$axios = axios;
import 'font-awesome/css/font-awesome.min.css'

// 富文本编辑框
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(require('vue-moment'));
const router = new VueRouter({
  routes
});


//每次路由跳转，都会先执行这个方法
router.beforeEach((to, from, next) => {

  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {

    next({ path: '/login' })
  } else {
    next()
  }
});
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

