const Router = require('koa-router')
const multer = require('@koa/multer')
const { uploadSingleFile } = require('../controller/upload.controller')
const { saveUserSpaceBg } = require('../middleware/user.middleware')

const uploadRouter = new Router({ prefix: '/upload' })

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        let extension = file.originalname.split('.')[1]
        cb(null, file.fieldname + '-' + Date.now() + `.${extension}`)
    }
})

const upload = multer({
    storage
})

uploadRouter.post('/invitation', upload.single('invitation'), uploadSingleFile)
uploadRouter.post('/img', upload.single('img'), uploadSingleFile)
uploadRouter.post('/avatar', upload.single('avatar'), uploadSingleFile)
uploadRouter.post('/spaceBg', upload.single('spaceBg'), uploadSingleFile)

module.exports = uploadRouter
