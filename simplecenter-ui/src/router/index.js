import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import {ADDMENUROUTE} from '../store/mutations-types'
import {createRoute,defaultRouteHandle} from '@/router/route-util'


// 封装页面组件导入
const _import = require('./import-' + process.env.NODE_ENV)

//全局系统路由
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' ,isLogin:false} },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' ,isLogin:false} },
  { path: '/', component: _import('common/home'), name: 'home', meta: { title: '进入首页中' ,isLogin:true} },

]


// 系统管理路由
const customRoutes = [

]


Vue.use(Router)
const router = new Router({
  mode: 'history',
  path: '/',
  routes:  globalRoutes.concat(customRoutes)
})



router.beforeEach((to, from, next) => {
  document.title = to.meta.title?to.meta.title:"首页"
  if(to.name && !to.meta.isLogin){
    next();
    return;
  }

  let token = Vue.cookie.get('token');
  // 判断账号是否已经登录
  if (!token) {
    next({name: 'login'})
    return;
  }

  if(to.name=="home"){
    next()
    return;
  }

  const systemItem = sessionStorage.getItem("system");
  const menuListItem = sessionStorage.getItem("menuList")
  if(systemItem){
    const system = JSON.parse(systemItem);
    const routes = router.options.routes;
    for (let route of routes) {
      if(route.name == system.routeName){
        next();
        return;
      }
    }
    const menuList = JSON.parse(menuListItem);
    const routerList = [];
    createRoute(menuList,routerList);
    const defaultRoute = defaultRouteHandle(menuList);
    const mainRoutes = {
      path: system.routePath,
      component: _import('common/main'),
      name: system.routeName,
      meta: {isLogin:true},
      redirect:  { name: defaultRoute.routeName },
      children: routerList
    }
    router.options.routes.push(mainRoutes);
    router.addRoutes([mainRoutes])
    next(to);
  }else{
    next("/")
  }




// next() ;
// 添加动态(菜单)路由
// 1. 已经添加 or 全局路由, 直接访问
// 2. 获取菜单列表, 添加并保存本地存储

})

export default router;
