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
    console.log(socket.id, 'connection')
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
        try {
            const game = await getSingleGame(room);
            game.players1 = {}
            if (game.owner === user.user_id && game.started !== 'ended' && game.started !== 'started') {
                const getUsers = await getSocketInRoom(room);
                let users = [];
                let bots = 0;
                getUsers.forEach(user => {
                    game.players1[user.userName] = {player: {
                        userName: user.userName,
                        user_id: user.user_id,
                        },
                        bot: false
                    }
                    users.push({player: {
                        userName: user.userName,
                        user_id: user.user_id,
                        },
                        bot: false
                    });
                });
                if (users.length > 0) {
                    if (users.length < game.playerAllowed) {
                        for (let i = users.length; i < game.playerAllowed; i++) {
                            game.players1[`bot${i}`] = {
                                player: {
                                    userName: `bot${i}`,
                                    user_id: `bot${i}`
                                },
                                bot:true
                            }
                            users.push(
                                    {
                                        player: {
                                            userName: `bot${i}`,
                                            user_id: `bot${i}`
                                        },
                                        bot:true
                                    },
                                )
                                bots ++
                        }
                    }

                    const players = await assignRoles(users);
                    game.players = players;
                    game.phase = 'night';
                    game.started = 'started';
                    game.endRound = phaseTimer;
                    game.players.forEach((player) => {
                        game.players1[player.player.userName].status = player.status
                        game.players1[player.player.userName].role = player.role
                        game.players1[player.player.userName].voteHistory = {0: null}
                    })
                    await editGame(game);
                    io.emit(`receive-message-${room}`, gameMaster, `THE GAME WIL BEGIN IN 10 SECOND ${bots > 0 ? `WITH ${bots} BOTS` : ''}`);
                    setTimeout(() => {
                        runGame(room, [], io);
                    }, 10000);
                } else {
                    io.emit(`receive-message-${room}`, gameMaster, 'NEED A MINIMUM OF 2 PLAYERS TO START ');
                }
            }
        }
        catch(err) {
            socket.emit('error', err);
            console.log(err)
        }
    })



    socket.on('get-games', async() => {
        //console.log('get-games')
        try {
            const games = await getAllGames({ started: { $ne: 'ended' } });
            //console.log(games)
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

