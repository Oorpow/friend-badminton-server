const connection = require('../app/database')

class uploadService {
	async uploadSingleFile(url) {
		const statement = `INSERT INTO invitation_img (url) VALUES (?)`
		try {
			await connection.execute(statement, [url])
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new uploadService()
