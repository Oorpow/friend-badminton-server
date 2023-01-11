const connection = require('../app/database')

const formatFriendInfo = (list) => {
    const result = list.map(item => {
        item.friendInfo = {
            userId: item.userId,
            name: item.name,
            avatar: item.avatar,
            status: item.status
        }
        delete item.userId
        delete item.name
        delete item.avatar
        delete item.status
        return item
    })
    return result
}

class MessageService {
    // 获取与某个好友的全部聊天记录
    async findAllByUserIdAndFriendId(userId, friendId) {
        const statement = `
            SELECT f.id, f.from_uid, f.to_uid, f.content, f.is_read, f.create_at, f.type, u.id userId, u.name, u.avatar, u.status  
            FROM friend_msg_record f, user u 
            WHERE (u.id = ? AND f.from_uid = ? AND f.to_uid = ?) 
            OR (u.id = ? AND f.from_uid = ? AND f.to_uid = ?)
            ORDER BY f.create_at
        `

        try {
            const [res] = await connection.execute(statement, [userId, userId, friendId, friendId, friendId, userId])
            const result = formatFriendInfo(res)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async findAllUnRead(userId, friendId) {
        const statement = `
            SELECT f.id, f.from_uid, f.to_uid, f.content, f.is_read, f.create_at, f.type, u.id userId, u.name, u.avatar, u.status  
            FROM friend_msg_record f, user u
            WHERE f.from_uid = u.id
            AND f.from_uid = ? AND f.to_uid = ?
            AND f.is_read = 0
            ORDER BY f.create_at;
        `
        try {
            const [res] = await connection.execute(statement, [friendId, userId])
            const result = formatFriendInfo(res)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    // 用户修改记录的阅读状态为已读
    async updateOneReadStatus(userId, friendId) {
        const statement = `UPDATE friend_msg_record SET is_read = 1 WHERE from_uid = ? AND to_uid = ?;`

        try {
            await connection.execute(statement, [userId, friendId])
        } catch (error) {
            console.log(error)
        }
    }

    // 给某个好友发消息
    async sendMsgToFriend(fromId, toId, content, type) {
        const statement = `INSERT INTO friend_msg_record (from_uid, to_uid, content, type) VALUES (?, ?, ?, ?)`
        try {
            await connection.execute(statement, [fromId, toId, content, type])
        } catch (error) {
            console.log(error)
        }
    }

    // 获取某个用户所有的未读信息
    async findAllUnReadWithAllFriend(userId) {
        const statement = `
            SELECT f.id, f.from_uid, f.to_uid, f.content, f.is_read, f.create_at, f.type
            FROM friend_msg_record f, user u
            WHERE f.to_uid = u.id
            AND f.to_uid = ?
            AND f.is_read = 0
            ORDER BY f.create_at;
        `

        try {
            const [res] = await connection.execute(statement, [userId])
            return res
        } catch (error) {
            console.log(error)   
        }
    }
}

module.exports = new MessageService()