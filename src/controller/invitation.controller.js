const { OK } = require('../constant/httpStatus')
const {
	INVITATION_GET_SUCCESS,
	INVITATION_CREATE_SUCCESS,
	INVITATION_GET_ONE_SUCCESS,
    INVITATION_GET_BY_TAG_SUCCESS,
	INVITATION_GET_BY_USERID_SUCCESS,
	INVITATION_STARRED_SUCCESS,
	INVITATION_ORDER_BY_STARS,
	INVITATION_UNSTAR_SUCCESS,
	INVITATION_IS_STARRED,
	INVITATION_STARRED_LIST_GET_SUCCESS,
	INVITATION_GET_BY_VAL_SUCCESS,
	INVITATION_UPDATE_SUCCESS,
INVITATION_GET_BY_OFFSET,
} = require('../constant/successMessage')
const {
	findAll,
	create,
	findOne,
	findAllByTag,
	findAllByUserId,
	patchOneStarsById,
	findHotList,
	cancelOneStarsById,
	isStarred,
	findAllStarredByUserId,
	findAllBySearchVal,
	updateOneById,
	findByUserIdAndPageNum
} = require('../service/invitation.service')

class invitationController {
	async findAll(ctx, next) {
		const { pagenum } = ctx.params
		const res = await findAll(pagenum)
		
		ctx.body = {
			code: OK,
			message: INVITATION_GET_SUCCESS,
			data: res,
		}
	}
	async findOne(ctx, next) {
		const { id } = ctx.params
		const res = await findOne(id)
		ctx.body = {
			code: OK,
			message: INVITATION_GET_ONE_SUCCESS,
			data: res,
		}
	}
	async findAllByTag(ctx, next) {
		const { tagId, pagenum } = ctx.params
		const res = await findAllByTag(tagId, pagenum)

        ctx.body = {
            code: OK,
            message: INVITATION_GET_BY_TAG_SUCCESS,
            data: res
        }
	}
	// 创建一个帖子
	async create(ctx, next) {
		const { title, content, tag, img, uid } = ctx.request.body
		await create(title, content, tag, img, uid)
		ctx.body = {
			code: OK,
			message: INVITATION_CREATE_SUCCESS,
		}
	}
	// 根据用户id查询其发的所有帖子
	async findAllByUserId(ctx, next) {
		const { userId } = ctx.params
		const res = await findAllByUserId(userId)

		ctx.body = {
			code: OK,
			message: INVITATION_GET_BY_USERID_SUCCESS,
			data: res
		}
	}
	// 根据页码获取用户发布过的帖子
	async findByUserIdAndPageNum(ctx, next) {
		const { userId, pagenum } = ctx.params
		const res = await findByUserIdAndPageNum(userId, pagenum)

		ctx.body = {
			code: OK,
			message: INVITATION_GET_BY_OFFSET,
			data: res
		}
	}
	// 点赞帖子
	async patchOneStarsById(ctx, next) {
		const { userId, invitationId } = ctx.request.body
		const res = await patchOneStarsById(userId, invitationId)

		if (res) {
			ctx.body = {
				code: OK,
				message: INVITATION_STARRED_SUCCESS
			}
		}
	}
	// 查看用户是否点赞过某条帖子
	async isStarred(ctx, next) {
		const { userId, invitationId } = ctx.params
		const res = await isStarred(userId, invitationId)

		ctx.body = {
			code: OK,
			message: res ? 'T' : 'F'
		}
	}
	// 查看用户点赞过的所有帖子
	async findAllStarredByUserId(ctx, next) {
		const { id } = ctx.params
		const res = await findAllStarredByUserId(id)
		ctx.body = {
			code: OK,
			message: INVITATION_STARRED_LIST_GET_SUCCESS,
			data: res
		}
	}
	// 取消点赞
	async cancelOneStarsById(ctx, next) {
		const { userId, invitationId } = ctx.request.body

		const res = await cancelOneStarsById(userId, invitationId)
		if (res) {
			ctx.body = {
				code: OK,
				message: INVITATION_UNSTAR_SUCCESS
			}
		}
	}
	// 获取点赞数量前5位的帖子
	async findHotList(ctx, next) {
		const res = await findHotList()

		ctx.body = {
			code: 200,
			message: INVITATION_ORDER_BY_STARS,
			data: res
		}
	}
	async findAllBySearchVal(ctx, next) {
		const { val } = ctx.request.body

		const res = await findAllBySearchVal(val)
		
		ctx.body = {
			code: OK,
			message: INVITATION_GET_BY_VAL_SUCCESS,
			data: res
		}
	}
	async updateOneById(ctx, next) {
		const { invId, title, content, img, tag } = ctx.request.body

		try {
			await updateOneById({
				id: invId,
				title,
				content,
				img,
				tag
			})
			ctx.body = {
				code: OK,
				message: INVITATION_UPDATE_SUCCESS
			}
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new invitationController()
