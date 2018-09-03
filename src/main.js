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

import BaiduMap from 'vue-baidu-map' // 百度地图
Vue.use(BaiduMap, {
  ak: 'ShpB32ZSyuF7pGexsWkcA4Iu9Nq5CYpO'
})

import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

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