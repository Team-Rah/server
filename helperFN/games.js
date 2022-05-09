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
      err.statusCode = 500;
      throw Error(err);
    }
  },
  changeStatus : async (user, array) => {
    for (var i = 0; i < array.length; i ++) {
      if (user.userName === array[i].userName) {
        // change status
        return 
      }
    }
    return 'User does not exist';
  }
}
