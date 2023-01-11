const {
	ERR_NO_USERNAME_OR_PASSWORD,
	ERR_USER_EXIST,
	ERR_USER_NO_EXIST,
	ERR_PASSWORD_NOT_MATCH,
	ERR_TOKEN_EXPIRED
} = require('../constant/errMessage')

const { BAD_REQUEST, UN_AUTHORIZED } = require('../constant/httpStatus')

const errorHandler = (err, ctx) => {
	console.log(err)
	let status, message

	switch (err.message) {
		case ERR_NO_USERNAME_OR_PASSWORD:
			status = BAD_REQUEST
			message = '用户名或密码不能为空'
			break
		case ERR_USER_EXIST:
			status = BAD_REQUEST
			message = '用户已被占用'
			break
		case ERR_USER_NO_EXIST:
			status = BAD_REQUEST
			message = '用户不存在'
			break
		case ERR_PASSWORD_NOT_MATCH:
			status = BAD_REQUEST
			message = '密码不匹配'
			break
		case ERR_TOKEN_EXPIRED:
			status = UN_AUTHORIZED
			message = 'token失效'
			break
		default:
			status = BAD_REQUEST
			message = '出错了'
			break
	}

	ctx.status = status
	ctx.body = message
}

module.exports = errorHandler
