// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import store from './store'
import router from './router'
import VueCookie from 'vue-cookie'
import http from './utils/httpRequest'
import {clearUser} from './utils/userUtil'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/_common.css';
import App from './App'

Vue.config.productionTip = false


// 安装ElementUI
Vue.use(ElementUI,{ size: 'small', zIndex: 3000 })

Vue.use(VueCookie)

Vue.prototype.$http = http;
Vue.prototype.clearUser = clearUser;
/* eslint-disable no-new */
// 以下等同于 Vue.prototype.$cloneDeep = cloneDeep
// 使用: this.$cloneDeep


new Vue({
  el: '#app',
  cloneDeep,
  store,
  router,
  components: { App },
  template: '<App/>'
})
