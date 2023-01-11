const Router = require('koa-router')

const {
	create,
	findBySearchVal,
	getOneById,
	updateOneBg,
	updateOneAvatar,
	updateInfo
} = require('../controller/user.controller')
const {
	verifyUserBody,
	handlePassword,
} = require('../middleware/user.middleware')

const userRouter = new Router({ prefix: '/user' })

// 注册用户: 校验表单信息 -> 密码加密 -> 存储到数据库
userRouter.post('/', verifyUserBody, handlePassword, create)
userRouter.post('/search', findBySearchVal)
userRouter.patch('/', updateInfo)
userRouter.patch('/bg', updateOneBg)
userRouter.patch('/avatar', updateOneAvatar)
userRouter.get('/:id', getOneById)

module.exports = userRouter
