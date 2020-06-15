<template>
  <div class="main-config" >

  </div>
</template>

<script>

  export default {
    name: "home",
    activated() {
      this.initNav()
    },
    methods: {
      initNav(){
        const loading = this.$loading({
          lock: true,
          text: '跳转系统中,请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // 查询菜单
        const systemId = sessionStorage.getItem('systemId') || ''
        this.$http({
          url: `/sys/menu/nav`,
          method: 'get',
          params: this.$http.adornParams({systemId: systemId})
        }).then(({data}) => {
          if (data && data.code === 0) {
            const systemEntity = data.data.systemEntity
            const menuList = systemEntity.children
            systemEntity.children = null
            sessionStorage.setItem('systemId', systemEntity.id)
            sessionStorage.setItem('system', JSON.stringify(systemEntity))
            sessionStorage.setItem('menuList', JSON.stringify(menuList))
            sessionStorage.setItem('perms', JSON.stringify(data.data.perms))

            this.$router.push(systemEntity.routePath)
          } else {
            // 没有任何权限立马退出
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 1000,
              onClose: () => {
                this.$router.push('/404')
              }
            })
          }
        }).catch((res) => {
          this.$router.push('/404')
        }).finally((res) => {
          loading.close()
        })
      }
    }

  }
</script>

<style scoped>

</style>
