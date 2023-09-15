const express = require('express')
const helmet = require('helmet')
const rateLimiter = require('./middlewares/rateLimiter')
const cors = require('cors')

const app = express()

app.use(rateLimiter)
app.use(cors())
app.use(helmet())
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: true, limit: '5mb'}))
// app.use(morgan('dev'))
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
