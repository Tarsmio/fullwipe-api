const { Server } = require("socket.io");
const connectionSocHandle = require("./socket/connection");

let io;

module.exports = {
    init: (server) => {
        io = new Server(server, {
            path: '/socket/',
            cors: {
                origin: [process.env.SO_ORIGIN_PROD, process.env.SO_ORIGIN_DEV]
            }
        });

        io.on("connection", socket => {
            connectionSocHandle(socket, io);
        });

        return io;
    },
    
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io n'est pas encore initialisé !");
        }
        return io;
    }
};