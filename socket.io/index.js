const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:4040"]
    }
});

const {getUsersFromSocket, assignUserName, assignRoom} = require('../helperFN/socket.io')
const {getSingleGame, getAllGames, editGame} = require('../database/controller/games');
const {getPlayer, assignRoles} = require('../helperFN/games');
const {runGame, gameMaster, phaseTimer, messageTimer} = require('../game/game')

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};


io.on('connection', socket => {
    console.log(socket.id, 'has connected')
    socket.on('join-room', async(user,room) => {
        try {
            assignUserName(socket, user);
            assignRoom(socket, room);
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

    socket.on('player-vote', async(user, candidate, room) => {
        try {
            const game = await getSingleGame(room);
            const player = await getPlayer(game.players, user);
            const target = await getPlayer(game.players, {user_id:candidate.player.user_id, userName: candidate.player.userName});
            
            console.log('vote received')
            if (player.status && target.status) {
                game.voted.push({voter:user.user_id, voterUserName: user.userName, candidate:candidate.player.user_id, candidateUserName:candidate.player.userName});
                await editGame(game);
            }
        }
        catch (err) {
            socket.emit('error', err);
        }
    });

    socket.on('start-game', async (user, room) => {
        console.log('start game button triggered')
        try {
            const game = await getSingleGame(room);
            if (game.owner === user.user_id && !game.started) {
                
                const getUsers = await getSocketInRoom(room);
                let users = [];
                getUsers.forEach(user => {
                    users.push({player: {
                        userName: user.userName,
                        user_id: user.user_id,
                        }
                    });
                });
                if (users.length > 1) {
                    console.log('starting game')
                    const players = await assignRoles(users);
                // const players = [
                //     {
                //         player: {
                //             userName: 'david',
                //             user_id: '628081cfe63751300f397853'
                //         },
                //         role: 'seer'
                //     },
                //     {
                //         player: {
                //             userName: 'david2',
                //             user_id: '62808230e63751300f397870'
                //         },
                //         role: 'doctor'
                //     },
                //     {
                //         player: {
                //             userName: 'marlee',
                //             user_id: '627943e704269d70e06d1563'
                //         },
                //         role: 'wolf'
                //     },
                //     {
                //         player: {
                //             userName: 'candelario',
                //             user_id: '627943e704269d70e06d1565'
                //         },
                //         role: 'villager'
                //     },
                //     {
                //         player: {
                //             userName: 'ralph',
                //             user_id: '627943e704269d70e06d1567'
                //         },
                //         role: 'villager'
                //     },
                //     {
                //         player: {
                //             userName: 'dasdfsdfvedsrr',
                //             user_id: '62801bb10812d290b8b3637c'
                //         },
                //         role: 'villager'
                //     },
                // ]
                    game.players = players;
                    game.phase = 'night';
                    game.started = true;
                    game.endRound = phaseTimer;
                    await editGame(game);
                    io.emit(`receive-message-${room}`, gameMaster, 'THE GAME WIL BEGIN IN 5 SECOND');
                    setTimeout(() => {
                        runGame(room, [], io);
                    }, 5000);
                } else {
                    io.emit(`receive-message-${room}`, gameMaster, 'NEED A MINIMUM OF 2 PLAYERS TO START ');
                }
            }
        }
        catch(err) {
            console.log(err)
            socket.emit('error', err);
        }
    })

    

    socket.on('get-games', async() => {
        try {
            const games = await getAllGames({started: false});
            io.emit('receive-games', games);
        }
        catch(cihadsWork) {
            socket.emit('error', cihadsWork);
        }
    });

    socket.on("disconnecting", async () => {
        try {
            const rooms = Array.from(socket.rooms);
            for (let i = 1; i < rooms.length;i++) {
                const users = await getSocketInRoom(rooms[i]);
                const editUsers = users.filter(user => user.userName !== socket.user.userName);
                io.emit(`receive-${rooms[i]}`, editUsers);
            }
        }
        catch (err) {
            socket.emit('error', err);
        }
      });
});

module.exports = io;

