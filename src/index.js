const express = require('express')
const { PORT } = require('./env')
const app = express()
const database = require('./db/dbConnection')
const User = require('./db/userModel')
const routers = require('./routes')

app.use(express.json())
app.use(routers)

app.listen(PORT, async () => {
    await database.sync();

    console.log(`Rota rodando na porta ${PORT}`)
})