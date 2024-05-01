const { Router } = require('express')
const { createUser, login, profile, updateProfile, deleteUser } = require('./controllers/usersControllers')
const routers = Router()


routers.post('/create-user', createUser)
routers.post('/login', login)
routers.get('/profile', profile)
routers.post('/update-profile', updateProfile)
routers.delete('/delete-myself', deleteUser)

module.exports = routers