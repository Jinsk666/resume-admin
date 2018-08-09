import request from '@/utils/login';
import { hex_sha1 } from '../assets/js/sha1';

// 获取验证码
export const getVerify = (phone) => {
  return request({
    url: '/auth/userInfo/sendSms',
    method: 'post',
    params: { phone },
    data: {}
  })
}
// 手机登陆
export const login = (username, password) => {
  return request({
    url: '/auth/loginWithType',
    method: 'post',
    data: {
      username: username,
      password: password,
      loginType: 1,
    }
  })
}
//账号密码登陆
export const accountLogin = (username, password) => {
  return request({
    url: '/auth/loginWithType',
    method: 'post',
    data: {
      username: username,
      password: hex_sha1( password ),
      loginType: 2
    }
  })
}
//修改密码
export const setPassword = (username, verify, password, password2) => {
  return request({
    url: '/auth/userInfo/findPassword',
    method: 'post',
    data: {
      username: username,
      authCode: verify,
      password: hex_sha1( password ),
      resurePassword: hex_sha1( password2 )
    }
  })
}
//登出
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
// 获取企业信息
export const getFactoryInfo = code => {
  return request({
    url: '/auth/enterpriseInfo/get/' + code,
    method: 'get',
    data: code
  })
}
// 添加企业信息
export const addFactoryInfo = code => {
  return request({
    url: '/auth/enterpriseInfo/addFromResume',
    method: 'post',
    data: code
  })
}
// 修改企业信息
export const editFactoryInfo = code => {
  return request({
    url: '/auth/enterpriseInfo/edit',
    method: 'put',
    data: code
  })
}

//获取省市区
export const getCountry = id => {
  return request({
    url: '/auth/area/getSonArea/'+ id,
    method: 'get'
  })
}

