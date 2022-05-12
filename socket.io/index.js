const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const {getUsersFromSocket, assignUserName, assignRoom} = require('../helperFN/socket.io')
const {getSingleGame, getAllGames, updateGame} = require('../database/controller/games');
const {getPlayer, assignRoles, tallyVotes} = require('../helperFN/games');
const {getSingleUserById} = require('../database/controller/users');
const {wolfKills} = require('../helperFN/roles');
const {addTimeFromNow} = require('../helperFN/addTime');
const gameMaster = {
    user_id : 'announcement',
    userName: 'announcement',
};

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};



const calculateNight = async(room) => {

    try {
        const messages = [];

        const game = getSingleGame(room);

        const wolf = wolfKills(game.voted, game.players);

        if (wolf.deaths.length !== 0) {
            wolf.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was gravely injured during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }

        const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);
        //update doctorCheck third parameter...needs to accept an array
        //check if doctor is alive before performing action

        if (doctor.deaths.length !== 0) {
            doctor.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was saved by a stranger with tremendous healing abilities during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }

        const seer = seerCheck(game.voted, doctor.players);
        //update seer chek to return the updated player array
        //update to check player status

        if (seer.length !== 0) {
            seer.forEach(user => {
                let {seer, target} = user;
                messages.push({message: `${seer.player.userName} was a peeping tom during the night and saw that ${target.player.userName} is a ${target.role}.`, userName: seer.player.userName, role: seer.role})

            });
        }

        game.voted = [];
        game.endRound = addTimeFromNow(1);
        game.players = doctor.players;
        game.phase = 'day1';
        await editGame(game);

        emitGame2(room, messages);
    }
    catch (err) {
        throw(err)
    }
};

const calculateDay2 = async(room) => {
    try {
        const game = await getSingleGame(room);

        const messages = [];

        const votes = await tallyVotes(game.voted);

        const user = await getSingleUserById(votes.userName);

        messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});

        game.playerVoted.userName = user.userName;

        game.endRound = addTimeFromNow(1);

        game.voted = [];

        game.phase = 'day3';

        await editGame(game);

        emitGame2(room, messages);
    }
    catch (err) {
        throw(err)
    }
};

