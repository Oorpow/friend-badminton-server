const {
	findAllByUserIdAndFriendId,
	findAllUnRead,
	findAllUnReadWithAllFriend,
	updateOneReadStatus,
	sendMsgToFriend,
} = require('../service/message.service')
const RES_STATUS = require('../constant/httpStatus')
const {
	MESSAGE_WITH_FRIEND_GET_SUCCESS,
	MESSAGE_READ_STATUS_UPDATE_SUCCESS,
    MESSAGE_SEND_SUCCESS,
    MESSAGE_WITH_FRIEND_UNREAD_GET_SUCCESS,
	MESSAGE_ALL_UNREAD_GET_SUCCESS,
} = require('../constant/successMessage')

class MessageController {
	// 获取全部聊天记录
	async findAllByUserIdAndFriendId(ctx, next) {
		const { userId, friendId } = ctx.params
		const res = await findAllByUserIdAndFriendId(userId, friendId)

		ctx.body = {
			code: 200,
			message: MESSAGE_WITH_FRIEND_GET_SUCCESS,
			data: res,
		}
	}

	// 获取某个好友发给用户，用户未读的信息
	async findAllUnRead(ctx, next) {
		const { userId, friendId } = ctx.params
		const res = await findAllUnRead(userId, friendId)

        ctx.body = {
            code: RES_STATUS.OK,
            message: MESSAGE_WITH_FRIEND_UNREAD_GET_SUCCESS,
            data: res
        }
	}

	async findAllUnReadWithAllFriend(ctx, next) {
		const { userId } = ctx.params

		const res = await findAllUnReadWithAllFriend(userId)

		ctx.body = {
			code: 200,
			message: MESSAGE_ALL_UNREAD_GET_SUCCESS,
			data: res
		}
	}

	// 更新未读信息
	async updateOneReadStatus(ctx, next) {
		const { userId, friendId } = ctx.params
		await updateOneReadStatus(userId, friendId)

		ctx.body = {
			code: RES_STATUS.OK,
			message: MESSAGE_READ_STATUS_UPDATE_SUCCESS,
		}
	}

	// 给指定用户发送消息
	async sendMsgToFriend(ctx, next) {
		const { fromId, toId, content, type } = ctx.request.body
		await sendMsgToFriend(fromId, toId, content, type)

		ctx.body = {
			code: RES_STATUS.CREATED,
			message: MESSAGE_SEND_SUCCESS,
		}
	}
}

module.exports = new MessageController()
