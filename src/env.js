require('dotenv').config()

const PORT = process.env.PORT
const USER_MYSQL = process.env.USER_MYSQL
const PASSWORD_MYSQL = process.env.PASSWORD_MYSQL
const DATABASE = process.env.DATABASE
const DB_PORT = process.env.DB_PORT
const JWT_PASSWORD = process.env.JWT_PASSWORD

module.exports = {
    PORT,
    USER_MYSQL,
    PASSWORD_MYSQL,
    DATABASE,
    DB_PORT,
    JWT_PASSWORD
}