const calculateDay3 = async() => {
    try {
        const game = await getSingleGame(room);

        const messages = [];

        const {players, deaths} = await votesVsUsers(game.voted, game.players);

        game.voted.forEach(vote => {
            messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        });

        if (deaths.length !== 0) {
            messages.push({message: `${vote.voterUserName} was mummified by majority rule.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        } else {
            messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }

        game.players = players;

        game.voted = [];

        game.phase = 'day4';

        game.endRound = addTimeFromNow(1);

        await editGame(game);

        emitGame2(room, messages);
    }
    catch (err) {
        throw(err)
    }
};

const emitGame2 = async (room, messages) => {
    const game = await getSingleGame(room);

    if (game.phase === 'night') {
        io.to(room).emit('game-send', game);
        setTimeout(() => {
            calculateNight(room);
        }, game.endRound - Date.now() + 1000);
    }

    if (game.phase === 'day1') {
        io.to(room).emit('game-send', game);


        for (let i = 0; i < messages.length; i ++) {
            if (messages[i].role === 'seer') {
                let sockets = await io.in(room).fetchSockets();
                let socket;
                for (let i = 0; i < sockets.length; i ++) {
                    if (sockets[i].userName === messages[i].userName) {
                      socket = sockets[i]
                      break;
                    }
                }
                setTimeout(() => {
                    io.to(socket.id).emit(`receive-message-${room}`, gameMaster, messages[i].message)
                })
            } else {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, messages[i].message);
                }, 1000*i);
            }
        }

        const gameOver = await checkIfGamesOver(game.players);

        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            await game.editGame(game);
            setTimeout(() => {
                gameEnd(room, gameOver.players);
            }, game.endRound + 1000);
        }

        game.phase = 'day2';
        await editGame(game);

        setTimeout(() => {
            emitGame2(room);
        }, game.endRound + 1000);
    }

    if (game.phase === 'day2') {
        io.to(room).emit('game-send',game);

        game.endRound = addTimeFromNow(2);

        await editGame(game);

        setTimeout(() => {
            calculateDay2(room);
        }, game.endRound + 1000);

    }

    if (game.phase === 'day3') {
        io.to(room).emit('game-send', game);

        for (let i = 0; i < messages.length; i ++) {
            if (messages[i].role === 'seer') {
                let sockets = await io.in(room).fetchSockets();
                let socket;
                for (let i = 0; i < sockets.length; i ++) {
                    if (sockets[i].userName === messages[i].userName) {
                      socket = sockets[i]
                      break;
                    }
                }
                setTimeout(() => {
                    io.to(socket.id).emit(`receive-message-${room}`, gameMaster, messages[i].message)
                })
            } else {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, messages[i].message);
                }, 1000*i);
            }
        }

        game.endRound = addTimeFromNow(2);

        await editGame(game);

        setTimeout(() => {
            calculateDay3(room);
        }, game.endRound + 1000);

    }

    if (game.phase === 'day4') {
        io.to(room).emit('game-send', game)

    }

    if (game.phase === 'end') {
        io.to(room).emit('game-send', game)

    }
}

let test;
const emitGame = (socket, room , data, timer ) => { az
    const user = {
        user_id : 'announcement',
        userName: 'announcement',
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
            io.emit(`receive-message-${room}`, user, 'player 1 killed by a wolf');
        }, 500);
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 6 killed by a wolf');
        }, 1500);
        test = setTimeout(() => {
            emitGame(socket,room, data, timer)
        }, timer + 3000);
        return
    }
    if (data.phase === 'day2') {
        io.to(room).emit('game-send',data)
        data.phase = 'day3'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day2 phase');
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 3 voted player 2 to stand trial');
        }, 1000);
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 4 voted player 2 to stand trial');
        }, 1100);

        setTimeout(() => {
            io.emit(`receive-message-${room}`, user2, 'i like the sunny day');
        }, 1000);
        test = setTimeout(() => {
            emitGame(socket,room, data, timer)
        }, timer + 3000);
        return
    }
    if (data.phase === 'day3') {
        io.to(room).emit('game-send',data)
        data.phase = 'day4'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day3 phase');
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 4 voted player 2 guilty');
        }, 700);
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 8 voted player 2 guilty');
        }, 1000);
        test = setTimeout(() => {
            emitGame(socket,room, data, timer)
        }, timer + 3000);
        return
    }
    if (data.phase === 'day4') {
        io.to(room).emit('game-send',data)
        data.phase = 'end'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'start day4 phase');
        setTimeout(() => {
            io.emit(`receive-message-${room}`, user, 'player 2 is hung for being a wolf his role was seer');
        }, 1000);
        test = setTimeout(() => {
            emitGame(socket,room, data, timer);
        }, timer + 1000);
        return
    }
    if (data.phase === 'end') {
        io.to(room).emit('game-send',data)
        data.phase = 'night'
        data.endRound = Date.now() + 1000 + timer
        io.emit(`receive-message-${room}`, user, 'game ended');
        test = setTimeout(() => {
            emitGame(socket,room, data, timer);
        }, timer + 5000);
        return
    }
}


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
            const target = await getPlayer(game.players, candidate);
            if (game.endRound > Date.now() && player.status && target.status) {
                game.voted.push({voter:user.user_id, candidate:candidate.user_id});
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

            // socket.emit('placeholder', game);
            if (game.owner === user.user_id) {
                const users = await getSocketInRoom(room);
                const players = await assignRoles(users);

                game.players = players;
                game.phase = 'night';
                game.endRound = addTimeFromNow(2);

                const updatedGame = await updateGame(room, game);

                emitGame2(room);
            }
        }
        catch(err) {
            socket.emit('error', err);
        }
    })

    socket.on('start-test', async (user, room, timer) => {
        const game = {
            owner: '1',
            gameName:'test game',
            playerAllowed: 20,
            endRound: Date.now(),
            players : [
                {player: {user_id: '1',userName:'dave'}, status: true, role:'villager'},
                {player: {user_id: '2',userName:'dave2'}, status: false, role:'villager'},
                {player: {user_id: '3',userName:'dave3'}, status: true, role:'doctor'},
                {player: {user_id: '4',userName:'dave4'}, status: false, role:'doctor'},
                {player: {user_id: '5',userName:'dave5'}, status: true, role:'seer', abilityCount: 1},
                {player: {user_id: '6',userName:'dave6'}, status: false, role:'seer', abilityCount: 0},
                {player: {user_id: '7',userName:'dave7'}, status: true, role:'wolf'},
                {player: {user_id: '8',userName:'dave8'}, status: false, role:'wolf'},
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





//Input
// [
//     {
//         player: {userName: "dave1", user_id: 1}
//     }
// ]

//output
// [
    //     {
    //         player: {userName: "dave1", user_id: 1},
    //         status: true,
    //         role: "villager",
    //         abilityCount: 0
    //     }
// ]
