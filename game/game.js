const {getUsersFromSocket} = require('../helperFN/socket.io')
const {getSingleGame, editGame} = require('../database/controller/games');
const {getPlayer, assignRoles, tallyVotes, checkIfGamesOver, votesVsUsers} = require('../helperFN/games');
const {getSingleUserById} = require('../database/controller/users');
const {wolfKills , doctorCheck, seerCheck} = require('../helperFN/roles');
const User = require('../database/models/User.js')

const createBotsVote = async (players, phase, trial) => {
    const botsVote = [];
    let bots;
    let alivePlayer = players.filter(player => player.status);
    
    if (phase === 'night') {
        bots = players.filter(player => player.status && player.bot && player.role !== 'villager');
    } else {
      bots = players.filter(player => player.status && player.bot && player.role);
    }

    bots.forEach(bot => {
        const {userName, user_id} = bot.player
        let randomNum = Math.floor(Math.random() * alivePlayer.length);
        if (phase !== 'day3') {
            let targetPlayer = alivePlayer[randomNum];
            console.log('first', targetPlayer)
            console.log('first self', bot)
            while (targetPlayer.player.user_id === bot.player.user_id) {
                targetPlayer = alivePlayer[Math.floor(Math.random() * alivePlayer.length)];
                console.log('while', targetPlayer)
            }
            botsVote.push({
                voter: user_id,
                voterUserName: userName,
                candidate: targetPlayer.player.user_id,
                candidateUserName: targetPlayer.player.userName
            });
        } else {
            randomNum = Math.floor(Math.random() * 2);
            if (randomNum === 0) {
                botsVote.push({
                    voter: user_id,
                    voterUserName: userName,
                    candidate: trial.user_id,
                    candidateUserName: trial.userName
                });
            }
        }

    })
    return botsVote;
}

const gameMaster = {
    user_id : 'announcement',
    userName: 'announcement',
};

const messageInterval = (messageLength, timer, index) => {
    const timeToDisplay = timer * .8;
    const messageInterval = timeToDisplay/messageLength * index;
    if (index === 0) return 1000;
    return messageInterval + 1000;
}

const messageTimer = 10000
const phaseTimer =  10000

