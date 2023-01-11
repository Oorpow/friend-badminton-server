const { BRAND_ALL_GET_SUCCESS } = require('../constant/successMessage')
const { findAll } = require('../service/brand.service')

class BrandController {
    async findAll(ctx, next) {
        const res = await findAll()
        ctx.body = {
            code: 200,
            message: BRAND_ALL_GET_SUCCESS,
            data: res
        }
    }
}

module.exports = new BrandController()