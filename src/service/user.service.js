const connection = require('../app/database')

class UserService {
	// 创建一个用户
	async create(name, password) {
		try {
			const statement = `INSERT INTO user (name, password) VALUES (?, ?);`
			const res = await connection.execute(statement, [
				name,
				password,
			])
			return res
		} catch (error) {
            console.log(error)
        }
	}

	// 根据用户名获取用户信息(模糊查询)
	async getOne(name) {
		const statement = `
			SELECT u.id, u.name, u.avatar, u.status, u.space_bg 
			FROM user u WHERE name LIKE CONCAT('%', ?, '%');
		`
		try {
			const res = await connection.execute(statement, [name])
			return res[0]
		} catch (error) {
			console.log(error)
		}
	}

	// 匹配登录用户的用户名
	async getOneByUserName(name) {
		const statement = `SELECT * FROM user u WHERE name = ?;`
		try {
			const res = await connection.execute(statement, [name])
			return res[0]
		} catch (error) {
			console.log(error)
		}
	}

	// 根据id查找用户信息
	async getOneById(id) {
		const statement = `
            SELECT u.id id, u.name name, u.avatar, u.space_bg, u.description
            FROM user u
            WHERE id = ?
        `

		try {
			const [res] = await connection.execute(statement, [id])
			return res[0]
		} catch (error) {
			console.log(error)
		}
	}

	async updateInfo(id, name, password, description) {
		const statement = `
			UPDATE user SET name = ?, password = ?, description = ? WHERE id = ?
		`
		try {
			const [res] = await connection.execute(statement, [name, password, description, id])
			if (res.affectedRows) {
				return true
			}
		} catch (error) {
			console.log(error)
		}
	}

	// 更新用户空间背景
	async updateOneBg(id, url) {
		const statement = `UPDATE user SET space_bg = ? WHERE id = ?`
		try {
			const [res] = await connection.execute(statement, [url, id])
			console.log(res)
		} catch (error) {
			console.log(error)
		}
	}

	// 更新用户头像
	async updateOneAvatar(id, url) {
		const statement = `UPDATE user SET avatar = ? WHERE id = ?`
		try {
			await connection.execute(statement, [url, id])
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new UserService()
