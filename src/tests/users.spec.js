const request = require('supertest')
const app = require('../routes')
const express = require('express')
const apptest = express()


apptest.use(express.json());
apptest.use(app)


describe('test routes', () => {
    it('Create user test route success', async () => {
        const res = await request(apptest).post('/create-user').send({'nome': 'Lucas', 'email': 'teste2', 'password': '123'})

        expect(res.text).toEqual('ok')
    })

    it('Create user test route error', async () => {
        const res = await request(apptest).post('/create-user').send({'nome': 'Lucas', 'email': 'teste2', 'password': '123'})

        expect(res.text).toEqual('User Exists')
    })

    it('Login, View Profile, Update Profile and Delete user test route', async () => {
        const login = await request(apptest).post('/login').send({'email': 'teste2', 'password': '123'})
        const loginError = await request(apptest).post('/login').send({'email': 'inexistente', 'password': '141'})

        expect(loginError.text).toEqual('Email or password incorrect')
        expect(login._body).toHaveProperty('token')

        const profile = await request(apptest).get('/profile').set('authorization', `Bearer ${login._body.token}`)
        const profileError = await request(apptest).get('/profile').set('authorization', `Bearer 123`)
        const profileErrorAuthorization = await request(apptest).get('/profile')

        expect(profileErrorAuthorization.text).toEqual('logged out user')
        expect(profileError.text).toEqual("Invalid Token")
        expect(profile._body).toHaveProperty('user')

        const profileUpdateAuthorizationError = await request(apptest).post('/update-profile')
        const profileUpdateNoParams = await request(apptest).post('/update-profile').set('authorization', `Bearer ${login._body.token}`)
        const profileUpdateError = await request(apptest).post('/update-profile').set('authorization', `Bearer 123`)    
        const profileUpdate = await request(apptest).post('/update-profile').set('authorization', `Bearer ${login._body.token}`).send({'nome': 'teste1', 'email': 'teste', 'password': '175'})

        expect(profileUpdateAuthorizationError.text).toEqual('logged out user')
        expect(profileUpdateError.text).toEqual('Invalid Token')
        expect(profileUpdateNoParams.text).toEqual('Not changes')
        expect(profileUpdate.text).toEqual('ok')


        const deleteAuthorizationError = await request(apptest).delete('/delete-myself')
        const deleteUserError = await request(apptest).delete('/delete-myself').set('authorization', `Bearer 123`)
        const deleteUser = await request(apptest).delete('/delete-myself').set('authorization', `Bearer ${login._body.token}`)

        expect(deleteAuthorizationError.text).toEqual('logged out user')
        expect(deleteUserError.text).toEqual("Invalid Token")
        expect(deleteUser.text).toEqual(`The user teste has been deleted`)
    })
})