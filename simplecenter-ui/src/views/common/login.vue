<template>
    <div >
      <el-card class="box-card" style="width:400px;margin: 100px auto">
        <el-form v-loading="dataFormloading"  :model="dataForm" label-width="100px" :rules="dataFormRule" ref="dataForm"  @keyup.enter.native="onSubmit">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="dataForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input  v-model="dataForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>

  export default {
    name: "login",
    data(){
      return{
        dataFormloading:false,
        dataForm:{
          username:"",
          password:"",
          captcha:"",
        },
        dataFormRule:{
          username:[
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
        }
      }
    },
    activated() {

      if( this.$cookie.get('token')||sessionStorage.getItem("token")){
        this.$message({
          message: '账号已登录正在跳转到首页!',
          duration:800,
          type: 'warning'
        });
        this.$router.push("/")
      }

      this.$refs['dataForm'].resetFields();
    },
    methods:{
      onSubmit(){
        this.$refs['dataForm'].validate((valid)=>{
          if(valid){
            this.dataFormloading = true;
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
                this.$router.push("/")
              }else{
                this.dataForm.password = "";
                this.$message.error(data.msg)
              }

            }).finally((res) => {
              this.dataFormloading = false;
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
