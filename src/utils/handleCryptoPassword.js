const crypto = require('crypto')

function handleCryptoPassword(password) {
    const md5 = crypto.createHash('md5')
    const result = md5.update(password).digest('hex')
    return result
}

module.exports = handleCryptoPassword