import store from '../store'
import {DELUSER,DELMENUROUTE} from '../store/mutations-types'
import Vue from "vue";

export function clearUser () {
  sessionStorage.removeItem("menuList")
  sessionStorage.removeItem("token")
  store.commit(DELUSER)
  store.commit(DELMENUROUTE)
  Vue.cookie.remove('token')
}
