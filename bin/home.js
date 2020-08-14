
const POST = 8000
const http = require('http')
const serverHandler = require('../app')

const server = http.createServer(serverHandler)
server.listen(POST)