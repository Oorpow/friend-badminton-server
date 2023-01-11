const http = require('http')
const { Server } = require('socket.io')

const {
	createFriendReq,
	findIsExistReq,
	agreeAddFriend,
	denyAddFriend,
	findAll,
} = require('../service/friend.service')
const { NO_HANDLE } = require('../constant/friendStatus')
const {
	FRIEND_REQ_EXISTS,
	FRIEND_REQ_SEND_SUCCESS,
} = require('../constant/successMessage')
const app = require('./index')

const server = http.createServer(app.callback())


// socket配置项
const io = new Server(server, {
	serveClient: false,
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

// 保存已连接用户的信息
const userMap = new Map()

const emitFriendLineStatus = (friendList, userMap, currentUser, isOnline) => {
    friendList.forEach((item) => {
        const friendInfo = userMap.get(item.friendInfo.name)

        // 如果对方用户也在线
        if (friendInfo) {
            io.to(friendInfo.socketId).emit('line_status_change', currentUser.name, isOnline)
        }
    })
}

// 监听用户连接
io.on('connection', (socket) => {
	// 用户上线以后，保存该用户的socket实例等信息, 并且主动向用户推送信息
	socket.on('online', async (userInfo) => {
		userMap.set(userInfo.name, {
			socketId: socket.id,
			...userInfo,
		})

		const user = userMap.get(userInfo.name)

		try {
			// 上线操作
			const friendList = await findAll(user.id)
			// 用户上线了，通知其他在线好友他上线了
			emitFriendLineStatus(friendList, userMap, user, true)
		} catch (error) {
			console.log(error)
		}
		// 向用户推送离线时收到的信息
		// io.to(user.socketId).emit('offline_message')
	})

	// 用户离线，需要通知其好友
	socket.on('offline', async (name) => {
		const user = userMap.get(name)
		if (user) {
			// 下线操作
			try {
				const friendList = await findAll(user.id)
				emitFriendLineStatus(friendList, userMap, user, false)
				userMap.delete(name)
			} catch (error) {
				console.log(error)
			}
		}
    })

	// 监听用户发送添加好友请求, 得到发送者、接收者的信息，将好友请求转发给接收者
	socket.on('send_req', async (targetName, selfName, selfId) => {
		const targetInfo = userMap.get(targetName)
		const currentUserInfo = userMap.get(selfName)

		// 向目标用户发送好友请求(在线情况下)
		if (targetInfo.socketId) {
			// (将好友请求记录插入到数据中)是否已经发过好友请求?
			const existReq = await findIsExistReq(selfId, targetInfo.id)
			if (existReq) {
				// 没发过
				const res = await createFriendReq(
					selfId,
					targetInfo.id,
					NO_HANDLE
				)
				if (res) {
					io.to(currentUserInfo.socketId).emit(
						'send_req_result',
						true,
						FRIEND_REQ_SEND_SUCCESS
					)
				} else {
					io.to(currentUserInfo.socketId).emit(
						'send_req_result',
						false,
						FRIEND_REQ_SEND_SUCCESS
					)
				}
			} else {
				// 已经发送过请求了
				io.to(currentUserInfo.socketId).emit(
					'send_req_repeat',
					FRIEND_REQ_EXISTS
				)
			}

			// 提醒对方用户，有新的好友请求
			io.to(targetInfo.socketId).emit('receive_req', currentUserInfo)
		} else {
			// 离线情况下???
		}
	})

	// 用户处理好友请求 userInfo己方 friendInfo对方
	socket.on('handle_req', async (userInfo, friendInfo, isAccept) => {
		let targetInfo = userMap.get(friendInfo.name)
		let selfInfo = userMap.get(userInfo.name)

		if (isAccept) {
			// 用户同意了好友请求
			await agreeAddFriend(friendInfo.userId, userInfo.id)
		} else {
			//  用户拒绝了好友请求
			await denyAddFriend(friendInfo.userId, userInfo.id)
		}

		// 对方用户已经处理了好友请求
		io.to(targetInfo.socketId).emit(
			'req_handle_done',
			userInfo.name,
			isAccept
		)
		io.to(selfInfo.socketId).emit('req_handle_done_self')
	})

	// 用户发送私聊消息
	socket.on('private_msg', async (userInfo, friendInfo, content) => {
		const targetInfo = userMap.get(friendInfo.name)
		const selfInfo = userMap.get(userInfo.name)

		try {
			io.to(targetInfo.socketId).emit('get_private_msg', selfInfo.id)
		} catch (error) {
			console.log(error)
		}
	})
})

module.exports = server
