const { TAG_GET_SUCCESS } = require('../constant/successMessage')
const { findAllTag } = require('../service/tag.service')

class TagController {
    // 获取全部帖子标签
    async findAllTag(ctx, next) {
        const res = await findAllTag()
        ctx.body = {
            code: 200,
            message: TAG_GET_SUCCESS,
            data: res
        }
    }
}

module.exports = new TagController()