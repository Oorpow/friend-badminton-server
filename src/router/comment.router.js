const Router = require('koa-router')

const { verifyToken } = require('../middleware/auth.middleware')
const { findAllById, create } = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

// 根据帖子的id获取第一层评论列表 注意(需要登录才能查看评论)
commentRouter.get('/:invitationId', findAllById)
// 发布评论
commentRouter.post('/', create)

module.exports = commentRouter