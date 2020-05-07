<template>
  <div>
    <span v-for="item in list">
      <el-submenu :index="item.id" v-if="item.children&&item.children.length">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.name}}</span>
        </template>
        <menu-el-submenu v-if="item.children&&item.children.length>0" :list="item.children"></menu-el-submenu>
      </el-submenu>
      <el-menu-item :index="item.id" v-if="!item.children||!item.children.length">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </span>
  </div>
</template>

<script>
    export default {
        name: "menu-el-submenu",
        props:["list"],
        components:{},
      activated() {
      }
    }
</script>

<style scoped>

</style>
