const Router = require('koa-router')

const { login, logout, refreshAuth } = require('../controller/auth.controller')
const { verifyUserLogin } = require('../middleware/auth.middleware')

const authRouter = new Router({ prefix: '/login' })

// 用户登录: 校验用户提交的表单信息 -> 根据信息查找数据库是否存在匹配的用户 -> 签发token
authRouter.post('/', verifyUserLogin, login)

authRouter.post('/out', logout)

module.exports = authRouter