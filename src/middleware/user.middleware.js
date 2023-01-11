const { ERR_NO_USERNAME_OR_PASSWORD, ERR_USER_EXIST } = require('../constant/errMessage')
const userService = require("../service/user.service")
const handleCryptoPassword = require('../utils/handleCryptoPassword')

const verifyUserBody = async (ctx, next) => {
    const { name, password } = ctx.request.body

    // 1. 判断用户填写的表单信息是否有误
    if (!name || !password) {
        const error = new Error(ERR_NO_USERNAME_OR_PASSWORD)
        return ctx.app.emit('error', error, ctx)
    }

    // 2. 通过用户名判断用户是否已经注册
    const isExist = await userService.getOne(name)
    // 2.1 用户已被注册，提示信息
    if (isExist.length !== 0) {
        const error = new Error(ERR_USER_EXIST)
        return ctx.app.emit('error', error, ctx)
    }
    
    // 3. 表单校验通过，进入下一个中间件
    await next()
}

// 对请求体的密码进行md5加密，加密完毕后重新加入到请求体中
const handlePassword = async (ctx, next) => {
    const { password } = ctx.request.body
    ctx.request.body.password = handleCryptoPassword(password)
    await next()
}

module.exports = {
    verifyUserBody,
    handlePassword,
}