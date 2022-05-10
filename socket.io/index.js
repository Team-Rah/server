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

const getUserInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getAllUsersFromRoom(getAllConnectedSocket);
    return users;
};

// const joinRoom = async(room, user) => {
//     try {
//         await socket.join(room);
//         socket.username = user.userName;
//         socket.roomID = room;
//     }
//     catch (err) {
//         throw(err);
//     }
// };

const assignUserName = (socket , user) => {
    socket.username = user.userName;
}
const assignRoom = (socket, room) => {
    socket.join(room);
    socket.roomID = room;
}

io.on('connection', socket => {
    // console.log('socket');
    socket.on('join-room', async(user,room) => {
        try {
            assignUserName(socket, user);
            assignRoom(socket, room);
            const users = await getUserInRoom(room);
            socket.emit(`send-${room}`, users);
        }
        catch (err) {
            socket.emit('error', err);
        }
    });

    // socket.on('get-users', async(room) => {
    //     try {
    //        const users = await getUserInRoom(room);
    //        socket.emit(`send-${room}`, users);
    //     }
    //     catch (err) {
    //         socket.emit('error', err);
    //     }
    // })


  
});

module.exports = io;