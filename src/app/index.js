const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const serve = require('koa-static')

const useRoutes = require('../router/index')
const errorHandler = require('./errorHandler')

const app = new Koa()

app.useRoutes = useRoutes

// 请求体解析
app.use(bodyParser())
// 处理跨域
app.use(cors())
// 路由注册
app.useRoutes()
app.use(serve('.'))
app.use(serve('/uploads'))

// 错误处理中间件
app.on('error', errorHandler)

process.on('uncaughtException', (err) => {
    console.error('An uncaught exception occurred:', err);
  });

module.exports = app
