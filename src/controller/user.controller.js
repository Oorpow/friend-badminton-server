const { OK } = require('../constant/httpStatus')
const {
	USER_CREATE_SUCCESS,
	USER_GET_SUCCESS_BY_SEARCH,
	USER_BG_UPDATE_SUCCESS,
	USER_AVATAR_UPDATE_SUCCESS,
	USER_INFO_UPDATE_SUCCESS,
} = require('../constant/successMessage')
const {
	getOne,
	create,
	getOneById,
	updateOneBg,
    updateOneAvatar,
	updateInfo
} = require('../service/user.service')
const handleCryptoPassword = require('../utils/handleCryptoPassword')

class UserController {
	async create(ctx, next) {
		const { name, password, avatar } = ctx.request.body
		await create(name, password, avatar)

		ctx.body = {
			code: 200,
			message: USER_CREATE_SUCCESS,
		}
	}

	async findBySearchVal(ctx, next) {
		const { username } = ctx.request.body
		const result = await getOne(username)

		ctx.body = {
			code: 200,
			message: USER_GET_SUCCESS_BY_SEARCH,
			data: result,
		}
	}

	// 根据id获取用户信息
	async getOneById(ctx, next) {
		const { id } = ctx.params
		const res = await getOneById(id)

		ctx.body = {
			code: 200,
			message: USER_GET_SUCCESS_BY_SEARCH,
			data: res,
		}
	}

	// 更新用户信息
	async updateInfo(ctx, next) {
		const { id, name, password, desc } = ctx.request.body
		let cryptoPassword = handleCryptoPassword(password)
		const res = await updateInfo(id, name, cryptoPassword, desc)

		ctx.body = {
			code: res && OK,
			message: USER_INFO_UPDATE_SUCCESS
		}
	}

	async updateOneBg(ctx, next) {
		const { userId, url } = ctx.request.body
		await updateOneBg(userId, url)

		ctx.body = {
			code: 200,
			message: USER_BG_UPDATE_SUCCESS
		}
	}

    async updateOneAvatar(ctx, next) {
		const { userId, url } = ctx.request.body
        await updateOneAvatar(userId, url)

        ctx.body = {
			code: 200,
			message: USER_AVATAR_UPDATE_SUCCESS
		}
    }
}

module.exports = new UserController()
