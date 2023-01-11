const Router = require('koa-router')

const { findAll } = require('../controller/carousel.controller')
const { verifyToken } = require('../middleware/auth.middleware')

const carouselRouter = new Router({ prefix: '/carousel' })

carouselRouter.get('/', findAll)

module.exports = carouselRouter