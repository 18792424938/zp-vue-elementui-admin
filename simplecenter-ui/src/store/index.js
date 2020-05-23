import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//动态加属性

const store = new Vuex.Store({
  state: { //数据存储器
    user:{
      id:"",
      logo:"",
      username:"",
      realname:""
    },
    routeBreadcrumb:[],
    menuRoute:{}
  },
  mutations: {
    setUser(state,data){
      const {id,username,realname,logo} = data
      Vue.prototype.$http({
        url: `/fileupload/file/findById`,
        method: 'get',
        params:Vue.prototype.$http.adornParams({id:logo})
      }).then(({data}) => {
        if (data && data.code === 0) {
          const {url}  = data.data;
          state.user.logo=url
        }
      }).finally((res) => {

      })
      Object.assign(state.user,{id,username,realname})
    },
    setRouteBreadcrumb(state,data){
      state.routeBreadcrumb = data;
    },
    delUser(state){
      Object.assign(state.user,{id:"",logo:"",username:"",realname:""})
    },
    setMenuRoute(state,data){
      state.menuRoute[data.id] = data
    },
    delMenuRoute(state){
      state.menuRoute = {}
    },
    // 同步执行代码 ,第一个参数是state, 第二个参数是外面传进来的(payload 载荷 )
    // 修改数据之类的  使用方式是this.$store.commit('方法名')
    //Vue.set(state.info,'address','西安')
    //Vue.delete(state.info,'address')
  },
  actions:{
    //异步执行代码 第一个参数是context(上下文,context.state)  修改值的方式 context.commit('方法名')
    // 第二个参数是外面传进来的(payload 载荷 )
    //this.$store.dispatch('方法名'),

  },
  getters:{// 获取数据 第一参数是 state第二个参数是getters,最多两个参数
    user(state){
      return state.user
    },
    menuRoute(state){
      return state.menuRoute
    },
    routeBreadcrumb(state){
      return state.routeBreadcrumb
    },

  },
  modules:{ //解决state臃肿的问题

  }
})
export default store;
