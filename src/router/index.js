const fs = require('fs')

// 读取router文件夹下的所有路由文件，完成路由的注册
const useRoutes = function() {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') return
        const router = require(`./${file}`)
        this.use(router.routes())
        this.use(router.allowedMethods())
    })
}

module.exports = useRoutes