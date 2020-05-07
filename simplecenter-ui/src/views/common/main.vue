<template>
  <div>
    <el-container>
      <el-header style="background: red">
        <div>
          用户名:{{user.username}} 姓名:{{user.realname}} logo:{{user.logo}}
          <el-button type="text" @click="logoutHandle">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <menuelsubmenu :list="menuList"></menuelsubmenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <keep-alive>
              <router-view :key="routePath"/> <!--class="animated fadeInRight nfaster"-->
            </keep-alive>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import menuelsubmenu from "./menu-el-submenu"
  import {ADDUSER} from '@/store/mutations-types'


  export default {
    name: "main",
    data() {
      return {
        systemId:"",
        defaultActive: "",
        menuList: [],
        user: {id: "", username: "", realname: "", logo: "",},
      }
    },
    computed: {
      routePath() {
        return this.$route.path;
      }
    },
    components: {menuelsubmenu},
    activated() {

      //加载用户信息
      this.initUser();
      //加载系统信息

      //加载
      this.initMenu();

    },
    methods: {
      initMenu(){
        const systemItem = sessionStorage.getItem("system");
        //加载菜单
        const menuListItem = sessionStorage.getItem("menuList");
        if(menuListItem){
          const menuList = JSON.parse(menuListItem)

          // 洗菜单
          const menu = [];
          this.getMenu(menuList,menu)

          var munuId;
          this.handleDefaultActive(menu,munuId);
          this.defaultActive =  munuId;
          this.menuList = menu
        }else{
          const system = JSON.parse(systemItem)
          this.$router.push(system.path)
        }
      },
      initUser(){
        this.$http({
          url: `/auth/user`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            const {id, username,realname,logo}  = data.data;
            this.$store.commit(ADDUSER,Object.assign({}, { id,username,realname,logo}))
            // 请求用户信息
            this.$set(this, "user", this.$store.getters.user)
          }
        }).finally((res) => {

        })
      },
      getMenu(menuList,menu){
        menuList.forEach(item=>{
          if(item.type==10||item.type==20){
            const {id,name,children} = item
            const childrenTemp = [];
            if (children&&children.length){
              this.getMenu(children,childrenTemp);
            }
            menu.push(Object.assign({},{id,name,children:childrenTemp}))
          }
        })

      },
      handleDefaultActive(list,munuId){
        for (let i = 0; i < list.length; i++) {
          if(list[i].type == '20'){//菜单
            munuId = list[i].id
          }
          if(munuId && this.$route.meta.id==list[i].id){
            this.defaultActive = munuId
            return true
          }
          if(list[i].children&&list[i].children.length){
            return this.handleDefaultActive(list[i].children,munuId)
          }
        }
        return false
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        var route = this.$store.getters.menuRoute[key]
        this.$router.push(route.path)
      },
      //用户退出
      logoutHandle(){
        this.clearUser();
        this.$router.push("/login")
      },

    }
  }
</script>

<style scoped>

</style>
