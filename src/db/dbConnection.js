const Sequelize = require('sequelize')
const { USER_MYSQL, DATABASE, PASSWORD_MYSQL, DB_PORT } = require('../env')

const sequelize = new Sequelize(DATABASE, USER_MYSQL, PASSWORD_MYSQL, {
    dialect: 'mysql',
    host: 'localhost', 
    port: DB_PORT, 
})

module.exports = sequelize