const connection = require('../app/database')

class CarouselService {
    async findAll() {
        const statement = `SELECT * FROM carousel`
        try {
            const [res] = await connection.execute(statement)
            return res
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new CarouselService()