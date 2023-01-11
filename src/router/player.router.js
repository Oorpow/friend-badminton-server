const Router = require('koa-router')

const { findAll, findOne } = require('../controller/player.controller')

const playerRouter = new Router({ prefix: '/player' })

// 获取全部球员基本信息
playerRouter.get('/', findAll)

// 获取一个球员的信息
playerRouter.get('/:id', findOne)

module.exports = playerRouter