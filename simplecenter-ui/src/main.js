// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import store from './store'
import router from './router'
import VueCookie from 'vue-cookie'

import http from './utils/httpRequest'
import {clearUser} from './utils/userUtil'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/_common.css'
import '@/assets/icon/iconfont/iconfont.css'

import dictModule from '@/components/dict/dictModule'
import dict from '@/components/dict/dict'

import App from './App'

/* 导入基础组件 */
import fileupload from './components/fileupload/fileupload'

Vue.use('fileupload', fileupload)

/**
 * 默认组件 字典
 * @type {{install: dictComponent.install}}
 */
const dictMComponent = {
  install: function (Vue) {
    Vue.component('dictModule', dictModule)
  }  // 'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
}
const dictComponent = {
  install: function (Vue) {
    Vue.component('dict', dict)
  }  // 'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
}

Vue.config.productionTip = false

// 安装ElementUI
Vue.use(ElementUI, { size: 'mini', zIndex: 3000 })

Vue.use(VueCookie)

Vue.use(dictMComponent)
Vue.use(dictComponent)

Vue.prototype.$http = http
Vue.prototype.clearUser = clearUser
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
