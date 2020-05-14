<template>
  <div>
    <el-container>
      <el-header style="background-color: #23262E;">
        <el-row>
          <el-col  :span="14">
            <img  src="~@/assets/logo.png" @click="$router.push('/')" style="height: 50px;margin: 5px;cursor: pointer;"/>
          </el-col>
          <el-col  :span="6">
            <div style="margin-top: 14px;">
              <el-select v-model="systemId" @change="systemChange" placeholder="请选择">
                <el-option
                  v-for="item in systemList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>


          </el-col>
          <el-col  :span="2">
            <div style="text-align: right;margin-top: 16px">
              <span style="color: #FFF;margin-top: 15px;margin-right: 20px;">
                欢迎 {{$store.getters.user.realname}}
              </span>
            </div>
          </el-col>
          <el-col  :span="2">
            <div style="text-align: right;margin-top: 10px">
              <el-dropdown trigger="click" @command="changeDropdown">
                  <span class="el-dropdown-link" style="cursor: pointer;">
                     <el-avatar size="large" :src="$store.getters.user.logo"></el-avatar>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="2">修改密码</el-dropdown-item>
                  <el-dropdown-item command="3">修改个人信息</el-dropdown-item>
                  <el-dropdown-item command="4">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
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

    <!--修改密码-->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="50%">
      <el-form  v-loading="passwordFormloading" :model="passwordForm" :rules="passwordFormRules" ref="passwordForm" label-width="120px">
        <el-form-item  label="原密码:" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword"  placeholder="请输入" show-password></el-input>
        </el-form-item>
        <el-form-item  label="新密码:" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" placeholder="请输入" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword1">
          <el-input v-model="passwordForm.newPassword1" placeholder="请输入" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </div>
    </el-dialog>


    <!--修改个人信息-->
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogCenterVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="50%">
      <el-form  v-loading="centerFormloading" :model="centerForm" :rules="centerFormRules" ref="centerForm" label-width="120px">
        <el-form-item  label="头像:" prop="logo">
          <fileupload @refresh="fileuploadRefresh" :ids="centerForm.logos" :showFileList="false" className="avatar-uploader"></fileupload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCenterVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSelf">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import menuelsubmenu from "./menu-el-submenu"
  import {SETUSER} from '@/store/mutations-types'
  import Fileupload from "../../components/fileupload/fileupload";

  export default {
    name: "main",
    data() {
      return {
        dialogCenterVisible:false,
        centerFormloading:false,
        centerForm:{
          logo:"",
          logos:[],
        },
        centerFormRules:{
          logo: [
            {required: true, message: '必填', trigger: 'change'},
          ],
        },
        passwordFormloading:false,
        dialogVisible:false,
        systemId:"",
        defaultActive: "",
        menuList: [],
        systemList:[],
        passwordForm:{
          oldPassword:"",
          newPassword:"",
          newPassword1:"",
        },
        passwordFormRules:{
          oldPassword: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          newPassword: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
          newPassword1: [
            {required: true, message: '必填', trigger: 'blur'},
          ],
        }
      }
    },
    computed: {
      routePath() {
        return this.$route.path;
      }
    },
    components: {Fileupload, menuelsubmenu},
    activated() {

      //加载用户信息
      this.initUser();

      //初始化菜单
      this.initMenu();


      //初始化系统
      this.getSystemAll();

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
          this.defaultActive =  this.$route.meta.id;
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
            this.$store.commit(SETUSER,Object.assign({}, { id,username,realname,logo}))
          }
        }).finally((res) => {

        })
      },
      getSystemAll() {
        this.$http({
          url: `/sys/system/listSystem`,
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0 && data.data) {
            this.systemList = data.data
            this.systemId = sessionStorage.getItem("systemId");
          }
        }).finally((res) => {

        })
      },
      systemChange(val){
        sessionStorage.setItem("systemId",val);
        sessionStorage.removeItem("system");
        sessionStorage.removeItem("menuList");
        this.$router.push({name:'home'})
      },
      getMenu(menuList,menu){
        menuList.forEach(item=>{
          if(item.type==10||item.type==20){
            const {id,name,type,icon,children} = item
            const childrenTemp = [];
            if (children&&children.length){
              this.getMenu(children,childrenTemp);
            }
            menu.push(Object.assign({},{id,name,type,icon,children:childrenTemp}))
          }
        })

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
      changeDropdown(item ){
        if(item==2) {
          this.dialogVisible = true;
          this.$nextTick(() => {
            this.$refs['passwordForm'].resetFields();
          })
        }else if(item==3){
          console.log("http",this.$http.defaults);
          this.dialogCenterVisible = true;
        }else if(item==4){
          this.logoutHandle()
        }

      },
      updatePassword(){
        this.$refs["passwordForm"].validate((valid) => {
          if (valid) {
            if(this.passwordForm.newPassword != this.passwordForm.newPassword1){
              this.$message.error("两次密码不一致")
              return
            }
            this.passwordFormloading = true;

            this.$http({
              url: `/sys/user/updatePassword`,
              method: 'post',
              data: this.$http.adornData(this.passwordForm)
            }).then(({data}) => {
              if (data.code == 0 ) {
                this.$message({
                  message:  '修改成功,请重新登录!',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.clearUser();
                this.$router.push("/login")

              }else{
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.passwordFormloading = false;
            })


          }
        })
      },
      //修改个人信息
      updateSelf(){

        this.centerForm.logo = this.centerForm.logos.length>0?this.centerForm.logos[0]:"";
        this.$refs["centerForm"].validate((valid) => {
          if (valid) {
            var stringify = JSON.parse(JSON.stringify(this.centerForm));
            stringify.logos = null;
            this.centerFormloading = true;
            this.$http({
              url: `/sys/user/updateSelf`,
              method: 'post',
              data: this.$http.adornData(stringify)
            }).then(({data}) => {
              if (data.code == 0 ) {
                this.$message({
                  message:  '修改成功!',
                  type: 'success'
                });
                this.dialogCenterVisible = false;
              }else{
                this.$message.error(data.msg)
              }
            }).finally((res) => {
              this.centerFormloading = false;
            })


          }
        })
      },
      //用户退出
      logoutHandle(){
        this.clearUser();
        this.$router.push("/login")
      },
      fileuploadRefresh(data){
        this.centerForm.logos = data;
      },



    }
  }
</script>

<style  lang="scss">

</style>
