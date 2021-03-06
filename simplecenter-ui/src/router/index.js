import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {SETROUTEBREADCRUMB} from '@/store/mutations-types'
import {createRoute, defaultRouteHandle} from '@/router/route-util'

// 封装页面组件导入
const _import = require('./import-' + process.env.NODE_ENV)

// 全局系统路由
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到', isLogin: false} },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录', isLogin: false} },
  { path: '/', component: _import('common/home'), name: 'home', meta: { title: '进入首页中', isLogin: true} }

]

// 各应用公共路由
const customRoutes = [
  { path: '/usercenter/updateinfo', component: _import('global/updateinfo'), name: 'updateinfo', meta: { title: '修改用户信息', isLogin: true, isTab: true }}
]

Vue.use(Router)
const router = new Router({
  mode: 'history',
  path: '/',
  routes: globalRoutes.concat(customRoutes.filter(item => !item.meta.isTab))
})

router.beforeEach((to, from, next) => {
  debugger
  document.title = to.meta.title || '首页'
  // name存在 && 不需要登录
  if (to.name && !to.meta.isLogin) {
    next()
    return
  }

  // 判断token是否存在账号是否已经登录
  let token = Vue.cookie.get('token') || sessionStorage.getItem('token')
  if (!token) {
    next({name: 'login'})
    return
  }

  // 判断是否进入首页缓冲
  if (to.name == 'home') {
    next()
    return
  }

  /* 处理面包屑-------------start */
  var routeBreadcrumbTemp = JSON.parse(JSON.stringify(store.getters.routeBreadcrumb))
  var bl = JSON.parse(sessionStorage.getItem('breadcrumbList'))
  var foo = (list, ts) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].name == to.name) {
        ts.push({title: list[i].title, name: list[i].name, query: to.query, params: to.params})
        return
      } else {
        if (list[i].children.length) {
          var xxx = []
          foo(list[i].children, xxx)
          if (xxx.length) {
            ts.push({title: list[i].title, name: list[i].name})
            xxx.forEach(item => {
              ts.push(item)
            })
            return
          }
        }
      }
    }
  }
  var ts = []
  foo(bl, ts)
  if (ts.length) {
    var routeBreadcrumbName = routeBreadcrumbTemp.map(item => {
      return item.name
    })

    ts.forEach(item => {
      if (!item.query && !item.params && routeBreadcrumbName.indexOf(item.name) > -1) {
        item.query = routeBreadcrumbName[routeBreadcrumbName.indexOf(item.name)].query
        item.param = routeBreadcrumbName[routeBreadcrumbName.indexOf(item.name)].param
      }
    })
    routeBreadcrumbTemp = ts
  } else {
    routeBreadcrumbTemp = [{title: to.meta.title, name: to.name, query: to.query, params: to.params}]
  }
  store.commit(SETROUTEBREADCRUMB, routeBreadcrumbTemp)

  /* 处理面包屑-------------end */

  const systemItem = sessionStorage.getItem('system')
  const menuListItem = sessionStorage.getItem('menuList')
  if (systemItem && menuListItem) {
    // 判断路由是否已经加入  如果已经加入则进入
    const system = JSON.parse(systemItem)
    const routes = router.options.routes
    for (let route of routes) {
      if (route.name == system.routeName) {
        next()
        return
      }
    }

    // 未加入路由 则加入路由信息
    const menuList = JSON.parse(menuListItem)
    const routerList = []
    createRoute(menuList, routerList)
    const defaultRoute = defaultRouteHandle(menuList)

    const mainRoutes = {
      path: system.routePath,
      name: system.routeName,
      component: _import('common/main'),
      meta: {isLogin: true},
      redirect: { name: defaultRoute.routeName },
      children: routerList.concat(customRoutes.filter(item => item.meta.isTab))
    }

    router.options.routes.push(mainRoutes)
    router.addRoutes([mainRoutes])
    next(to)
  } else {
    // 进入home获取相应的数据
    next({name: 'home'})
  }

// next() ;
// 添加动态(菜单)路由
// 1. 已经添加 or 全局路由, 直接访问
// 2. 获取菜单列表, 添加并保存本地存储
})

export default router
