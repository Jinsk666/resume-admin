'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://192.168.21.197:8380/resume/V2.0"',
  BASE_API: '"http://cs.nongchangyun.cn/farmeasy-resume-service"',
  LOGIN_API:'"http://cs.nongchangyun.cn/farmeasy-api-gateway/farmeasy-auth-service"',
  PORTAL_API:'"http://cs.nongchangyun.cn/resume-portal-beta"',
})
