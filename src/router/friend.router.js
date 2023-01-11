const Router = require('koa-router')

const { findAll, findAllReq, findAllReceive, agreeAddFriend, denyAddFriend, sendFriendReq } = require('../controller/friend.controller')
const { verifyToken } = require('../middleware/auth.middleware')

const friendRouter = new Router({ prefix: '/friend' })

// 需要登录，登录后根据userId查看好友列表
friendRouter.get('/:userId', verifyToken, findAll)

// 根据userId查看用户发送过的好友请求
friendRouter.get('/:userId/req', verifyToken, findAllReq)

// 根据userId查看用户接受到的好友请求
friendRouter.get('/:userId/receive', verifyToken, findAllReceive)

// 根据userId查看用户未读的好友请求
friendRouter.get('/:userId/receive/no-read', verifyToken, findAllReceive)

// 发送好友请求
friendRouter.post('/send-req', verifyToken, sendFriendReq)

// 同意加好友(同样需要登录) verifyToken
friendRouter.post('/agree', verifyToken, agreeAddFriend)

// 拒绝添加好友
friendRouter.post('/deny', verifyToken, denyAddFriend)

module.exports = friendRouter
