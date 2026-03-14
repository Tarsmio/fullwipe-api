// server.js
require('dotenv').config()

const http = require('http')
const app = require('./app')
const socket = require('./socket')

const mongoose = require('mongoose')

const {normalizePort} = require('./utils/serverUtils')
const logger = require('./logger')
const { cacheTeams } = require('./cache/constantCache')

const port = normalizePort(process.env.PORT || 3000)
app.set('port', port)

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges.')
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use.')
            process.exit(1);
            break;
        default:
            throw error;
    }
}

mongoose.connect(process.env.DB_LINK, { dbName: process.env.DB_NAME}).then(() => {
    console.log("Connexion DB reussi !")
}).catch((err) => {
    console.log(err)
    console.log("Connexion Db raté !")
})

const server = http.createServer(app)
socket.init(server)

server.on('error', errorHandler)
server.on('listening', async () => {
    await cacheTeams()

    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    logger.info('Listening on ' + bind)
})

server.listen(process.env.PORT || 3000)