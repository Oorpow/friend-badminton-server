const connection = require('../app/database')

class TagService {
    // 获取全部标签
	async findAllTag() {
		const statement = `SELECT * FROM tag`
		try {
			const [res] = await connection.execute(statement)
			return res
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new TagService()