const Router = require('koa-router')

const { findAllTag } = require('../controller/tag.controller')

const tagRouter = new Router({ prefix: '/tag' })

tagRouter.get('/', findAllTag)

module.exports = tagRouter