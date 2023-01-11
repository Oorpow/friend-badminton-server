const Router = require('koa-router')

const { findAll } = require('../controller/brand.controller')

const brandRouter = new Router({ prefix: '/brand' })

brandRouter.get('/', findAll)

module.exports = brandRouter