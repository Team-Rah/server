const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const getUsersFromSocket = (socket) => {
    const users = [];
    for(let i = 0; i< socket.length;i++) {
        if (!users.includes(socket[i].username)) {
            users.push(socket[i].username);
        }
    }
    return users;
};
const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};


const assignUserName = (socket , user) => {
    socket.username = user.userName;
};

const assignRoom = (socket, room) => {
    socket.join(room);
    socket.rooms = room;
};

io.on('connection', socket => {
    socket.on('join-room', async(user,room) => {
        try {
            assignUserName(socket, user);
            assignRoom(socket, room);
            console.log('socket', io)
            const users = await getSocketInRoom(room);
            io.to(room).emit(`receive-${room}`, users);
        }
        catch (err) {
            socket.emit('error', err);
        }
    });
    socket.on('send-message', (user, message, room) => {
        io.emit(`receive-message-${room}`, user, message);
    });


    socket.on("disconnecting", async () => {
        try {
            const rooms = Array.from(socket.rooms);
            for (let i = 1; i < rooms.length;i++) {
                const users = await getSocketInRoom(rooms[i]);
                users.splice(users.indexOf(socket.userName),1);
                io.emit(`receive-${rooms[i]}`, users);
            }
        }
        catch (err) {
            socket.emit('error', err);
        }
      });
});

module.exports = io;