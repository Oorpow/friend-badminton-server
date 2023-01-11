const { uploadSingleFile } = require("../service/upload.service")

class uploadController {
    async uploadSingleFile(ctx, next) {
        const { filename, destination } = ctx.file
        const url = destination +  '/' + filename
        await uploadSingleFile(url)
        ctx.body = {
            errno: 0,
            data: {
                url
            }
        }
    }
}

module.exports = new uploadController()