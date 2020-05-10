import store from '../store'
import {DELUSER,DELMENUROUTE} from '../store/mutations-types'
import Vue from "vue";

export function clearUser () {
  sessionStorage.removeItem("system")
  sessionStorage.removeItem("menuList")
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("systemId")
  store.commit(DELUSER)
  store.commit(DELMENUROUTE)
  //删除cookie
  Vue.cookie.delete('token')
}
