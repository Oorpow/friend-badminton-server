const Router = require('koa-router')

const {
	findAll,
	findOne,
	findAllByTag,
	findAllByUserId,
    findHotList,
	findAllStarredByUserId,
	findAllBySearchVal,
	findByUserIdAndPageNum,
	create,
    patchOneStarsById,
	cancelOneStarsById,
	updateOneById,
	isStarred,
} = require('../controller/invitation.controller')

const invitationRouter = new Router({ prefix: '/invitation' })

// 获取全部帖子
invitationRouter.get('/pagenum/:pagenum', findAll)
// 获取点赞数量靠前的帖子
invitationRouter.get('/star', findHotList)
invitationRouter.get('/tag/:tagId/pagenum/:pagenum', findAllByTag)
invitationRouter.get('/user/:userId', findAllByUserId)
invitationRouter.get('/starred/list/:id', findAllStarredByUserId)
invitationRouter.get('/starred/:userId/:invitationId', isStarred)
invitationRouter.get('/:id', findOne)
invitationRouter.get('/user/:userId/pagenum/:pagenum', findByUserIdAndPageNum)
invitationRouter.post('/', create)
invitationRouter.patch('/update', updateOneById)
invitationRouter.post('/search', findAllBySearchVal)
// 点赞某个帖子
invitationRouter.patch('/star', patchOneStarsById)
// 取消点赞
invitationRouter.patch('/unstar', cancelOneStarsById)

module.exports = invitationRouter
