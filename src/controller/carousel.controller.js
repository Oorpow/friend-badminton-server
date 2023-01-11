const { CAROUSEL_GET_SUCCESS } = require("../constant/successMessage")
const { findAll } = require("../service/carousel.service")

class CarouselController {
    async findAll(ctx, next) {
        const res = await findAll()
        ctx.body = {
            code: 200,
            message: CAROUSEL_GET_SUCCESS,
            data: res
        }
    }
}

module.exports = new CarouselController()