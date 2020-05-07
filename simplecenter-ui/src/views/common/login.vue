<template>
    <div >
      <el-form ref="form" :model="dataForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dataForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return{
        dataForm:{
          username:"",
          password:"",
          captcha:"",
        }
      }
    },
    activated() {
      console.log("this.$cookie.get('token')",this.$cookie)
      if( this.$cookie.get('token')||sessionStorage.getItem("token")){

        this.$message({
          message: '账号已登录正在跳转到首页!',
          duration:800,
          type: 'warning'
        });

        this.$router.push("/")
      }
    },
    methods:{
      onSubmit(){
        this.$http({
          url: `/auth/login`,
          method: 'post',
          data: this.$http.adornData(this.dataForm)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message:  data.msg,
              type: 'success'
            });
            sessionStorage.setItem("token",data.data)
            this.$cookie.set('token',data.data)
            /*sessionStorage.setItem("user",JSON.stringify({id:"1",username:"2",realname:"3",logo:"4",}))
            this.$store.commit(ADDUSER,{id:"5",username:"6",realname:"7",logo:"8",})*/
            this.$router.push("/")
          }else{
            this.$message.error(data.msg)
          }

        }).finally((res) => {

        })
      }
    }
  }
</script>

<style scoped>

</style>
