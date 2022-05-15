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
const calculateVoteTime = (milliseconds) => {
    const time = Date.now()
    console.log('time till vote phase end', time + milliseconds - time)
    console.log(time)
    return time + milliseconds > time;
}

const getSocketInRoom = async(room) => {
    const getAllConnectedSocket = await io.in(room).fetchSockets();
    const users = getUsersFromSocket(getAllConnectedSocket);
    return users;
};

const messageInterval = (messageLength, timer, index) => {
    const timeToDisplay = timer * .8;
    const messageInterval = timeToDisplay/messageLength * index;
    if (index === 0) return 1000;
    return messageInterval + 1000;
}

const messageTimer = 15000
const phaseTimer =  15000

const calculateNight = async(room) => {
    const game = await getSingleGame(room);

    try {
        const messages = [];
        
        const wolf = wolfKills(game.voted, game.players);

        

        if (wolf.deaths.length !== 0) {
            messages.push({message: `A new day begins but there was many commotion during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            wolf.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was gravely injured during the night by a mysterious being.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        } else {
            messages.push({message: `A new day begins, It was a clam and relaxing night, nothing notable happen.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
        }

        const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);

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
        // IF WE NEED THIS ROLE
        // const seer = seerCheck(game.voted, doctor.players);

        // if (seer.length !== 0) {
        //     seer.forEach(user => {
        //         let {seer, target} = user;
        //         messages.push({message: `${seer.player.userName} was a peeping tom during the night and saw that ${target.player.userName} is a ${target.role}.`, userName: seer.player.userName, role: seer.role})

        //     });
        // }

        // console.log('doctor players', doctor.players)
        game.voted = [];
        game.endRound = messageTimer;
        game.players = doctor.players;
        game.phase = 'day1';
        await editGame(game);
        runGame(room, messages);
    }
    catch (err) {
        throw(err)
    }
};

const calculateDay2 = async(room) => {
    const game = await getSingleGame(room);
    // console.log('game votes from day 2', game.voted)

    try {

        const messages = [];

        const votes = await tallyVotes(game.voted);
        game.endRound = messageTimer;
        if (votes) {
            const user = await getSingleUserById(votes.userName);
            messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.playerVoted = user.userName;
            game.phase = 'day3';
            game.voted = [];
            await editGame(game);
            runGame(room, messages);
        } else {
            game.phase = 'day4';
            messages.push({message: 'No One was Accused this day!! You are lucky', userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.voted = [];
            await editGame(game);
            runGame(room, messages);
        }

    }
    catch (err) {
        throw(err)
    }
};

const calculateDay3 = async(room) => {
    const game = await getSingleGame(room);

    try {
        const messages = [];
        const {players, deaths} = await votesVsUsers(game.voted, game.players);

            game.voted.forEach(vote => {
                messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            });
            game.players = players;
        if (deaths.length) {
            messages.push({message: `${game.playerVoted} was mummified by majority rule, ${game.playerVoted} was a ${deaths[0].role}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }else {
            messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }

        game.voted = [];
        game.phase = 'day4';
        game.endRound = messageTimer;
        await editGame(game);
        runGame(room, messages);
    }
    catch (err) {
        throw(err)
    }
};

const runGame = async (room, messages) => {

    const game = await getSingleGame(room);
    console.log('current round', game.currentRound, 'for game', game._id)

    if (game.phase === 'end') {
        // console.log('hitting endgame')

        io.to(room).emit('game-send', game)
        if (messages) {
            const {winningPlayers, losingPlayers} = messages
            for (let i = 0; i < winningPlayers.length; i++) {
                // updated winning player score might refactor out later
                let user = await User.findById(winningPlayers[i].player.user_id);
                user.score += 30;
                await user.save();
                //
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, `congratulations ${winningPlayers[i].player.userName} you have won`);
                }, messageInterval(messages.length, messages.length * 3000, i))
            }
            for (let i = 0; i < losingPlayers.length; i++) {
                // updated losing player score might refactor out later
                let user = await User.findById(losingPlayers[i].player.user_id);
                if (user.score > 25) {
                    user.score -= 25;
                    await user.save();
                }

                //
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, `congratulations ${winningPlayers[i].player.userName} you have won`);
                }, messageInterval(messages.length, messages.length * 3000, i))
            }
            setTimeout(() => {
                io.emit(`receive-message-${room}`, gameMaster, `Thank you for playing`);
            }, messages.length * 3000 + 2000)


        } else {
            io.emit(`receive-message-${room}`, gameMaster, `You have reached the round limit for this game, Thank you for playing`);
        }

        // add or sub player score
        console.log(messages)

    }
    // else if (game.currentRound > game.maxRounds) {
        else if (game.currentRound > 1) {
        console.log('round limit for game', room)

        game.phase = 'end';
        await editGame(game);
        runGame(room);
  
    }
    else if (game.phase === 'night') {
        // console.log('hitting night phase')
        // console.log('next phase starts in', game.endRound)
        // console.log(game.endRound + 1000)

        io.to(room).emit('game-send', game);

        setTimeout(() => {
            io.emit(`receive-message-${room}`, gameMaster, 'As the darkness enveloped the day, night has come once again and with comes uncertainty and danger');
        }, 1000);

        setTimeout(() => {
            calculateNight(room);
        }, game.endRound  + 1000);
    }

    else if (game.phase === 'day1') {

        // console.log('hitting day1 phase')
        // console.log('next phase starts in', game.endRound)

        io.to(room).emit('game-send', game);
        for (let i = 0; i < messages.length; i ++) {
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, messages[i].message);
                }, messageInterval(messages.length, game.endRound, i));
        }

        const gameOver = await checkIfGamesOver(game.players);
        console.log('day1 game over check', gameOver)
        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            setTimeout(async() => {
                await editGame(game);
                runGame(room, gameOver);
            }, game.endRound + 1000);
        } else {
            game.phase = 'day2';
            setTimeout(async() => {
                game.endRound = phaseTimer;
                await editGame(game);
                runGame(room);
            }, game.endRound + 1000);

        }
    }

    else if (game.phase === 'day2') {
        // console.log('hitting day2 phase')
        // console.log('next phase starts in', game.endRound)
        io.to(room).emit('game-send',game);

        setTimeout(() => {
            calculateDay2(room, game.endRound);
        }, game.endRound + 1000);

    }

    else if (game.phase === 'day3') {
        // console.log('hitting day3 phase')
        // console.log('next phase starts in', game.endRound)

        io.to(room).emit('game-send', game);

        for (let i = 0; i < messages.length; i ++) {
            setTimeout(() => {
                io.emit(`receive-message-${room}`, gameMaster, messages[i].message);
            }, messageInterval(messages.length, game.endRound, i));
        }

        setTimeout(() => {
            calculateDay3(room, game);
        }, game.endRound + 1000);

    }

    else if (game.phase === 'day4') {
        game.currentRound ++;

        // console.log('hitting day 4')
        // console.log('next phase starts in', game.endRound)
        
        io.to(room).emit('game-send', game)

        for (let i = 0; i < messages.length; i ++) {
            // console.log('message interval', messageInterval(messages.length, game.endRound, i))
            setTimeout(() => {
                io.emit(`receive-message-${room}`, gameMaster, messages[i].message);
            }, messageInterval(messages.length, game.endRound, i));
        }


        let endRound = game.endRound;
        game.voted = [];
        game.endRound = messageTimer;
        const gameOver = await checkIfGamesOver(game.players);

        if (gameOver.gameOver) {
            setTimeout(async () => {
                game.winner = gameOver.winner;
                game.phase = 'end';
                await editGame(game);
                runGame(room, gameOver);
            },endRound  + 1000);
        } else {
            setTimeout(async() => {
                game.phase = 'night';
                await editGame(game);
                runGame(room);
            },endRound  + 1000);

        }

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
                //         role: 'wolf'
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
                //         role: 'seer'
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
                        runGame(room);
                    }, 5000);
                } else {
                    io.emit(`receive-message-${room}`, gameMaster, 'NEED A MINIMUM OF 5 PLAYERS TO START ');
                }
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

