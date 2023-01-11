const mysql = require('mysql2')

const config = require('./config')

const connection = mysql.createPool({
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD
})

connection.getConnection((err, con) => {
    con.connect(err => {
        if (err) {
            console.log(`database ${config.MYSQL_DATABASE} connect failed`, err);
        } else {
            console.log(`database ${config.MYSQL_DATABASE} connect success`)
        }
    })
})

module.exports = connection.promise()