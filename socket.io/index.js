const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});
const getAllUsersFromRoom = (socket) => {
    const users = [];
    for(let i = 0; i< socket.length;i++) {
        if (!users.includes(socket[i].username)) {
            users.push(socket[i].username);
        }
    }
    return users;
};

const emitRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getAllUsersFromRoom(getAllConnectedSocket);
    io.to(room).emit('receive-lobby', users);
};
const joinRoom = async(room, user) => {
    try {
        await socket.join(room);
        socket.username = user.userName;
        socket.roomID = room;
    }
    catch (err) {
        throw(err);
    }
};

io.on('connection', socket => {
    console.log('socket');
    socket.on('join-lobby', async(user) => {
        try {
            joinRoom('lobby', user);
            emitLobby('lobby');
            io.to('lobby').emit('joined-lobby', user);
        }
        catch (err) {
            socket.emit('error', err);
        }
    });


  
});

module.exports = io;