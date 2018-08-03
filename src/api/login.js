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

