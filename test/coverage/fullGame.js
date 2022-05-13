const {addTimeFromNow} = require('../../helperFN/addTime');
const {wolfKills, doctorCheck, seerCheck} = require('../../helperFN/roles');
const {tallyVotes, checkIfGamesOver} = require('../../helperFN/games');

        // const calculateNight = async(room) => {
        //     try {
        //         if (round === 0) {
        //             game.voted = [{voter:"0" , candidate: "7"}, {voter:"1" , candidate: "7"}, {voter:"2" , candidate: "0"}]
        //         }
                
        //         const messages = [];
        //         const wolf = wolfKills(game.voted, game.players);
    
        //         if (wolf.deaths.length !== 0) {
        //             wolf.deaths.forEach(death => {
                //         let {player, role, status} = death;
                //         if (round === 0) {
                //             messages.push({message: `${player.userName} was gravely injured during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
                //             test('1st Night should have 1 death to be villager "7"', () => {
                //                 expect(player.user_id).toBe('7');
                //                 expect(role).toBe('villager');
                //             })
                //         }
                //     });
                // }
        //         const doctor = doctorCheck(game.voted, wolf.players, wolf.deaths);
        //         if (doctor.deaths.length !== 0) {
        //             doctor.deaths.forEach(death => {
        //                 let {player, role, status} = death;
        //                 messages.push({message: `${player.userName} was saved by a stranger with tremendous healing abilities during the night.`, userName: 'announcement', user_id: 'announcement', role: 'gameMaster'});
        //                 if (round === 0) {
        //                     test('1st Night should doctor "1" should saved 1 person player "7"', () => {
        //                         expect(player.user_id).toBe('7');
        //                         expect(status).toBe(true);
        //                     })  
        //                 }
        //             });
        //         }
        
        //         const seer = seerCheck(game.voted, doctor.players);
        //         if (seer.length !== 0) {
        //             seer.forEach(user => {
        //                 let {seer, target} = user;
        //                 messages.push({message: `${seer.player.userName} was a peeping tom during the night and saw that ${target.player.userName} is a ${target.role}.`, userName: seer.player.userName, role: seer.role})   
                    //     if (round === 0) {
                    //         test('1st Night Seer "2" should see player "0" as wolf', () => {
                    //             expect(target.player.user_id).toBe('0');
                    //             expect(target.role).toBe('wolf');
                    //         })
                    //     }
                    // });
        //         }
        //         game.voted = [];
        //         game.endRound = 2000;
        //         game.players = doctor.players;
        //         game.phase = 'day1';
        //         emitGame2(room, messages);
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
        // };
    
        
        // const calculateDay2 = async(room) => {
        //     try { 

        //         test('1st day2 calc votes array to bee empty', () => {
        //             expect(game.voted).toHaveLength(0);
        //         })

                

        //         const messages = [];
                // if (round === 0) {
                //     const votes = tallyVotes([{voter:"0" , candidate: "1"}, {voter:"0" , candidate: "1"}, {voter:"0" , candidate: "1"}]);
                //     test('1st day2 calc votes to be player "1"', () => {
                //         expect(votes).toBe('1');
                //     })
                // }


        //         messages.push({message: `${user.userName} was accused of first degree murder and is being put on trial.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        //         game.playerVoted.userName = user.userName;
        //         game.endRound = 2000;
        //         game.voted = [];
        //         game.phase = 'day3';
        //         emitGame2(room, messages);
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
        // };
        
        // // const calculateDay3 = async() => {
        // //     try {
        // //         const messages = [];
        // //         const {players, deaths} = await votesVsUsers(game.voted, game.players);
        // //         // game.voted.forEach(vote => {
        // //         //     messages.push({message: `${vote.voterUserName} voted to mummify ${vote.candidateUserName}`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        // //         // });
        // //         // if (deaths.length !== 0) {
        // //         //     messages.push({message: `${vote.voterUserName} was mummified by majority rule.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        // //         // } else {
        // //         //     messages.push({message: `No one was mummified by lack of majority.`, userName: "announcement", user_id: "announcement", role: "gameMaster"});
        // //         // }
        // //         game.players = players;
        // //         game.voted = [];
        // //         game.phase = 'day4';
        // //         game.endRound = 2000;
        // //         emitGame2(room, messages);
        // //     }
        // //     catch (err) {
        // //         console.log(err)
        // //     }
        // // };
        
        // const emitGame2 = (room, messages) => {
        //     try {
        //         if (game.phase === 'night') {
        //             calculateNight(room);
        //         }
        //         if (game.phase === 'day1') {
        //             if (round === 0) {
        //                 test('1st day1 Message Array length to be 3', () => {
        //                     expect(messages).toHaveLength(3);
        //                 })
        //             }

        //             for (let i = 0; i < messages.length; i ++) {
        //                 if (messages[i].role === 'seer') {
        //                     if (round === 0) {
        //                         test('1st day1 expect 1 message from seer to be sent', () => {
        //                             expect(i).toBe(2);
        //                         })
        //                     }

        //                 } else {
        //                     test(`1st day1 expect 2 message from gameMaster to be sent ${i}`, () => {
        //                         expect(i).toBe(i);
        //                     })
        //                 }
        //             }
            
        //             const gameOver = checkIfGamesOver(game.players);
        //             if (gameOver.gameOver) {
        //                 game.winner = gameOver.winner;
        //                 game.phase = 'end';
        //                 emitGame2(room, gameOver.players);
        //             }
        //             if (round === 0) {
        //                 test('1st day1 expect game to not me over', () => {
        //                     expect(gameOver.gameOver).toBe(false);
        //                 })
        //             }
        //             game.phase = 'day2';
        //             emitGame2(room);
        //         }
        //         if (game.phase === 'day2') {
        //             game.endRound = 2000;
        //                 calculateDay2(room);
        //         }
            
        //         // if (game.phase === 'day3') {
        //         //     for (let i = 0; i < messages.length; i ++) {
        //         //         if (messages[i].role === 'seer') {
                            
        //         //         } else {
        
        //         //         }
        //         //     }
        //         //     setTimeout(() => {
        //         //         calculateDay3(room);
        //         //     }, game.endRound + 1000);
            
        //         // }
            
        //         // if (game.phase === 'day4') {
        
        //         //     for (let i = 0; i < messages.length; i ++) {
        //         //         if (messages[i].role === 'seer') {
        
        //         //         } else {
        
        //         //         }
        //         //     }
        //         //     game.voted = [];
        //         //     game.endRound = 2000;
        //         //     const gameOver = await checkIfGamesOver(game.players);
            
        //         //     if (gameOver.gameOver) {
        //         //         game.winner = gameOver.winner;
        //         //         game.phase = 'end';
        //         //         setTimeout(() => {
        //         //             emitGame2(room, gameOver.players);
        //         //         }, game.endRound + 1000);
        //         //     }
        //         //     game.phase = 'night';
        //         //     setTimeout(() => {
        //         //         calculateNight(room)
        //         //     }, game.endRound + 1000);
        //         // }
            
        //         // if (game.phase === 'end') {
        //         //     for (let i = 0; i < messages.length; i++) {
        //         //         setTimeout(() => {
                            
        //         //         }, i*2000)
            
        //         //     }
        //         // }
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
    
           
        // }
    
    
        // emitGame2()
        





/// const user = await getSingleUserById(votes.userName); error
/// 1 count of game.editGame(game)