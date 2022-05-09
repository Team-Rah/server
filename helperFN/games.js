const {error} = require('../errorHandler/errorHandler')
const at = 'helperFN/games'
module.exports = {
  assignRoles: async (array) => {
    try {
      const roles = ['test1', 'test2', 'test3', 'test4'];
      const numRoles = roles.length - 1;
      const numPlayers = array.length;
      let iterations = Math.floor(numPlayers * (4/7));
     let count = 0;
      while (iterations > 0) {
        var position = Math.floor(Math.random() * numPlayers);
        if (array[position]['role'] === 'villager')  {
          array[position]['role'] = roles[count];
          count++;
          iterations --;
        }
        if (count > numRoles) {
          count = 0;
        }
      }
      return array;
    }

    catch (err) {
      throw error(500,'DID NOT ASSIGN ROLE',at);
    }
  },
  changeStatus : async (user, array) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.userName === array[i].userName) {
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
  }
}
