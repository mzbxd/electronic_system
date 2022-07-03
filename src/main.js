import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
axios.interceptors.request.use(config => {
  // 最后必须return
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = '127.0.0.1/api/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
