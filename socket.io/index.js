const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});



io.on('connection', socket => {
    console.log('socket')
    socket.on('join-room', async (id, user) => {
        try {
            await socket.join(id);
            let getBoard = await Sudoku.findById(id);
            socket.username = user;
            socket.roomID = id;
            io.to(socket.id).emit('get-board', getBoard);
            emitUsers(id);
        }
        catch (err) {
            socket.emit('error', err);
        }
    }






    

})

module.exports = io;