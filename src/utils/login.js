import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.LOGIN_API, // api的base_url
  timeout: 6000 // 请求超时时间
})

//request拦截器
service.interceptors.request.use(config => {
    config.headers['Platform-Secret'] = '08xwwf336woy1688uudkelyyhl3i13mk';
    config.headers['Platform-Code'] = '1s7kc8zvwwat';
    if( getToken() )config.headers['Access-Token'] = getToken();
    return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

//respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if(res.code != '0000') {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
