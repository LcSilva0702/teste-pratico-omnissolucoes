const userSequelize = require('../db/userModel')
const sequelize = require('../db/dbConnection')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const {JWT_PASSWORD} = require('../env')
const { where } = require('sequelize')

async function createUser(req,res){
    const {nome, email, password} = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)

    const verifyEmail = await userSequelize.findAll({ where: {
        email: email
    }})

    if(verifyEmail.length > 0){
        return res.status(400).send('User Exists')
    }

    const user = userSequelize.create({
        nome: nome,
        email: email,
        password: encryptedPassword
    })


    return res.status(201).send('ok')
}

async function login(req, res){
    const {email, password} = req.body

    const verifyEmail = await userSequelize.findOne({ where: {
        email: email
    }})

    if(!verifyEmail){
        return res.status(400).send('Email or password incorrect')
    }

    const verifyPassword = await bcrypt.compare(password, verifyEmail.password)

    if(!verifyPassword){
        return res.status(400).send('Email or password incorrect')
    }

    const token = JWT.sign({id: verifyEmail.id}, JWT_PASSWORD, {expiresIn: "1h"})
    
    return res.json({token: `${token}`})
}

async function profile(req,res) {
    const { authorization } = req.headers
    
    if(!authorization) {
        return res.status(401).send('logged out user')
    }

    const token = authorization.split(" ")


    JWT.verify(token[1], JWT_PASSWORD, (erro, decoded) => {
        if (erro) {
            return res.status(403).send("Invalid Token");
        }

        return req.user = decoded.id
    });

    if(!req.user){
        return;
    }

    const User = await userSequelize.findOne({ where: {
        id: req.user 
    }})

    return res.status(200).json({user: User})
}

async function updateProfile(req, res){
    const {nome, email, password} = req.body
    const {authorization} = req.headers

    if(!authorization) {
        return res.send('logged out user')
    }

    const token = authorization.split(" ")

    JWT.verify(token[1], JWT_PASSWORD, (erro, decoded) => {
        if (erro) {
            return res.status(403).send("Invalid Token");
        }

        return req.user = decoded.id
    });

    if(!req.user){
        return;
    }

    const User = await userSequelize.findOne({ where: {
        id: req.user
    }})

    
    if(!nome && !email && !password){
        return res.send('Not changes')
    }

    if(nome){
        userSequelize.update({nome: nome}, { where: {id: User.dataValues.id}})
    }

    if(email){
        userSequelize.update({email: email}, { where: {id: User.dataValues.id}})
    }


    if(password){
        const encryptedPassword = await bcrypt.hash(password, 10) 
        userSequelize.update({password: encryptedPassword}, {where: {id: User.dataValues.id}})
    }


    return res.send('ok')
}

async function deleteUser(req, res){
    const {authorization} = req.headers

    if(!authorization) {
        return res.send('logged out user')
    }

    const token = authorization.split(" ")

    JWT.verify(token[1], JWT_PASSWORD, (erro, decoded) => {
        if (erro) {
            return res.status(403).send("Invalid Token");
        }

        return req.user = decoded.id
    });

    if(!req.user){
        return;
    }

    const User = await userSequelize.findOne({ where: {
        id: req.user
    }})

    await User.destroy({
        where: {
          id: User.dataValues.id,
        },
      });


    return res.status(200).send(`The user ${User.dataValues.email} has been deleted`)
}

module.exports = {
    createUser,
    login,
    profile,
    updateProfile,
    deleteUser
}