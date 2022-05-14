const io = require('socket.io')(process.env.PORT2, {
    cors: {
        origin: ["http://localhost:4040"]
    }
});

const {getUsersFromSocket, assignUserName, assignRoom} = require('../helperFN/socket.io')
const {getSingleGame, getAllGames, editGame} = require('../database/controller/games');
const {getPlayer, assignRoles, tallyVotes, checkIfGamesOver, votesVsUsers} = require('../helperFN/games');
const {getSingleUserById} = require('../database/controller/users');
const {wolfKills , doctorCheck, seerCheck} = require('../helperFN/roles');
const {addTimeFromNow} = require('../helperFN/addTime');
const User = require('../database/models/User.js')
const Game = require('../database/models/Game')
const gameMaster = {
    user_id : 'announcement',
    userName: 'announcement',
};

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};


const day2 = (room, game) => {
    io.to(room).emit('game-send',game);
}
const night = (room, game) => {
    io.to(room).emit('game-send', game);
}
const nightcal = async(room, game) => {
        let messages = [];
        const wolf = await wolfKills(game.voted, game.players);
        if (wolf.deaths.length !== 0) {
            wolf.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was gravely injured during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }
        
        const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);
        console.log('night calc vote',doctor)
        console.log("doctor.deaths.length",doctor.deaths.length)
        console.log("doctor.deaths.length 333333",doctor.deaths.length > 0)
        if (doctor.deaths.length > 0) {
            doctor.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} bleed out and died.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }
        if (doctor.saved.length > 0) {
            doctor.saved.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was saved by a stranger with tremendous healing abilities during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        }
        game.voted = [];

        game.players = doctor.players;
        game.phase = 'day1';
        await editGame(game);
        emitGame2(room, game, messages);
}

