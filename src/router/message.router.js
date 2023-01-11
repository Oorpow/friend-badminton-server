const Router = require('koa-router')

const {
	findAllByUserIdAndFriendId,
	findAllUnRead,
	findAllUnReadWithAllFriend,
	updateOneReadStatus,
	sendMsgToFriend,
} = require('../controller/message.controller')

const messageRouter = new Router({ prefix: '/message' })

// 获取用户与某个好友之间的聊天记录
messageRouter.get('/:userId/:friendId', findAllByUserIdAndFriendId)

// 获取某个用户所有未读的信息
messageRouter.get('/unread/num/:userId', findAllUnReadWithAllFriend)

// 获取某个好友发给用户，而用户未读的信息
messageRouter.get('/unread/:userId/:friendId', findAllUnRead)

// 给指定好友发送消息
messageRouter.post('/', sendMsgToFriend)

// 处理未读信息，将状态更新为已读
messageRouter.put('/unread/:userId/:friendId', updateOneReadStatus)

module.exports = messageRouter
