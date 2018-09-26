const app = require('express')()
const db = require('./config/db')
const consign = require('consign')
const mongoose = require('mongoose')

require('./config/mongodb')

app.db = db
app.mongoose = mongoose

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando...')
})