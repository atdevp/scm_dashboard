// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueNativeSock from 'vue-native-websocket'
import axios from 'axios'
import './assets/css/global.css'
import moment from 'vue-moment'

Vue.use(ElementUI)
Vue.use(moment)

Vue.use(VueNativeSock, 'ws://127.0.0.1:8000/api/v1/projects/post/build.go', {
  connectManually: false
})

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'
// 除了登录接口之外都需要在请求头中添加Authorization字段提供token令牌
// 使用axios添加拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (!error.response) {
      return ElementUI.Message('网络错误请联系管理员')
    }

    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
