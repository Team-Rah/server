module.exports = {

  wolfKills: (voters, players) => {
    //iterate over players to see who the wolf or wolves kill
    //iterate over voters, grab id
    //iterate over players and validate votes for wolf v. wolf
    let wolfPlayer = [];
    let wolfCandidate = [];
    let deaths = [];
    //console.log(voters, players)
    //if(module.exports.wolfCheck(voters, players)) {

      players.forEach(findWolf => {
        if (findWolf.role === 'wolf') {
          wolfPlayer.push(findWolf);
        }
      })

      voters.forEach(voter => {
        wolfPlayer.forEach(wolf => {
          if (wolf.player.user_id === voter.voter) {
            wolfCandidate.push(voter.candidate);
          }
        });
      });

      players.forEach(player => {
        wolfCandidate.forEach(pray => {
          if (player.player.user_id === pray) {
            deaths.push(player);
          }
        })
      })

      return {players, deaths};
    //}
  },

  wolfCheck: (voters, players) => {
    //check if a wolf voted for a wolf
    let isValidVoting = true;
    voters.forEach((voter, i, arr) => {
      let voterUser = voter.voter;
      let candidateUser = voter.candidate;

      let voterRole = "";
      let candidateRole = "";

      players.forEach(player => {
        if (player.player.user_id === voterUser) {
          voterRole = player.role;
        }
        if (player.player.user_id === candidateUser) {
          candidateRole = player.role;
        }
      });

      if (voterRole === 'wolf' && candidateRole === 'wolf') {
        isValidVoting = false;
      }
    });

    return isValidVoting;
  },

  doctorCheck: (voters, players, userThatDies) => {
    //return an object with the modified array of players and array of messages
    let currentDoctor = [];
    let healedCandidate = [];
    let victimsSaved = [];
    let victimsNotSaved = [];
    let healedCandidateWithStatusMessage = [];

    //grabs the player profile for doctors
    players.forEach((player) => {
      if (player.role === 'doctor' && player.status === true) {
        currentDoctor.push(player);
      }
    });

    //see if currentDoctor array is greater than 0
    if (currentDoctor.length === 0) {


      players.forEach(player => {
        userThatDies.forEach(dead => {
          if (player.player.user_id === dead.player.user_id) {
            player.status = false;
            dead.status = false;
          }
        });
      });


      return {players, deaths: userThatDies, saved: victimsSaved};
    }

    //grabs who the doctors chose to save
    voters.forEach((voter) => {
      currentDoctor.forEach(doc => {
        if (doc.player.user_id === voter.voter) {
          healedCandidate.push(voter.candidate);
        }
      })
    });

    //filter out the users that were killed vs who was saved by the doctor
    userThatDies.forEach((victim, i) => {
      healedCandidate.forEach(heal => {
        if (victim.player.user_id === heal) {
          victim.status = true;
          victimsSaved.push(victim);
        } else {
          victim.status = false;
          victimsNotSaved.push(victim);
        }
      });
    });

    //change players status before being returned
    players.forEach(player => {
      victimsNotSaved.forEach(unsaved => {
        if (unsaved.player.user_id === player.player.user_id) {
          player.status = false;
          // healedCandidateWithStatusMessage.push(`Player ${unsaved.player.userName} has been brutally mauled.`);
        }
      });

      victimsSaved.forEach(saved => {
        if(saved.player.user_id === player.player.user_id) {
          player.status = true;
          // healedCandidateWithStatusMessage.push(`Player ${saved.player.userName} has been healed.`);
        }
      });
    });

    if (healedCandidate.length === 0) {
      players.forEach(player => {
        userThatDies.forEach(death => {
          if (death.player.user_id === player.player.user_id) {
            death.status = false;
            player.status = false;
          }
        })
      })

      return {players, deaths: userThatDies, saved: victimsSaved};
    }

    return {players, deaths: victimsNotSaved, saved: victimsSaved};
  },

  seerCheck: (voters, players) => {
    let currentSeer = [];
    let seerCandidate = [];
    let seerRole = [];

    //Grab the wolf and seer roles
    players.forEach(player => {
      if (player.role === "seer" && player.status) {
        currentSeer.push(player);
      }
    });

    if (currentSeer.length === 0) {
      return [];
    }

    voters.forEach(voter => {
      currentSeer.forEach(seer => {
        if (voter.voter === seer.player.user_id) {
          seerCandidate.push(voter);
        }
      });
    });

    players.forEach(player => {
      seerCandidate.forEach(user => {
        if (player.player.user_id === user.candidate) {
          seerRole.push({seer: user, target: player});
        }
      });
    });

    currentSeer.forEach(seer => {
      seerRole.forEach(saw => {
        if (seer.player.user_id === saw.seer.voter) {
          saw.seer = seer;
        }
      })
    })

    return seerRole;
  },

};



