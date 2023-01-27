const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')

// 公钥、密钥
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))

// .env文件在服务端需要重新指定文件路径
const result = dotenv.config({
	path: path.resolve(__dirname, '../../', '.env')
})

if (result.error) {
  throw result.error
}

console.log(result.parsed)

module.exports = {
	HTTP_SERVER_PORT,
	MYSQL_HOST,
	MYSQL_PORT,
	MYSQL_DATABASE,
	MYSQL_USER,
	MYSQL_PASSWORD,
	SOCKET_PORT
} = process.env

module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY
