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

          <el-form-item label="验证码:" prop="captcha" >
            <el-input  v-model="dataForm.captcha" style="width: 144px"></el-input>
            <el-image fit="fill" title="点击切换验证码" :src="image" @click="getcaptcha">
              <div slot="error" class="image-slot" >
                <div title="点击加载验证码" style="cursor: pointer;"  @click="getcaptcha">
                  请点击
                </div>
              </div>
            </el-image>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
  export default {

    name: 'login',
    data () {
      return {
        image: '',
        dataFormloading: false,
        dataForm: {
          username: '',
          password: '',
          captcha: '',
          code: ''
        },
        dataFormRule: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    activated () {
      if (this.$cookie.get('token') || sessionStorage.getItem('token')) {
        this.$message({
          message: '账号已登录正在跳转到首页!',
          duration: 800,
          type: 'warning'
        })
        this.$router.push('/')
      }
      this.getcaptcha()

      this.$refs['dataForm'].resetFields()
  },
    methods: {
      onSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataFormloading = true
            this.$http({
              url: `/auth/login`,
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataFormloading = false
                sessionStorage.setItem('token', data.data)
                this.$cookie.set('token', data.data)
                this.$router.push('/')
              } else {
                this.getcaptcha()
                this.dataForm.password = ''
                this.dataForm.captcha = ''
                this.$message.error(data.msg)

              }
            }).finally((res) => {
              this.dataFormloading = false
            })
          }
        })
      },
      getcaptcha () {
        this.$http({
          url: `/auth/captcha.jpg?t=` + new Date().getTime(),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.image = data.data.image
            this.dataForm.code = data.data.code
          }
        })
      },
      reset () {
        this.$refs['dataForm'].resetFields()
      }
    }
  }
</script>

<style scoped>
  .el-image{
    position: absolute;
    margin-left: 15px;
  }
</style>
