import Vue from 'vue'
import Router from 'vue-router'
/** Webpack 实现路由懒加载 */
const Layout = r => require.ensure([], () => r( require('../views/layout/Layout') ), 'layout')
const Login = r => require.ensure([], () => r( require('../views/login/login') ), 'login')
const AccountLogin = r => require.ensure([], () => r( require('../views/login/accountLogin') ), 'accountLogin')
const Forget = r => require.ensure([], () => r( require('../views/login/forget') ), 'forget')
const Errors = r => require.ensure([], () => r( require('../views/404') ), 'error')
const Myresume = r => require.ensure([], () => r( require('../views/my-resume/index') ), 'myresume')
const Addresume = r => require.ensure([], () => r( require('../views/my-resume/add') ), 'addresume')
const Listresume = r => require.ensure([], () => r( require('../views/my-resume/list') ), 'listresume')
const Module = r => require.ensure([], () => r( require('../views/module-sel/index') ), 'module')
const CodeList = r => require.ensure([], () => r( require('../views/code-list/index') ), 'codelist')
const CodeListDetails = r => require.ensure([], () => r( require('../views/code-list/details') ), 'codelistdetails')
const Factory = r => require.ensure([], () => r( require('../views/factory/index') ), 'factory')

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',name: 'login', component: Login, hidden: true },
  { path: '/accountLogin',name: 'accountLogin', component: AccountLogin, hidden: true },
  { path: '/forget',name: 'forget', component: Forget, hidden: true },
  { path: '/404', component: Errors, hidden: true },
  { path: '/factory', name:'factory', component: Factory, hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/resume/index',
    name: 'Dashboard',
    hidden: true,
    // children: [{
    //   path: '/dashboard',
    //   component: () => import('@/views/dashboard/index')
    // }]
  },
  {
    path: '/resume',
    component: Layout,
    redirct: '/resume/index',
    children: [
      {
        path: 'index',
        name: 'Resume',
        component: Myresume,
        meta: { title: '我的履历', icon: 'resume' }
      },
      {
        path: 'add',
        name: 'AddResume',
        component: Addresume,
        meta: { title: '添加履历', icon: 'form' },
        hidden: true
      },
      {
        path: 'list',
        name: 'resumeList',
        component: Listresume,
        meta: { title: '对应履历', icon: 'form' },
        hidden: true
      }
    ]
  },

  {
    path: '/module',
    component: Layout,
    redirct: '/module-sel/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Module',
        component: Module,
        meta: { title: '模板选择', icon: 'choose' }
      }
    ]
  },

  {
    path: '/list',
    component: Layout,
    redirect: '/list/index',
    //name: 'ListOuter',
    //meta: { title: '编码列表', icon: 'module' },
    children: [
      {
        path: 'index',
        name: 'List',
        component: CodeList,
        meta: { title: '编码列表', icon: 'module' }
      },
      {
        path: 'details',
        name: 'listDetails',
        component: CodeListDetails,
        meta: { title: '编码详情', icon: 'form' },
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }), // history 使用 滚动到页面什么位置
  routes: constantRouterMap
})

