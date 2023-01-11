const connection = require('../app/database')
const { ACCEPT, DENY } = require('../constant/friendStatus')
const { updateFriendStatus } = require('../utils/updateFriendStatus')

const { getOneById } = require('./user.service')

class friendService {
    // 获取好友列表
	async findAll(id) {
		const statement = `
            SELECT f.id, uid userId, friend_id, us.name username, us.avatar, us.status
            FROM friend f, user us
            WHERE f.friend_id = us.id
            AND f.uid = ?
        `
        try {
            const [res] = await connection.execute(statement, [id])
            const list = res.map(item => {
                item.friendInfo = {
                    id: item.friend_id,
                    name: item.username,
                    avatar: item.avatar,
                    status: item.status
                }

                delete item.friend_id
                delete item.username
                delete item.avatar
                delete item.status
                return item
            })
            return list
        } catch (error) {
            console.log(error)
        }
	}

    // 查看是否已经存在一条匹配的好友请求
    async findIsExistReq(fromId, toId) {
        // 判断是否已经存在该好友请求了，如果存在就不需要再添加进去了
        const statement = `SELECT * FROM friend_request WHERE from_uid = ? AND to_uid = ?`
        try {
            const [res] = await connection.execute(statement, [fromId, toId])
            return res.length === 0
        } catch (error) {
            console.log(error)
        }
        
    }

    // 发送好友申请
    async createFriendReq(fromId, toId, status) {
        const statement = `INSERT INTO friend_request (from_uid, to_uid, status) VALUES (?, ?, ?);`
        try {
            const [res] = await connection.execute(statement, [fromId, toId, status])
            return res
        } catch (error) {
            console.log(error)
        }
    }

    // 获取发送过的好友请求
    async findAllReq(id) {
        const statement = `
            SELECT fr.id, u.id userId, u.name, fr.status, u.avatar, fr.create_at
            FROM friend_request fr, user u
            WHERE fr.to_uid = u.id
            AND fr.from_uid = ?
        `

        try {
            const [res] = await connection.execute(statement, [id])
            return res
        } catch (error) {
            console.log(error)
        }
    }

    // 获取接收到的好友请求
    async findAllReceive(id) {
        const statement = `
            SELECT fr.id, u.id userId, u.name, fr.status, u.avatar, fr.create_at
            FROM friend_request fr, user u
            WHERE fr.from_uid = u.id
            AND fr.to_uid = ?
        `

        try {
            const [res] = await connection.execute(statement, [id])
            return res
        } catch (error) {
            console.log(error)
        }
        
    }

    // 同意加好友 (同意加好友的是接收者，传入该好友申请的发送者id，以及接收者id)
    async agreeAddFriend(senderId, receiverId) {
        const statement = `INSERT INTO friend (uid, friend_id) VALUES (?, ?)`

        try {
            // 好友添加是双向的
            await connection.execute(statement, [senderId, receiverId])
            await connection.execute(statement, [receiverId, senderId])

            // 根据请求发送者、请求接收者获取对应的好友申请记录，并修改该条记录的状态为1
            await updateFriendStatus(ACCEPT, senderId, receiverId)
            return true
        } catch (error) {
            console.log(error)
        }
    }

    // 拒绝添加好友
    async denyAddFriend(senderId, receiverId) {
        try {
            // 找到对应的好友申请记录，并修改该条记录的状态为2
            await updateFriendStatus(DENY, senderId, receiverId)
        } catch (error) {
            console.log(error)
        }
    }

    // 获取用户所有未读请求
    async findAllNoReadReceive(id) {
        const statement = `
            SELECT fr.id, u.id userId, u.name, fr.status, u.avatar, fr.create_at, fr.is_read
            FROM friend_request fr, user u
            WHERE fr.from_uid = u.id
            AND fr.to_uid = ?
            AND fr.is_read = 0
        `

        try {
            const [res] = await connection.execute(statement, [id])
            return res
        } catch (error) {
            console.log(error)
        }
        
    }

    // 将所有未读请求更新为已读
    async updateReadStatus(id) {
        // 先拿到用户所有未读的好友请求
        const statement = `UPDATE friend_request SET is_read = 1 WHERE to_uid = ? AND is_read = 0;`
        try {
            // 更新状态为已读
            await connection.execute(statement, [id])
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new friendService()
