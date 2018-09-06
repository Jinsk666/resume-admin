import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getFactory } from '@/utils/auth' // 验权

const whiteList = ['/login', '/accountLogin', '/forget'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
      if( (Number(getFactory()) || to.name == 'factory')  ) {
        next()
      }else {
        // 给提示
        if( from.name != 'login' && from.name !='accountLogin') {
          Message({
            message: '请填写企业信息',
            type: 'error',
            duration: 5 * 1000
          })
        }
        next({name: 'factory'})
      }
      NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 包含
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
