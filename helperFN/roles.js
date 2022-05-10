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
        if (player.player === voterUser) {
          voterRole = player.role;
        }
        if (player.player === candidateUser) {
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
    players.forEach((player) => {
      if (player.role === 'doctor') {
        currentDoctor.push(player.player);
      }
    });

    voters.forEach((voter) => {
      currentDoctor.forEach(doc => {
        if (doc === voter.voter) {
          healedCandidate.push(voter.candidate);
        }
      })
    });

    healedCandidate.forEach((heal) => {
      players.forEach(player => {
        if (userThatDies === heal && player.player === userThatDies) {
          healedCandidateWithStatus.push(player);
        }
      })
    });

    healedCandidateWithStatus.forEach((healed,i, arr) => {
      if (healed.status === false) {
        healed.status = true;
        healed.message = `Player ${healed.player} has been healed.`;
      }
    });

    return healedCandidateWithStatus;
  }
};

let sampleVoters = [
  {
    voter: 'cihad',
    candidate: 'david'
  },
  {
    voter: 'tony',
    candidate: 'david'
  },
  {
    voter: 'david',
    candidate: 'tony'
  }
];

let samplePlayers = [
  {
    player: 'tony',
    status: true,
    role: 'doctor',
  },
  {
    player: 'cihad',
    status: true,
    role: 'wolf',
  },
  {
    player: 'david',
    status: false,
    role: 'wolf'
  },
];

let testOne = module.exports.wolfCheck(sampleVoters, samplePlayers);

let testTwo = module.exports.doctorCheck(sampleVoters, samplePlayers, 'david');