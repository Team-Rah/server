module.exports = {

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
    let healedCandidateWithStatus = [];
    let healedCandidateWithStatusMessage = [];

    players.forEach((player) => {
      if (player.role === 'doctor') {
        currentDoctor.push(player);
      }
    });

    voters.forEach((voter) => {
      currentDoctor.forEach(doc => {
        if (doc.player.user_id === voter.voter) {
          healedCandidate.push(voter.candidate);
        }
      })
    });

    healedCandidate.forEach((heal) => {
      players.forEach(player => {
        if (userThatDies === heal && player.player.user_id === userThatDies) {
          healedCandidateWithStatus.push(player);
        }
      })
    });

    healedCandidateWithStatus.forEach((healed,i, arr) => {
      if (healed.status === false) {
        healed.status = true;
        healedCandidateWithStatusMessage.push(`Player ${healed.player} has been healed.`);
      }
    });

    console.log({players: healedCandidateWithStatus, message: healedCandidateWithStatusMessage});

    return {players: healedCandidateWithStatus, message: healedCandidateWithStatusMessage};
  },
  seerCheck: (voters, players) => {
    let currentSeer = [];
    let currentWolf = [];
    let seerCandidate = [];
    let caughtAWolf = [];

    //Grab the wolf and seer roles
    players.forEach(player => {
      if (player.role === "seer") {
        currentSeer.push(player);
      }
      if (player.role === 'wolf') {
        currentWolf.push(player);
      }
    });

    voters.forEach(voter => {
      currentSeer.forEach(seer => {
        if (voter.voter === seer.player.user_id) {
          seerCandidate.push(voter.candidate);
        }
      });
    });

    console.log('--seer cand --', seerCandidate);

    players.forEach(player => {
      seerCandidate.forEach(user => {
        console.log(player.player, user)
        if (player.player.user_id === user) {
          console.log(player.role);
          if (player.role === 'wolf') {
            caughtAWolf.push(player);
          }
        }
      });
    });
console.log('caught', caughtAWolf);
    return caughtAWolf;
  },

};

