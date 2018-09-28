import Vue from 'vue'
import Router from 'vue-router'
/** Webpack 实现路由懒加载 */
/*********   V1   *************/
const Home = r => require.ensure([], () => r( require('../views/home/home') ), 'home')
const Layout = r => require.ensure([], () => r( require('../views/layout/Layout') ), 'layout')
const Login = r => require.ensure([], () => r( require('../views/login/login') ), 'login')
const AccountLogin = r => require.ensure([], () => r( require('../views/login/accountLogin') ), 'accountLogin')
const Forget = r => require.ensure([], () => r( require('../views/login/forget') ), 'forget')
const Errors = r => require.ensure([], () => r( require('../views/404') ), 'error')
// const Myresume = r => require.ensure([], () => r( require('../views/my-resume/index') ), 'myresume')
// const Addresume = r => require.ensure([], () => r( require('../views/my-resume/add') ), 'addresume')
// const Listresume = r => require.ensure([], () => r( require('../views/my-resume/list') ), 'listresume')
// const CodeList = r => require.ensure([], () => r( require('../views/code-list/index') ), 'codelist')
// const CodeListDetails = r => require.ensure([], () => r( require('../views/code-list/details') ), 'codelistdetails')
const Factory = r => require.ensure([], () => r( require('../views/factory/index') ), 'factory')

/*********   V2   *************/
  // 产品模版
const TemplateIndex = r => require.ensure([], () => r( require('../views/template/index') ), 'template-index')
const TemplateAdd = r => require.ensure([], () => r( require('../views/template/add') ), 'template-add')

  // 数据采集
const CollectionMaterial = r => require.ensure([], () => r( require('../views/collection/material') ), 'collection-material')
const CollectionAddMaterial = r => require.ensure([], () => r( require('../views/collection/add-material') ), 'collection-add-material')
const CollectionViewMaterial = r => require.ensure([], () => r( require('../views/collection/view-material') ), 'collection-view-material')
const CollectionFactory = r => require.ensure([], () => r( require('../views/collection/factory') ), 'collection-factory')
const CollectionAddFactory = r => require.ensure([], () => r( require('../views/collection/add-factory') ), 'collection-add-factory')
const CollectionViewFactory = r => require.ensure([], () => r( require('../views/collection/view-factory') ), 'collection-view-factory')
const CollectionProcess = r => require.ensure([], () => r( require('../views/collection/process') ), 'collection-process')
const CollectionAddProcess = r => require.ensure([], () => r( require('../views/collection/add-process') ), 'collection-add-process')
const CollectionViewProcess = r => require.ensure([], () => r( require('../views/collection/view-process') ), 'collection-view-process')
const CollectionIndex = r => require.ensure([], () => r( require('../views/collection/index') ), 'collection-index')

  // 赋码
const AssignmentIndex = r => require.ensure([], () => r( require('../views/assignment/index') ), 'assignment-index')
const AssignmentAdd = r => require.ensure([], () => r( require('../views/assignment/add') ), 'assignment-add')
const AssignmentQrcode = r => require.ensure([], () => r( require('../views/assignment/qrcode') ), 'assignment-qrcode')
const AssignmentDetails = r => require.ensure([], () => r( require('../views/assignment/details') ), 'assignment-details')
const AssignmentProductBatch = r => require.ensure([], () => r( require('../views/assignment/product-batch') ), 'assignment-product-batch')
const AssignmentMap = r => require.ensure([], () => r( require('../views/assignment/map') ), 'assignment-map')

  // 统计
const StayTunedIndex = r => require.ensure([], () => r( require('../components/v2/static/index') ), 'stay-tuned-index');

Vue.use(Router)

