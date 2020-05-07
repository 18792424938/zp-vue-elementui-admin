<template>
  <div class="main-config" >

  </div>
</template>

<script>
  const _import = require('@/router/import-' + process.env.NODE_ENV)
  import {createRoute,defaultRouteHandle} from '@/router/route-util'
  export default {
    name: "home",
    created() {
      console.log("home.crated");
    },
    activated() {
      console.log("home.activated");
      const loading = this.$loading({
        lock: true,
        text: '进入系统中,请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      const systemItem = sessionStorage.getItem("system");
      if(systemItem){
        const system = JSON.parse(systemItem)
        this.$router.push(system.routePath);
        loading.close();
      }else{
        // 查询菜单
        this.$http({
          url: `/sys/menu/nav`,
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            const systemEntity = data.data

            const menuList = systemEntity.children;
            const routerList = [];
            createRoute(menuList,routerList);
            const defaultRoute = defaultRouteHandle(menuList);

            const mainRoutes = {
              path: systemEntity.routePath,
              component: _import('common/main'),
              name: systemEntity.routeName,
              meta: {isLogin:true},
              redirect:  { name: defaultRoute.routeName },
              children: routerList
            }

            this.$router.options.routes.push(mainRoutes);
            this.$router.addRoutes([mainRoutes])
            systemEntity.children = null;
            sessionStorage.setItem("system",JSON.stringify(systemEntity));
            sessionStorage.setItem("menuList",JSON.stringify(menuList));
            this.$router.push(systemEntity.routePath);
          }else{
            //没有任何权限立马退出
            this.$message.error(data.msg)
            this.clearUser();
            this.$router.push("/login")
          }
        }).catch((res) => {
          this.$message.error("网络异常,请刷新页面")
          this.$router.push("/404")
        }).finally((res) => {
          loading.close();
        })
      }
    },
    methods: {

    }



  }
</script>

<style scoped>

</style>
