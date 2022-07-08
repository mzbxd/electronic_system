import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 拦截请求
axios.interceptors.request.use(config => {
  // 最后必须return
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 注册树形表格组件
Vue.component('tree-table', TreeTable) // for bubble theme

// 注册富文本编辑器
Vue.use(VueQuillEditor)

// 时间过滤器
Vue.filters('dateFormat', (originVal) => {
  const date = new Date(originVal)
  const y = date.getFullYear()
  const mt = `0${date.getMonth() + 1}`
  const m = mt.slice(mt.length - 2)
  const d = `${date.getDate()}`.padStart(2, '0')
  const hh = `${date.getHours()}`.padStart(2, '0')
  const mm = `${date.getMinutes()}`.padStart(2, '0')
  const ss = `${date.getSeconds()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
