
const app = require('./app/index')
const config = require('./app/config')
const server = require('./app/server')

server.listen(config.SOCKET_PORT, () => {
    console.log(`socket port ${config.SOCKET_PORT} is running`);
})

app.listen(config.HTTP_SERVER_PORT, () => {
    console.log(`port ${config.HTTP_SERVER_PORT} is running`);
})