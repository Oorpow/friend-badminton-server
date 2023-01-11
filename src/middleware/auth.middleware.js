const jwt = require('jsonwebtoken')

const handleCryptoPassword = require('../utils/handleCryptoPassword')
const { getOneByUserName } = require('../service/user.service')
const {
	ERR_NO_USERNAME_OR_PASSWORD,
	ERR_USER_NO_EXIST,
	ERR_PASSWORD_NOT_MATCH,
	ERR_TOKEN_EXPIRED,
} = require('../constant/errMessage')
const { PUBLIC_KEY } = require('../app/config')

// 用户登录验证
const verifyUserLogin = async (ctx, next) => {
	// 1. 验证用户名、密码是否为空
	const { name, password } = ctx.request.body

	if (!name || !password) {
		const error = new Error(ERR_NO_USERNAME_OR_PASSWORD)
		return ctx.app.emit('error', error, ctx)
	}

	// 2. 验证是否存在于数据库
	const isExist = await getOneByUserName(name)
	if (isExist.length === 0) {
		const error = new Error(ERR_USER_NO_EXIST)
		return ctx.app.emit('error', error, ctx)
	}

	// 3. 验证密码是否与库中一致
	const afterCryptoPwd = handleCryptoPassword(password)
	// 密码不一致
	if (afterCryptoPwd !== isExist[0].password) {
		const error = new Error(ERR_PASSWORD_NOT_MATCH)
		return ctx.app.emit('error', error, ctx)
	}
	ctx.user = isExist[0]
	ctx.user.password = password
	await next()
}

// 校验用户token有效性
const verifyToken = async (ctx, next) => {
	const authorization = ctx.headers.authorization
	const token = authorization.replace('Bearer ', '')

	try {
		const res = jwt.verify(token, PUBLIC_KEY, {
			algorithm: ['RS256'],
		})
		ctx.user = res

		await next()
	} catch (error) {
		const err = new Error(ERR_TOKEN_EXPIRED)
		return ctx.app.emit('error', err, ctx)
	}
}

module.exports = {
	verifyUserLogin,
	verifyToken,
}