export const constantRouterMap = [
  /** app 路由 */
  { path: '/login',name: 'login', component: Login, hidden: true },
  { path: '/accountLogin',name: 'accountLogin', component: AccountLogin, hidden: true },
  { path: '/forget',name: 'forget', component: Forget, hidden: true },
  { path: '/404', component: Errors, hidden: true },
  { path: '*', redirect: '/404', hidden: true },

  /** layout 路由 */
  // 企业信息
  {
    path: '/factory',
    component: Layout,
    redirect: '/factory/index',
    name: 'factoryAll',
    hidden: true,
    children: [{
      path: '/index',
      name: 'factory',
      component: Factory,
    }]
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'homeOuter',
    //hidden: true,
    children: [{
      path: '/home',
      component: Home,
      name: 'home',
      meta: { title: '首页', icon: 'resume' },
    }]
  },
  // 我的履历
  // {
  //   path: '/resume',
  //   component: Layout,
  //   redirct: '/resume/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Resume',
  //       component: Myresume,
  //       meta: { title: '我的履历', icon: 'resume' },
  //     },
  //     {
  //       path: 'add',
  //       name: 'AddResume',
  //       component: Addresume,
  //       meta: { title: '添加履历', icon: 'form' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       name: 'resumeList',
  //       component: Listresume,
  //       meta: { title: '对应履历', icon: 'form' },
  //       hidden: true
  //     }
  //   ]
  // },
  // // 编码列表
  // {
  //   path: '/list',
  //   component: Layout,
  //   redirect: '/resume/index',
  //   name: 'ListOuter',
  //   meta: { title: '编码列表', icon: 'module' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'List',
  //       component: CodeList,
  //       meta: { title: '编码列表', icon: 'module' }
  //     },
  //     {
  //       path: 'details',
  //       name: 'listDetails',
  //       component: CodeListDetails,
  //       meta: { title: '编码详情', icon: 'form' },
  //       //hidden: true
  //     }
  //   ]
  // },
  /****************    V2   **************************/
  // 产品模版
  {
    path: '/template',
    component: Layout,
    redirct: '/template/index',
    children: [
      { path: 'index', name: 'templateIndex', component: TemplateIndex, meta: {title: '产品管理', icon: 'product'} },
      { path: 'add', name: 'templateAdd', component: TemplateAdd, meta: {title: '添加产品模版', icon: 'add-resume'}, hidden: true }
    ]
  },
  // 数据采集
  {
    path: '/collection',
    component: Layout,
    redirect: '/collection/index',
    name:'collection',
    meta: { title: '溯源数据', icon : 'data' },
    children: [
      { path: 'index', name: 'collectionIndex', component: CollectionIndex, meta: { title: '溯源数据', icon: 'data' }, hidden: true },
      { path: 'factory', name: 'collectionFactory', component: CollectionFactory, meta: { title: '企业信息', icon: 'factory' } },
      { path: 'add-factory', name: 'collectionAddFactory', component: CollectionAddFactory, meta: { title: '添加企业', icon: 'module' }, hidden: true },
      { path: 'view-factory', name: 'collectionViewFactory', component: CollectionViewFactory, meta: { title: '查看企业', icon: 'module' }, hidden: true },
      { path: 'material', name: 'collectionMaterial', component: CollectionMaterial, meta: { title: '原料信息', icon: 'material' } },
      { path: 'add-material', name: 'collectionAddMaterial', component: CollectionAddMaterial, meta: { title: '添加原料信息', icon: 'module' },hidden: true },
      { path: 'view-material', name: 'collectionViewMaterial', component: CollectionViewMaterial, meta: { title: '查看原料信息', icon: 'module' }, hidden: true },
      { path: 'process',  name: 'collectionProcess', component: CollectionProcess, meta: { title: '环节信息', icon: 'step' } },
      { path: 'add-process',  name: 'collectionAddProcess', component: CollectionAddProcess, meta: { title: '添加信息', icon: 'module' }, hidden: true },
      { path: 'view-process',  name: 'collectionViewProcess', component: CollectionViewProcess, meta: { title: '查看信息', icon: 'module' }, hidden: true },
    ]
  },
  // 赋码
  {
    path: '/assignment',
    component: Layout,
    redirect: '/assignment/index',
    name:'assignment',
    meta: { title: '履历赋码', icon : 'resume-code' },
    children: [
      { path: 'index', name: 'assignmentIndex', component: AssignmentIndex, meta: { title: '履历赋码', icon: 'index-resume' }, hidden: true },
      { path: 'add', name: 'assignmentAdd', component: AssignmentAdd, meta: { title: '新建履历', icon: 'add-resume' } },
      { path: 'product-batch', name: 'assignmentProductBatch', component: AssignmentProductBatch, meta: { title: '产品批次管理', icon: 'batch-code' } },
      { path: 'qrcode', name: 'assignmentQrcode', component: AssignmentQrcode, meta: { title: '二维码管理', icon: 'qrcode' } },
      { path: 'details', name: 'assignmentDetails', component: AssignmentDetails, meta: { title: '编码详情', icon: 'module' }, hidden: true },
      { path: 'map', name: 'assignmentMap', component: AssignmentMap, meta: { title: '对应履历', icon: 'module' }, hidden: true },
    ]
  },
  // 统计分析
  {
    path: '/statistics',
    component: Layout,
    redirct: '/statistics/index',
    meta: { title: '统计分析', icon : 'static' },
    children: [
      { path: 'idnex', name: 'StayTunedIndex', component: StayTunedIndex, meta: {title: '统计分析', icon: 'static'} }
    ],
  }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }), // history 使用 滚动到页面什么位置
  routes: constantRouterMap
})

