const jwt = require('jsonwebtoken')

const { PRIVATE_KEY, PUBLIC_KEY } = require('../app/config')
const { setStatusToOnline, setStatusToOffline } = require('../service/auth.service')
const { USER_LOGIN_SUCCESS, USER_LOGOUT_SUCCESS } = require("../constant/successMessage")

class AuthController {
    async login(ctx, next) {
        const { id } = ctx.user
        
        // 签发token
        const token = jwt.sign(ctx.user, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
        })

        try {
            // 将用户的状态改为在线
            await setStatusToOnline(id)
        } catch (error) {
            console.log(error)
        }

        ctx.body = {
            code: 200,
            message: USER_LOGIN_SUCCESS,
            data: {
                user: { ...ctx.user },
                token,
            }
        }
    }

    async logout(ctx, next) {
        const { id } = ctx.request.body
        await setStatusToOffline(id)

        ctx.body = {
            code: 200,
            message: USER_LOGOUT_SUCCESS
        }
    }
}

module.exports = new AuthController()