const day3calc = (room, game) => {

    Game.findById(room).then(foundGame => {
        let messages = [];
        console.log('day3calc game.voted', game.voted)
        console.log('dayc3calc game.players', game.players)
        let {players, deaths} = votesVsUsers(foundGame.voted, foundGame.players);
        if (players) {
            console.log('day3calc death', deaths)
            foundGame.voted.forEach(vote => {
                messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            });

        foundGame.players = players;
        }
        if (deaths.length !== 0) {
            messages.push({message: `${foundGame.voted.voterUserName} was mummified by majority rule.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }else {
            messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }
        foundGame.voted = [];
        foundGame.phase = 'day4';
        emitGame2(room, foundGame , messages)
    })

}

const endGame = (room, game, messages) => {
    console.log('end game message', messages)
    io.to(room).emit('game-send', game)
    for (let i = 0; i < messages.length; i++) {
        setTimeout(() => {
            io.emit(`receive-message-${room}`, gameMaster, `congratulations ${messages[i].player.userName} you have won`);
        }, i * 2000)
    }

}

// if (game.phase === 'end') {
//     console.log('gameover end day', gamemessages)
//     io.to(room).emit('game-send', gamemessages)
//     for (let i = 0; i < gamemessages.length; i++) {
//         setTimeout(() => {
//             io.emit(`receive-message-${room}`, gameMaster, `congratulations ${gamemessages[i].userName} you have won`);
//         }, i * 2000)
//     }
// }

const emitGame2 = async (room, game, gamemessages) => {
    let messages = [];

    if (game.phase === 'day2calc') {
        let votes = await tallyVotes(game.voted);
        console.log('accuse voted calc', votes)
        if (votes) {
            let user = await getSingleUserById(votes.userName);
            messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.playerVoted = user.userName;
            game.phase = 'day3';
            game.voted = [];
            await editGame(game);
            emitGame2(room, game, messages);
        }else {
            game.phase = 'day4';
            messages.push({message: 'No One was Accused this day!! You are lucky', userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.voted = [];
            await editGame(game);
            emitGame2(room, game, messages);
        }


    }
    if (game.phase === 'day1') {
        io.to(room).emit('game-send', game);
        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                if (gamemessages[i].role === 'seer') {
                    let sockets = await io.in(room).fetchSockets();
                    let socket;
                    for (let i = 0; i < sockets.length; i ++) {
                        if (sockets[i].userName === gamemessages[i].userName) {
                          socket = sockets[i]
                          break;
                        }
                    }
                    setTimeout(() => {
                        io.to(socket.id).emit(`receive-message-${room}`, gameMaster, gamemessages[i].message)
                    })
                } else {
                    setTimeout(() => {
                        io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                    }, 2000 * i);
                }
            }
        }
        console.log('game players day 1',game.players);
        let gameOver = await checkIfGamesOver(game.players);
        console.log('gameOver day 1',gameOver);
        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            setTimeout(() => {endGame(room, game, gameOver.Winningplayers)}, 30000);
        } else {
            game.phase = 'day2';
            await editGame(game);
            setTimeout(() => {
                day2(room, game);
            }, 15000);
        }


    }

    if (game.phase === 'day3') {
        io.to(room).emit('game-send', game);

        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                }, 2000 * i);
            }
        }

        setTimeout( () => {
            day3calc(room, game);
        }, 15000);

    }

    if (game.phase === 'day4') {
        io.to(room).emit('game-send', game)
        if (gamemessages) {
            for (let i = 0; i < gamemessages.length; i ++) {
                setTimeout(() => {``
                    io.emit(`receive-message-${room}`, gameMaster, gamemessages[i].message);
                }, 1000 * i);
            }
        }
        game.voted = [];
        let gameOver = await checkIfGamesOver(game.players);
        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            setTimeout(() => {
                gameEnd(room, game, gameOver.Winningplayers);
            },15000);
        } else {
            game.phase = 'night';
            await editGame(game);
            setTimeout(() => {
                night(room, game)
            },15000);
        }
    }

    // if (game.phase === 'end') {
    //     console.log('gameover end day', gamemessages)
    //     io.to(room).emit('game-send', gamemessages)
    //     for (let i = 0; i < gamemessages.length; i++) {
    //         setTimeout(() => {
    //             io.emit(`receive-message-${room}`, gameMaster, `congratulations ${gamemessages[i].userName} you have won`);
    //         }, i * 2000)
    //     }
    // }
}

io.on('connection', socket => {
    console.log(socket.id, 'has connected')
    socket.on('join-room', async(user,room) => {
        console.log('from socket.emit',user)
        try {
            console.log('on connect user', user)
            assignUserName(socket, user);
            console.log('assign user', socket.user)
            assignRoom(socket, room);
            const users = await getSocketInRoom(room);
            console.log('room user', users)
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
        console.log('hit vote')
        try {
            const game = await getSingleGame(room);
            console.log('game phase in vote', game.phase)
            const voteNumber = game.players.filter(obj => obj.status && obj.role !== 'villager')
            const wolfVoteNumber = game.players.filter(obj => (obj.status && obj.role === 'wolf') || (obj.status && obj.role === 'doctor'))
            const aliveVote = game.players.filter(obj => obj.status )
            const player = await getPlayer(game.players, user);
            const target = await getPlayer(game.players, {user_id:candidate.player.user_id, userName: candidate.player.userName});
            if (player.status && target.status) {
                game.voted.push({voter:user.user_id, voterUserName: user.userName, candidate:candidate.player.user_id, candidateUserName:candidate.player.userName});
            }
            // console.log('voteNumber', voteNumber.length)
            // console.log('game.voted.length',game.voted.length)

                console.log('hit vote limit')
                if (game.phase === 'night') {
                    if (wolfVoteNumber.length === game.voted.length) {
                        await editGame(game);
                        nightcal(room, game)
                    }

                }
                console.log('phase' , game.phase)
                if (game.phase === 'day2') {
                    console.log('aliveVote.length' ,aliveVote.length)
                    console.log('game.voted.length' ,game.voted.length)
                    if (aliveVote.length === game.voted.length) {
                        // if ( 1 === game.voted.length) {
                        console.log('hit day 2 vote phase')
                        game.phase = 'day2calc'
                        await editGame(game);
                        emitGame2(room, game)
                    }
                }
                if (game.phase === 'day3') {
                    console.log('hit day 3 vote')
                    console.log(game.voted)
                        await editGame(game);
                    }
                
              if (aliveVote !== game.voted.length || wolfVoteNumber !== game.voted.length) {
                await editGame(game);
              }

        }
        catch (err) {
            socket.emit('error', err);
        }
    });

    socket.on('start-game', async (user, room) => {
        console.log('start game')
        try {
            const game = await getSingleGame(room);
            if (game.owner === user.user_id) {
                const getUsers = await getSocketInRoom(room);
                console.log(getUsers, "getUser")
                let users = [];
                getUsers.forEach(user => {
                    users.push({player: {
                        userName: user.userName,
                        user_id: user.user_id,
                        }
                    });
                });
                const players = await assignRoles(users);
                // const players = [
                //     {
                //         player: {
                //             userName: 'david',
                //             user_id: '627f09ccc6a3d29f3692e7d4'
                //         },
                //         role: 'wolf'
                //     },
                //     {
                //         player: {
                //             userName: 'david2',
                //             user_id: '627f0b1bc6a3d29f3692e7f5'
                //         },
                //         role: 'doctor'
                //     },
                //     {
                //         player: {
                //             userName: 'david3',
                //             user_id: '627f0ba3c6a3d29f3692e815'
                //         },
                //         role: 'seer'
                //     },
                //     {
                //         player: {
                //             userName: 'ab1212',
                //             user_id: '627f01a391b79ed151e03f97'
                //         },
                //         role: 'villager'
                //     },
                //     {
                //         player: {
                //             userName: 'cihad',
                //             user_id: '627f07bfc6a3d29f3692e7bd'
                //         },
                //         role: 'villager'
                //     },
                //     {
                //         player: {
                //             userName: 'joshson',
                //             user_id: '627f0924c6a3d29f3692e7ca'
                //         },
                //         role: 'villager'
                //     },
                // ]
                game.players = players;
                game.phase = 'night';
                game.started = true;
                await editGame(game);
                night(room, game);
            }
        }
        catch(err) {
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

