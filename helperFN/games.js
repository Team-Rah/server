const {error} = require('../errorHandler/errorHandler');
const at = 'helperFN/games';
module.exports = {
  assignRoles: async (array) => {
    try {
      const roles = ['wolf', 'doctor', 'seer', 'villager'];
      const numRoles = roles.length - 1;
      const numPlayers = array.length;
      let iterations = Math.floor(numPlayers * (4/7));
      let count = 0;
      while (iterations > 0) {
        var position = Math.floor(Math.random() * numPlayers);
        if (!array[position]['role'])  {
          if (roles[count] === 'Seer'){
            array[position]['role'] = roles[count];
            array[position]['abilityCount'] = 1;
            count++;
            iterations --;
          } else {
            array[position]['role'] = roles[count];
            count++;
            iterations --;
          }
        }
        if (count > numRoles) {
          count = 0;
        }
      }
      return array
    }

    catch (err) {
      throw error(500,'DID NOT ASSIGN ROLE',at);
    }
  },
  changeStatus : (user, array) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.userName === array[i].player.userName) {
        // change status
        return
      }
    }
    throw error(404,'User does not exist', at);
  },
  tallyVotes: (array) => {
    if (array.length === 0) {
      return null;
    }

    let result = {};
    let mostVotes = 0;
    let mostVotesUser = '';
    for (var i = 0; i < array.length; i++) {
      if (!result[array[i].candidate]) {
        result[array[i].candidate] = 1;
      } else {
        result[array[i].candidate] ++;
      }
      if (result[array[i].candidate] > mostVotes) {
        mostVotes = result[array[i].candidate];
        mostVotesUser = [array[i].candidate];
      }
    }
    let tieBreaker = [];
    for (var x = 0; x < Object.keys(result).length; x++) {
      if (mostVotes === result[Object.keys(result)[x]]){
        tieBreaker.push({userName:Object.keys(result)[x], votes: mostVotes})
      }
    }
    let randomIndex = Math.floor(Math.random() * tieBreaker.length)
    return tieBreaker[randomIndex];
  },

  checkIfGamesOver: (array) => {
    var wolves = 0;
    var villagers = 0;
    for (let i = 0; i < array.length; i ++) {
      if (array[i].status) {
        if (array[i].role === 'wolf') {
          wolves++;
        } else {
          villagers++
        }
      }
    }
  if (wolves === 0) {
    let result = [];
    let losers = [];
    for (let x = 0; x < array.length; x++) {
      if ((array[x].role !== 'wolf')) {
        result.push(array[x]);
      }
      if ((array[x].role === 'wolf')) {
        losers.push(array[x]);
      }
    }
    return {gameOver:true, winner: 'villagers', winningPlayers: result, losingPlayers: losers}
  }

  if (villagers === 0) {
    let result = [];
    let losers = [];
    for (let x = 0; x < array.length; x++) {
      if ((array[x].status) && (array[x].role === 'wolf')) {
        result.push(array[x]);
      }
      if ((array[x].role !== 'wolf')) {
        losers.push(array[x]);
      }
    }
    return {gameOver:true, winner: 'wolves', winningPlayers: result, losingPlayers: losers}
  }

  return {gameOver:false, winner: null}
  },

  getPlayer : (array, user) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.user_id === array[i].player.user_id) {
        return array[i];
      }
    }
    throw error(404,'User does not exist', at);
  },

  votesVsUsers : (votesArray, userArray) => {
    if (votesArray.length === 0) {
      return {players: [], deaths:[]}
    }
    const numVotes = votesArray.length;
    let count = 0;
    let VotedForIndex;
    for (var i = 0; i < userArray.length; i++) {
      if (votesArray[0].candidate === userArray[i].player.user_id) {
        VotedForIndex = i;
      }
      if (userArray[i].status === true) {
        count ++;
      }
    }
    if (count/2 === numVotes) {
      return {players: userArray, deaths:[]};
    }
    else if (count/2 < numVotes){
      userArray[VotedForIndex].status = false;
      return {players: userArray, deaths:[userArray[VotedForIndex]]};
    }
    else {
      return {players: userArray, deaths:[]};
    }
  }
}

// vote array, user array
// phase 4 return person with the highest vote
// set user status to false
// default to no if no input
// status is true--
// go through how many have voted
//
//
//


