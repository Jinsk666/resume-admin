import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/element-variables.scss'

import '@/styles/index.scss' // global css

import '@/styles/theme.scss' // 主题

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import VueDND from 'awe-dnd' // 拖拽插件
Vue.use(VueDND)

Vue.use(ElementUI, {
  //size: 'small'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})