const {
	FRIEND_LIST_GET_SUCCESS,
	FRIEND_ADD_SUCCESS,
	FRIEND_REQ_LIST_GET_SUCCESS,
	FRIEND_DENY_SUCCESS,
} = require('../constant/successMessage')
const {
	findAll,
	agreeAddFriend,
	denyAddFriend,
	findAllReq,
	findAllReceive,
	findAllNoReadReceive,
	findIsExistReq,
	createFriendReq,
} = require('../service/friend.service')

class friendController {
	// 获取好友列表
	async findAll(ctx, next) {
		const { userId } = ctx.params
		const result = await findAll(userId)

		ctx.body = {
			code: 200,
			message: FRIEND_LIST_GET_SUCCESS,
			data: result,
		}
	}

	// 发送好友请求
	async sendFriendReq(ctx, next) {
		const { fromUid, toUid } = ctx.request.body

		const isExist = await findIsExistReq(fromUid, toUid)
		if (!isExist) {
			await createFriendReq(fromUid, toUid, 0)
		}
		ctx.body = {
			code: 200,
			message: ''
		}
	}

	// 同意添加好友
	async agreeAddFriend(ctx, next) {
		const { userId, friendId } = ctx.request.body
		await agreeAddFriend(userId, friendId)

		ctx.body = {
			code: 200,
			message: FRIEND_ADD_SUCCESS,
		}
	}

	// 拒绝添加好友
	async denyAddFriend(ctx, next) {
		const { userId, friendId } = ctx.request.body
		await denyAddFriend(userId, friendId)

		ctx.body = {
			code: 200,
			message: FRIEND_DENY_SUCCESS,
		}
	}

	// 获取用户发送过的好友请求
	async findAllReq(ctx, next) {
		const { userId } = ctx.params

		const res = await findAllReq(userId)
		ctx.body = {
			code: 200,
			message: FRIEND_REQ_LIST_GET_SUCCESS,
			data: res,
		}
	}

	// 获取用户收到的好友请求
	async findAllReceive(ctx, next) {
		const { userId } = ctx.params

		const res = await findAllReceive(userId)
		ctx.body = {
			code: 200,
			message: FRIEND_REQ_LIST_GET_SUCCESS,
			data: res,
		}
	}

	// 获取用户未读的好友请求
	async findAllNoReadReceive(ctx, next) {
		const { userId } = ctx.params
		const res = await findAllNoReadReceive(userId)

		ctx.body = {
			code: 200,
			message: '',
			data: res
		}
	}
}

module.exports = new friendController()
