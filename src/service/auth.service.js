const connection = require('../app/database')

class AuthService {
    // 用户在线
    async setStatusToOnline(id) {
        const statement = `UPDATE user SET status = 1 WHERE id = ?;`
        try {
            await connection.execute(statement, [id])
        } catch (error) {
            console.log(error)
        }
    }
    
    // 用户离线
    async setStatusToOffline(id) {
        const statement = `UPDATE user SET status = 0 WHERE id = ?;`
        try {
            await connection.execute(statement, [id])
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new AuthService();