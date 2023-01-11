const connection = require('../app/database')

const updateFriendStatus = async (status, fromId, toId) => {
    const statement = `UPDATE friend_request SET status = ? WHERE from_uid = ? AND to_uid = ?`
    await connection.execute(statement, [status, fromId, toId])
    return true
}

module.exports = {
    updateFriendStatus
}