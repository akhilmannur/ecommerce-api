const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('uploads'))

const Admin = require('./routers/admin')
app.use('/', Admin)

const Dealer = require('./routers/dealers')
app.use('/', Dealer)

const User = require('./routers/users')
app.use('/', User)

const { ErrorHandler } = require('./middlewares/errorHandling')
app.use(ErrorHandler)

module.exports = app
