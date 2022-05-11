const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const {getUsersFromSocket, assignUserName, assignRoom} = require('../helperFN/socket.io')

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};





let test;
const emitGame = (socket, room , data, timer ) => {
    const user = {
        user_id : 'server',
        userName: 'server',
    }
    const user2 = {
        user_id : 'dave',
        userName: 'dave',
    }

    if (data.phase === 'night') {
        io.to(room).emit('game-send',data)
        data.phase = 'day1'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start night phase');
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user2, 'im scared');
        }, 1500);
        
         test = setTimeout(() => {
            emitGame(socket,room, data, timer)
        }, timer + 1000);
        return 
    }
    if (data.phase === 'day1') {
        io.to(room).emit('game-send',data)
        data.phase = 'day2'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day1 phase');
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user2, 'i like the sunny day');
        }, 1500);
        
        test = setTimeout(() => {
            emitGame(socket,room, data, timer )
        }, timer + 1000);
        return
    }
    if (data.phase === 'day2') {
        io.to(room).emit('game-send',data)
        data.phase = 'day3'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day2 phase');
        test = setTimeout(() => {
            emitGame(socket,room, data, timer)
        }, timer + 1000);
        return
    }
    if (data.phase === 'day3') {
        io.to(room).emit('game-send',data)
        data.phase = 'end'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day3 phase');
        test = setTimeout(() => {
            emitGame(socket,room, data, timer )
        }, timer + 1000);
        return
    }
    if (data.phase === 'end') {
        io.to(room).emit('game-send',data)
        data.phase = 'night'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'game ended');
        test = setTimeout(() => {
            emitGame(socket,room, data, timer )
        }, timer + 5000);
        return
    }
}



io.on('connection', socket => {
    socket.on('join-room', async(user,room) => {
        try {
            assignUserName(socket, user);
            assignRoom(socket, room);
            const users = await getSocketInRoom(room);
            io.to(room).emit(`receive-${room}`, users);
        }
        catch (err) {
            console.log(err)
            socket.emit('error', err);
        }
    });
    socket.on('send-message', (user, message, room) => {
        io.emit(`receive-message-${room}`, user, message);
    });

    socket.on('start-game', async (user, room, timer) => {
        const game = {
            owner: '1',
            gameName:'test game',
            playerAllowed: 20,
            startRound: Date.now(),
            endRound: Date.now(),
            players : [
                {player: {userID: '1',userName:'dave'}, status: true, role:'villager'},
                {player: {userID: '2',userName:'dave2'}, status: false, role:'villager'},
                {player: {userID: '3',userName:'dave3'}, status: true, role:'doctor'},
                {player: {userID: '4',userName:'dave4'}, status: false, role:'doctor'},
                {player: {userID: '5',userName:'dave5'}, status: true, role:'seer', abilityCount: 1},
                {player: {userID: '6',userName:'dave6'}, status: false, role:'seer', abilityCount: 0},
                {player: {userID: '7',userName:'dave7'}, status: true, role:'wolf'},
                {player: {userID: '8',userName:'dave8'}, status: false, role:'wolf'},
            ],
            phase: 'night',
        }

        if (user === game.owner) {
            test = setTimeout(() => {
                emitGame(socket, room , game, timer)
            }, 1);
        }
    });
    socket.on('pause-test', () => {
        clearTimeout(test);
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








// const getUsersFromSocket = (socket) => {
//     const users = [];
//     for(let i = 0; i< socket.length;i++) {
//         if (!users.includes(socket[i].username)) {
//             users.push(socket[i].username);
//         }
//     }
//     return users;
// };
// const assignUserName = (socket , user) => {
//     socket.username = user.userName;
//     if (user.user_id) {
//         socket.user_id = user.user_id
//     }
    
// };

// const assignRoom = (socket, room) => {
//     socket.join(room);
//     socket.rooms = room;
// };