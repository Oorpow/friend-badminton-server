const connection = require('../app/database')

class BrandService {
    async findAll() {
        const statement = `SELECT * FROM brand`
        try {
            const [res] = await connection.execute(statement)
            return res
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new BrandService()