const calculateNight = async(room, io) => {
    const game = await getSingleGame(room);

    try {
        const messages = [];

        const botVotes = await createBotsVote(game.players, game.phase);

        game.voted = [...game.voted, ...botVotes];

        const wolf = wolfKills(game.voted, game.players);

        if (wolf.deaths.length !== 0) {
            messages.push({message: `A new day begins but there was many commotion during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            wolf.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} was gravely injured during the night by a mysterious being.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
            });
        } else {
            messages.push({message: `A new day begins, It was a clam and relaxing night, nothing notable happened.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
        }

        const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);

        if (doctor.deaths.length > 0) {
            doctor.deaths.forEach(death => {
                let {player, role, status} = death;
                messages.push({message: `${player.userName} has died from his injuries.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
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
        runGame(room, messages, io);
    }
    catch (err) {
        throw(err)
    }
};

const calculateDay2 = async(room, io) => {
    const game = await getSingleGame(room);
    // console.log('game votes from day 2', game.voted)

    try {

        const messages = [];

        const botVotes = await createBotsVote(game.players, game.phase);

        game.voted = [...game.voted, ...botVotes];

        const votes = await tallyVotes(game.voted);
        console.log('most voted', votes)
        game.endRound = messageTimer;
        if (votes) {
            getPlayer
            // const user = await getSingleUserById(votes.userName);
            console.log('votes return', votes)
            const user = getPlayer(game.players, {user_id: votes.userName});
            console.log('day2 calc for user find',user)
            messages.push({message: `${user.player.userName} was accused of being a Seth worshipper and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.playerVoted = user.player;
            game.phase = 'day3';
            game.voted = [];
            await editGame(game);
            runGame(room, messages, io);
        } else {
            game.phase = 'day4';
            messages.push({message: 'No One was Accused this day!! You are lucky', userName: "announcement", user_id: "announcement", role: "gameMaster"});
            messages.push({message: `Day ${game.currentRound} is coming to an end`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            game.voted = [];
            await editGame(game);
            runGame(room, messages, io);
        }

    }
    catch (err) {
        throw(err)
    }
};

const calculateDay3 = async(room, io) => {
    const game = await getSingleGame(room);

    try {
        const messages = [];

        const botVotes = await createBotsVote(game.players, game.phase, game.playerVoted);

        game.voted = [...game.voted, ...botVotes];
        console.log('phase 3 votes',game.voted)
        console.log('phase 3 players',game.players)

        const {players, deaths} = await votesVsUsers(game.voted, game.players);

            game.voted.forEach(vote => {
                messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
            });
        if (deaths.length) {
            game.players = players;
            messages.push({message: `${game.playerVoted.userName} was mummified by majority rule, ${game.playerVoted.userName} was a ${deaths[0].role}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }else {
            messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        }
        messages.push({message: `Day ${game.currentRound} is coming to an end`, userName: "announcement", user_id: "announcement", role: "gameMaster"});

        game.voted = [];
        game.phase = 'day4';
        game.endRound = messageTimer;
        await editGame(game);
        runGame(room, messages, io);
    }
    catch (err) {
        throw(err)
    }
};

const runGame = async (room, messages, io) => {

    const game = await getSingleGame(room);
    // console.log('current round', game.currentRound, 'for game', game._id)

    if (game.phase === 'end') {
        // console.log('hitting endgame')

        io.to(room).emit('game-send', game)
        if (messages.winningPlayers) {
            const {winningPlayers, losingPlayers} = messages
            for (let i = 0; i < winningPlayers.length; i++) {
                // updated winning player score might refactor out later
                let user = await User.findById(winningPlayers[i].player.user_id);
                user.score += 30;
                await user.save();
                //
                setTimeout(() => {
                    io.emit(`receive-message-${room}`, gameMaster, `congratulations ${winningPlayers[i].player.userName} you have won`);
                }, messageInterval(winningPlayers.length, game.endRound, i))
            }
            for (let i = 0; i < losingPlayers.length; i++) {
                // updated losing player score might refactor out later
                let user = await User.findById(losingPlayers[i].player.user_id);
                if (user.score > 25) {
                    user.score -= 25;
                    await user.save();
                }
                //
            }
            setTimeout(() => {
                io.emit(`receive-message-${room}`, gameMaster, `Thank you for playing`);
            }, messageInterval(winningPlayers.length, game.endRound, winningPlayers.length + 1))


        } else {
            io.emit(`receive-message-${room}`, gameMaster, `You have reached the round limit for this game, Thank you for playing`);
        }


    }
    else if (game.currentRound > game.maxRounds) {
        // else if (game.currentRound > 5) {
        game.phase = 'end';
        await editGame(game);
        runGame(room, {}, io);
  
    }
    else if (game.phase === 'night') {
        // console.log('hitting night phase')
        // console.log('next phase starts in', game.endRound)
        // console.log(game.endRound + 1000)

        io.to(room).emit('game-send', game);

        setTimeout(() => {
            io.emit(`receive-message-${room}`, gameMaster, 'As the darkness enveloped the day, night has come once again and with it comes uncertainty and danger');
        }, 1000);

        setTimeout(() => {
            calculateNight(room, io);
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
        if (gameOver.gameOver) {
            game.winner = gameOver.winner;
            game.phase = 'end';
            setTimeout(async() => {
                await editGame(game);
                runGame(room, gameOver, io);
            }, game.endRound + 1000);
        } else {
            game.phase = 'day2';
            setTimeout(async() => {
                game.endRound = phaseTimer;
                await editGame(game);
                runGame(room, {}, io);
            }, game.endRound + 1000);

        }
    }

    else if (game.phase === 'day2') {
        // console.log('hitting day2 phase')
        // console.log('next phase starts in', game.endRound)
        io.to(room).emit('game-send',game);

        setTimeout(() => {
            calculateDay2(room, io);
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
            calculateDay3(room, io);
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
        // console.log('day 4 players array', game.players)
        // console.log(gameOver)

        if (gameOver.gameOver) {
            setTimeout(async () => {
                game.winner = gameOver.winner;
                game.phase = 'end';
                await editGame(game);
                runGame(room, gameOver, io);
            },endRound  + 1000);
        } else {
            setTimeout(async() => {
                game.phase = 'night';
                await editGame(game);
                runGame(room, {}, io);
            },endRound  + 1000);

        }

    }

}

module.exports = {runGame ,gameMaster, messageTimer, phaseTimer}