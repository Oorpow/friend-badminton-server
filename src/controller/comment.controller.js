const { COMMENT_GET_SUCCESS, COMMENT_CREATE_SUCCESS } = require("../constant/successMessage")
const { findAllById, create } = require("../service/comment.service")

class commentController {
    async findAllById(ctx, next) {
        const { invitationId } = ctx.params
        const res = await findAllById(invitationId)
        ctx.body = {
            code: 200,
            message: COMMENT_GET_SUCCESS,
            data: res
        }
    }
    async create(ctx, next) {
        const { content, inv_id, parent_id, user_id } = ctx.request.body
        await create(content, inv_id, parent_id, user_id)
        ctx.body = {
            code: 200,
            message: COMMENT_CREATE_SUCCESS
        }
    }
}

module.exports = new commentController()