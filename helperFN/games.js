const {error} = require('../errorHandler/errorHandler');
const at = 'helperFN/games';
module.exports = {
  assignRoles: async (array) => {
    try {
      const roles = ['Wolf', 'Doctor', 'Seer', 'villager'];
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
  changeStatus : async (user, array) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.userName === array[i].player.userName) {
        // change status
        return
      }
    }
    throw error(404,'User does not exist', at);
  },
  tallyVotes: (array) => {
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
    for (var x = 0; x < Object.keys(result).length; x++) {
      if (mostVotes === result[Object.keys(result)[x]]){
        return {[Object.keys(result)[x]]: mostVotes};
      }
    }
  },
  checkIfGamesOver: (array) => {
    var wolves = 0;
    var villagers = 0;
    for (var i = 0; i < array.length; i ++) {
      if (array[i].role === 'wolf') {
        wolves++;
      } else {
        villagers++
      }
  }
  if (wolves === 0) {
    return ({gameover:true, winner: 'villagers'}, array)
  }
  if (villagers === 0) {
    return ({gameover:true, winner: 'wolves'}, array)
  }
  return {gameover:false, winner: null}
  },
  getPlayer : async (array, user) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.user_id === array[i].player.user_id) {
        return array[i];
      }
    }
    throw error(404,'User does not exist', at);
  },
  votesVsUsers : async (votesArray, userArray) => {
    const numVotes = votesArray.length;
    let count = 0;
    let VotedForIndex;
    for (var i = 0; i < userArray.length; i++) {
      if (votesArray[1].candidate === userArray[i].player.user_id) {
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


