import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
	baseURL: process.env.BASE_API, // api的base_url
	timeout: 6000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
	if (store.getters.token) {
		config.headers['Access-Token'] = getToken()
	}
	config.headers['Platform-Secret'] = '08xwwf336woy1688uudkelyyhl3i13mk';
    config.headers['Platform-Code'] = '1s7kc8zvwwat';
	return config
}, error => {
	console.log(error)
	Promise.reject(error)
})

//respone拦截器
service.interceptors.response.use(
  	response => {
		const res = response.data
		if (res.code != '0000') {
			Message({
				message: res.message,
				type: 'error',
				duration: 5 * 1000
			})
			if (res.code == '2000') {
				store.dispatch('FedLogOut').then(() => {
					location.reload()// 为了重新实例化vue-router对象 避免bug
				})
				// MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
				// 	confirmButtonText: '重新登录',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	debugger
				// 	store.dispatch('FedLogOut').then(() => {
				// 		location.reload()// 为了重新实例化vue-router对象 避免bug
				// 	})
				// })
			}
      		return Promise.reject('error')
		} else {
			return response.data
		}
  	},
	error => {
		console.log('err' + error)
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

export default service
