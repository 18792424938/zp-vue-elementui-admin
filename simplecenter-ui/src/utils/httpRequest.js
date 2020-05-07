import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import qs from 'qs'
import merge from 'lodash/merge'
import de from "element-ui/src/locale/lang/de";






const instance = axios.create({
  timeout: 1000 * 10,
  withCredentials: true,
  mode: "no-cors",
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }
})

if (process.env.NODE_ENV == 'development') {
  instance.defaults.baseURL = 'http://127.0.0.1:9000';
}else if (process.env.NODE_ENV == 'production') {
  instance.defaults.baseURL = 'http://api.123dailu.com/';
}

/**
 * 请求拦截
 */
instance.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token')?Vue.cookie.get('token'):sessionStorage.getItem("token") // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
instance.interceptors.response.use(response => {
  if(response.status === 200){
    if (response.data && response.data.code === 401) { // 需要登录
      //清除用户信息
      //clearUser()
      //跳转去登录
      router.push({ name: 'login' })
    }
  }else{
    return Promise.reject(response)
  }
  return response
}, error => {
  // 尝试跳到首页去
  // router.push({ name: 'login' })
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
/*  instance.adornUrl = (actionName) => {

  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}*/

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
instance.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
instance.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default instance;

