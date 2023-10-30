const app = require('../app')
const http = require('http')
const mongoose = require('mongoose');

app.set('port', process.env.PORT)

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to MongoDB.')
})
.catch(() => {
    console.log('Failed to Connect MongoDB.')
})
const server = http.createServer(app)
const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})