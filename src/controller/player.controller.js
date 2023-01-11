const { findAll, findOne } = require("../service/player.service")
const { PLAYER_GET_SUCCESS } = require("../constant/successMessage")

class playerController {
    async findAll(ctx, next) {
        const res = await findAll()
        ctx.body = {
            code: 200,
            message: PLAYER_GET_SUCCESS,
            data: res
        }
    }
    async findOne(ctx, next) {
        const { id } = ctx.params
        const res = await findOne(id)
        ctx.body = {
            code: 200,
            message: PLAYER_GET_SUCCESS,
            data: res
        }
    }
}

module.exports = new playerController()