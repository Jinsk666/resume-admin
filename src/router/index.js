import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login',name: 'login', component: () => import('@/views/login/login'), hidden: true },
  { path: '/accountLogin',name: 'accountLogin', component: () => import('@/views/login/accountLogin'), hidden: true },
  { path: '/forget',name: 'forget', component: () => import('@/views/login/forget'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

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

  // {
  //   path: '/module',
  //   component: Layout,
  //   redirect: '/module/index',
  //   name: 'Module',
  //   meta: { title: 'Module', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //   ]
  // },
  {
    path: '/resume',
    component: Layout,
    redirct: '/resume/index',
    children: [
      {
        path: 'index',
        name: 'Resume',
        component: () => import('@/views/my-resume/index'),
        meta: { title: '我的履历', icon: 'resume' }
      },
      {
        path: 'add',
        name: 'AddResume',
        component: () => import('@/views/my-resume/add'),
        meta: { title: '添加履历', icon: 'form' },
        hidden: true
      },
      {
        path: 'list',
        name: 'resumeList',
        component: () => import('@/views/my-resume/list'),
        meta: { title: '对应履历', icon: 'form' },
        hidden: true
      }
    ]
  },

  {
    path: '/module',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Module',
        component: () => import('@/views/module-sel/index'),
        meta: { title: '模板选择', icon: 'choose' }
      }
    ]
  },

  {
    path: '/list',
    component: Layout,
    redirect: '/list/index',
    name: 'ListOuter',
    meta: { title: '编码列表', icon: 'module' },
    children: [
      {
        path: 'index',
        name: 'List',
        component: () => import('@/views/code-list/index'),
        meta: { title: '编码列表', icon: 'module' }
      },
      {
        path: 'details',
        name: 'listDetails',
        component: () => import('@/views/code-list/details'),
        meta: { title: '编码详情', icon: 'form' },
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

