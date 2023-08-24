const app = require('../app')
const http = require('http')

app.set('port', process.env.PORT)

const server = http.createServer(app)
const port = process.env.PORT

server.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})