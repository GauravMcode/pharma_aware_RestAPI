let io;
module.exports = {
    initIO: (httpServer) => {
        io = require('socket.io')(httpServer);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw Error('Socket.io is not Initialized')
        }
        return io;
    }
}